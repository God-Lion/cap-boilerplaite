export const BlockchainPath = {
  dashboard: '/blockchain/dashboard',
  did: {
    management: '/blockchain/did',
    resolve: '/blockchain/did/:did',
    create: '/blockchain/did/create',
  },
  credentials: {
    list: '/blockchain/credentials',
    detail: '/blockchain/credentials/:id',
    issue: '/blockchain/credentials/issue',
    verify: '/blockchain/credentials/verify',
  },
  governance: {
    contracts: '/blockchain/contracts',
    deploy: '/blockchain/contracts/deploy',
  },
  audit: {
    logs: '/blockchain/audit',
  },
} as const;

export default BlockchainPath;
