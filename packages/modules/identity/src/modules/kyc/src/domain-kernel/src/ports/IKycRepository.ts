import type { KycProfile, KycStatus, IdentityPathType } from '../types/KycProfile';
import type { VerificationTier } from '../types/VerificationLevel';
import type { AlternativeIdDocument } from '../types/AlternativeId';

export interface IKycRepository {
  create(profile: Omit<KycProfile, 'id' | 'kycNumber' | 'createdAt' | 'updatedAt'>): Promise<KycProfile>;
  findById(id: string): Promise<KycProfile | null>;
  findByApplicantId(applicantId: string): Promise<KycProfile | null>;
  findByKycNumber(kycNumber: string): Promise<KycProfile | null>;
  update(id: string, updates: Partial<KycProfile>): Promise<KycProfile>;
  updateStatus(id: string, status: KycStatus): Promise<KycProfile>;
  updateTier(id: string, tier: VerificationTier): Promise<KycProfile>;
  addDocument(id: string, document: AlternativeIdDocument): Promise<KycProfile>;
  removeDocument(id: string, documentId: string): Promise<KycProfile>;
  findByStatus(status: KycStatus): Promise<KycProfile[]>;
  findByIdentityPath(path: IdentityPathType): Promise<KycProfile[]>;
  findExpiringBefore(date: string): Promise<KycProfile[]>;
  findExpired(): Promise<KycProfile[]>;
  findByReviewer(reviewerId: string): Promise<KycProfile[]>;
  findPendingReview(): Promise<KycProfile[]>;
  countByStatus(): Promise<Record<KycStatus, number>>;
  countByTier(): Promise<Record<VerificationTier, number>>;
  delete(id: string): Promise<void>;
  existsByApplicantId(applicantId: string): Promise<boolean>;
}

export interface IKycQueryRepository {
  findWithFilters(filters: KycFilters): Promise<KycProfile[]>;
  findStats(): Promise<KycStats>;
}

export interface KycFilters {
  status?: KycStatus[];
  identityPath?: IdentityPathType[];
  tier?: VerificationTier[];
  reviewerId?: string;
  fromDate?: string;
  toDate?: string;
  searchTerm?: string;
  limit?: number;
  offset?: number;
}

export interface KycStats {
  total: number;
  byStatus: Record<KycStatus, number>;
  byTier: Record<VerificationTier, number>;
  byIdentityPath: Record<IdentityPathType, number>;
  avgProcessingTimeDays: number;
  approvalRate: number;
  rejectionRate: number;
}
