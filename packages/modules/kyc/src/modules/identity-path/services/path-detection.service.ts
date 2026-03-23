import {
  IdentityPathType,
  VerificationTier,
  AlternativeIdType
} from '../../../domain-kernel/src';

export interface ICivilRegistryClient {
  findBySsn(ssn: string): Promise<any | null>;
}

export interface IDigitalIdClient {
  findByApplicantId(applicantId: string): Promise<any | null>;
}

export class PathDetectionService {
  constructor(
    private readonly civilRegistryClient: ICivilRegistryClient,
    private readonly digitalIdClient: IDigitalIdClient,
  ) {}

  /**
   * Determine which KYC path an applicant should follow
   * based on what identity documents they have available.
   */
  async detectPath(applicantId: string, declaredInfo: {
    hasSSN: boolean;
    ssn?: string;
    hasDigitalId: boolean;
    hasForeignPassport: boolean;
    hasRefugeeDoc: boolean;
    hasResidencePermit: boolean;
    isAsylumSeeker: boolean;
    hasNoDocuments: boolean;
    nationality: string;
  }): Promise<{
    path: IdentityPathType;
    suggestedTier: VerificationTier;
    availableDocumentTypes: AlternativeIdType[];
    requiredDocumentCount: number;
    estimatedProcessingTime: string;
    specialConsiderations?: string[];
  }> {

    // Priority order: most verified → least verified

    // 1. Check SSN in civil registry
    if (declaredInfo.hasSSN && declaredInfo.ssn) {
      const civilRecord = await this.civilRegistryClient
        .findBySsn(declaredInfo.ssn);
      if (civilRecord) {
        return {
          path: 'SSN_CITIZEN',
          suggestedTier: 3,
          availableDocumentTypes: [],
          requiredDocumentCount: 0,
          estimatedProcessingTime: '< 5 minutes',
        };
      }
    }

    // 2. Check digital ID
    if (declaredInfo.hasDigitalId) {
      const digitalId = await this.digitalIdClient
        .findByApplicantId(applicantId);
      if (digitalId?.status === 'ISSUED') {
        return {
          path: 'DIGITAL_ID_HOLDER',
          suggestedTier: 3,
          availableDocumentTypes: [],
          requiredDocumentCount: 0,
          estimatedProcessingTime: '< 10 minutes',
        };
      }
    }

    // 3. Foreign passport
    if (declaredInfo.hasForeignPassport) {
      return {
        path: 'FOREIGN_NATIONAL',
        suggestedTier: 2,
        availableDocumentTypes: [
          'PASSPORT', 'UTILITY_BILL', 'BANK_STATEMENT',
          'TENANCY_AGREEMENT', 'EMPLOYER_LETTER',
        ],
        requiredDocumentCount: 2,
        estimatedProcessingTime: '1-3 business days',
      };
    }

    // 4. Refugee documentation
    if (declaredInfo.hasRefugeeDoc) {
      return {
        path: 'REFUGEE',
        suggestedTier: 2,
        availableDocumentTypes: [
          'UNHCR_REFUGEE_CARD', 'CONVENTION_TRAVEL_DOCUMENT',
          'MANDATE_REFUGEE_LETTER', 'SOCIAL_WORKER_ATTESTATION',
          'NGO_SUPPORT_LETTER',
        ],
        requiredDocumentCount: 2,
        estimatedProcessingTime: '2-5 business days',
        specialConsiderations: [
          'Refugee documents accepted as primary identification',
          'NGO or UNHCR attestation can substitute for address proof',
          'Expedited processing available for urgent cases',
        ],
      };
    }

    // 5. Asylum seeker
    if (declaredInfo.isAsylumSeeker) {
      return {
        path: 'ASYLUM_SEEKER',
        suggestedTier: 1,
        availableDocumentTypes: [
          'ASYLUM_SEEKER_CERTIFICATE', 'SOCIAL_WORKER_ATTESTATION',
          'NGO_SUPPORT_LETTER', 'SCHOOL_ENROLLMENT_RECORD',
        ],
        requiredDocumentCount: 2,
        estimatedProcessingTime: '3-7 business days',
        specialConsiderations: [
          'Asylum seeker certificate is accepted as primary document',
          'Maximum tier achievable is Tier 2 until asylum is granted',
          'Services may be limited during processing period',
        ],
      };
    }

    // 6. Residence permit
    if (declaredInfo.hasResidencePermit) {
      return {
        path: 'FOREIGN_NATIONAL',
        suggestedTier: 2,
        availableDocumentTypes: [
          'RESIDENCE_PERMIT', 'WORK_PERMIT',
          'UTILITY_BILL', 'EMPLOYER_LETTER',
        ],
        requiredDocumentCount: 2,
        estimatedProcessingTime: '1-3 business days',
      };
    }

    // 7. No documents — community route
    if (declaredInfo.hasNoDocuments) {
      return {
        path: 'UNDOCUMENTED',
        suggestedTier: 1,
        availableDocumentTypes: [
          'WITNESS_DECLARATION', 'COMMUNITY_LEADER_ATTESTATION',
          'SOCIAL_WORKER_ATTESTATION', 'RELIGIOUS_COMMUNITY_LETTER',
          'SCHOOL_ENROLLMENT_RECORD', 'HOSPITAL_BIRTH_RECORD',
          'NGO_SUPPORT_LETTER',
        ],
        requiredDocumentCount: 3,
        estimatedProcessingTime: '5-10 business days',
        specialConsiderations: [
          'Mandatory in-person appointment required',
          'Social worker referral strongly recommended',
          'Maximum tier achievable is Tier 2 without primary document',
          'Humanitarian services access available immediately',
          'Case assigned to dedicated support officer',
        ],
      };
    }

    // Default fallback
    return {
      path: 'STATELESS_PERSON',
      suggestedTier: 1,
      availableDocumentTypes: [
        'STATELESS_PERSON_DOCUMENT', 'COMMUNITY_LEADER_ATTESTATION',
        'WITNESS_DECLARATION', 'SOCIAL_WORKER_ATTESTATION',
      ],
      requiredDocumentCount: 2,
      estimatedProcessingTime: '5-10 business days',
    };
  }
}
