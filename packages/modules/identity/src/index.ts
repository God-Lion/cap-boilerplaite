import { CAPModule } from '@cap/platform-core';
import { identityRouteConfig, IdentityRoutes } from './routes/routes';
import Path from './routes/path';

export const IdentityModule: CAPModule = {
  id: 'identity-module',
  version: '1.0.0',
  routes: IdentityRoutes as any,
  authRouteConfig: identityRouteConfig as any,
  navItems: [
    // We can aggregate nav items from sub-modules here or define them centrally
    // For now, let's keep it simple
    {
      id: 'identity-section',
      label: 'Identity',
      section: 'Identity',
      variant: ['admin'],
      order: 400,
    },
  ],
};

export default IdentityModule;
export { Path as IdentityPath };

// Re-export sub-module APIs
export * from './modules/civil-registry/src/index';
// export * from '../modules/digital-id/src/index';
// export * from '../modules/kyc/src/index';
