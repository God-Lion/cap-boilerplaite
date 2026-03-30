import { SocialSecurityNumber } from '../types/SSN';

export interface AtomicReserveDto {
  ssn: string;
  certificateId: string;
  reservedAt: string;
}

export interface ISsnRepository {
  atomicReserve(data: AtomicReserveDto): Promise<boolean>;
  updateStatus(ssn: string, status: SocialSecurityNumber['status'], certificateId?: string): Promise<void>;
}
