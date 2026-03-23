// src/routes/routes.tsx

import React, { lazy } from 'react';
import { Route } from 'react-router-dom';
import { AuthRouteConfig, RoleGuard } from '@cap/platform-core';
import Path from './path';

const EligibilityCheckScreen = lazy(() => import('../modules/eligibility/screens/EligibilityCheckScreen').then(m => ({ default: m.EligibilityCheckScreen })));
const NewApplicationScreen = lazy(() => import('../modules/application/screens/NewApplicationScreen').then(m => ({ default: m.NewApplicationScreen })));
const ApplicationStatusScreen = lazy(() => import('../modules/application/screens/ApplicationStatusScreen').then(m => ({ default: m.ApplicationStatusScreen })));
const ManualReviewQueue = lazy(() => import('../modules/manual-review/screens/ManualReviewQueue').then(m => ({ default: m.ManualReviewQueue })));
const ReviewDetailScreen = lazy(() => import('../modules/manual-review/screens/ReviewDetailScreen').then(m => ({ default: m.ReviewDetailScreen })));
const IssuanceDashboard = lazy(() => import('../modules/id-issuance/screens/IssuanceDashboard').then(m => ({ default: m.IssuanceDashboard })));

export const digitalIdRouteConfig: AuthRouteConfig[] = [
  {
    path: Path.eligibility.check,
    element: <EligibilityCheckScreen citizenId="current" />, // Simplified for now
    layout: 'admin',
  },
  {
    path: Path.application.new,
    element: <NewApplicationScreen />,
    layout: 'admin',
  },
  {
    path: Path.application.status,
    element: <ApplicationStatusScreen />,
    layout: 'admin',
  },
  {
    path: Path.review.queue,
    element: (
      <RoleGuard require="digital-id:review_officer" logic="OR">
        <ManualReviewQueue />
      </RoleGuard>
    ),
    layout: 'admin',
  },
  {
    path: Path.review.detail,
    element: (
      <RoleGuard require="digital-id:review_officer" logic="OR">
        <ReviewDetailScreen />
      </RoleGuard>
    ),
    layout: 'admin',
  },
  {
    path: Path.issuance.dashboard,
    element: (
      <RoleGuard require="digital-id:director" logic="OR">
        <IssuanceDashboard />
      </RoleGuard>
    ),
    layout: 'admin',
  },
];

export const DigitalIdRoutes: React.FC = () => (
  <React.Suspense fallback={null}>
    <>
      {digitalIdRouteConfig.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}
    </>
  </React.Suspense>
);
