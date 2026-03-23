import { BiometricRecord } from '../types/BiometricRecord';
import { VerificationResult } from '../types/VerificationResult';

export interface IBiometricEngine {
  verify(biometric: BiometricRecord): Promise<VerificationResult>;
}
