import { didService, DidDocument } from '../../domain-kernel/services/did.service';
import { vcService, VerifiableCredential } from '../../domain-kernel/services/vc.service';
import { blockchainClient, AuditEvent } from '../../domain-kernel/clients/blockchain.client';
import { smartContractService, SmartContract } from '../../domain-kernel/services/contract.service';

export interface IBlockchainIdaasFacade {
  identity: {
    getDid: (userId: string) => Promise<string>
    resolveDid: (did: string) => Promise<DidDocument>
    issueCredential: (issuerDid: string, subjectDid: string, claims: any, type: string) => Promise<VerifiableCredential>
    verifyCredential: (vc: VerifiableCredential) => Promise<boolean>
    getCredentials: () => Promise<VerifiableCredential[]>
  }
  governance: {
    listContracts: () => Promise<SmartContract[]>
    updateContractStatus: (address: string, status: SmartContract['status']) => Promise<string>
  }
  audit: {
    getLogs: (did: string) => Promise<AuditEvent[]>
  }
}

class BlockchainIdaasFacadeImpl implements IBlockchainIdaasFacade {
  identity = {
    getDid: (userId: string) => didService.generateDid(userId),
    resolveDid: (did: string) => didService.resolveDid(did),
    issueCredential: (issuerDid: string, subjectDid: string, claims: any, type: string) => 
      vcService.issueCredential(issuerDid, subjectDid, claims, type),
    verifyCredential: (vc: VerifiableCredential) => vcService.verifyCredential(vc),
    getCredentials: () => vcService.getCredentials(),
  }

  governance = {
    listContracts: () => smartContractService.listContracts(),
    updateContractStatus: (address: string, status: SmartContract['status']) => 
      smartContractService.updateContractStatus(address, status),
  }

  audit = {
    getLogs: (did: string) => blockchainClient.getAuditLogs(did),
  }
}

export const blockchainIdaasFacade = new BlockchainIdaasFacadeImpl();
export type { IBlockchainIdaasFacade as BlockchainIdaasFacade };
