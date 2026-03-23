import { VerificationTier } from './VerificationLevel';
import { RiskProfile } from './RiskProfile';
import { AlternativeIdDocument } from './AlternativeId';

export type KycStatus =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'DOCUMENTS_SUBMITTED'
  | 'AUTO_VERIFICATION'
  | 'MANUAL_REVIEW'
  | 'APPROVED'
  | 'CONDITIONALLY_APPROVED'  // Approved with restrictions
  | 'REJECTED'
  | 'EXPIRED'
  | 'SUSPENDED'               // Temporarily suspended (investigation)
  | 'REVOKED';                // Permanently revoked

export type IdentityPathType =
  | 'SSN_CITIZEN'             // Has SSN from civil-registry
  | 'DIGITAL_ID_HOLDER'       // Has digital ID card
  | 'FOREIGN_NATIONAL'        // Foreign passport holder
  | 'REFUGEE'                 // UNHCR refugee documentation
  | 'ASYLUM_SEEKER'           // Pending asylum claim
  | 'STATELESS_PERSON'        // No nationality document
  | 'UNDOCUMENTED'            // No formal documents at all
  | 'MINOR_GUARDIAN'          // Under 18, guardian applies
  | 'CORPORATE_ENTITY';       // Business / organization KYC

export interface KycProfile {
  id: string;
  kycNumber: string;              // e.g. "KYC-2025-0001234"
  tenantId: string;
  status: KycStatus;

  // Identity
  applicantId: string;            // Platform user ID
  identityPath: IdentityPathType;
  alternativeIdType?: string;     // Ref to AlternativeIdType

  // Links to other modules
  ssnRef?: string;                // If has SSN (civil-registry)
  digitalIdRef?: string;          // If has digital ID card
  civilRecordRef?: string;        // Birth certificate ref

  // Personal information (from documents)
  personalInfo: KycPersonalInfo;

  // Verification
  currentTier: VerificationTier;
  targetTier: VerificationTier;
  verificationMethod: 'AUTOMATIC' | 'MANUAL' | 'HYBRID';

  // Documents submitted
  documents: any[];               // KycDocument[] from AlternativeId.ts

  // Biometrics
  biometricsCaptured: boolean;
  biometricReference?: string;    // Ref to biometric record

  // Risk
  riskProfile: RiskProfile;

  // Flags
  isPep: boolean;                 // Politically Exposed Person
  isOnSanctionsList: boolean;
  requiresEnhancedDueDiligence: boolean;

  // Conditions (for conditional approval)
  accessConditions?: string[];
  restrictedServices?: string[];

  // Validity
  approvedAt?: string;
  expiresAt?: string;
  lastRenewedAt?: string;

  // Rejection
  rejectionReason?: string;
  rejectionCategory?: RejectionCategory;
  canReapply: boolean;
  reapplyAfter?: string;

  // Audit
  timeline: KycEvent[];
  reviewerId?: string;
  reviewNotes?: string;

  // Compliance
  amlCheckedAt?: string;
  pepCheckedAt?: string;
  sanctionsCheckedAt?: string;
  nextReviewDate?: string;

  createdAt: string;
  updatedAt: string;
}

export interface KycPersonalInfo {
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  placeOfBirth?: string;
  nationality: string;
  secondNationality?: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
  currentAddress: KycAddress;
  previousAddresses?: KycAddress[];
  phoneNumber: string;
  email?: string;
  occupation?: string;
  employer?: string;
  sourceOfIncome?: string;
}

export interface KycAddress {
  street: string;
  city: string;
  region?: string;
  postalCode?: string;
  country: string;
  from: string;
  to?: string;                   // null = current address
  type: 'PERMANENT' | 'TEMPORARY' | 'CAMP' | 'SHELTER' | 'OTHER';
}

export interface KycEvent {
  timestamp: string;
  action: string;
  performedBy: string;           // userId or 'SYSTEM'
  automated: boolean;
  note?: string;
}

export type RejectionCategory =
  | 'DOCUMENT_EXPIRED'
  | 'DOCUMENT_FRAUDULENT'
  | 'FACE_MISMATCH'
  | 'SANCTIONS_HIT'
  | 'INCOMPLETE_SUBMISSION'
  | 'UNVERIFIABLE_IDENTITY'
  | 'HIGH_RISK_COUNTRY'
  | 'PROHIBITED_PERSON'
  | 'DUPLICATE_APPLICATION';

export type KycDocument = AlternativeIdDocument;

export function formatKycStatus(status: KycStatus): string {
  return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
}

export function daysUntilExpiry(expiryDate?: string): number {
  if (!expiryDate) return Infinity;
  const expiry = new Date(expiryDate);
  const now = new Date();
  const diffTime = expiry.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function isExpiringSoon(expiryDate?: string, thresholdDays: number = 30): boolean {
  if (!expiryDate) return false;
  return daysUntilExpiry(expiryDate) <= thresholdDays;
}
