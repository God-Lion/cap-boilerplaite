import { DigitalIdCard } from '../types/DigitalId';
import { DigitalIdApplication } from '../types/Application';

export interface IDigitalIdRepository {
  findActiveByCitizenId(citizenId: string): Promise<DigitalIdCard | null>;
  findPendingApplicationByCitizenId(citizenId: string): Promise<DigitalIdApplication | null>;
}
