import {
  Box,
  Typography,
  Grid,
  Stack,
  Alert,
  AlertTitle,
  LinearProgress,
  Card,
  CardContent,
  Button,
  Chip
} from '@mui/material';
import {
  SupportAgent as SupportAgentIcon
} from '@mui/icons-material';
import { ALTERNATIVE_DOCUMENT_MATRIX } from '../../../domain-kernel/src';

// Mock hooks and components
const useDocumentCapture = () => ({
  documents: [],
});

const DocumentUploadCard = ({ docType, isOptional }: any) => (
  <Card variant="outlined" sx={{ mb: 1 }}>
    <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="body2" fontWeight="bold">{docType}</Typography>
        {isOptional && <Chip label="Optional" size="small" variant="outlined" />}
        <Button size="small" variant="contained">Upload</Button>
      </Stack>
    </CardContent>
  </Card>
);

const DocumentChecklist = () => (
  <Card variant="outlined">
    <CardContent>
      <Typography variant="subtitle2" gutterBottom>Checklist</Typography>
      <Typography variant="body2" color="text.secondary">Verification requirements will appear here.</Typography>
    </CardContent>
  </Card>
);

const AttestationRequestSection = () => <Box>Attestation section</Box>;

const getPathGuidanceTitle = (_path: string) => _path === 'UNDOCUMENTED' ? 'Support for Undocumented Individuals' : 'Document Submission';
const getPathGuidanceText = (_path: string) => "Please upload the required documents as per your selected identity path.";
const isRequiredSupporting = (_type: string, _docs: any[], _rule: any) => true;

export function AlternativeDocumentScreen({
  pathResult,
}: {
  pathResult: any;
}) {
  const { documents } = useDocumentCapture();

  const suggestedTier = pathResult?.suggestedTier ?? 1;
  const rules = ALTERNATIVE_DOCUMENT_MATRIX[suggestedTier as keyof typeof ALTERNATIVE_DOCUMENT_MATRIX] || [];
  const requiredDocs = rules.find(rule => rule.name === pathResult?.recommendedRule) || rules[0];

  const completedCount = documents.filter((d: any) => d.status === 'VERIFIED').length;
  const progress = (completedCount / (requiredDocs?.minimumDocuments ?? 1)) * 100;

  return (
    <Box maxWidth={900} mx="auto" py={4}>

      {/* Progress header */}
      <Box mb={4}>
        <Stack direction="row" justifyContent="space-between" mb={1}>
          <Typography variant="h6">Document Submission</Typography>
          <Typography variant="body2" color="text.secondary">
            {completedCount} of {requiredDocs?.minimumDocuments ?? 0} required
          </Typography>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={progress}
          color={progress === 100 ? 'success' : 'primary'}
          sx={{ height: 8, borderRadius: 4 }}
        />
      </Box>

      {/* Path-specific guidance */}
      <Alert
        severity={
          pathResult?.path === 'UNDOCUMENTED' ? 'info' :
          pathResult?.path === 'REFUGEE' ? 'success' : 'info'
        }
        sx={{ mb: 3 }}
      >
        <AlertTitle>{getPathGuidanceTitle(pathResult?.path)}</AlertTitle>
        {getPathGuidanceText(pathResult?.path)}
      </Alert>

      <Grid container spacing={3}>

        {/* Left: Document upload area */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Upload Your Documents
          </Typography>

          {/* Primary document section */}
          {requiredDocs?.primaryDocuments && requiredDocs.primaryDocuments.length > 0 && (
            <Box mb={3}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                PRIMARY DOCUMENT (choose one)
              </Typography>
              <Stack spacing={2}>
                {requiredDocs.primaryDocuments.map((docType: string) => (
                  <DocumentUploadCard
                    key={docType}
                    docType={docType}
                    isOptional={false}
                  />
                ))}
              </Stack>
            </Box>
          )}

          {/* Supporting documents */}
          {requiredDocs?.supportingDocuments && requiredDocs.supportingDocuments.length > 0 && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                SUPPORTING DOCUMENTS (choose from list)
              </Typography>
              <Stack spacing={2}>
                {requiredDocs.supportingDocuments.map((docType: string) => (
                  <DocumentUploadCard
                    key={docType}
                    docType={docType}
                    isOptional={!isRequiredSupporting(docType, documents, requiredDocs)}
                  />
                ))}
              </Stack>
            </Box>
          )}

          {/* Undocumented special guidance */}
          {pathResult?.path === 'UNDOCUMENTED' && (
            <Box mt={3}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                ATTESTATIONS (we need 3 from different sources)
              </Typography>
              <AttestationRequestSection />
            </Box>
          )}
        </Grid>

        {/* Right: Checklist + tips */}
        <Grid size={{ xs: 12, md: 5 }}>
          <DocumentChecklist />

          {/* Photo tips */}
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>
                📷 Photo Tips
              </Typography>
              <Typography variant="body2" color="text.secondary" component="div">
                <ul style={{ paddingLeft: 16, margin: 0 }}>
                  <li>Flat surface, no shadows</li>
                  <li>All four corners visible</li>
                  <li>No glare or reflections</li>
                  <li>Text must be clearly readable</li>
                  <li>Color photo preferred</li>
                </ul>
              </Typography>
            </CardContent>
          </Card>

          {/* Need help? */}
          <Card sx={{ mt: 2, bgcolor: 'primary.50' }}>
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>
                Need help?
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                A support officer can help you gather your documents.
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<SupportAgentIcon />}
                fullWidth
              >
                Contact Support Officer
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
