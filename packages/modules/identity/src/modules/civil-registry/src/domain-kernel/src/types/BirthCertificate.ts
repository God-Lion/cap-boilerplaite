// domain-kernel/src/types/BirthCertificate.ts

import { SocialSecurityNumber } from './SSN';

export type CertificateStatus =
  | 'DRAFT'           // Hospital started form
  | 'SUBMITTED'       // Hospital submitted declaration
  | 'UNDER_REVIEW'    // Registrar reviewing
  | 'SSN_ASSIGNED'    // SSN generated, pending approval
  | 'APPROVED'        // Director approved
  | 'ISSUED'          // Certificate officially issued
  | 'REVOKED'         // Revoked (error/fraud)
  | 'AMENDED';        // Amended after issuance

export interface PersonName {
  firstName: string;
  middleName?: string;
  lastName: string;
  suffix?: string;           // Jr, Sr, III
}

export interface Parent {
  role: 'MOTHER' | 'FATHER' | 'PARENT_1' | 'PARENT_2';
  fullName: PersonName;
  dateOfBirth: string;       // ISO date
  nationalId: string;        // Their own ID/SSN
  nationality: string;
  occupation?: string;
  address: Address;
}

export interface BirthDetails {
  dateOfBirth: string;       // ISO datetime
  timeOfBirth: string;       // HH:mm:ss
  placeOfBirth: PlaceOfBirth;
  sex: 'MALE' | 'FEMALE' | 'INTERSEX' | 'UNDETERMINED';
  gestationalAge?: number;   // weeks
  birthWeight?: number;      // grams
  multipleBirth?: {
    isMultiple: boolean;
    birthOrder?: number;     // 1st, 2nd twin etc.
    totalCount?: number;
  };
}

export interface PlaceOfBirth {
  type: 'HOSPITAL' | 'CLINIC' | 'HOME' | 'OTHER';
  facilityName?: string;
  facilityId?: string;       // Registered health facility ID
  address: Address;
  attendingPhysician?: {
    name: string;
    licenseNumber: string;
  };
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface BirthCertificate {
  // System fields
  id: string;                // UUID
  certificateNumber: string; // Official sequential number e.g. "BC-2025-0042891"
  status: CertificateStatus;
  tenantId: string;          // Which civil registry jurisdiction

  // The child
  childName: PersonName;
  birthDetails: BirthDetails;
  ssn?: SocialSecurityNumber; // Assigned after approval

  // Parents
  parents: Parent[];

  // Declaration metadata
  declarationDate: string;
  declaringHospitalId: string;
  declaringStaffId: string;

  // Workflow audit trail
  timeline: CertificateEvent[];

  // Verification
  qrCode?: string;           // URL for public verification
  nfcTagUid?: string;        // If physical NFC card issued
  digitalSignature?: string; // Director's cryptographic signature
  blockchainTxId?: string;   // Anchor to blockchain-idaas

  // Timestamps
  createdAt: string;
  issuedAt?: string;
  updatedAt: string;
}

export interface CertificateEvent {
  timestamp: string;
  action: string;
  performedBy: string;
  note?: string;
}
