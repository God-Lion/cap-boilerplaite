import type { SanctionsResult } from '../types/RiskProfile';

export interface ISanctionsChecker {
  screen(data: SanctionsScreeningData): Promise<SanctionsResult>;
  checkName(name: string, dateOfBirth?: string): Promise<SanctionsMatch[]>;
  checkDocument(documentNumber: string, country: string): Promise<SanctionsMatch[]>;
  getSupportedLists(): SanctionsList[];
}

export interface SanctionsScreeningData {
  fullName: string;
  dateOfBirth?: string;
  nationality?: string;
  countryOfResidence?: string;
  documentNumber?: string;
  ssn?: string;
}

export interface SanctionsMatch {
  listName: string;
  listType: 'OFAC_SDN' | 'OFAC_CONS' | 'UN' | 'EU' | 'UK' | 'OTHER';
  matchedName: string;
  originalName: string;
  matchType: 'EXACT' | 'FUZZY' | 'PARTIAL';
  confidence: number;
  aliases?: string[];
  dateOfBirth?: string;
  nationality?: string;
  sanctionsProgram?: string;
  listingDate?: string;
  additionalInfo?: string;
}

export interface SanctionsList {
  id: string;
  name: string;
  country: string;
  type: 'SANCTIONS' | 'WATCHLIST' | 'ENHANCED_SCREENING';
  lastUpdated: string;
  entryCount: number;
}

export const SUPPORTED_SANCTIONS_LISTS: SanctionsList[] = [
  {
    id: 'ofac_sdn',
    name: 'OFAC Specially Designated Nationals',
    country: 'US',
    type: 'SANCTIONS',
    lastUpdated: new Date().toISOString(),
    entryCount: 0,
  },
  {
    id: 'ofac_cons',
    name: 'OFAC Consolidated Sanctions',
    country: 'US',
    type: 'SANCTIONS',
    lastUpdated: new Date().toISOString(),
    entryCount: 0,
  },
  {
    id: 'un_sanctions',
    name: 'UN Security Council Sanctions',
    country: 'UN',
    type: 'SANCTIONS',
    lastUpdated: new Date().toISOString(),
    entryCount: 0,
  },
  {
    id: 'eu_sanctions',
    name: 'EU Sanctions Map',
    country: 'EU',
    type: 'SANCTIONS',
    lastUpdated: new Date().toISOString(),
    entryCount: 0,
  },
  {
    id: 'uk_sanctions',
    name: 'UK Financial Sanctions',
    country: 'UK',
    type: 'SANCTIONS',
    lastUpdated: new Date().toISOString(),
    entryCount: 0,
  },
  {
    id: 'politically_exposed',
    name: 'Politically Exposed Persons',
    country: 'GLOBAL',
    type: 'WATCHLIST',
    lastUpdated: new Date().toISOString(),
    entryCount: 0,
  },
  {
    id: 'adverse_media',
    name: 'Adverse Media Screening',
    country: 'GLOBAL',
    type: 'ENHANCED_SCREENING',
    lastUpdated: new Date().toISOString(),
    entryCount: 0,
  },
];

export function formatSanctionsResult(result: SanctionsResult): string {
  if (!result.isOnList) {
    return 'No sanctions match found';
  }
  return `Match found on: ${result.lists?.join(', ') || 'Unknown list'}`;
}
