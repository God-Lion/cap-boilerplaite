import { KycProfile } from '../types/KycProfile';

export interface IKycRepository {
  findById(id: string): Promise<KycProfile | null>;
  findByApplicantId(applicantId: string): Promise<KycProfile | null>;
  save(profile: KycProfile): Promise<void>;
  updateStatus(id: string, status: KycProfile['status']): Promise<void>;
  list(filter: any): Promise<KycProfile[]>;
}

export interface IDocumentVerifier {
  verify(documentId: string): Promise<{ success: boolean; reason?: string }>;
}

export interface ISanctionsChecker {
  check(name: string, dob: string, nationality: string): Promise<{ isOnList: boolean; matches: any[] }>;
}

export interface IPepChecker {
  check(name: string): Promise<{ isPep: boolean; details?: string }>;
}
