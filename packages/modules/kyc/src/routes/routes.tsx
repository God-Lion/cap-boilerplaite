import { lazy, Suspense } from 'react';
import { Route } from 'react-router-dom';
import type { AuthRouteConfig } from '@cap/platform-core';
import Path from './path';

const IdentityPathScreen = lazy(() => import('../modules/identity-path/screens/IdentityPathScreen').then(m => ({ default: m.IdentityPathScreen })));
const AlternativeDocumentScreen = lazy(() => import('../modules/document-collection/screens/AlternativeDocumentScreen').then(m => ({ default: m.AlternativeDocumentScreen })));
const MyKycScreen = lazy(() => import('../modules/kyc-profile/screens/MyKycScreen').then(m => ({ default: m.MyKycScreen })));

export const kycRouteConfig: AuthRouteConfig[] = [
  {
    path: Path.identityPath.select,
    element: <IdentityPathScreen />,
    layout: 'admin',
  },
  {
    path: Path.documentCollection.alternative,
    element: <AlternativeDocumentScreen pathResult={null} />,
    layout: 'admin',
  },
  {
    path: Path.profile.my,
    element: <MyKycScreen />,
    layout: 'admin',
  },
];

export const KycRoutes: React.FC = () => (
  <Suspense fallback={null}>
    <>
      {kycRouteConfig.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}
    </>
  </Suspense>
);
