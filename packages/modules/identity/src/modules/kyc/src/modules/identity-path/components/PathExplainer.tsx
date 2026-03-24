import React from 'react';
import { Box, Typography, Alert, AlertTitle, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import type { IdentityPathType } from '../../../domain-kernel/src/types/KycProfile';

interface PathExplainerProps {
  path: IdentityPathType;
}

const PATH_EXPLANATIONS: Record<IdentityPathType, { title: string; description: string; steps: string[] }> = {
  SSN_CITIZEN: {
    title: 'Social Security Number Verification',
    description: 'Your SSN will be verified against the civil registry for instant identity confirmation.',
    steps: [
      'Enter your SSN number',
      'System verifies against civil registry',
      'Biometric selfie capture',
      'Instant approval for Tier 3',
    ],
  },
  DIGITAL_ID_HOLDER: {
    title: 'Digital ID Verification',
    description: 'Your existing digital ID card provides verified identity information.',
    steps: [
      'Link your digital ID card',
      'System confirms ID status',
      'Biometric verification',
      'Quick approval for Tier 3',
    ],
  },
  FOREIGN_NATIONAL: {
    title: 'Foreign Passport Verification',
    description: 'Your foreign passport can be verified through automated document checking.',
    steps: [
      'Upload passport (front and back)',
      'Upload proof of address',
      'Automated document verification',
      'Approval within 1-3 business days',
    ],
  },
  REFUGEE: {
    title: 'Refugee Documentation',
    description: 'UNHCR and other refugee documentation is accepted as valid identification.',
    steps: [
      'Upload UNHCR refugee card or travel document',
      'Upload supporting attestation (NGO or social worker)',
      'Manual review by trained officer',
      'Approval within 2-5 business days',
    ],
  },
  ASYLUM_SEEKER: {
    title: 'Asylum Seeker Certificate',
    description: 'Pending asylum claims are supported with dedicated verification processes.',
    steps: [
      'Upload asylum seeker certificate',
      'Upload supporting documentation',
      'Risk assessment with humanitarian considerations',
      'Approval within 3-7 business days',
    ],
  },
  STATELESS_PERSON: {
    title: 'Stateless Person Verification',
    description: 'Alternative documentation can establish identity without national documents.',
    steps: [
      'Upload any available documentation',
      'Community or institutional attestations',
      'Case-by-case assessment',
      'Support officer assigned to assist',
    ],
  },
  UNDOCUMENTED: {
    title: 'Community Verification Route',
    description: 'When no formal documents exist, community attestations can establish identity.',
    steps: [
      'Gather 3 attestations from different sources',
      'Social worker or NGO support letter',
      'Community leader attestation',
      'Witness declarations',
      'In-person interview required',
    ],
  },
  MINOR_GUARDIAN: {
    title: 'Minor Guardian Verification',
    description: 'Guardians can initiate KYC on behalf of minors under their care.',
    steps: [
      'Guardian provides own KYC first',
      'Document relationship to minor',
      'Minor\'s birth certificate',
      'Guardian signs declaration',
    ],
  },
  CORPORATE_ENTITY: {
    title: 'Business/Organization Verification',
    description: 'Corporate entities require additional documentation and authorized representatives.',
    steps: [
      'Register company details',
      'Verify authorized signatories',
      'Company registration documents',
      'Beneficial ownership disclosure',
    ],
  },
};

export const PathExplainer: React.FC<PathExplainerProps> = ({ path }) => {
  const explanation = PATH_EXPLANATIONS[path];

  if (!explanation) return null;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {explanation.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        {explanation.description}
      </Typography>
      <Alert severity="info" sx={{ mb: 2 }}>
        <AlertTitle>What happens next</AlertTitle>
        <List dense>
          {explanation.steps.map((step, index) => (
            <ListItem key={index} disableGutters>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                  }}
                >
                  {index + 1}
                </Box>
              </ListItemIcon>
              <ListItemText primary={step} />
            </ListItem>
          ))}
        </List>
      </Alert>
    </Box>
  );
};

export default PathExplainer;
