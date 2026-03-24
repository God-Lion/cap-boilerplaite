import { KycRegistry, kycRegistry } from '../../registry/KycRegistry';
import { PathDetectionService } from '../../modules/identity-path/services/path-detection.service';
import { OcrService } from '../../modules/document-collection/services/ocr.service';
import { DocumentService } from '../../modules/document-collection/services/document.service';
import { RiskScoreService } from '../../modules/risk-assessment/services/risk-score.service';
import { BiometricKycService } from '../../modules/biometric-verification/services/biometric-kyc.service';
import { KycProfileService } from '../../modules/kyc-profile/services/kyc-profile.service';

export interface KycFacadeConfig {
  civilRegistryUrl?: string;
  digitalIdUrl?: string;
  ocrProviderUrl?: string;
  sanctionsApiUrl?: string;
  pepApiUrl?: string;
  countryRiskDbUrl?: string;
}

export class KycFacade {
  private static instance: KycFacade;
  private registry: KycRegistry;
  private pathDetectionService: PathDetectionService | null = null;
  private ocrService: OcrService | null = null;
  private documentService: DocumentService;
  private riskScoreService: RiskScoreService | null = null;
  private biometricService: BiometricKycService | null = null;
  private profileService: KycProfileService;

  private constructor(config?: KycFacadeConfig) {
    this.registry = kycRegistry;
    this.documentService = new DocumentService();
    this.profileService = new KycProfileService();

    if (config) {
      this.initializeServices(config);
    }
  }

  static getInstance(config?: KycFacadeConfig): KycFacade {
    if (!KycFacade.instance) {
      KycFacade.instance = new KycFacade(config);
    }
    return KycFacade.instance;
  }

  private initializeServices(config: KycFacadeConfig): void {
    // Initialize services with provided endpoints
    // This would typically connect to external APIs
  }

  getRegistry(): KycRegistry {
    return this.registry;
  }

  getPathDetectionService(): PathDetectionService | null {
    return this.pathDetectionService;
  }

  getOcrService(): OcrService | null {
    return this.ocrService;
  }

  getDocumentService(): DocumentService {
    return this.documentService;
  }

  getRiskScoreService(): RiskScoreService | null {
    return this.riskScoreService;
  }

  getBiometricService(): BiometricKycService | null {
    return this.biometricService;
  }

  getProfileService(): KycProfileService {
    return this.profileService;
  }
}

export const kycFacade = KycFacade.getInstance();
