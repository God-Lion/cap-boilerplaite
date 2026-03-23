import { z } from 'zod';
import { apiClient } from '@cap/platform-core';

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
    const response = await apiClient.post<{ did: string }>('/api/v1/blockchain/did/generate', { method });
    return response.data.did;
  }

  /**
   * Resolves a DID to its DID Document.
   */
  async resolveDid(did: string): Promise<DidDocument> {
    const response = await apiClient.get<DidDocument>(`/api/v1/blockchain/did/resolve/${encodeURIComponent(did)}`);
    return response.data;
  }
}

export const didService = new DidService();
