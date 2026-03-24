import { PathDetectionService } from '../modules/identity-path/services/path-detection.service';
import { OcrService } from '../modules/document-collection/services/ocr.service';
import { RiskScoreService } from '../modules/risk-assessment/services/risk-score.service';
import { IKycRepository } from '../domain-kernel/src/ports/index';

export class KycRegistry {
  private static instance: KycRegistry;

  public pathDetectionService: PathDetectionService;
  public ocrService: OcrService;
  public riskScoreService: RiskScoreService;

  private constructor(
    _kycRepository: IKycRepository,
    pathDetectionService: PathDetectionService,
    ocrService: OcrService,
    riskScoreService: RiskScoreService,
  ) {
    this.pathDetectionService = pathDetectionService;
    this.ocrService = ocrService;
    this.riskScoreService = riskScoreService;
  }

  public static getInstance(
    kycRepository?: IKycRepository,
    pathDetectionService?: PathDetectionService,
    ocrService?: OcrService,
    riskScoreService?: RiskScoreService,
  ): KycRegistry {
    if (!KycRegistry.instance) {
      if (!kycRepository || !pathDetectionService || !ocrService || !riskScoreService) {
        throw new Error('KycRegistry must be initialized with dependencies');
      }
      KycRegistry.instance = new KycRegistry(kycRepository, pathDetectionService, ocrService, riskScoreService);
    }
    return KycRegistry.instance;
  }
}
