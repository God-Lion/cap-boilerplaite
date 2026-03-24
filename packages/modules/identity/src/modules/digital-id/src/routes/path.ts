// src/routes/path.ts

const DigitalIdPath = {
  root: '/digital-id',
  eligibility: {
    root: '/digital-id/eligibility',
    check: '/digital-id/eligibility/check',
  },
  application: {
    root: '/digital-id/application',
    new: '/digital-id/application/new',
    status: '/digital-id/application/status/:id',
  },
  biometrics: {
    root: '/digital-id/biometrics',
    capture: '/digital-id/biometrics/capture/:id',
  },
  verification: {
    root: '/digital-id/verification',
    progress: '/digital-id/verification/progress/:id',
  },
  review: {
    root: '/digital-id/review',
    queue: '/digital-id/review/queue',
    detail: '/digital-id/review/detail/:id',
  },
  issuance: {
    root: '/digital-id/issuance',
    dashboard: '/digital-id/issuance/dashboard',
    preview: '/digital-id/issuance/preview/:id',
    print: '/digital-id/issuance/print/:id',
  },
  management: {
    myId: '/digital-id/my-id',
    renewal: '/digital-id/renewal',
    lossReport: '/digital-id/loss-report',
  },
} as const;

export default DigitalIdPath;
