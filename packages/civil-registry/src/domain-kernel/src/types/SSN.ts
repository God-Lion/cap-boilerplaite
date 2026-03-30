// domain-kernel/src/types/SSN.ts

export interface SocialSecurityNumber {
  value: string;             // Formatted: "XXX-XX-XXXX"
  raw: string;               // Unformatted: "XXXXXXXXX"
  assignedAt: string;        // ISO datetime
  assignedToId: string;      // Birth certificate ID
  status: 'RESERVED' | 'ACTIVE' | 'DECEASED' | 'CANCELLED';

  // SSN structure breakdown
  areaNumber: string;        // First 3 digits (geographic)
  groupNumber: string;       // Middle 2 digits
  serialNumber: string;      // Last 4 digits (sequential)
}
