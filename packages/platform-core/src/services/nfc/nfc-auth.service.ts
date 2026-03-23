// packages/platform-core/src/services/nfc/nfc-auth.service.ts

import { computeAesCmac } from './nfc-crypto.utils';
import type { NfcScanEvent, INfcTagRepository, INfcScanLogRepository, NfcVerificationResult } from '../../types/nfc-auth.types';

export class NfcAuthService {
  constructor(
    private readonly tagRepository: INfcTagRepository,
    private readonly scanLogRepository: INfcScanLogRepository,
  ) {}

  async verify(scan: NfcScanEvent): Promise<NfcVerificationResult> {
    // 1. Look up tag by UID
    const tag = await this.tagRepository.findByUid(scan.uid);
    if (!tag) {
      await this.logScan(scan, 'FAIL', 'UNKNOWN_TAG');
      return { status: 'FAIL', reason: 'UNKNOWN_TAG' };
    }

    // 2. Check if revoked
    if (tag.isRevoked) {
      await this.logScan(scan, 'FAIL', 'REVOKED');
      return { status: 'FAIL', reason: 'REVOKED' };
    }

    // 3. Replay attack protection — counter must be strictly increasing
    if (scan.counter <= tag.scanCounter) {
      await this.logScan(scan, 'FAIL', 'REPLAY_ATTACK');
      return { status: 'FAIL', reason: 'REPLAY_ATTACK' };
    }

    // 4. Re-compute CMAC using stored key
    //    NTAG424 input: uid (7 bytes) + counter (3 bytes LE)
    const counterHex = scan.counter.toString(16).padStart(6, '0');
    // Convert little-endian (NTAG424 spec)
    const counterLE = counterHex.match(/../g)!.reverse().join('');
    const inputData = scan.uid.replace(/:/g, '') + counterLE;
    const expectedCmac = computeAesCmac(tag.aesKey, inputData);

    // 5. Compare CMAC (timing-safe comparison)
    const receivedCmac = scan.cmac.toUpperCase();
    if (!timingSafeEqual(expectedCmac, receivedCmac)) {
      await this.logScan(scan, 'FAIL', 'INVALID_CMAC');
      return { status: 'FAIL', reason: 'INVALID_CMAC' };
    }

    // 6. PASS — update scan counter to prevent replay
    await this.tagRepository.updateScanCounter(tag.id, scan.counter);
    await this.logScan(scan, 'PASS', null);

    return { status: 'PASS', tag, scanEvent: scan };
  }

  private async logScan(
    scan: NfcScanEvent,
    result: 'PASS' | 'FAIL',
    reason: string | null
  ): Promise<void> {
    await this.scanLogRepository.create({
      uid: scan.uid,
      counter: scan.counter,
      result,
      reason,
      scannedAt: scan.scannedAt,
      ipAddress: scan.ipAddress,
    });
  }
}

// Timing-safe string comparison (prevents timing attacks)
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}
