import React from 'react';
import { Route, RoutesProps } from 'react-router-dom';
import { AuthRouteConfig } from '@cap/platform-core/src/assembly';
// import LoadingScreen from '../components/shared/LoadingScreen'; // Add if needed

// Import route configs from sub-modules
// Note: We'll assume the sub-modules export [name]RouteConfig
import { civilRegistryRouteConfig } from '../modules/civil-registry/src/routes/routes';
// import { digitalIdRouteConfig } from '../modules/digital-id/src/routes/routes';
// import { kycRouteConfig } from '../modules/kyc/src/routes/routes';

// Placeholder for missing configs if they don't exist yet
const digitalIdRouteConfig: any[] = [];
const kycRouteConfig: any[] = [];

export const identityRouteConfig: AuthRouteConfig[] = [
  ...civilRegistryRouteConfig,
  ...digitalIdRouteConfig,
  ...kycRouteConfig,
];

export const IdentityRoutes: React.FC<RoutesProps> = () => (
  <React.Suspense fallback={<div>Loading Identity...</div>}>
    <>
      {identityRouteConfig.map(({ path, element }) => (
        <Route
          key={path}
          path={path}
          element={element}
        />
      ))}
    </>
  </React.Suspense>
);
