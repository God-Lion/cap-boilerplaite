// src/index.ts

import { CAPModule } from '@cap/platform-core';
import { civilRegistryRouteConfig, CivilRegistryRoutes } from './routes/routes';
import Path from './routes/path';

export const CivilRegistryModule: CAPModule = {
  id: 'civil-registry-module',
  version: '1.0.0',
  routes: CivilRegistryRoutes,
  authRouteConfig: civilRegistryRouteConfig,
  navItems: [
    {
      id: 'civil-registry-section',
      label: 'Civil Registry',
      section: 'Civil Registry',
      variant: ['admin'],
      order: 400,
    },
    {
      id: 'birth-declaration',
      label: 'New Birth Declaration',
      icon: 'tabler-baby-carriage',
      path: Path.declaration.new,
      roles: ['civil:hospital_staff'],
      variant: ['admin'],
      order: 410,
    },
    {
      id: 'registry-dashboard',
      label: 'Registry Dashboard',
      icon: 'tabler-layout-dashboard',
      path: Path.issuance.dashboard,
      roles: ['civil:registrar', 'civil:director'],
      variant: ['admin'],
      order: 420,
    },
  ],
};

export default CivilRegistryModule;
export { Path as CivilRegistryPath };
