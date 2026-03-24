import { DigitalIdApplication } from '../types/Application';

export interface IApplicationRepository {
  save(application: DigitalIdApplication): Promise<void>;
  findById(id: string): Promise<DigitalIdApplication | null>;
  findByStatus(status: string): Promise<DigitalIdApplication[]>;
}
