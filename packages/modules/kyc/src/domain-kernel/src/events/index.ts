export interface KycStarted {
  applicantId: string;
  timestamp: string;
}

export interface DocumentSubmitted {
  kycProfileId: string;
  documentId: string;
  timestamp: string;
}

export interface VerificationPassed {
  kycProfileId: string;
  tier: number;
  timestamp: string;
}

export interface VerificationFailed {
  kycProfileId: string;
  reason: string;
  timestamp: string;
}

export interface KycExpired {
  kycProfileId: string;
  expiryDate: string;
}

export interface KycRevoked {
  kycProfileId: string;
  reason: string;
  timestamp: string;
}
