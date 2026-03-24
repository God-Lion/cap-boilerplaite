import type { PepScreeningResult } from '../types/RiskProfile';

export interface IPepChecker {
  check(data: PepScreeningData): Promise<PepScreeningResult>;
  checkName(name: string, dateOfBirth?: string): Promise<PepMatch[]>;
  getPepCategories(): PepCategory[];
}

export interface PepScreeningData {
  fullName: string;
  dateOfBirth?: string;
  nationality?: string;
  countryOfResidence?: string;
  occupation?: string;
}

export interface PepMatch {
  name: string;
  originalName: string;
  matchType: 'EXACT' | 'FUZZY' | 'PARTIAL';
  confidence: number;
  category: 'DOMESTIC' | 'FOREIGN' | 'INTERNATIONAL_ORGANIZATION';
  role: string;
  position?: string;
  organization?: string;
  country: string;
  dateOfBirth?: string;
  sources?: string[];
  aliases?: string[];
}

export interface PepCategory {
  id: string;
  name: string;
  description: string;
  eddRequired: boolean;
  examples: string[];
}

export const PEP_CATEGORIES: PepCategory[] = [
  {
    id: 'head_of_state',
    name: 'Head of State/Government',
    description: 'Current heads of state, government, and their immediate deputies',
    eddRequired: true,
    examples: ['President', 'Prime Minister', 'King', 'Queen', 'Supreme Leader'],
  },
  {
    id: 'government_official',
    name: 'Senior Government Official',
    description: 'Senior officials in legislative, executive, judicial, or military positions',
    eddRequired: true,
    examples: ['Minister', 'Deputy Minister', 'Secretary of State', 'Governor', 'Ambassador'],
  },
  {
    id: 'political_party',
    name: 'Political Party Official',
    description: 'Senior officials and key operatives of political parties',
    eddRequired: true,
    examples: ['Party Leader', 'Party Chairman', 'Chief of Staff'],
  },
  {
    id: 'judicial',
    name: 'Judicial/Legal',
    description: 'High-ranking officials in judicial and legal systems',
    eddRequired: true,
    examples: ['Chief Justice', 'Supreme Court Justice', 'Attorney General', 'Prosecutor'],
  },
  {
    id: 'military',
    name: 'Military',
    description: 'High-ranking military officials',
    eddRequired: true,
    examples: ['General', 'Admiral', 'Defense Minister', 'Chief of Staff'],
  },
  {
    id: 'state_enterprise',
    name: 'State Enterprise Executive',
    description: 'Executives of state-owned enterprises',
    eddRequired: true,
    examples: ['CEO of State Enterprise', 'Chairman of State Board'],
  },
  {
    id: 'international_org',
    name: 'International Organization',
    description: 'Senior officials of international organizations',
    eddRequired: true,
    examples: ['UN Official', 'World Bank Director', 'IMF Executive'],
  },
  {
    id: 'diplomat',
    name: 'Diplomat',
    description: 'Ambassadors and high-ranking diplomats',
    eddRequired: true,
    examples: ['Ambassador', 'Consul General', 'Foreign Minister'],
  },
  {
    id: 'relative',
    name: 'Family Member (PEP Relative)',
    description: 'Immediate family members of PEPs',
    eddRequired: false,
    examples: ['Spouse', 'Child', 'Parent', 'Sibling'],
  },
  {
    id: 'associate',
    name: 'Close Associate',
    description: 'Known close associates of PEPs',
    eddRequired: false,
    examples: ['Business Partner', 'Personal Assistant', 'Advisor'],
  },
];

export function isPepMatchSignificant(match: PepMatch): boolean {
  return match.confidence >= 0.85 && match.matchType === 'EXACT';
}

export function requiresEnhancedDueDiligenceForPep(result: PepScreeningResult): boolean {
  return result.isPep || result.requiresEdd;
}

export function getPepRiskLevel(result: PepScreeningResult): 'LOW' | 'MEDIUM' | 'HIGH' {
  if (result.isPep && result.pepCategory === 'FOREIGN') return 'HIGH';
  if (result.isPep || result.isPepRelative) return 'MEDIUM';
  return 'LOW';
}
