import { useState } from 'react'
import {
  Box,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  alpha,
  useTheme,
  Link,
} from '@mui/material'
import { CheckCircle, VpnKey, AccountCircle, Email, Badge, Shield } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

export default function PermissionConsentScreen() {
  const { t } = useTranslation()
  const theme = useTheme()

  const [loading, setLoading] = useState(false)

  const scopes = [
    {
      id: 'openid',
      icon: <VpnKey fontSize='small' />,
      label: t('auth.sso.scope_openid', 'OpenID'),
      description: t(
        'auth.sso.scope_openid_desc',
        'Securely verify your unique identity across platforms.',
      ),
    },
    {
      id: 'profile',
      icon: <AccountCircle fontSize='small' />,
      label: t('auth.sso.scope_profile', 'Profile Information'),
      description: t('auth.sso.scope_profile_desc', 'Access your full name and display picture.'),
    },
    {
      id: 'email',
      icon: <Email fontSize='small' />,
      label: t('auth.sso.scope_email', 'Email Address'),
      description: t('auth.sso.scope_email_desc', 'View and confirm your primary contact email.'),
    },
    {
      id: 'roles',
      icon: <Badge fontSize='small' />,
      label: t('auth.sso.scope_roles', 'Roles & Access'),
      description: t('auth.sso.scope_roles_desc', 'View your assigned group permissions.'),
    },
  ]

  const handleAllow = () => {
    setLoading(true)
    // Integration logic here
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `radial-gradient(circle at 50% 50%, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 70%)`,
        p: 3,
      }}
    >
      <Container maxWidth='sm'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card
            sx={{
              borderRadius: '24px',
              backdropFilter: 'blur(20px)',
              backgroundColor: alpha(theme.palette.background.paper, 0.8),
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              boxShadow: theme.shadows[10],
              overflow: 'visible',
            }}
          >
            <CardContent sx={{ p: { xs: 3, md: 5 } }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                <Box sx={{ position: 'relative', mb: 2 }}>
                  <Avatar
                    src='/app-logo.png'
                    sx={{
                      width: 80,
                      height: 80,
                      boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.2)}`,
                      border: `2px solid ${theme.palette.background.paper}`,
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      backgroundColor: theme.palette.success.main,
                      borderRadius: '50%',
                      p: 0.5,
                      display: 'flex',
                      border: `2px solid ${theme.palette.background.paper}`,
                    }}
                  >
                    <CheckCircle sx={{ color: '#fff', fontSize: 16 }} />
                  </Box>
                </Box>
                <Typography variant='h5' fontWeight={800} gutterBottom align='center'>
                  Nexus Design Studio
                </Typography>
                <Typography variant='body2' color='text.secondary' align='center'>
                  {t('auth.sso.consent_subtitle', 'is requesting access to your account')}
                </Typography>
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography
                  variant='overline'
                  color='primary'
                  fontWeight={700}
                  sx={{ mb: 2, display: 'block', letterSpacing: 1.5 }}
                >
                  {t('auth.sso.requested_scopes', 'Requested Scopes')}
                </Typography>
                <List disablePadding>
                  {scopes.map((scope) => (
                    <ListItem
                      key={scope.id}
                      sx={{
                        px: 2,
                        py: 1.5,
                        borderRadius: '12px',
                        mb: 1,
                        backgroundColor: alpha(theme.palette.action.hover, 0.05),
                        transition: 'all 0.2s',
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.08),
                          transform: 'translateX(4px)',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40, color: theme.palette.primary.main }}>
                        {scope.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant='subtitle2' fontWeight={600}>
                            {scope.label}
                          </Typography>
                        }
                        secondary={scope.description}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                <Button
                  fullWidth
                  variant='contained'
                  size='large'
                  onClick={handleAllow}
                  disabled={loading}
                  sx={{
                    height: 56,
                    borderRadius: '16px',
                    fontSize: '1rem',
                    fontWeight: 700,
                    textTransform: 'none',
                    boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                  }}
                >
                  {t('auth.sso.allow', 'Allow Access')}
                </Button>
                <Button
                  fullWidth
                  variant='outlined'
                  size='large'
                  sx={{
                    height: 56,
                    borderRadius: '16px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    borderColor: alpha(theme.palette.divider, 0.2),
                  }}
                >
                  {t('auth.sso.deny', 'Deny')}
                </Button>
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
                <Link
                  href='#'
                  variant='caption'
                  color='text.secondary'
                  sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
                >
                  {t('auth.sso.terms', 'Terms of Service')}
                </Link>
                <Link
                  href='#'
                  variant='caption'
                  color='text.secondary'
                  sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
                >
                  {t('auth.sso.privacy', 'Privacy Policy')}
                </Link>
              </Box>
            </CardContent>
          </Card>
        </motion.div>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 0.75,
              borderRadius: '20px',
              backgroundColor: alpha(theme.palette.background.paper, 0.5),
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            <Shield sx={{ fontSize: 14, color: 'text.secondary' }} />
            <Typography variant='caption' color='text.secondary' fontWeight={500}>
              {t('auth.sso.secure_encryption', 'Verified & Protected by Antigravity OS')}
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
