// src/routes/path.ts

const CivilRegistryPath = {
  root: '/civil-registry',
  declaration: {
    root: '/civil-registry/declaration',
    new: '/civil-registry/declaration/new',
    status: '/civil-registry/declaration/status/:id',
  },
  issuance: {
    root: '/civil-registry/issuance',
    dashboard: '/civil-registry/issuance/dashboard',
    detail: '/civil-registry/issuance/detail/:id',
    print: '/civil-registry/issuance/print/:id',
  },
  verification: {
    public: '/verify/certificate/:id',
  },
  dashboard: '/civil-registry/dashboard',
} as const;

export default CivilRegistryPath;
