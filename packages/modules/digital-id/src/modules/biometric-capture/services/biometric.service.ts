// modules/biometric-capture/services/biometric.service.ts

import { IBiometricEngine } from '../../../domain-kernel/src/ports/IBiometricEngine';
import { BiometricRecord, FaceBiometric } from '../../../domain-kernel/src/types/BiometricRecord';

export class BiometricService {
  constructor(private readonly biometricEngine: IBiometricEngine) {}

  async captureFace(image: string): Promise<FaceBiometric> {
    return {
      photoUrl: image,
      thumbnailUrl: image,
      faceEncoding: Array(128).fill(0).map(() => Math.random()), 
      boundingBox: { x: 100, y: 100, width: 200, height: 200 },
      qualityScore: 95,
      isFrontalFace: true,
      matchThreshold: 0.85
    };
  }

  async verify(record: BiometricRecord) {
    return this.biometricEngine.verify(record);
  }
}
