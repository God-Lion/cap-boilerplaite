import blockchainService, { AuditEvent } from '../services/blockchain.service';

/**
 * @deprecated Use blockchainService from domain-kernel/services/blockchain.service
 */
export class BlockchainClient {
  /**
   * Retrieves audit logs from the chain (or our local cache of anchored txs).
   */
  async getAuditLogs(did: string): Promise<AuditEvent[]> {
    return blockchainService.getAuditLogs(did);
  }

  /**
   * Generic anchor method for legacy contract service.
   */
  async anchorData(data: string): Promise<string> {
    return blockchainService.anchorData(data);
  }
}

export const blockchainClient = new BlockchainClient();
export type { AuditEvent };
