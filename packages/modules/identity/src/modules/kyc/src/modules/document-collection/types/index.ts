import type { AlternativeIdType } from '../../../domain-kernel/src/types/AlternativeId';

export interface DocumentUpload {
  id: string;
  type: AlternativeIdType;
  file: File;
  previewUrl?: string;
  status: 'PENDING' | 'UPLOADING' | 'UPLOADED' | 'PROCESSING' | 'COMPLETED' | 'ERROR';
  progress: number;
  error?: string;
}

export interface OcrResult {
  documentType: AlternativeIdType;
  confidence: number;
  extractedFields: Record<string, { value: string; confidence: number }>;
  qualityIssues: string[];
  isAuthentic: boolean;
  authenticityChecks: {
    mrz_valid?: boolean;
    security_features_detected?: boolean;
    document_not_expired: boolean;
    no_signs_of_tampering: boolean;
  };
}

export interface DocumentRequirement {
  type: AlternativeIdType;
  required: boolean;
  label: string;
  description: string;
  acceptsCamera: boolean;
  acceptsUpload: boolean;
  maxFileSize: number;
  allowedFormats: string[];
}

export const DOCUMENT_REQUIREMENTS: Record<AlternativeIdType, DocumentRequirement> = {
  PASSPORT: {
    type: 'PASSPORT',
    required: true,
    label: 'Passport',
    description: 'Valid passport (front and back)',
    acceptsCamera: true,
    acceptsUpload: true,
    maxFileSize: 10 * 1024 * 1024,
    allowedFormats: ['image/jpeg', 'image/png', 'image/webp'],
  },
  PASSPORT_CARD: {
    type: 'PASSPORT_CARD',
    required: true,
    label: 'Passport Card',
    description: 'Passport card (front and back)',
    acceptsCamera: true,
    acceptsUpload: true,
    maxFileSize: 10 * 1024 * 1024,
    allowedFormats: ['image/jpeg', 'image/png', 'image/webp'],
  },
  EMERGENCY_TRAVEL_DOCUMENT: {
    type: 'EMERGENCY_TRAVEL_DOCUMENT',
    required: true,
    label: 'Emergency Travel Document',
    description: 'Issued by embassy or consulate',
    acceptsCamera: true,
    acceptsUpload: true,
    maxFileSize: 10 * 1024 * 1024,
    allowedFormats: ['image/jpeg', 'image/png', 'image/webp'],
  },
  UNHCR_REFUGEE_CARD: {
    type: 'UNHCR_REFUGEE_CARD',
    required: true,
    label: 'UNHCR Refugee Card',
    description: 'UNHCR registration card',
    acceptsCamera: true,
    acceptsUpload: true,
    maxFileSize: 10 * 1024 * 1024,
    allowedFormats: ['image/jpeg', 'image/png', 'image/webp'],
  },
  CONVENTION_TRAVEL_DOCUMENT: {
    type: 'CONVENTION_TRAVEL_DOCUMENT',
    required: true,
    label: 'Convention Travel Document',
    description: '1951 Refugee Convention travel document',
    acceptsCamera: true,
    acceptsUpload: true,
    maxFileSize: 10 * 1024 * 1024,
    allowedFormats: ['image/jpeg', 'image/png', 'image/webp'],
  },
  MANDATE_REFUGEE_LETTER: {
    type: 'MANDATE_REFUGEE_LETTER',
    required: true,
    label: 'UNHCR Mandate Refugee Letter',
    description: 'Official UNHCR mandate refugee letter',
    acceptsCamera: false,
    acceptsUpload: true,
    maxFileSize: 10 * 1024 * 1024,
    allowedFormats: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  },
  ASYLUM_SEEKER_CERTIFICATE: {
    type: 'ASYLUM_SEEKER_CERTIFICATE',
    required: true,
    label: 'Asylum Seeker Certificate',
    description: 'Certificate of pending asylum claim',
    acceptsCamera: true,
    acceptsUpload: true,
    maxFileSize: 10 * 1024 * 1024,
    allowedFormats: ['image/jpeg', 'image/png', 'image/webp'],
  },
  REFUGEE_ID_CARD: {
    type: 'REFUGEE_ID_CARD',
    required: true,
    label: 'Refugee ID Card',
    description: 'National refugee identification card',
    acceptsCamera: true,
    acceptsUpload: true,
    maxFileSize: 10 * 1024 * 1024,
    allowedFormats: ['image/jpeg', 'image/png', 'image/webp'],
  },
  RESIDENCE_PERMIT: {
    type: 'RESIDENCE_PERMIT',
    required: true,
    label: 'Residence Permit',
    description: 'Temporary or permanent residence permit',
    acceptsCamera: true,
    acceptsUpload: true,
    maxFileSize: 10 * 1024 * 1024,
    allowedFormats: ['image/jpeg', 'image/png', 'image/webp'],
  },
  WORK_PERMIT: {
    type: 'WORK_PERMIT',
    required: true,
    label: 'Work Permit',
    description: 'Valid work authorization document',
    acceptsCamera: true,
    acceptsUpload: true,
    maxFileSize: 10 * 1024 * 1024,
    allowedFormats: ['image/jpeg', 'image/png', 'image/webp'],
  },
  VISA: {
    type: 'VISA',
    required: true,
    label: 'Visa',
    description: 'Long-stay visa',
    acceptsCamera: true,
    acceptsUpload: true,
    maxFileSize: 10 * 1024 * 1024,
    allowedFormats: ['image/jpeg', 'image/png', 'image/webp'],
  },
  IMMIGRANT_VISA: {
    type: 'IMMIGRANT_VISA',
    required: true,
    label: 'Immigrant Visa',
    description: 'Immigrant visa',
    acceptsCamera: true,
    acceptsUpload: true,
    maxFileSize: 10 * 1024 * 1024,
    allowedFormats: ['image/jpeg', 'image/png', 'image/webp'],
  },
  GREEN_CARD: {
    type: 'GREEN_CARD',
    required: true,
    label: 'Green Card',
    description: 'US Permanent Resident Card',
    acceptsCamera: true,
    acceptsUpload: true,
    maxFileSize: 10 * 1024 * 1024,
    allowedFormats: ['image/jpeg', 'image/png', 'image/webp'],
  },
  STATELESS_PERSON_DOCUMENT: {
    type: 'STATELESS_PERSON_DOCUMENT',
    required: true,
    label: 'Stateless Person Document',
    description: 'Document for stateless persons',
    acceptsCamera: true,
    acceptsUpload: true,
    maxFileSize: 10 * 1024 * 1024,
    allowedFormats: ['image/jpeg', 'image/png', 'image/webp'],
  },
  FOREIGN_NATIONAL_ID: {
    type: 'FOREIGN_NATIONAL_ID',
    required: true,
    label: 'Foreign National ID',
    description: 'National ID from another country',
    acceptsCamera: true,
    acceptsUpload: true,
    maxFileSize: 10 * 1024 * 1024,
    allowedFormats: ['image/jpeg', 'image/png', 'image/webp'],
  },
  CONSULAR_ID: {
    type: 'CONSULAR_ID',
    required: true,
    label: 'Consular ID',
    description: 'Issued by foreign consulate',
    acceptsCamera: true,
    acceptsUpload: true,
    maxFileSize: 10 * 1024 * 1024,
    allowedFormats: ['image/jpeg', 'image/png', 'image/webp'],
  },
  DIPLOMATIC_ID: {
    type: 'DIPLOMATIC_ID',
    required: true,
    label: 'Diplomatic ID',
    description: 'Diplomatic identification',
    acceptsCamera: true,
    acceptsUpload: true,
    maxFileSize: 10 * 1024 * 1024,
    allowedFormats: ['image/jpeg', 'image/png', 'image/webp'],
  },
  TRIBAL_IDENTITY_CARD: {
    type: 'TRIBAL_IDENTITY_CARD',
    required: true,
    label: 'Tribal Identity Card',
    description: 'Indigenous or tribal community ID',
    acceptsCamera: true,
    acceptsUpload: true,
    maxFileSize: 10 * 1024 * 1024,
    allowedFormats: ['image/jpeg', 'image/png', 'image/webp'],
  },
  RELIGIOUS_COMMUNITY_LETTER: {
    type: 'RELIGIOUS_COMMUNITY_LETTER',
    required: true,
    label: 'Religious Community Letter',
    description: 'Letter from recognized religious authority',
    acceptsCamera: false,
    acceptsUpload: true,
    maxFileSize: 10 * 1024 * 1024,
    allowedFormats: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  },
  COMMUNITY_LEADER_ATTESTATION: {
    type: 'COMMUNITY_LEADER_ATTESTATION',
    required: true,
    label: 'Community Leader Attestation',
    description: 'Attestation from community leader',
    acceptsCamera: false,
    acceptsUpload: true,
    maxFileSize: 10 * 1024 * 1024,
    allowedFormats: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  },
  PRISON_RELEASE_DOCUMENT: {
    type: 'PRISON_RELEASE_DOCUMENT',
    required: true,
    label: 'Prison Release Document',
    description: 'Official release documentation',
    acceptsCamera: true,
    acceptsUpload: true,
    maxFileSize: 10 * 1024 * 1024,
    allowedFormats: ['image/jpeg', 'image/png', 'image/webp'],
  },
  HOSPITAL_BIRTH_RECORD: {
    type: 'HOSPITAL_BIRTH_RECORD',
    required: true,
    label: 'Hospital Birth Record',
    description: 'Official birth record from hospital',
    acceptsCamera: true,
    acceptsUpload: true,
    maxFileSize: 10 * 1024 * 1024,
    allowedFormats: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  },
  SCHOOL_ENROLLMENT_RECORD: {
    type: 'SCHOOL_ENROLLMENT_RECORD',
    required: true,
    label: 'School Enrollment Record',
    description: 'Current school enrollment documentation',
    acceptsCamera: true,
    acceptsUpload: true,
    maxFileSize: 10 * 1024 * 1024,
    allowedFormats: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  },
  MILITARY_ID: {
    type: 'MILITARY_ID',
    required: true,
    label: 'Military ID',
    description: 'Military identification card',
    acceptsCamera: true,
    acceptsUpload: true,
    maxFileSize: 10 * 1024 * 1024,
    allowedFormats: ['image/jpeg', 'image/png', 'image/webp'],
  },
  UTILITY_BILL: {
    type: 'UTILITY_BILL',
    required: false,
    label: 'Utility Bill',
    description: 'Recent utility bill (within 3 months)',
    acceptsCamera: true,
    acceptsUpload: true,
    maxFileSize: 10 * 1024 * 1024,
    allowedFormats: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  },
  BANK_STATEMENT: {
    type: 'BANK_STATEMENT',
    required: false,
    label: 'Bank Statement',
    description: 'Recent bank statement (within 3 months)',
    acceptsCamera: true,
    acceptsUpload: true,
    maxFileSize: 10 * 1024 * 1024,
    allowedFormats: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  },
  EMPLOYER_LETTER: {
    type: 'EMPLOYER_LETTER',
    required: false,
    label: 'Employer Letter',
    description: 'Letter from current employer',
    acceptsCamera: false,
    acceptsUpload: true,
    maxFileSize: 10 * 1024 * 1024,
    allowedFormats: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  },
  TENANCY_AGREEMENT: {
    type: 'TENANCY_AGREEMENT',
    required: false,
    label: 'Tenancy Agreement',
    description: 'Current rental or lease agreement',
    acceptsCamera: false,
    acceptsUpload: true,
    maxFileSize: 10 * 1024 * 1024,
    allowedFormats: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  },
  SOCIAL_WORKER_ATTESTATION: {
    type: 'SOCIAL_WORKER_ATTESTATION',
    required: false,
    label: 'Social Worker Attestation',
    description: 'Attestation from registered social worker',
    acceptsCamera: false,
    acceptsUpload: true,
    maxFileSize: 10 * 1024 * 1024,
    allowedFormats: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  },
  NGO_SUPPORT_LETTER: {
    type: 'NGO_SUPPORT_LETTER',
    required: false,
    label: 'NGO Support Letter',
    description: 'Letter from registered NGO',
    acceptsCamera: false,
    acceptsUpload: true,
    maxFileSize: 10 * 1024 * 1024,
    allowedFormats: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  },
  WITNESS_DECLARATION: {
    type: 'WITNESS_DECLARATION',
    required: false,
    label: 'Witness Declaration',
    description: 'Signed declaration from witness',
    acceptsCamera: false,
    acceptsUpload: true,
    maxFileSize: 10 * 1024 * 1024,
    allowedFormats: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  },
};
