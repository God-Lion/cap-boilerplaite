/**
 * KYC tiers define what a person can access.
 * Each tier requires more documents and stricter checks.
 *
 * TIER 0 — Unverified:      Basic registration only
 * TIER 1 — Basic:           Name + 1 document = limited services
 * TIER 2 — Standard:        Full document set = standard services
 * TIER 3 — Enhanced:        Biometrics + in-person = full services
 * TIER 4 — Premium:         Ongoing monitoring = high-risk services
 */
export type VerificationTier = 0 | 1 | 2 | 3 | 4;

export interface VerificationLevel {
  tier: VerificationTier;
  label: string;
  description: string;

  // What's required to reach this tier
  requirements: TierRequirement[];

  // What services this tier unlocks
  serviceAccess: ServiceAccessRule[];

  // How long the KYC is valid before renewal
  validityMonths: number;

  // Transaction limits (for banking use case)
  transactionLimits?: {
    dailyLimit: number;
    monthlyLimit: number;
    singleTransactionLimit: number;
    currency: string;
  };
}

export interface TierRequirement {
  type: 'DOCUMENT' | 'BIOMETRIC' | 'IN_PERSON' | 'REFERENCE' | 'DECLARATION';
  description: string;
  mandatory: boolean;
  alternatives?: string[];  // Alternative ways to satisfy this requirement
}

export interface ServiceAccessRule {
  service: string;
  allowed: boolean;
  conditions?: string[];
}

export const VERIFICATION_TIERS: Record<VerificationTier, VerificationLevel> = {
  0: {
    tier: 0,
    label: 'Unverified',
    description: 'No identity verification completed',
    requirements: [],
    serviceAccess: [
      { service: 'platform_access', allowed: true },
      { service: 'public_info', allowed: true },
    ],
    validityMonths: 0,
  },
  1: {
    tier: 1,
    label: 'Basic KYC',
    description: 'Minimum identity confirmed',
    requirements: [
      { type: 'DOCUMENT', description: 'One government-issued photo ID', mandatory: true },
      { type: 'DECLARATION', description: 'Self-declared personal information', mandatory: true },
    ],
    serviceAccess: [
      { service: 'basic_banking', allowed: true },
      { service: 'healthcare_registration', allowed: true },
      { service: 'housing_enquiry', allowed: true },
    ],
    validityMonths: 12,
    transactionLimits: {
      dailyLimit: 500, monthlyLimit: 2000,
      singleTransactionLimit: 200, currency: 'USD',
    },
  },
  2: {
    tier: 2,
    label: 'Standard KYC',
    description: 'Full identity and address verified',
    requirements: [
      { type: 'DOCUMENT', description: 'Primary identity document', mandatory: true },
      { type: 'DOCUMENT', description: 'Proof of address', mandatory: true },
      { type: 'DOCUMENT', description: 'Secondary supporting document', mandatory: false,
        alternatives: ['Reference letter', 'Employment proof', 'School enrollment'] },
      { type: 'BIOMETRIC', description: 'Face photo capture', mandatory: true },
    ],
    serviceAccess: [
      { service: 'full_banking', allowed: true },
      { service: 'loan_application', allowed: true },
      { service: 'insurance', allowed: true },
      { service: 'employment', allowed: true },
    ],
    validityMonths: 24,
    transactionLimits: {
      dailyLimit: 5000, monthlyLimit: 20000,
      singleTransactionLimit: 3000, currency: 'USD',
    },
  },
  3: {
    tier: 3,
    label: 'Enhanced KYC',
    description: 'Biometric + in-person verification',
    requirements: [
      { type: 'DOCUMENT', description: 'Full document set (Tier 2)', mandatory: true },
      { type: 'BIOMETRIC', description: 'Full biometric capture (face + fingerprint)', mandatory: true },
      { type: 'IN_PERSON', description: 'In-person verification at accredited office', mandatory: true },
    ],
    serviceAccess: [
      { service: 'all_services', allowed: true },
      { service: 'high_value_transactions', allowed: true },
      { service: 'government_services', allowed: true },
      { service: 'real_estate', allowed: true },
    ],
    validityMonths: 60,
    transactionLimits: {
      dailyLimit: 50000, monthlyLimit: 200000,
      singleTransactionLimit: 30000, currency: 'USD',
    },
  },
  4: {
    tier: 4,
    label: 'Premium / EDD',
    description: 'Enhanced Due Diligence — continuous monitoring',
    requirements: [
      { type: 'DOCUMENT', description: 'Full Tier 3 requirements', mandatory: true },
      { type: 'REFERENCE', description: 'Two independent references', mandatory: true },
      { type: 'DECLARATION', description: 'Source of funds declaration', mandatory: true },
      { type: 'IN_PERSON', description: 'Annual in-person review', mandatory: true },
    ],
    serviceAccess: [
      { service: 'all_services', allowed: true },
      { service: 'unlimited_transactions', allowed: true },
      { service: 'investment_products', allowed: true },
    ],
    validityMonths: 12,   // Annual renewal for EDD
  },
};
