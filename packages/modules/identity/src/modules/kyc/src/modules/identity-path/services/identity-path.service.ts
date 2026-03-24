import { apiClient } from '@cap/platform-core';
import type { 
  IdentityPathType, 
  VerificationTier, 
  AlternativeIdType 
} from '../../../domain-kernel/src';

export interface PathDetectionInput {
  hasSSN: boolean;
  ssn?: string;
  hasDigitalId: boolean;
  hasForeignPassport: boolean;
  hasRefugeeDoc: boolean;
  hasResidencePermit: boolean;
  isAsylumSeeker: boolean;
  hasNoDocuments: boolean;
  nationality: string;
}

export interface PathDetectionResult {
  path: IdentityPathType;
  suggestedTier: VerificationTier;
  availableDocumentTypes: AlternativeIdType[];
  requiredDocumentCount: number;
  estimatedProcessingTime: string;
  specialConsiderations?: string[];
}

export const identityPathService = {
  detectPath: async (input: PathDetectionInput): Promise<PathDetectionResult> => {
    const response = await apiClient.post<PathDetectionResult>('/api/kyc/detect-path', input);
    return response.data;
  }
};
