import type { VerificationTier } from './VerificationLevel';
import { VERIFICATION_TIERS } from './VerificationLevel';

export type ServiceCategory =
  | 'banking'
  | 'healthcare'
  | 'housing'
  | 'government'
  | 'employment'
  | 'education'
  | 'financial'
  | 'travel'
  | 'humanitarian';

export interface ServiceAccess {
  service: string;
  category: ServiceCategory;
  label: string;
  description: string;
  minTier: VerificationTier;
  allowed: boolean;
  conditions?: string[];
  restrictions?: string[];
}

export const ALL_SERVICES: ServiceAccess[] = [
  {
    service: 'platform_access',
    category: 'government',
    label: 'Platform Access',
    description: 'Basic access to the platform',
    minTier: 0,
    allowed: true,
  },
  {
    service: 'public_info',
    category: 'government',
    label: 'Public Information',
    description: 'View public information and resources',
    minTier: 0,
    allowed: true,
  },
  {
    service: 'basic_banking',
    category: 'banking',
    label: 'Basic Banking',
    description: 'Basic banking services with limited transaction amounts',
    minTier: 1,
    allowed: true,
  },
  {
    service: 'healthcare_registration',
    category: 'healthcare',
    label: 'Healthcare Registration',
    description: 'Register for healthcare services',
    minTier: 1,
    allowed: true,
  },
  {
    service: 'housing_enquiry',
    category: 'housing',
    label: 'Housing Enquiry',
    description: 'View available housing options',
    minTier: 1,
    allowed: true,
  },
  {
    service: 'humanitarian_services',
    category: 'humanitarian',
    label: 'Humanitarian Services',
    description: 'Access emergency and humanitarian aid services',
    minTier: 0,
    allowed: true,
  },
  {
    service: 'full_banking',
    category: 'banking',
    label: 'Full Banking',
    description: 'Full banking services with higher limits',
    minTier: 2,
    allowed: true,
  },
  {
    service: 'loan_application',
    category: 'financial',
    label: 'Loan Application',
    description: 'Apply for loans and credit',
    minTier: 2,
    allowed: true,
  },
  {
    service: 'insurance',
    category: 'financial',
    label: 'Insurance',
    description: 'Purchase insurance products',
    minTier: 2,
    allowed: true,
  },
  {
    service: 'employment',
    category: 'employment',
    label: 'Employment Services',
    description: 'Access employment matching services',
    minTier: 2,
    allowed: true,
  },
  {
    service: 'education',
    category: 'education',
    label: 'Education Services',
    description: 'Access educational resources and enrollment',
    minTier: 1,
    allowed: true,
  },
  {
    service: 'all_services',
    category: 'government',
    label: 'All Services',
    description: 'Access to all platform services',
    minTier: 3,
    allowed: true,
  },
  {
    service: 'high_value_transactions',
    category: 'banking',
    label: 'High Value Transactions',
    description: 'Process high-value financial transactions',
    minTier: 3,
    allowed: true,
  },
  {
    service: 'government_services',
    category: 'government',
    label: 'Government Services',
    description: 'Access government agency integrations',
    minTier: 3,
    allowed: true,
  },
  {
    service: 'real_estate',
    category: 'housing',
    label: 'Real Estate',
    description: 'Access real estate services',
    minTier: 3,
    allowed: true,
  },
  {
    service: 'unlimited_transactions',
    category: 'banking',
    label: 'Unlimited Transactions',
    description: 'No transaction limits',
    minTier: 4,
    allowed: true,
  },
  {
    service: 'investment_products',
    category: 'financial',
    label: 'Investment Products',
    description: 'Access investment and wealth management products',
    minTier: 4,
    allowed: true,
  },
  {
    service: 'travel_services',
    category: 'travel',
    label: 'Travel Services',
    description: 'Access travel booking and visa services',
    minTier: 2,
    allowed: true,
  },
];

export function getServicesForTier(tier: VerificationTier): ServiceAccess[] {
  return ALL_SERVICES.filter((service) => tier >= service.minTier && service.allowed);
}

export function getTierRequiredServices(tier: VerificationTier): ServiceAccess[] {
  return VERIFICATION_TIERS[tier].serviceAccess
    .map((rule) => ALL_SERVICES.find((s) => s.service === rule.service))
    .filter((s): s is ServiceAccess => s !== undefined);
}

export function canAccessService(
  tier: VerificationTier,
  service: string,
  restrictions?: string[]
): boolean {
  const serviceInfo = ALL_SERVICES.find((s) => s.service === service);
  if (!serviceInfo) return false;
  if (tier < serviceInfo.minTier) return false;
  if (restrictions?.includes(service)) return false;
  return serviceInfo.allowed;
}

export function getServiceAccessMatrix(tier: VerificationTier): Record<string, boolean> {
  const matrix: Record<string, boolean> = {};
  for (const service of ALL_SERVICES) {
    matrix[service.service] = tier >= service.minTier && service.allowed;
  }
  return matrix;
}

export function getRestrictedServices(
  tier: VerificationTier,
  restrictions?: string[]
): ServiceAccess[] {
  return ALL_SERVICES.filter(
    (s) => !canAccessService(tier, s.service, restrictions)
  );
}

export function getAvailableServices(
  tier: VerificationTier,
  restrictions?: string[]
): ServiceAccess[] {
  return ALL_SERVICES.filter((s) => canAccessService(tier, s.service, restrictions));
}

export function getServicesByCategory(
  tier: VerificationTier,
  category: ServiceCategory,
  restrictions?: string[]
): ServiceAccess[] {
  return getAvailableServices(tier, restrictions).filter((s) => s.category === category);
}

export interface TransactionLimit {
  service: string;
  dailyLimit: number;
  monthlyLimit: number;
  singleTransactionLimit: number;
  currency: string;
}

export function getTransactionLimits(tier: VerificationTier): TransactionLimit | null {
  const tierConfig = VERIFICATION_TIERS[tier];
  if (!tierConfig.transactionLimits) return null;
  return {
    service: 'default',
    ...tierConfig.transactionLimits,
  };
}
