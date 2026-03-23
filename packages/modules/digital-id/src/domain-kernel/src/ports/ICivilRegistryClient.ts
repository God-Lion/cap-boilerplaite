import { BirthCertificate } from '@cap/module-civil-registry';

export interface ICivilRegistryClient {
  getBirthCertificateByCitizenId(citizenId: string): Promise<BirthCertificate | null>;
}
