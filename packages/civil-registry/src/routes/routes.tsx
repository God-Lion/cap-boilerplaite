import React, { lazy } from 'react';
import { Route } from 'react-router-dom';
import { AuthRouteConfig, RoleGuard } from '@cap/platform-core';
import Path from './path';

const NewDeclarationScreen = lazy(() => import('../modules/birth-declaration/screens/NewDeclarationScreen').then(m => ({ default: m.NewDeclarationScreen })));
const RegistryDashboard = lazy(() => import('../modules/registry-dashboard/screens/RegistryDashboard').then(m => ({ default: m.RegistryDashboard })));

export const civilRegistryRouteConfig: AuthRouteConfig[] = [
  {
    path: Path.declaration.new,
    element: (
      <RoleGuard require="civil:hospital_staff" logic="OR">
        <NewDeclarationScreen />
      </RoleGuard>
    ),
    layout: 'admin',
  },
  {
    path: Path.issuance.dashboard,
    element: (
      <RoleGuard require={["civil:registrar", "civil:director"]} logic="OR">
        <RegistryDashboard />
      </RoleGuard>
    ),
    layout: 'admin',
  },
];

export const CivilRegistryRoutes: React.FC = () => (
  <React.Suspense fallback={null}>
    <>
      {civilRegistryRouteConfig.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}
    </>
  </React.Suspense>
);
