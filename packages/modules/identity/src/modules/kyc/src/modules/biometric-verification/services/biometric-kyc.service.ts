export interface BiometricCapture {
  id: string;
  kycProfileId: string;
  type: 'FACE' | 'FINGERPRINT' | 'IRIS';
  reference: string;
  capturedAt: string;
  confidence: number;
  livenessScore?: number;
  qualityScore?: number;
  status: 'PENDING' | 'CAPTURED' | 'VERIFIED' | 'FAILED';
}

export interface FaceMatchResult {
  isMatch: boolean;
  confidence: number;
  similarityScore: number;
  livenessDetected: boolean;
  qualityScore: number;
}

export interface IBbiometricClient {
  captureFace(imageData: string): Promise<BiometricCapture>;
  captureFingerprint(imageData: string): Promise<BiometricCapture>;
  verifyFaceMatch(faceImage: string, documentImage: string): Promise<FaceMatchResult>;
  verifyLiveness(imageData: string): Promise<{ isLive: boolean; confidence: number }>;
}

export class BiometricKycService {
  constructor(private readonly biometricClient: IBbiometricClient) {}

  async captureForKyc(
    kycProfileId: string,
    type: 'FACE' | 'FINGERPRINT' | 'IRIS',
    imageData: string
  ): Promise<BiometricCapture> {
    const capture =
      type === 'FACE'
        ? await this.biometricClient.captureFace(imageData)
        : await this.biometricClient.captureFingerprint(imageData);

    return {
      ...capture,
      kycProfileId,
    };
  }

  async verifyFaceWithDocument(
    selfieImage: string,
    documentImage: string
  ): Promise<FaceMatchResult> {
    return this.biometricClient.verifyFaceMatch(selfieImage, documentImage);
  }

  async verifyLiveness(imageData: string): Promise<{ isLive: boolean; confidence: number }> {
    return this.biometricClient.verifyLiveness(imageData);
  }
}

export const BIOMETRIC_REQUIREMENTS = {
  FACE: {
    required: true,
    description: 'Selfie photo for identity verification',
    minQualityScore: 0.8,
    instructions: [
      'Face should be clearly visible',
      'Remove glasses, hats, or head coverings',
      'Ensure good lighting on your face',
      'Look directly at the camera',
      'Keep a neutral expression',
    ],
  },
  FINGERPRINT: {
    required: false,
    description: 'Fingerprint for enhanced verification (Tier 3+)',
    minQualityScore: 0.85,
    instructions: [
      'Place finger flat on scanner',
      'Apply even pressure',
      'Scanner will capture automatically',
    ],
  },
  IRIS: {
    required: false,
    description: 'Iris scan for highest security (EDD)',
    minQualityScore: 0.9,
    instructions: [
      'Look at the camera',
      'Keep eyes open and still',
      'Scanner will capture both eyes',
    ],
  },
};
