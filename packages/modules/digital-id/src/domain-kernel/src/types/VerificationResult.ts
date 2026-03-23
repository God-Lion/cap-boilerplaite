// domain-kernel/src/types/VerificationResult.ts

export type VerificationDecision = 'PASS' | 'FAIL' | 'UNCERTAIN' | 'PENDING';

export interface CheckResult {
  passed: boolean;
  score?: number;
  detail?: string;
}

export type EscalationReason =
  | 'LOW_FACE_QUALITY'
  | 'LOW_LIVENESS_SCORE'
  | 'FACE_MATCH_UNCERTAIN'
  | 'FINGERPRINT_POOR_QUALITY'
  | 'DOCUMENT_UNREADABLE'
  | 'POSSIBLE_SPOOF_DETECTED'
  | 'DUPLICATE_FACE_DETECTED'
  | 'WATCHLIST_HIT'
  | 'MANUAL_OVERRIDE_REQUESTED';

export interface VerificationResult {
  decision: VerificationDecision;
  method: 'AUTOMATIC' | 'MANUAL';
  confidence?: number;               // 0-1 for automatic

  // Automatic checks
  automaticChecks?: {
    livenessCheck:    CheckResult;
    faceQuality:      CheckResult;
    faceMatch:        CheckResult;   // Photo vs birth cert
    fingerprintQuality: CheckResult;
    documentValidity: CheckResult;   // Birth cert is genuine
    ageVerification:  CheckResult;   // Is actually 18+
    duplicateCheck:   CheckResult;   // Not already registered
    watchlistCheck:   CheckResult;   // Not on revocation list
  };

  // Manual review
  manualReview?: {
    reviewerId: string;
    reviewedAt: string;
    decision: 'APPROVE' | 'REJECT';
    notes: string;
    overriddenChecks?: string[];     // Which auto-checks were overridden
  };

  // Why escalated to manual
  escalationReasons?: EscalationReason[];

  completedAt?: string;
}
