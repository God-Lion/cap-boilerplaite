import React from 'react';
import { motion } from 'framer-motion';
import { 
  Box, 
  Typography, 
  Chip, 
  IconButton, 
  Tooltip 
} from '@mui/material';
import { 
  VerifiedUser, 
  Share, 
  InfoOutlined, 
  Hub 
} from '@mui/icons-material';

interface CredentialCardProps {
  type: string;
  issuer: string;
  date: string;
  status: 'VERIFIED' | 'REVOKED' | 'EXPIRED';
  data: Record<string, string>;
}

export const CredentialCard: React.FC<CredentialCardProps> = ({ 
  type, 
  issuer, 
  date, 
  status, 
  data 
}) => {
  const isVerified = status === 'VERIFIED';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      style={{
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(12px)',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: isVerified 
          ? '0 8px 32px 0 rgba(139, 92, 246, 0.1)' 
          : 'none',
      }}
    >
      {/* Accent Gradient */}
      <Box
        sx={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: '100px',
          height: '100px',
          background: isVerified 
            ? 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(6, 182, 212, 0.2) 0%, transparent 70%)',
          filter: 'blur(20px)',
        }}
      />

      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
        <Box>
          <Typography variant="overline" color="rgba(255, 255, 255, 0.5)" letterSpacing={2}>
            {type.toUpperCase()}
          </Typography>
          <Typography variant="h6" fontWeight="700" color="#fff">
            {issuer}
          </Typography>
        </Box>
        <Chip 
          icon={<VerifiedUser style={{ fontSize: 16, color: '#06b6d4' }} />}
          label={status}
          sx={{ 
            bgcolor: 'rgba(6, 182, 212, 0.1)', 
            color: '#06b6d4',
            fontWeight: '600',
            fontSize: '10px',
            border: '1px solid rgba(6, 182, 212, 0.2)'
          }} 
        />
      </Box>

      <Box mb={3}>
        {Object.entries(data).map(([key, value]) => (
          <Box key={key} display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="caption" color="rgba(255, 255, 255, 0.4)">
              {key}:
            </Typography>
            <Typography variant="caption" fontWeight="600" color="#fff">
              {value}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center" pt={2} sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <Typography variant="caption" color="rgba(255, 255, 255, 0.3)">
          Issued: {date}
        </Typography>
        <Box>
          <Tooltip title="Share Proof">
            <IconButton size="small" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              <Share fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="View on Ledger">
            <IconButton size="small" sx={{ color: '#8b5cf6' }}>
              <InfoOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </motion.div>
  );
};
