// src/index.ts

import { CAPModule } from '@cap/platform-core';
import { digitalIdRouteConfig, DigitalIdRoutes } from './routes/routes';
import Path from './routes/path';

export const DigitalIdModule: CAPModule = {
  id: 'digital-id-module',
  version: '1.0.0',
  routes: DigitalIdRoutes,
  authRouteConfig: digitalIdRouteConfig,
  navItems: [
    {
      id: 'digital-id-section',
      label: 'Digital ID',
      section: 'Digital ID',
      variant: ['admin', 'vertical'],
      order: 500,
    },
    {
      id: 'digital-id-eligibility',
      label: 'Check Eligibility',
      icon: 'tabler-user-check',
      path: Path.eligibility.check,
      variant: ['vertical'],
      order: 510,
    },
    {
      id: 'digital-id-application',
      label: 'My Application',
      icon: 'tabler-id',
      path: Path.application.status.replace(':id', 'current'),
      variant: ['vertical'],
      order: 520,
      roles: ['citizen'], // Assuming citizen role is required
    },
    {
      id: 'digital-id-review',
      label: 'Review Queue',
      icon: 'tabler-clipboard-check',
      path: Path.review.queue,
      roles: ['digital-id:review_officer'],
      variant: ['admin'],
      order: 530,
    },
    {
      id: 'digital-id-issuance',
      label: 'Issuance Dashboard',
      icon: 'tabler-printer',
      path: Path.issuance.dashboard,
      roles: ['digital-id:director'],
      variant: ['admin'],
      order: 540,
    },
  ],
};

export default DigitalIdModule;
export { Path as DigitalIdPath };
