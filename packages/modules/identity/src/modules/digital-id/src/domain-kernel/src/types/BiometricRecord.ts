// domain-kernel/src/types/BiometricRecord.ts

export type FingerType =
  | 'RIGHT_THUMB' | 'RIGHT_INDEX' | 'RIGHT_MIDDLE' | 'RIGHT_RING' | 'RIGHT_LITTLE'
  | 'LEFT_THUMB'  | 'LEFT_INDEX'  | 'LEFT_MIDDLE'  | 'LEFT_RING'  | 'LEFT_LITTLE';

export interface BoundingBox {
  x: number; y: number;
  width: number; height: number;
}

export interface FaceBiometric {
  // Raw capture
  photoUrl: string;                  // Encrypted storage URL
  thumbnailUrl: string;

  // Face analysis
  faceEncoding?: number[];           // 128-d face embedding vector
  boundingBox?: BoundingBox;
  qualityScore: number;              // 0-100
  isFrontalFace: boolean;

  // Matching result vs birth certificate photo (if available)
  matchScore?: number;               // 0-1 similarity score
  matchThreshold: number;            // e.g. 0.85 = 85% similarity required
  matchResult?: 'PASS' | 'FAIL' | 'UNCERTAIN';
}

export interface FingerprintBiometric {
  finger: FingerType;
  imageUrl: string;                  // Encrypted
  minutiaeTemplate?: string;         // ISO/IEC 19794-2 template (base64)
  qualityScore: number;              // NIST NFIQ score 1-5 (1=best)
  captureAttempts: number;
}

export interface LivenessChallenge {
  type: 'BLINK' | 'TURN_LEFT' | 'TURN_RIGHT' | 'SMILE' | 'NOD';
  completed: boolean;
  timestamp: string;
}

export interface LivenessResult {
  passed: boolean;
  score: number;                     // 0-1 confidence
  challenges: LivenessChallenge[];
  detectedSpoofAttempt: boolean;
  spoofType?: 'PHOTO' | 'VIDEO' | 'MASK' | '3D_MODEL';
}

export interface BiometricRecord {
  id: string;
  applicationId: string;

  // Face biometrics
  face: FaceBiometric;

  // Fingerprint biometrics
  fingerprints: FingerprintBiometric[];

  // Liveness check
  livenessCheck: LivenessResult;

  capturedAt: string;
  capturedByDevice: string;          // Device/station ID
  capturedByOfficerId?: string;      // If captured at office
}

export interface FaceCaptureInput {
  base64Image: string;
  timestamp: string;
  metadata?: Record<string, any>;
}
