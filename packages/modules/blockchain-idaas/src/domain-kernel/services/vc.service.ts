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
    const response = await fetch('/api/v1/blockchain/vc/issue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ issuerDid, subjectDid, claims, type })
    });

    if (!response.ok) {
      throw new Error('Failed to issue credential');
    }

    return await response.json();
  }

  /**
   * Verifies a Verifiable Credential.
   */
  async verifyCredential(vc: VerifiableCredential): Promise<boolean> {
    const response = await fetch('/api/v1/blockchain/vc/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vc })
    });

    if (!response.ok) {
      throw new Error('Failed to verify credential');
    }

    const data = await response.json();
    return data.isValid;
  }

  /**
   * Retrieves Verifiable Credentials for the current user.
   */
  async getCredentials(): Promise<VerifiableCredential[]> {
    const response = await fetch('/api/v1/blockchain/credentials');
    
    if (!response.ok) {
      throw new Error('Failed to fetch credentials');
    }
    
    return await response.json();
  }
}

export const vcService = new VcService();
