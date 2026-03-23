export interface AuditEvent {
  id: string;
  type: 'IDENTITY_ISSUE' | 'IDENTITY_REVOKE' | 'CONSENT_CHANGE' | 'ACCESS_GRANT';
  timestamp: string;
  actorDid: string;
  targetDid: string;
  txHash: string;
  status: 'PENDING' | 'CONFIRMED' | 'FAILED';
}

export class BlockchainClient {
  /**
   * Retrieves audit logs from the chain (or our local cache of anchored txs).
   */
  async getAuditLogs(_did: string): Promise<AuditEvent[]> {
    const response = await fetch('/api/v1/blockchain/audit/logs');
    
    if (!response.ok) {
      throw new Error('Failed to fetch audit logs');
    }
    
    const logs = await response.json();
    
    // Map backend BlockchainTransaction to frontend AuditEvent
    return logs.map((log: any) => {
      const metadata = log.metadata || {};
      return {
        id: log.id.toString(),
        type: log.type === 'DID_ANCHOR' ? 'IDENTITY_ISSUE' : 'ACCESS_GRANT',
        timestamp: log.createdAt,
        actorDid: _did,
        targetDid: metadata.entityId?.toString() || 'N/A',
        txHash: log.txHash,
        status: log.status,
      };
    });
  }

  /**
   * Generic anchor method for legacy contract service.
   */
  async anchorData(data: string): Promise<string> {
    console.log(`[BlockchainClient] Simulating anchor for: ${data}`);
    return `0x${Math.random().toString(16).slice(2, 10)}...`;
  }
}

export const blockchainClient = new BlockchainClient();
