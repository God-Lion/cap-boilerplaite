import type { AlternativeIdType } from '../types/AlternativeId';

export interface OcrExtractionResult {
  documentType: AlternativeIdType;
  confidence: number;
  extractedFields: Record<string, { value: string; confidence: number }>;
  qualityIssues: string[];
  isAuthentic: boolean;
  authenticityChecks: AuthenticityChecks;
  rawText?: string;
}

export interface AuthenticityChecks {
  mrz_valid?: boolean;
  security_features_detected?: boolean;
  document_not_expired: boolean;
  no_signs_of_tampering: boolean;
}

export interface DocumentVerificationResult {
  isVerified: boolean;
  confidence: number;
  checks: DocumentCheck[];
  extractedData?: Record<string, string>;
  issues: string[];
}

export interface DocumentCheck {
  name: string;
  passed: boolean;
  confidence: number;
  details?: string;
}

export interface IDocumentVerifier {
  extractFromImage(imageUrl: string, documentType: AlternativeIdType): Promise<OcrExtractionResult>;
  verifyAuthenticity(imageUrl: string, documentType: AlternativeIdType): Promise<DocumentVerificationResult>;
  extractMrzData(imageUrl: string): Promise<MrzData | null>;
  detectDocumentType(imageUrl: string): Promise<AlternativeIdType | null>;
  checkExpiry(expiryDate?: string): boolean;
}

export interface MrzData {
  documentType: string;
  country: string;
  surname: string;
  givenNames: string;
  documentNumber: string;
  nationality: string;
  dateOfBirth: string;
  sex: string;
  expiryDate: string;
  isValid: boolean;
}

export interface DocumentTemplate {
  type: AlternativeIdType;
  requiredFields: string[];
  optionalFields: string[];
  mrzFormat?: string;
  avgProcessingTime: string;
}

export const DOCUMENT_TEMPLATES: Record<AlternativeIdType, DocumentTemplate> = {
  PASSPORT: {
    type: 'PASSPORT',
    requiredFields: ['surname', 'givenNames', 'dateOfBirth', 'nationality', 'documentNumber', 'expiryDate'],
    optionalFields: ['placeOfBirth', 'issuingAuthority'],
    mrzFormat: 'TD3',
    avgProcessingTime: '< 1 minute',
  },
  PASSPORT_CARD: {
    type: 'PASSPORT_CARD',
    requiredFields: ['fullName', 'dateOfBirth', 'documentNumber', 'expiryDate'],
    optionalFields: ['nationality'],
    avgProcessingTime: '< 1 minute',
  },
  EMERGENCY_TRAVEL_DOCUMENT: {
    type: 'EMERGENCY_TRAVEL_DOCUMENT',
    requiredFields: ['fullName', 'dateOfBirth', 'documentNumber', 'issuingAuthority'],
    optionalFields: ['expiryDate', 'nationality'],
    avgProcessingTime: '1-2 minutes',
  },
  UNHCR_REFUGEE_CARD: {
    type: 'UNHCR_REFUGEE_CARD',
    requiredFields: ['caseNumber', 'fullName', 'dateOfBirth', 'nationality', 'cardNumber'],
    optionalFields: ['expiryDate', 'countryOfAsylum'],
    avgProcessingTime: '1-2 minutes',
  },
  CONVENTION_TRAVEL_DOCUMENT: {
    type: 'CONVENTION_TRAVEL_DOCUMENT',
    requiredFields: ['fullName', 'dateOfBirth', 'nationality', 'documentNumber', 'expiryDate'],
    optionalFields: ['placeOfBirth', 'issuingAuthority'],
    mrzFormat: 'TD3',
    avgProcessingTime: '1-2 minutes',
  },
  MANDATE_REFUGEE_LETTER: {
    type: 'MANDATE_REFUGEE_LETTER',
    requiredFields: ['fullName', 'dateOfBirth', 'caseNumber', 'issuingDate'],
    optionalFields: ['expiryDate', 'unhcrOffice'],
    avgProcessingTime: '2-3 minutes',
  },
  ASYLUM_SEEKER_CERTIFICATE: {
    type: 'ASYLUM_SEEKER_CERTIFICATE',
    requiredFields: ['referenceNumber', 'fullName', 'dateOfBirth', 'nationality', 'issueDate'],
    optionalFields: ['hearingDate', 'issuingAuthority'],
    avgProcessingTime: '2-3 minutes',
  },
  REFUGEE_ID_CARD: {
    type: 'REFUGEE_ID_CARD',
    requiredFields: ['cardNumber', 'fullName', 'dateOfBirth'],
    optionalFields: ['expiryDate', 'issuingAuthority'],
    avgProcessingTime: '1-2 minutes',
  },
  RESIDENCE_PERMIT: {
    type: 'RESIDENCE_PERMIT',
    requiredFields: ['permitNumber', 'fullName', 'dateOfBirth', 'permitType', 'expiryDate'],
    optionalFields: ['issuingAuthority', 'nationality'],
    avgProcessingTime: '1-2 minutes',
  },
  WORK_PERMIT: {
    type: 'WORK_PERMIT',
    requiredFields: ['permitNumber', 'fullName', 'dateOfBirth', 'expiryDate'],
    optionalFields: ['occupation', 'employer'],
    avgProcessingTime: '1-2 minutes',
  },
  VISA: {
    type: 'VISA',
    requiredFields: ['visaNumber', 'fullName', 'dateOfBirth', 'expiryDate'],
    optionalFields: ['visaType', 'issuingConsulate'],
    avgProcessingTime: '< 1 minute',
  },
  IMMIGRANT_VISA: {
    type: 'IMMIGRANT_VISA',
    requiredFields: ['visaNumber', 'fullName', 'dateOfBirth', 'expiryDate'],
    optionalFields: ['petitionNumber', 'issuingPost'],
    avgProcessingTime: '1-2 minutes',
  },
  GREEN_CARD: {
    type: 'GREEN_CARD',
    requiredFields: ['alienNumber', 'fullName', 'dateOfBirth', 'expiryDate'],
    optionalFields: ['residenceCategory'],
    avgProcessingTime: '1-2 minutes',
  },
  STATELESS_PERSON_DOCUMENT: {
    type: 'STATELESS_PERSON_DOCUMENT',
    requiredFields: ['fullName', 'dateOfBirth', 'documentNumber'],
    optionalFields: ['nationality', 'expiryDate'],
    avgProcessingTime: '2-3 minutes',
  },
  FOREIGN_NATIONAL_ID: {
    type: 'FOREIGN_NATIONAL_ID',
    requiredFields: ['idNumber', 'fullName', 'dateOfBirth'],
    optionalFields: ['expiryDate', 'issuingCountry'],
    avgProcessingTime: '1-2 minutes',
  },
  CONSULAR_ID: {
    type: 'CONSULAR_ID',
    requiredFields: ['idNumber', 'fullName', 'dateOfBirth', 'consulate'],
    optionalFields: ['expiryDate'],
    avgProcessingTime: '1-2 minutes',
  },
  DIPLOMATIC_ID: {
    type: 'DIPLOMATIC_ID',
    requiredFields: ['idNumber', 'fullName', 'dateOfBirth', 'mission'],
    optionalFields: ['expiryDate', 'rank'],
    avgProcessingTime: '1-2 minutes',
  },
  TRIBAL_IDENTITY_CARD: {
    type: 'TRIBAL_IDENTITY_CARD',
    requiredFields: ['cardNumber', 'fullName', 'dateOfBirth', 'tribe'],
    optionalFields: ['expiryDate', 'region'],
    avgProcessingTime: '2-3 minutes',
  },
  RELIGIOUS_COMMUNITY_LETTER: {
    type: 'RELIGIOUS_COMMUNITY_LETTER',
    requiredFields: ['fullName', 'dateOfBirth', 'authorityName', 'issueDate'],
    optionalFields: ['membershipNumber'],
    avgProcessingTime: '2-3 minutes',
  },
  COMMUNITY_LEADER_ATTESTATION: {
    type: 'COMMUNITY_LEADER_ATTESTATION',
    requiredFields: ['fullName', 'dateOfBirth', 'leaderName', 'community', 'issueDate'],
    optionalFields: ['leaderTitle'],
    avgProcessingTime: '2-3 minutes',
  },
  PRISON_RELEASE_DOCUMENT: {
    type: 'PRISON_RELEASE_DOCUMENT',
    requiredFields: ['fullName', 'dateOfBirth', 'releaseDate', 'facility'],
    optionalFields: ['caseNumber'],
    avgProcessingTime: '2-3 minutes',
  },
  HOSPITAL_BIRTH_RECORD: {
    type: 'HOSPITAL_BIRTH_RECORD',
    requiredFields: ['fullName', 'dateOfBirth', 'hospital', 'parentName'],
    optionalFields: ['birthCertificateNumber'],
    avgProcessingTime: '2-3 minutes',
  },
  SCHOOL_ENROLLMENT_RECORD: {
    type: 'SCHOOL_ENROLLMENT_RECORD',
    requiredFields: ['studentName', 'dateOfBirth', 'school', 'enrollmentDate'],
    optionalFields: ['grade', 'studentId'],
    avgProcessingTime: '2-3 minutes',
  },
  MILITARY_ID: {
    type: 'MILITARY_ID',
    requiredFields: ['serviceNumber', 'fullName', 'dateOfBirth', 'branch'],
    optionalFields: ['rank', 'expiryDate'],
    avgProcessingTime: '1-2 minutes',
  },
  UTILITY_BILL: {
    type: 'UTILITY_BILL',
    requiredFields: ['name', 'address', 'date'],
    optionalFields: ['accountNumber', 'utilityType'],
    avgProcessingTime: '< 1 minute',
  },
  BANK_STATEMENT: {
    type: 'BANK_STATEMENT',
    requiredFields: ['accountHolder', 'address', 'statementDate'],
    optionalFields: ['accountNumber', 'bankName'],
    avgProcessingTime: '< 1 minute',
  },
  EMPLOYER_LETTER: {
    type: 'EMPLOYER_LETTER',
    requiredFields: ['employeeName', 'company', 'issueDate'],
    optionalFields: ['position', 'employmentDate'],
    avgProcessingTime: '1-2 minutes',
  },
  TENANCY_AGREEMENT: {
    type: 'TENANCY_AGREEMENT',
    requiredFields: ['tenantName', 'address', 'startDate'],
    optionalFields: ['landlordName', 'monthlyRent'],
    avgProcessingTime: '1-2 minutes',
  },
  SOCIAL_WORKER_ATTESTATION: {
    type: 'SOCIAL_WORKER_ATTESTATION',
    requiredFields: ['fullName', 'dateOfBirth', 'workerName', 'organization', 'issueDate'],
    optionalFields: ['caseNumber'],
    avgProcessingTime: '2-3 minutes',
  },
  NGO_SUPPORT_LETTER: {
    type: 'NGO_SUPPORT_LETTER',
    requiredFields: ['fullName', 'organization', 'representative', 'issueDate'],
    optionalFields: ['program', 'caseId'],
    avgProcessingTime: '2-3 minutes',
  },
  WITNESS_DECLARATION: {
    type: 'WITNESS_DECLARATION',
    requiredFields: ['fullName', 'dateOfBirth', 'witnessName', 'witnessSignature', 'issueDate'],
    optionalFields: ['witnessAddress', 'relationship'],
    avgProcessingTime: '2-3 minutes',
  },
};
