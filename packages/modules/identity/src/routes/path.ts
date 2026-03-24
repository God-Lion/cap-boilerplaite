import CivilRegistryPath from '../modules/civil-registry/src/routes/path';
import DigitalIdPath from '../modules/digital-id/src/routes/path';
import { KycPath } from '../modules/kyc/src/routes/path';

export const Path = {
  civilRegistry: CivilRegistryPath,
  digitalId: DigitalIdPath,
  kyc: KycPath,
} as const;

export default Path;
