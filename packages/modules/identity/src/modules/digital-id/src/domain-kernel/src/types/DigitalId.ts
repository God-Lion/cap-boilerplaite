// domain-kernel/src/types/DigitalId.ts

export type IdCardStatus =
  | 'NOT_ELIGIBLE'         // Under 18
  | 'ELIGIBLE'             // Just turned 18, not yet applied
  | 'APPLICATION_DRAFT'    // Citizen started application
  | 'APPLICATION_SUBMITTED'// Submitted, awaiting biometrics
  | 'PENDING_BIOMETRICS'   // Specifically waiting for biometric capture
  | 'BIOMETRICS_CAPTURED'  // Biometrics captured
  | 'AUTO_VERIFICATION'    // Running automatic biometric check
  | 'AUTO_PASSED'          // Auto verification passed
  | 'MANUAL_REVIEW'        // Flagged for human review
  | 'APPROVED'             // Approved (auto or manual)
  | 'REJECTED'             // Rejected (manual decision)
  | 'ISSUED'               // Card officially issued
  | 'EXPIRED'              // Past validity date
  | 'REVOKED'              // Revoked (lost/stolen/fraud)
  | 'RENEWAL_PENDING';     // Renewal in progress

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface PersonalInfo {
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;               // ISO date
  placeOfBirth: string;
  sex: 'MALE' | 'FEMALE' | 'OTHER';
  nationality: string;
  address: Address;
  phoneNumber?: string;
  email?: string;
  eyeColor?: string;
  height?: number;                   // cm
  bloodType?: string;
}

export interface CardDesign {
  photoUrl: string;                  // Processed face photo for card
  cardVersion: string;               // Template version "v2025"
  hologramCode: string;              // Anti-tamper hologram serial
}

export interface IdCardEvent {
  timestamp: string;
  action: string;
  performedBy: string;               // userId or 'SYSTEM'
  automated: boolean;
  note?: string;
  metadata?: Record<string, unknown>;
}

export interface DomainEvent {
  type: string;
  payload: any;
  occurredAt: string;
}

export type ApplicationStatus = IdCardStatus;

import { BiometricRecord } from './BiometricRecord';
import { VerificationResult } from './VerificationResult';

export interface DigitalIdCard {
  // System fields
  id: string;                        // UUID
  cardNumber: string;                // e.g. "ID-2025-0001234"
  status: IdCardStatus;
  tenantId: string;

  // Linked records
  birthCertificateId: string;        // Link to civil-registry module
  citizenId: string;                 // Platform user ID
  ssn: string;                       // From birth certificate (encrypted)

  // Personal information
  personalInfo: PersonalInfo;

  // Biometrics
  biometrics: BiometricRecord;

  // Verification
  verificationMethod: 'AUTOMATIC' | 'MANUAL';
  verificationResult: VerificationResult;

  // Card data
  cardDesign: CardDesign;
  digitalSignature?: string;         // Issuing authority signature
  qrCodeUrl?: string;                // Public verification URL
  nfcTagUid?: string;                // Physical NFC card UID
  blockchainTxId?: string;           // Immutability anchor

  // Validity
  issueDate?: string;                // ISO date
  expiryDate?: string;               // ISO date (typically 10 years)

  // Workflow
  timeline: IdCardEvent[];
  reviewerId?: string;               // Manual reviewer officer ID
  rejectionReason?: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}
