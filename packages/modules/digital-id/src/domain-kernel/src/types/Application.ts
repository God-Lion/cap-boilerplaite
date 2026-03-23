// domain-kernel/src/types/Application.ts

import { ApplicationStatus, PersonalInfo } from './DigitalId';
export type { ApplicationStatus };
import { VerificationResult } from './VerificationResult';

export interface DigitalIdApplication {
  id: string;
  citizenId: string;
  status: ApplicationStatus;
  personalInfo: PersonalInfo;
  birthCertificateId: string;
  supportingDocuments: SupportingDocument[];
  verificationResult?: VerificationResult;
  createdAt: string;
  updatedAt: string;
}

export interface SupportingDocument {
  id: string;
  type: string;
  url: string;
  verified: boolean;
}
