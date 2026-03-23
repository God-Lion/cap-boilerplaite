// modules/eligibility/hooks/useEligibilityCheck.ts

import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DigitalIdRegistry } from '../../../registry/DigitalIdRegistry';
import { EligibilityStatus } from '../services/eligibility.service';

export function useEligibilityCheck(citizenId: string) {
  const registry = DigitalIdRegistry.getInstance();
  const eligibilityService = registry.eligibilityService;

  return useQuery<EligibilityStatus>({
    queryKey: ['eligibility', citizenId],
    queryFn: () => eligibilityService.checkEligibility(citizenId),
    enabled: !!citizenId,
  });
}
