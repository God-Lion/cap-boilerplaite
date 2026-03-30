export * from './idaas-facade/src/index';
export * from './domain-kernel/services/did.service';
export * from './domain-kernel/services/vc.service';
export * from './domain-kernel/clients/blockchain.client';
export * from './domain-kernel/services/contract.service';
export * from './routes/path';
export * from './routes/routes';

import type { CAPModule } from '@cap/shared-types';
import { blockchainRouteConfig } from './routes/routes';
import { BlockchainPath } from './routes/path';

export const BlockchainIdaasModule: CAPModule = {
  id: 'blockchain-idaas-module',
  version: '1.0.0',
  authRouteConfig: blockchainRouteConfig,
  routes: blockchainRouteConfig,
  navItems: [
    {
      id: 'blockchain-section',
      label: 'Blockchain IDaaS',
      section: 'Blockchain IDaaS',
      variant: ['admin'],
      order: 600,
    },
    {
      id: 'blockchain-dashboard',
      label: 'Dashboard',
      icon: 'tabler-chart-donut',
      path: BlockchainPath.dashboard,
      roles: ['admin', 'superadmin'],
      variant: ['admin'],
      order: 610,
    },
    {
      id: 'blockchain-did',
      label: 'DID Management',
      icon: 'tabler-fingerprint',
      path: BlockchainPath.did.management,
      roles: ['admin', 'superadmin'],
      variant: ['admin'],
      order: 620,
    },
    {
      id: 'blockchain-credentials',
      label: 'Verifiable Credentials',
      icon: 'tabler-certificate',
      path: BlockchainPath.credentials.list,
      roles: ['admin', 'superadmin'],
      variant: ['admin'],
      order: 630,
    },
    {
      id: 'blockchain-contracts',
      label: 'Smart Contracts',
      icon: 'tabler-code',
      path: BlockchainPath.governance.contracts,
      roles: ['superadmin'],
      variant: ['admin'],
      order: 640,
    },
    {
      id: 'blockchain-audit',
      label: 'Audit Logs',
      icon: 'tabler-file-description',
      path: BlockchainPath.audit.logs,
      roles: ['admin', 'superadmin'],
      variant: ['admin'],
      order: 650,
    },
  ],
};

export default BlockchainIdaasModule;
