import { lazy, Suspense } from 'react';
import type { AuthRouteConfig } from '@cap/platform-core';
import { BlockchainPath } from './path';

const Dashboard = lazy(() => import('./dashboard/Dashboard').then(m => ({ default: m.Dashboard })));

export const blockchainRouteConfig: AuthRouteConfig[] = [
  {
    path: BlockchainPath.dashboard,
    element: (
      <Suspense fallback={null}>
        <Dashboard />
      </Suspense>
    ),
    layout: 'admin',
  },
];

export const BlockchainRoutes = () => (
  <Suspense fallback={null}>
    <Dashboard />
  </Suspense>
);
