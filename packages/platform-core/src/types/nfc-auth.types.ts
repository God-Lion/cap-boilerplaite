// packages/platform-core/src/types/nfc-auth.types.ts

export interface NfcTagRecord {
  id: string;
  uid: string;               // Hardware UID (e.g. "04A32B1C")
  aesKey: string;            // AES-128 key (hex, stored encrypted in DB)
  scanCounter: number;       // Last verified scan count (replay protection)
  enrolledAt: Date;
  enrolledByUserId: string;
  label: string;             // Human name e.g. "Office Door Card - John"
  tenantId: string;          // Your multi-tenant support
  isRevoked: boolean;
  metadata?: Record<string, unknown>;
}

export interface NfcScanEvent {
  uid: string;
  counter: number;           // ctr param from URL (hex → decimal)
  cmac: string;              // cmac param from URL
  scannedAt: Date;
  ipAddress?: string;
  userAgent?: string;
}

export type NfcVerificationResult =
  | { status: 'PASS'; tag: NfcTagRecord; scanEvent: NfcScanEvent }
  | { status: 'FAIL'; reason: 'UNKNOWN_TAG' | 'INVALID_CMAC' | 'REPLAY_ATTACK' | 'REVOKED' };

export interface INfcTagRepository {
  findByUid(uid: string): Promise<NfcTagRecord | null>;
  updateScanCounter(id: string, counter: number): Promise<void>;
}

export interface INfcScanLogRepository {
  create(data: {
    uid: string;
    counter: number;
    result: 'PASS' | 'FAIL';
    reason: string | null;
    scannedAt: Date;
    ipAddress?: string;
  }): Promise<void>;
}
