import type { IdentityPathType } from '../types/KycProfile';
import type { VerificationTier } from '../types/VerificationLevel';

export interface KycEvent {
  type: string;
  timestamp: string;
  kycProfileId: string;
  applicantId: string;
  payload: Record<string, unknown>;
}

export interface KycStartedEvent extends KycEvent {
  type: 'KYC_STARTED';
  payload: {
    identityPath: IdentityPathType;
    targetTier: VerificationTier;
    tenantId: string;
  };
}

export interface DocumentSubmittedEvent extends KycEvent {
  type: 'DOCUMENT_SUBMITTED';
  payload: {
    documentId: string;
    documentType: string;
    ocrConfidence?: number;
  };
}

export interface BiometricCapturedEvent extends KycEvent {
  type: 'BIOMETRIC_CAPTURED';
  payload: {
    biometricType: 'FACE' | 'FINGERPRINT' | 'IRIS';
    reference: string;
  };
}

export interface VerificationPassedEvent extends KycEvent {
  type: 'VERIFICATION_PASSED';
  payload: {
    verificationType: 'DOCUMENT' | 'BIOMETRIC' | 'AML' | 'PEP' | 'SANCTIONS';
    confidence: number;
  };
}

export interface VerificationFailedEvent extends KycEvent {
  type: 'VERIFICATION_FAILED';
  payload: {
    verificationType: 'DOCUMENT' | 'BIOMETRIC' | 'AML' | 'PEP' | 'SANCTIONS';
    reason: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  };
}

export interface RiskAssessedEvent extends KycEvent {
  type: 'RISK_ASSESSED';
  payload: {
    riskScore: number;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH' | 'PROHIBITED';
    factors: Array<{ factor: string; score: number }>;
  };
}

export interface ManualReviewRequestedEvent extends KycEvent {
  type: 'MANUAL_REVIEW_REQUESTED';
  payload: {
    reason: string;
    priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
    assignedReviewerId?: string;
  };
}

export interface ManualReviewCompletedEvent extends KycEvent {
  type: 'MANUAL_REVIEW_COMPLETED';
  payload: {
    reviewerId: string;
    decision: 'APPROVED' | 'REJECTED' | 'CONDITIONALLY_APPROVED';
    notes?: string;
  };
}

export interface KycApprovedEvent extends KycEvent {
  type: 'KYC_APPROVED';
  payload: {
    tier: VerificationTier;
    expiresAt: string;
    conditions?: string[];
  };
}

export interface KycConditionallyApprovedEvent extends KycEvent {
  type: 'KYC_CONDITIONALLY_APPROVED';
  payload: {
    tier: VerificationTier;
    conditions: string[];
    restrictions: string[];
    expiresAt: string;
  };
}

export interface KycRejectedEvent extends KycEvent {
  type: 'KYC_REJECTED';
  payload: {
    reason: string;
    category: string;
    canReapply: boolean;
    reapplyAfter?: string;
  };
}

export interface KycExpiredEvent extends KycEvent {
  type: 'KYC_EXPIRED';
  payload: {
    expiredAt: string;
    previousTier: VerificationTier;
  };
}

export interface KycSuspendedEvent extends KycEvent {
  type: 'KYC_SUSPENDED';
  payload: {
    reason: string;
    suspendedBy: string;
  };
}

export interface KycRevokedEvent extends KycEvent {
  type: 'KYC_REVOKED';
  payload: {
    reason: string;
    revokedBy: string;
  };
}

export interface KycRenewedEvent extends KycEvent {
  type: 'KYC_RENEWED';
  payload: {
    previousTier: VerificationTier;
    newTier: VerificationTier;
    newExpiresAt: string;
    renewedBy: 'SELF' | 'AGENT' | 'SYSTEM';
  };
}

export interface KycUpgradedEvent extends KycEvent {
  type: 'KYC_UPGRADED';
  payload: {
    previousTier: VerificationTier;
    newTier: VerificationTier;
    reason: string;
    approvedBy: string;
  };
}

export type KycDomainEvent =
  | KycStartedEvent
  | DocumentSubmittedEvent
  | BiometricCapturedEvent
  | VerificationPassedEvent
  | VerificationFailedEvent
  | RiskAssessedEvent
  | ManualReviewRequestedEvent
  | ManualReviewCompletedEvent
  | KycApprovedEvent
  | KycConditionallyApprovedEvent
  | KycRejectedEvent
  | KycExpiredEvent
  | KycSuspendedEvent
  | KycRevokedEvent
  | KycRenewedEvent
  | KycUpgradedEvent;

export function createKycStartedEvent(
  kycProfileId: string,
  applicantId: string,
  identityPath: IdentityPathType,
  targetTier: VerificationTier,
  tenantId: string
): KycStartedEvent {
  return {
    type: 'KYC_STARTED',
    timestamp: new Date().toISOString(),
    kycProfileId,
    applicantId,
    payload: { identityPath, targetTier, tenantId },
  };
}

export function createDocumentSubmittedEvent(
  kycProfileId: string,
  applicantId: string,
  documentId: string,
  documentType: string,
  ocrConfidence?: number
): DocumentSubmittedEvent {
  return {
    type: 'DOCUMENT_SUBMITTED',
    timestamp: new Date().toISOString(),
    kycProfileId,
    applicantId,
    payload: { documentId, documentType, ocrConfidence },
  };
}

export function createKycApprovedEvent(
  kycProfileId: string,
  applicantId: string,
  tier: VerificationTier,
  expiresAt: string,
  conditions?: string[]
): KycApprovedEvent {
  return {
    type: 'KYC_APPROVED',
    timestamp: new Date().toISOString(),
    kycProfileId,
    applicantId,
    payload: { tier, expiresAt, conditions },
  };
}

export function createKycRejectedEvent(
  kycProfileId: string,
  applicantId: string,
  reason: string,
  category: string,
  canReapply: boolean,
  reapplyAfter?: string
): KycRejectedEvent {
  return {
    type: 'KYC_REJECTED',
    timestamp: new Date().toISOString(),
    kycProfileId,
    applicantId,
    payload: { reason, category, canReapply, reapplyAfter },
  };
}
