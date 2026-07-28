import React from 'react'
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  useTheme,
  alpha,
} from '@mui/material'
import { GlassCard, BentoCard } from '@cap/theme'
import { useNavigate } from 'react-router-dom'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import SecurityIcon from '@mui/icons-material/Security'
import SpeedIcon from '@mui/icons-material/Speed'

export default function Home() {
  const theme = useTheme()
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        bgcolor: 'customColors.bodyBg',
        minHeight: '100vh',
        pb: 8,
      }}
    >
      {/* Hero Section */}
      <Container
        maxWidth="lg"
        sx={{
          py: { xs: 8, md: 12 },
          position: 'relative',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100vw',
            height: '100%',
            background: `radial-gradient(circle at center, ${alpha(
              theme.palette.primary.lightOpacity || theme.palette.primary.light,
              0.15
            )} 0%, transparent 70%)`,
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />

        <GlassCard
          blur="24px"
          padding="4rem"
          style={{
            textAlign: 'center',
            position: 'relative',
            zIndex: 1,
            background: alpha(theme.palette.background.paper, 0.4),
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontWeight: 800,
              mb: 3,
              color: 'customColors.brandSlate',
              fontSize: { xs: '2.5rem', md: '4rem' },
              letterSpacing: '-0.02em',
            }}
          >
            Welcome to the{' '}
            <Box component="span" sx={{ color: 'customColors.brandGold' }}>
              Future
            </Box>
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: 'text.secondary',
              mb: 6,
              maxWidth: '800px',
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            Experience the next generation of our intelligent automation platform.
            Built with modern design principles for maximum efficiency and clarity.
          </Typography>

          <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="tonal"
              color="primary"
              size="large"
              onClick={() => navigate('/jobs')}
              sx={{
                px: 6,
                py: 2,
                fontSize: '1.125rem',
                fontWeight: 600,
                boxShadow: theme.customShadows?.primary?.md || 'none',
                '&:hover': {
                  boxShadow: theme.customShadows?.primary?.lg || 'none',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              Get Started
            </Button>
            <Button
              variant="tonal"
              color="secondary"
              size="large"
              onClick={() => navigate('/about')}
              sx={{
                px: 6,
                py: 2,
                fontSize: '1.125rem',
                fontWeight: 600,
                boxShadow: theme.customShadows?.secondary?.md || 'none',
                '&:hover': {
                  boxShadow: theme.customShadows?.secondary?.lg || 'none',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              Learn More
            </Button>
          </Box>
        </GlassCard>
      </Container>

      {/* Features Section */}
      <Box sx={{ bgcolor: 'customColors.greyLightBg', py: 10 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            sx={{
              textAlign: 'center',
              mb: 8,
              fontWeight: 700,
              color: 'customColors.brandSlate',
            }}
          >
            Powerful Features
          </Typography>

          <Grid container spacing={4}>
            {[
              {
                title: 'Intelligent AI',
                description: 'Leverage cutting-edge AI models for precise and automated data extraction.',
                icon: <AutoAwesomeIcon sx={{ fontSize: 40 }} />,
              },
              {
                title: 'Enterprise Security',
                description: 'Bank-grade security protocols ensuring your data remains private and protected.',
                icon: <SecurityIcon sx={{ fontSize: 40 }} />,
              },
              {
                title: 'Lightning Fast',
                description: 'Optimized infrastructure providing real-time results and analytics.',
                icon: <SpeedIcon sx={{ fontSize: 40 }} />,
              },
            ].map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <BentoCard
                  padding="2rem"
                  style={{
                    height: '100%',
                    background: theme.palette.background.paper,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  }}
                >
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: 'primary.main',
                      mb: 3,
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {feature.description}
                  </Typography>
                </BentoCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  )
}
