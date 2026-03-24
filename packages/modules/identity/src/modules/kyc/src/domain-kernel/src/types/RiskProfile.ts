export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH' | 'PROHIBITED';

export interface RiskProfile {
  overallRisk: RiskLevel;
  riskScore: number;               // 0-100

  // Individual risk factors
  factors: RiskFactor[];

  // Specific screenings
  amlResult?: AmlScreeningResult;
  pepResult?: PepScreeningResult;
  sanctionsResult?: SanctionsResult;

  // Country risk
  nationalityRisk: RiskLevel;
  countryOfResidenceRisk: RiskLevel;
  highRiskCountryFlags: string[];  // FATF grey/black list countries

  // Behavioral risk (for renewals)
  transactionPatternRisk?: RiskLevel;
  unusualActivityFlags?: string[];

  lastAssessedAt: string;
  nextReviewDate: string;
}

export interface RiskFactor {
  factor: string;
  weight: number;                  // 0-1
  score: number;                   // 0-100
  weightedScore: number;
  detail: string;
  canBeOverridden: boolean;
}

export interface AmlScreeningResult {
  status: 'CLEAR' | 'HIT' | 'POSSIBLE_HIT' | 'ERROR';
  matchedRecords?: AmlMatch[];
  screenedAt: string;
  provider: string;
}

export interface AmlMatch {
  source: string;                  // Database source
  matchType: 'EXACT' | 'FUZZY' | 'PARTIAL';
  confidence: number;
  reason: string;
}

export interface PepScreeningResult {
  isPep: boolean;
  isPepRelative: boolean;          // Family member of PEP
  pepCategory?: 'DOMESTIC' | 'FOREIGN' | 'INTERNATIONAL_ORGANIZATION';
  pepRole?: string;
  requiresEdd: boolean;            // Enhanced Due Diligence required
}

export interface SanctionsResult {
  isOnList: boolean;
  lists?: string[];                // OFAC, UN, EU, local lists
  matchDetails?: string;
}
