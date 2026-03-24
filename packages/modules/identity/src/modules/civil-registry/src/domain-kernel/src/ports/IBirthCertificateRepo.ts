import { BirthCertificate, CertificateStatus } from '../types/BirthCertificate';

export interface CreateDeclarationDto extends Omit<BirthCertificate, 'id' | 'certificateNumber' | 'status' | 'timeline' | 'createdAt' | 'updatedAt'> {}

export interface IBirthCertificateRepo {
  create(data: Partial<BirthCertificate>): Promise<BirthCertificate>;
  findById(id: string): Promise<BirthCertificate>;
  update(id: string, data: Partial<BirthCertificate>): Promise<BirthCertificate>;
  getNextSequence(year: number): Promise<number>;
}
