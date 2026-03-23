import { apiClient } from '@cap/platform-core'

export interface AuditEvent {
  id: string;
  type: 'IDENTITY_ISSUE' | 'IDENTITY_REVOKE' | 'CONSENT_CHANGE' | 'ACCESS_GRANT';
  timestamp: string;
  actorDid: string;
  targetDid: string;
  txHash: string;
  status: 'PENDING' | 'CONFIRMED' | 'FAILED';
}

const blockchainService = {
  /**
   * Retrieves audit logs from the chain (or our local cache of anchored txs).
   */
  getAuditLogs: async (did: string): Promise<AuditEvent[]> => {
    const response = await apiClient.get<any[]>('/api/v1/blockchain/audit/logs');
    
    if (!response.data) {
      throw new Error('Failed to fetch audit logs');
    }
    
    // Map backend BlockchainTransaction to frontend AuditEvent
    return response.data.map((log: any) => {
      const metadata = log.metadata || {};
      return {
        id: log.id.toString(),
        type: log.type === 'DID_ANCHOR' ? 'IDENTITY_ISSUE' : 'ACCESS_GRANT',
        timestamp: log.createdAt,
        actorDid: did,
        targetDid: metadata.entityId?.toString() || 'N/A',
        txHash: log.txHash,
        status: log.status,
      };
    });
  },

  /**
   * Generic anchor method for legacy contract service.
   */
  anchorData: async (data: string): Promise<string> => {
    console.log(`[BlockchainService] Simulating anchor for: ${data}`);
    // In a real implementation, we would use apiClient.post here
    return `0x${Math.random().toString(16).slice(2, 10)}...`;
  }
}

export default blockchainService;
