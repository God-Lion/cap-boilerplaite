// modules/ssn-engine/services/ssn-generator.service.ts

import { randomBytes } from 'crypto';
import type { SocialSecurityNumber } from '../../../domain-kernel/src/types/SSN';
import type { ISsnRepository } from '../../../domain-kernel/src/ports/ISsnRegistry';

export class SsnGeneratorService {
  constructor(
    private readonly ssnRepository: ISsnRepository,
    private readonly jurisdictionCode: string  // e.g. "001" for a region
  ) {}

  /**
   * Generate and atomically reserve a new unique SSN.
   * Uses database-level locking to prevent race conditions
   * when multiple births happen simultaneously.
   */
  async generateAndReserve(certificateId: string): Promise<SocialSecurityNumber> {
    const maxRetries = 5;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      const candidate = this.generateCandidate();

      // Validate format
      if (!this.isValidFormat(candidate)) continue;

      // Check not in blacklist (e.g. 000-XX-XXXX, 666-XX-XXXX, 9XX-XX-XXXX)
      if (this.isBlacklisted(candidate)) continue;

      // Atomic check-and-reserve in DB (uses DB transaction with SELECT FOR UPDATE)
      const reserved = await this.ssnRepository.atomicReserve({
        ssn: candidate,
        certificateId,
        reservedAt: new Date().toISOString(),
      });

      if (reserved) {
        const [area, group, serial] = candidate.split('-');
        return {
          value: candidate,
          raw: candidate.replace(/-/g, ''),
          assignedAt: new Date().toISOString(),
          assignedToId: certificateId,
          status: 'RESERVED',
          areaNumber: area,
          groupNumber: group,
          serialNumber: serial,
        };
      }
      // Collision — retry with new candidate
    }

    throw new Error('SSN generation failed after max retries — contact system administrator');
  }

  /**
   * Activate SSN after certificate is officially issued
   */
  async activate(ssn: string, certificateId: string): Promise<void> {
    await this.ssnRepository.updateStatus(ssn, 'ACTIVE', certificateId);
  }

  /**
   * Mark SSN as belonging to a deceased person
   */
  async markDeceased(ssn: string): Promise<void> {
    await this.ssnRepository.updateStatus(ssn, 'DECEASED');
  }

  private generateCandidate(): string {
    // Area number: jurisdiction-specific prefix + random
    // e.g. region "042" + sequential within region
    const area = this.jurisdictionCode.padStart(3, '0');

    // Group number: 01-99 (not 00)
    const group = (Math.floor(Math.random() * 98) + 1)
      .toString()
      .padStart(2, '0');

    // Serial: 0001-9999 (not 0000) — use crypto random for unpredictability
    const serialRaw = parseInt(randomBytes(2).toString('hex'), 16) % 9999;
    const serial = (serialRaw === 0 ? 1 : serialRaw)
      .toString()
      .padStart(4, '0');

    return `${area}-${group}-${serial}`;
  }

  private isValidFormat(ssn: string): boolean {
    return /^\d{3}-\d{2}-\d{4}$/.test(ssn);
  }

  private isBlacklisted(ssn: string): boolean {
    const [area, group, serial] = ssn.split('-');

    // Standard invalid SSN rules
    if (area === '000') return true;        // Area 000 never assigned
    if (area === '666') return true;        // Reserved
    if (area.startsWith('9')) return true;  // 900-999 reserved for ITINs
    if (group === '00') return true;        // Group 00 invalid
    if (serial === '0000') return true;     // Serial 0000 invalid
    if (ssn === '078-05-1120') return true; // Famous invalid SSN (Woolworth case)

    return false;
  }
}
