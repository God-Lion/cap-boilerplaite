import { 
  Box, 
  Grid, 
  Typography, 
  Stack,
  CircularProgress,
  CardContent,
  alpha,
  AdaptiveCard,
  AdaptiveButton,
  useTheme
} from '@cap/theme';
import { 
  Storage as StorageIcon,
  Add as AddIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const StatItem = ({ label, value, subValue, trend }: { label: string, value: string, subValue: string, trend?: 'up' | 'down' }) => {
  const theme = useTheme();
  return (
    <Box sx={{ flex: 1 }}>
      <Typography 
        variant="caption" 
        sx={{ 
          color: 'text.secondary', 
          display: 'block', 
          mb: 0.5,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          fontWeight: 700
        }}
      >
        {label}
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>{value}</Typography>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>{subValue}</Typography>
        {trend && (
          <Box 
            sx={{ 
              px: 1, 
              py: 0.25, 
              borderRadius: '6px', 
              fontSize: '0.7rem', 
              fontWeight: 700,
              bgcolor: trend === 'up' ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.error.main, 0.1),
              color: trend === 'up' ? 'success.main' : 'error.main'
            }}
          >
            {trend === 'up' ? '↑' : '↓'}
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export const Dashboard = () => {
  const theme = useTheme();
  const { data: stats, isLoading, refetch } = useQuery({
    queryKey: ['dbStats'],
    queryFn: async () => {
      const res = await axios.get('/api/admin/stats/database');
      return res.data;
    }
  });

  if (isLoading) return <CircularProgress />;

  return (
    <Box 
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      sx={{ p: { xs: 2, md: 4 } }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 6 }}>
        <Box>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 800, 
                mb: 1, 
                letterSpacing: '-0.02em',
                background: `linear-gradient(to bottom, ${theme.palette.text.primary} 0%, ${theme.palette.text.secondary} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Overview
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 400 }}>
              The Ethereal Command: Real-time intelligence and system health.
            </Typography>
        </Box>

        <Stack direction="row" spacing={2}>
          <AdaptiveButton 
            effectStyle="global"
            onClick={() => refetch()}
            variant="outline"
            style={{ borderRadius: '12px' }}
          >
            <RefreshIcon sx={{ fontSize: 18 }} />
          </AdaptiveButton>
          <AdaptiveButton 
            effectStyle="global"
            variant="primary"
            style={{ 
              borderRadius: '12px',
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.4)}`
            }}
          >
            <AddIcon sx={{ mr: 1 }} />
            Provision New DB
          </AdaptiveButton>
        </Stack>
      </Stack>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12 }}>
          <AdaptiveCard 
            effectStyle="global"
            style={{ 
              background: 'var(--color-surface-container, var(--color-surface))',
              border: 'none',
              overflow: 'hidden'
            }}
          >
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Stack direction="row" spacing={2.5} alignItems="center">
                <Box sx={{ 
                  p: 2, 
                  borderRadius: '16px', 
                  background: (theme) => alpha(theme.palette.primary.main, 0.08),
                  color: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <StorageIcon fontSize="large" />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>Database Health</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>MongoDB Diagnostic Cluster Metrics</Typography>
                </Box>
              </Stack>
              {isLoading && <CircularProgress size={24} thickness={4} sx={{ color: 'primary.main' }} />}
            </Box>

            <AnimatePresence mode="wait">
              {stats ? (
                <Box 
                  component={motion.div}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key="stats"
                >
                  <Grid container spacing={5}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <StatItem
                        label="Connections"
                        value={`${stats?.connections?.current || 0}`}
                        subValue={`${stats?.connections?.available || 0} available`}
                        trend="up"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <StatItem
                        label="Operations"
                        value={`${stats?.opcounters?.query || 0}`}
                        subValue={`${stats?.opcounters?.insert || 0} inserts/s`}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <StatItem
                        label="Memory"
                        value={`${stats?.mem?.resident || 0}MB`}
                        subValue={`${stats?.mem?.virtual || 0}MB virtual`}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <StatItem
                        label="Storage"
                        value={`${(stats?.extra_info?.page_faults || 0) / 100}GB`}
                        subValue={`${stats?.connections?.totalCreated || 0} pooled`}
                      />
                    </Grid>
                  </Grid>

                  <Box sx={{ 
                    mt: 6, 
                    height: 180, 
                    width: '100%', 
                    background: (theme) => `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0)} 100%)`,
                    borderRadius: '20px',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: '10%',
                      right: '10%',
                      height: '1px',
                      background: (theme) => `linear-gradient(90deg, transparent 0%, ${theme.palette.primary.main} 50%, transparent 100%)`,
                      boxShadow: (theme) => `0 0 15px ${theme.palette.primary.main}`,
                      opacity: 0.5
                    }
                  }}>
                    <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700, mb: 1 }}>Live Stream</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                      Ethereal visualization engine initializing...
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ height: 300, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {[1, 2, 3, 4].map((i) => (
                    <Box key={i} sx={{ flex: 1, height: 80, background: 'var(--color-surface-container-low)', borderRadius: '12px', opacity: 0.3 }} />
                  ))}
                </Box>
              )}
            </AnimatePresence>
          </AdaptiveCard>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard
