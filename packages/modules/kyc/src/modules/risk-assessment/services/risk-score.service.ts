import {
  RiskProfile,
  RiskLevel,
  RiskFactor,
  IdentityPathType,
  AlternativeIdType,
  PepScreeningResult,
  SanctionsResult
} from '../../../domain-kernel/src';

export interface ISanctionsService {
  screen(profile: any): Promise<SanctionsResult>;
}

export interface IPepService {
  check(profile: any): Promise<PepScreeningResult>;
}

export interface ICountryRiskDatabase {
  getCountryRisk(country: string): Promise<RiskLevel>;
  isFatfListed(country: string): boolean;
}

export class RiskScoreService {
  constructor(
    private readonly sanctionsService: ISanctionsService,
    private readonly pepService: IPepService,
    private readonly countryRiskDb: ICountryRiskDatabase,
  ) {}

  async assessRisk(profile: {
    identityPath: IdentityPathType;
    nationality: string;
    countryOfResidence: string;
    occupation?: string;
    sourceOfIncome?: string;
    documentTypes: AlternativeIdType[];
    age: number;
    isNewResident: boolean;
  }): Promise<RiskProfile> {

    // Run all checks in parallel
    const [
      sanctionsResult,
      pepResult,
      nationalityRisk,
      residenceRisk,
    ] = await Promise.all([
      this.sanctionsService.screen(profile),
      this.pepService.check(profile),
      this.countryRiskDb.getCountryRisk(profile.nationality),
      this.countryRiskDb.getCountryRisk(profile.countryOfResidence),
    ]);

    // Hard blocks — these cannot be overridden
    if (sanctionsResult.isOnList) {
      return this.buildProhibitedProfile(sanctionsResult, pepResult);
    }

    // Build risk factors
    const factors: RiskFactor[] = [
      this.scoreIdentityDocumentRisk(profile.documentTypes, profile.identityPath),
      this.scoreCountryRisk(nationalityRisk, residenceRisk),
      this.scoreOccupationRisk(profile.occupation),
      this.scorePepRisk(pepResult),
      this.scoreResidencyRisk(profile.isNewResident),
    ];

    // Compute overall score (weighted average 0-100)
    const riskScore = Math.round(
      factors.reduce((sum, f) => sum + f.weightedScore, 0)
    );

    const overallRisk: RiskLevel =
      riskScore >= 80 ? 'VERY_HIGH' :
      riskScore >= 60 ? 'HIGH'      :
      riskScore >= 40 ? 'MEDIUM'    : 'LOW';

    const highRiskCountries = [
      profile.nationality,
      profile.countryOfResidence,
    ].filter(c => this.countryRiskDb.isFatfListed(c));

    return {
      overallRisk,
      riskScore,
      factors,
      amlResult: {
        status: 'CLEAR',
        screenedAt: new Date().toISOString(),
        provider: 'internal',
      },
      pepResult,
      sanctionsResult,
      nationalityRisk,
      countryOfResidenceRisk: residenceRisk,
      highRiskCountryFlags: highRiskCountries,
      lastAssessedAt: new Date().toISOString(),
      nextReviewDate: this.calculateNextReview(overallRisk),
    };
  }

  private scoreIdentityDocumentRisk(
    docs: AlternativeIdType[],
    path: IdentityPathType
  ): RiskFactor {
    // Lower risk = stronger documents
    const docStrengthMap: Partial<Record<AlternativeIdType, number>> = {
      PASSPORT:                    10,  // Very low risk
      UNHCR_REFUGEE_CARD:          25,  // Low-medium
      CONVENTION_TRAVEL_DOCUMENT:  20,
      RESIDENCE_PERMIT:            20,
      ASYLUM_SEEKER_CERTIFICATE:   35,  // Medium
      FOREIGN_NATIONAL_ID:         30,
      SOCIAL_WORKER_ATTESTATION:   50,  // Higher risk (unverifiable)
      WITNESS_DECLARATION:         65,  // Higher risk
      COMMUNITY_LEADER_ATTESTATION:60,
    };

    const pathRisk: Record<IdentityPathType, number> = {
      SSN_CITIZEN:        5,
      DIGITAL_ID_HOLDER:  10,
      FOREIGN_NATIONAL:   25,
      REFUGEE:            35,
      ASYLUM_SEEKER:      45,
      STATELESS_PERSON:   55,
      UNDOCUMENTED:       70,
      MINOR_GUARDIAN:     30,
      CORPORATE_ENTITY:   20,
    };

    const docScore = docs.length > 0
      ? Math.min(...docs.map(d => docStrengthMap[d] ?? 60))
      : 80;

    const score = Math.round((docScore + pathRisk[path]) / 2);

    return {
      factor: 'Identity Document Strength',
      weight: 0.40,
      score,
      weightedScore: score * 0.40,
      detail: `Path: ${path} | Strongest doc type: ${docs[0] ?? 'none'}`,
      canBeOverridden: true,
    };
  }

  private scoreCountryRisk(
    nationalityRisk: RiskLevel,
    residenceRisk: RiskLevel
  ): RiskFactor {
    const riskToScore: Record<RiskLevel, number> = {
      LOW: 10, MEDIUM: 40, HIGH: 70, VERY_HIGH: 90, PROHIBITED: 100,
    };
    const score = Math.max(
      riskToScore[nationalityRisk],
      riskToScore[residenceRisk]
    );
    return {
      factor: 'Country Risk',
      weight: 0.25,
      score,
      weightedScore: score * 0.25,
      detail: `Nationality: ${nationalityRisk} | Residence: ${residenceRisk}`,
      canBeOverridden: false,   // FATF list hits cannot be overridden
    };
  }

  private scoreOccupationRisk(occupation?: string): RiskFactor {
    const highRiskOccupations = [
      'politician', 'judge', 'military', 'police',
      'money services', 'crypto', 'casino', 'arms dealer',
    ];
    const isHighRisk = highRiskOccupations.some(
      o => occupation?.toLowerCase().includes(o)
    );
    const score = isHighRisk ? 70 : 20;
    return {
      factor: 'Occupation Risk',
      weight: 0.15,
      score,
      weightedScore: score * 0.15,
      detail: occupation ?? 'Not provided',
      canBeOverridden: true,
    };
  }

  private scorePepRisk(pep: PepScreeningResult): RiskFactor {
    const score = pep.isPep ? 80 : pep.isPepRelative ? 50 : 10;
    return {
      factor: 'PEP Status',
      weight: 0.15,
      score,
      weightedScore: score * 0.15,
      detail: pep.isPep ? `PEP: ${pep.pepRole}` : 'Not a PEP',
      canBeOverridden: false,
    };
  }

  private scoreResidencyRisk(isNewResident: boolean): RiskFactor {
    const score = isNewResident ? 40 : 10;
    return {
      factor: 'Residency Duration',
      weight: 0.05,
      score,
      weightedScore: score * 0.05,
      detail: isNewResident ? 'New resident (< 6 months)' : 'Established resident',
      canBeOverridden: true,
    };
  }

  private buildProhibitedProfile(
    sanctions: SanctionsResult,
    pep: PepScreeningResult
  ): RiskProfile {
    return {
      overallRisk: 'PROHIBITED',
      riskScore: 100,
      factors: [],
      sanctionsResult: sanctions,
      pepResult: pep,
      nationalityRisk: 'PROHIBITED',
      countryOfResidenceRisk: 'LOW',
      highRiskCountryFlags: [],
      lastAssessedAt: new Date().toISOString(),
      nextReviewDate: new Date().toISOString(),
    };
  }

  private calculateNextReview(risk: RiskLevel): string {
    const monthsMap: Record<RiskLevel, number> = {
      LOW: 24, MEDIUM: 12, HIGH: 6, VERY_HIGH: 3, PROHIBITED: 0,
    };
    const date = new Date();
    date.setMonth(date.getMonth() + monthsMap[risk]);
    return date.toISOString();
  }
}
