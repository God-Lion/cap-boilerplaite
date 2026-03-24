// modules/stubs.tsx
import React from 'react';

// modules/application/screens/NewApplicationScreen.tsx
export function NewApplicationScreen() { return <div>New Application Screen</div>; }

// modules/application/screens/ApplicationStatusScreen.tsx
export function ApplicationStatusScreen() { return <div>Application Status Screen</div>; }

// modules/manual-review/screens/ManualReviewQueue.tsx
export function ManualReviewQueue() { return <div>Manual Review Queue</div>; }

// modules/manual-review/screens/ReviewDetailScreen.tsx
export function ReviewDetailScreen({ applicationId }: { applicationId: string }) { return <div>Review Detail Screen: {applicationId}</div>; }

// modules/id-issuance/screens/IssuanceDashboard.tsx
export function IssuanceDashboard() { return <div>Issuance Dashboard</div>; }
