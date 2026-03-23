import { apiClient } from '@cap/platform-core';

export interface VerifiableCredential {
  context: string[];
  id: string;
  type: string[];
  issuer: string;
  issuanceDate: string;
  credentialSubject: {
    id: string;
    [key: string]: any;
  };
  proof: {
    type: string;
    created: string;
    proofPurpose: string;
    verificationMethod: string;
    jws: string;
  };
}

export class VcService {
  /**
   * Issues a Verifiable Credential.
   */
  async issueCredential(
    issuerDid: string,
    subjectDid: string,
    claims: Record<string, any>,
    type: string = 'VerifiableCredential'
  ): Promise<VerifiableCredential> {
    const response = await apiClient.post<VerifiableCredential>('/api/v1/blockchain/vc/issue', {
      issuerDid,
      subjectDid,
      claims,
      type,
    });

    return response.data;
  }

  /**
   * Verifies a Verifiable Credential.
   */
  async verifyCredential(vc: VerifiableCredential): Promise<boolean> {
    const response = await apiClient.post<{ isValid: boolean }>('/api/v1/blockchain/vc/verify', { vc });
    return response.data.isValid;
  }

  /**
   * Retrieves Verifiable Credentials for the current user.
   */
  async getCredentials(): Promise<VerifiableCredential[]> {
    const response = await apiClient.get<VerifiableCredential[]>('/api/v1/blockchain/credentials');
    return response.data;
  }
}

export const vcService = new VcService();
