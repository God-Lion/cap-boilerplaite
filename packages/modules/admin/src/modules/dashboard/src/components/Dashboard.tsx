import React from 'react'
import { 
  Box, 
  Grid, 
  Typography, 
  Stack,
  CircularProgress
} from '@mui/material'
import { 
  Storage as StorageIcon
} from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'
import { GlassCard } from '@cap/theme'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const StatItem = ({ label, value, subValue, trend }: { label: string, value: string, subValue: string, trend?: 'up' | 'down' }) => (
  <Box sx={{ flex: 1 }}>
    <Typography variant="caption" sx={{ color: 'var(--color-text-muted)', display: 'block', mb: 0.5 }}>
      {label}
    </Typography>
    <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--color-text)', lineHeight: 1 }}>
      {value}
    </Typography>
    <Typography variant="caption" sx={{ color: trend === 'up' ? 'var(--color-success)' : 'var(--color-text-muted)', fontSize: '0.7rem' }}>
      {subValue}
    </Typography>
  </Box>
)

export const Dashboard = () => {
  const { data: mongoStats, isLoading } = useQuery({
    queryKey: ['mongoStats'],
    queryFn: async () => {
      const { data } = await axios.get('/api/admin/mongodb/stats')
      return data.data
    },
    refetchInterval: 5000 
  })

  return (
    <Box 
      component={motion.div}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
    >
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Overview</Typography>
        <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
          Welcome back, Admin. Here's what's happening today.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 12 }}>
          <GlassCard>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{ 
                  p: 1.5, 
                  borderRadius: '10px', 
                  background: 'rgba(99, 91, 255, 0.1)',
                  color: 'var(--color-primary)'
                }}>
                  <StorageIcon />
                </Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Database Health</Typography>
                  <Typography variant="caption" sx={{ color: 'var(--color-text-muted)' }}>MongoDB Diagnostic Stats</Typography>
                </Box>
              </Stack>
              {isLoading && <CircularProgress size={20} />}
            </Box>

            <AnimatePresence mode="wait">
              {mongoStats ? (
                <Box 
                  component={motion.div}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key="stats"
                >
                  <Grid container spacing={4}>
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <StatItem 
                        label="Uptime" 
                        value={`${(mongoStats.uptime / 3600).toFixed(1)}h`} 
                        subValue="Server runtime" 
                      />
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <StatItem 
                        label="Memory" 
                        value={`${mongoStats.memory.resident}MB`} 
                        subValue="Resident" 
                        trend="up"
                      />
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <StatItem 
                        label="Connections" 
                        value={mongoStats.connections.current} 
                        subValue={`${mongoStats.connections.available} avail.`} 
                      />
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <StatItem 
                        label="Opcounters" 
                        value={(mongoStats.opcounters.insert + mongoStats.opcounters.query).toString()} 
                        subValue="Total Operations" 
                      />
                    </Grid>
                  </Grid>

                  <Box sx={{ 
                    mt: 4, 
                    height: 120, 
                    width: '100%', 
                    background: 'linear-gradient(180deg, rgba(99, 91, 255, 0.05) 0%, rgba(99, 91, 255, 0) 100%)',
                    borderRadius: '12px',
                    border: '1px dashed var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-text-muted)',
                    fontSize: '0.8rem'
                  }}>
                    Real-time visualization incoming...
                  </Box>
                </Box>
              ) : (
                <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
                    Fetching statistics...
                  </Typography>
                </Box>
              )}
            </AnimatePresence>
          </GlassCard>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard
