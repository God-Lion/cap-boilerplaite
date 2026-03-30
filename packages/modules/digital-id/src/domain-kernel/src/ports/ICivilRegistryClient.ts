import { BirthCertificate } from '@cap/civil-registry';

export interface ICivilRegistryClient {
  getBirthCertificateByCitizenId(citizenId: string): Promise<BirthCertificate | null>;
}
