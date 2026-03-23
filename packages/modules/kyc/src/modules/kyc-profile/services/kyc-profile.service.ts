import type { KycProfile } from '../../../domain-kernel/src/types/KycProfile';
import type { VerificationTier } from '../../../domain-kernel/src/types/VerificationLevel';
import { VERIFICATION_TIERS } from '../../../domain-kernel/src/types/VerificationLevel';
import { isExpiringSoon, daysUntilExpiry } from '../../../domain-kernel/src/types/KycProfile';
import { apiClient } from '@cap/platform-core';

export class KycProfileService {
  async getProfile(profileId: string): Promise<KycProfile> {
    const response = await apiClient.get<KycProfile>(`/api/kyc/profiles/${profileId}`);
    return response.data;
  }

  async getProfileByApplicant(applicantId: string): Promise<KycProfile | null> {
    const response = await apiClient.get<KycProfile>(`/api/kyc/profiles/applicant/${applicantId}`);
    return response.data;
  }

  async renewProfile(profileId: string): Promise<KycProfile> {
    const response = await apiClient.post<KycProfile>(`/api/kyc/profiles/${profileId}/renew`);
    return response.data;
  }

  async upgradeProfile(profileId: string, targetTier: VerificationTier): Promise<KycProfile> {
    const response = await apiClient.post<KycProfile>(`/api/kyc/profiles/${profileId}/upgrade`, { targetTier });
    return response.data;
  }

  async suspendProfile(profileId: string, reason: string): Promise<KycProfile> {
    const response = await apiClient.post<KycProfile>(`/api/kyc/profiles/${profileId}/suspend`, { reason });
    return response.data;
  }

  async revokeProfile(profileId: string, reason: string): Promise<KycProfile> {
    const response = await apiClient.post<KycProfile>(`/api/kyc/profiles/${profileId}/revoke`, { reason });
    return response.data;
  }

  getTierInfo(tier: VerificationTier) {
    return VERIFICATION_TIERS[tier];
  }

  getExpiryStatus(profile: KycProfile): {
    isExpiringSoon: boolean;
    daysRemaining: number;
    isExpired: boolean;
  } {
    const days = daysUntilExpiry(profile.expiresAt);
    return {
      isExpiringSoon: isExpiringSoon(profile.expiresAt),
      daysRemaining: days,
      isExpired: days < 0,
    };
  }
}

export const kycProfileService = new KycProfileService();
