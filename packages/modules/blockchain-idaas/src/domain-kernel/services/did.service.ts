import { z } from 'zod';

export const DidSchema = z.string().startsWith('did:');

export interface DidDocument {
  id: string;
  context: string[];
  verificationMethod: Array<{
    id: string;
    type: string;
    controller: string;
    publicKeyMultibase: string;
  }>;
  authentication: string[];
}

export class DidService {
  /**
   * Generates a unique DID for the current user.
   */
  async generateDid(_userId?: string, method: string = 'key'): Promise<string> {
    const response = await fetch('/api/v1/blockchain/did/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ method })
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate DID');
    }
    
    const data = await response.json();
    return data.did;
  }

  /**
   * Resolves a DID to its DID Document.
   */
  async resolveDid(did: string): Promise<DidDocument> {
    const response = await fetch(`/api/v1/blockchain/did/resolve/${encodeURIComponent(did)}`);
    
    if (!response.ok) {
      throw new Error('Failed to resolve DID');
    }
    
    return await response.json();
  }
}

export const didService = new DidService();
