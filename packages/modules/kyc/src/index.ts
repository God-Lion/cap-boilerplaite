export * from './domain-kernel/src/index';
export * from './registry/KycRegistry';
export * from './routes/path';
export * from './routes/routes';

import type { CAPModule } from '@cap/shared-types';
import { kycRouteConfig } from './routes/routes';
import { KycPath } from './routes/path';

export const KycModule: CAPModule = {
  id: 'kyc-module',
  version: '0.1.0',
  authRouteConfig: kycRouteConfig,
  routes: kycRouteConfig,
  navItems: [
    {
      id: 'kyc-section',
      label: 'KYC Verification',
      section: 'Identity',
      variant: ['admin'],
      order: 450,
    },
    {
      id: 'kyc-identity-path',
      label: 'Identity Path',
      icon: 'tabler-route',
      path: KycPath.identityPath.select,
      variant: ['admin', 'vertical'],
      order: 455,
    },
    {
      id: 'kyc-documents',
      label: 'Documents',
      icon: 'tabler-file-upload',
      path: KycPath.documentCollection.upload,
      variant: ['admin', 'vertical'],
      order: 460,
    },
    {
      id: 'kyc-profile',
      label: 'My KYC Profile',
      icon: 'tabler-id-badge',
      path: KycPath.profile.my,
      variant: ['vertical'],
      order: 465,
    },
    {
      id: 'kyc-compliance',
      label: 'Compliance Dashboard',
      icon: 'tabler-shield-check',
      path: KycPath.compliance.dashboard,
      roles: ['admin', 'compliance_officer'],
      variant: ['admin'],
      order: 470,
    },
  ],
};

export default KycModule;
