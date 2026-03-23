import { VerificationTier } from './VerificationLevel';

/**
 * All valid identity document types for individuals WITHOUT an SSN.
 * Each type has its own required fields and validation rules.
 */
export type AlternativeIdType =
  // International travel documents
  | 'PASSPORT'                    // Foreign passport
  | 'PASSPORT_CARD'
  | 'EMERGENCY_TRAVEL_DOCUMENT'   // Issued by embassy

  // Refugee & asylum documents
  | 'UNHCR_REFUGEE_CARD'          // UN High Commissioner for Refugees card
  | 'CONVENTION_TRAVEL_DOCUMENT'  // 1951 Refugee Convention travel doc
  | 'MANDATE_REFUGEE_LETTER'      // UNHCR mandate refugee letter
  | 'ASYLUM_SEEKER_CERTIFICATE'   // Pending asylum claim cert
  | 'REFUGEE_ID_CARD'             // National refugee ID (if issued by host)

  // Residence & immigration documents
  | 'RESIDENCE_PERMIT'            // Temporary/permanent residence
  | 'WORK_PERMIT'
  | 'VISA'                        // Long-stay visa
  | 'IMMIGRANT_VISA'
  | 'GREEN_CARD'                  // US permanent residency
  | 'STATELESS_PERSON_DOCUMENT'   // Convention relating to Stateless Persons

  // National IDs (foreign)
  | 'FOREIGN_NATIONAL_ID'         // Another country's national ID
  | 'CONSULAR_ID'                 // Issued by foreign consulate
  | 'DIPLOMATIC_ID'

  // Community / tribal / religious
  | 'TRIBAL_IDENTITY_CARD'        // Indigenous/tribal community ID
  | 'RELIGIOUS_COMMUNITY_LETTER'  // Letter from recognized religious authority
  | 'COMMUNITY_LEADER_ATTESTATION'

  // Institutional documents
  | 'PRISON_RELEASE_DOCUMENT'
  | 'HOSPITAL_BIRTH_RECORD'       // For newborns not yet registered
  | 'SCHOOL_ENROLLMENT_RECORD'
  | 'MILITARY_ID'

  // Supporting documents (cannot stand alone, used with primary)
  | 'UTILITY_BILL'
  | 'BANK_STATEMENT'
  | 'EMPLOYER_LETTER'
  | 'TENANCY_AGREEMENT'
  | 'SOCIAL_WORKER_ATTESTATION'   // Social worker vouches for identity
  | 'NGO_SUPPORT_LETTER'          // NGO working with the person
  | 'WITNESS_DECLARATION';        // Two independent witnesses

export interface AlternativeIdDocument {
  id: string;
  kycProfileId: string;
  type: AlternativeIdType;
  issuingCountry: string;
  issuingAuthority: string;
  documentNumber?: string;        // Some docs have no number
  issueDate?: string;
  expiryDate?: string;
  hasExpiry: boolean;

  // Extracted data (via OCR)
  extractedData?: {
    name?: string;
    dateOfBirth?: string;
    nationality?: string;
    documentNumber?: string;
    issuingCountry?: string;
    [key: string]: string | undefined;
  };

  // Verification
  ocrConfidence?: number;          // 0-1 OCR confidence
  authenticityScore?: number;      // 0-1 document authenticity
  isAuthenticated: boolean;
  authenticationMethod: 'AUTO_OCR' | 'MANUAL' | 'THIRD_PARTY_API';

  // Document images (encrypted)
  frontImageUrl: string;
  backImageUrl?: string;
  selfieWithDocumentUrl?: string;  // Person holding the document

  // Status
  status: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'EXPIRED';
  rejectionReason?: string;

  uploadedAt: string;
  verifiedAt?: string;
}

/**
 * Rules for which document combinations satisfy each tier.
 * This defines the alternative verification matrix.
 */
export const ALTERNATIVE_DOCUMENT_MATRIX: Record<
  VerificationTier,
  AlternativeDocumentRule[]
> = {
  0: [],
  1: [
    {
      name: 'Foreign passport alone',
      primaryDocuments: ['PASSPORT'],
      supportingDocuments: [],
      minimumDocuments: 1,
      notes: 'Valid passport is sufficient for Tier 1',
    },
    {
      name: 'UNHCR refugee documentation',
      primaryDocuments: ['UNHCR_REFUGEE_CARD', 'MANDATE_REFUGEE_LETTER'],
      supportingDocuments: [],
      minimumDocuments: 1,
      notes: 'UNHCR documents accepted as primary',
    },
    {
      name: 'Any national ID + declaration',
      primaryDocuments: ['FOREIGN_NATIONAL_ID', 'CONSULAR_ID', 'TRIBAL_IDENTITY_CARD'],
      supportingDocuments: ['WITNESS_DECLARATION'],
      minimumDocuments: 2,
      notes: 'National ID from any country + sworn declaration',
    },
  ],
  2: [
    {
      name: 'Passport + proof of address',
      primaryDocuments: ['PASSPORT', 'PASSPORT_CARD'],
      supportingDocuments: ['UTILITY_BILL', 'BANK_STATEMENT', 'TENANCY_AGREEMENT'],
      minimumDocuments: 2,
      notes: 'Standard: 1 primary + 1 address proof',
    },
    {
      name: 'Refugee full package',
      primaryDocuments: ['UNHCR_REFUGEE_CARD', 'CONVENTION_TRAVEL_DOCUMENT'],
      supportingDocuments: ['SOCIAL_WORKER_ATTESTATION', 'NGO_SUPPORT_LETTER'],
      minimumDocuments: 2,
      notes: 'Refugee card + NGO or social worker attestation',
    },
    {
      name: 'Asylum seeker package',
      primaryDocuments: ['ASYLUM_SEEKER_CERTIFICATE'],
      supportingDocuments: ['SOCIAL_WORKER_ATTESTATION', 'EMPLOYER_LETTER', 'SCHOOL_ENROLLMENT_RECORD'],
      minimumDocuments: 2,
      notes: 'Asylum certificate + 1 supporting doc',
    },
    {
      name: 'Residence permit holder',
      primaryDocuments: ['RESIDENCE_PERMIT', 'WORK_PERMIT', 'VISA'],
      supportingDocuments: ['UTILITY_BILL', 'EMPLOYER_LETTER'],
      minimumDocuments: 2,
    },
    {
      name: 'No primary document — community route',
      primaryDocuments: [],
      supportingDocuments: [
        'WITNESS_DECLARATION',
        'COMMUNITY_LEADER_ATTESTATION',
        'SOCIAL_WORKER_ATTESTATION',
        'SCHOOL_ENROLLMENT_RECORD',
        'HOSPITAL_BIRTH_RECORD',
      ],
      minimumDocuments: 3,
      notes: 'For truly undocumented individuals — requires 3 supporting docs from different sources + mandatory manual review',
      requiresManualReview: true,
      maximumTierAchievable: 2,
    },
  ],
  3: [
    {
      name: 'Enhanced — any Tier 2 + biometrics + in-person',
      primaryDocuments: ['PASSPORT', 'UNHCR_REFUGEE_CARD', 'RESIDENCE_PERMIT'],
      supportingDocuments: ['UTILITY_BILL', 'EMPLOYER_LETTER'],
      minimumDocuments: 2,
      requiresBiometrics: true,
      requiresInPerson: true,
    },
  ],
  4: [
    {
      name: 'EDD — Tier 3 + references + source of funds',
      primaryDocuments: ['PASSPORT'],
      supportingDocuments: ['BANK_STATEMENT', 'EMPLOYER_LETTER'],
      minimumDocuments: 3,
      requiresBiometrics: true,
      requiresInPerson: true,
      requiresReferences: true,
      notes: 'Enhanced Due Diligence for high-risk or high-value individuals',
    },
  ],
};

export interface AlternativeDocumentRule {
  name: string;
  primaryDocuments: AlternativeIdType[];
  supportingDocuments: AlternativeIdType[];
  minimumDocuments: number;
  requiresBiometrics?: boolean;
  requiresInPerson?: boolean;
  requiresReferences?: boolean;
  requiresManualReview?: boolean;
  maximumTierAchievable?: VerificationTier;
  notes?: string;
}

export type KycDocument = AlternativeIdDocument;
