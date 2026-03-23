export const KycPath = {
  identityPath: {
    select: '/kyc/identity-path',
  },
  documentCollection: {
    upload: '/kyc/documents',
    alternative: '/kyc/documents/alternative',
  },
  profile: {
    my: '/kyc/profile',
    renewal: '/kyc/renewal',
    access: '/kyc/access',
  },
  compliance: {
    dashboard: '/admin/compliance',
    audit: '/admin/compliance/audit',
  },
} as const;

export default KycPath;
