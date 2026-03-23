import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Container, 
  Avatar, 
  Paper,
  Button,
  Stack,
  Chip
} from '@mui/material';
import { 
  Fingerprint, 
  AccountBalanceWallet, 
  History, 
  Security,
  Code
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { CredentialCard } from '../../components/CredentialCard';
import { blockchainIdaasFacade } from '../../idaas-facade/src/index';

export const Dashboard: React.FC = () => {
  const [did, setDid] = useState<string>('');
  const [vcs, setVcs] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [isIssuing, setIsIssuing] = useState(false);

  const refreshData = async () => {
    try {
      const userDid = await blockchainIdaasFacade.identity.getDid('me');
      setDid(userDid);
      
      const [credentials, auditLogs] = await Promise.all([
        blockchainIdaasFacade.identity.getCredentials(),
        blockchainIdaasFacade.audit.getLogs(userDid)
      ]);
      
      setVcs(credentials);
      setLogs(auditLogs);
    } catch (error) {
      console.error('Failed to refresh identity data:', error);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleRequestCredential = async () => {
    setIsIssuing(true);
    try {
      await blockchainIdaasFacade.identity.issueCredential(
        'did:key:z6Msystem-authority',
        did,
        {
          role: 'Verified Developer',
          clearance: 'Level-3',
          platform: 'OneAuth'
        },
        'VerifiedDeveloper'
      );
      await refreshData();
    } catch (error) {
      console.error('Failed to request credential:', error);
    } finally {
      setIsIssuing(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', py: 4, background: '#0a0a0c' }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box mb={6} display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4" fontWeight="800" gutterBottom sx={{ 
              background: 'linear-gradient(90deg, #fff 0%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Identity Vault
            </Typography>
            <Typography variant="body2" color="rgba(255, 255, 255, 0.5)">
              Manage your decentralized identifiers and verifiable credentials.
            </Typography>
          </Box>
          <Avatar 
            sx={{ 
              width: 56, 
              height: 56, 
              background: 'linear-gradient(45deg, #8b5cf6, #06b6d4)',
              border: '2px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            JD
          </Avatar>
        </Box>

        <Grid container spacing={4}>
          {/* Identity Info Panel */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={3}>
              <Paper sx={{ 
                p: 3, 
                borderRadius: '24px', 
                bgcolor: 'rgba(255, 255, 255, 0.02)', 
                border: '1px solid rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)'
              }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Fingerprint sx={{ color: '#8b5cf6', mr: 2 }} />
                  <Typography variant="h6" fontWeight="700">Your DID</Typography>
                </Box>
                <Typography variant="caption" sx={{ wordBreak: 'break-all', color: '#06b6d4', fontFamily: 'monospace' }}>
                  {did || 'Resolving...'}
                </Typography>
                <Button fullWidth variant="outlined" size="small" sx={{ mt: 2, borderColor: 'rgba(255, 255, 255, 0.1)', color: 'rgba(255, 255, 255, 0.6)' }}>
                  Copy DID
                </Button>
              </Paper>

              <Paper sx={{ 
                p: 3, 
                borderRadius: '24px', 
                bgcolor: 'rgba(255, 255, 255, 0.02)', 
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Security sx={{ color: '#06b6d4', mr: 2 }} />
                  <Typography variant="h6" fontWeight="700">Security</Typography>
                </Box>
                <Typography variant="body2" color="rgba(255, 255, 255, 0.4)">
                  MFA Status: <span style={{ color: '#00ff00' }}>Active</span>
                </Typography>
                <Typography variant="body2" color="rgba(255, 255, 255, 0.4)">
                  Trust Level: High
                </Typography>
              </Paper>
            </Stack>
          </Grid>

          {/* Credentials Section */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
              <Box display="flex" alignItems="center">
                <AccountBalanceWallet sx={{ color: '#8b5cf6', mr: 2 }} />
                <Typography variant="h5" fontWeight="700">Verifiable Credentials</Typography>
              </Box>
              <Button 
                variant="contained" 
                size="small" 
                disabled={isIssuing || !did}
                onClick={handleRequestCredential}
                sx={{ 
                  bgcolor: 'rgba(139, 92, 246, 0.1)', 
                  color: '#8b5cf6',
                  border: '1px solid rgba(139, 92, 246, 0.2)',
                  '&:hover': { bgcolor: 'rgba(139, 92, 246, 0.2)' }
                }}
              >
                {isIssuing ? 'Issuing...' : 'Request Credential'}
              </Button>
            </Box>
            <Grid container spacing={3}>
              {vcs.length > 0 ? vcs.map((vc) => (
                <Grid key={vc.id} size={{ xs: 12, sm: 6 }}>
                  <CredentialCard 
                    type={vc.type}
                    issuer={vc.issuerDid.slice(0, 15) + '...'}
                    date={new Date(vc.createdAt).toLocaleDateString()}
                    status={vc.status.toUpperCase()}
                    data={JSON.parse(vc.claimsJson)}
                  />
                </Grid>
              )) : (
                <Grid size={{ xs: 12 }}>
                  <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'transparent', border: '1px dashed rgba(255,255,255,0.1)' }}>
                    <Typography color="rgba(255,255,255,0.3)">No credentials found in your vault.</Typography>
                  </Paper>
                </Grid>
              )}
            </Grid>
          </Grid>

          {/* Audit Trail & Governance */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Box mt={4} mb={3} display="flex" alignItems="center">
              <History sx={{ color: '#06b6d4', mr: 2 }} />
              <Typography variant="h5" fontWeight="700">Cryptographic Audit Trail</Typography>
            </Box>
            <Paper sx={{ 
              borderRadius: '24px', 
              bgcolor: 'rgba(255, 255, 255, 0.01)', 
              border: '1px solid rgba(255, 255, 255, 0.05)',
              overflow: 'hidden'
            }}>
              {logs.map((log, index) => (
                <Box 
                  key={log.id} 
                  sx={{ 
                    p: 3, 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    borderBottom: index === logs.length - 1 ? 'none' : '1px solid rgba(255, 255, 255, 0.05)'
                  }}
                >
                  <Box display="flex" alignItems="center">
                    <Code sx={{ color: 'rgba(255, 255, 255, 0.3)', mr: 2 }} />
                    <Box>
                      <Typography variant="body2" fontWeight="600">{log.type.replace('_', ' ')}</Typography>
                      <Typography variant="caption" color="rgba(255, 255, 255, 0.3)">{log.timestamp}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="caption" sx={{ color: '#8b5cf6', display: 'block', fontFamily: 'monospace' }}>
                      {log.txHash.slice(0, 10)}...{log.txHash.slice(-8)}
                    </Typography>
                    <Chip size="small" label="VERIFIED" sx={{ height: 20, fontSize: '9px', bgcolor: 'rgba(0, 255, 0, 0.05)', color: '#00ff00', border: '1px solid rgba(0, 255, 0, 0.1)' }} />
                  </Box>
                </Box>
              ))}
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Box mt={4} mb={3} display="flex" alignItems="center">
              <Security sx={{ color: '#8b5cf6', mr: 2 }} />
              <Typography variant="h5" fontWeight="700">Governance</Typography>
            </Box>
            <Paper sx={{ 
              p: 3, 
              borderRadius: '24px', 
              bgcolor: 'rgba(255, 255, 255, 0.02)', 
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}>
              <Typography variant="subtitle2" color="rgba(255, 255, 255, 0.5)" mb={2}>Active Contracts</Typography>
              <Stack spacing={2}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2">Consent Manager</Typography>
                  <Chip size="small" label="ACTIVE" sx={{ bgcolor: 'rgba(0, 255, 0, 0.1)', color: '#00ff00', fontSize: '10px' }} />
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2">Access Policy v2</Typography>
                  <Chip size="small" label="ACTIVE" sx={{ bgcolor: 'rgba(0, 255, 0, 0.1)', color: '#00ff00', fontSize: '10px' }} />
                </Box>
              </Stack>
              <Button fullWidth variant="contained" sx={{ 
                mt: 3, 
                bgcolor: '#8b5cf6', 
                borderRadius: '12px',
                '&:hover': { bgcolor: '#7c3aed' }
              }}>
                Manage Policies
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
