import React, { useState } from 'react'
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Avatar,
  alpha,
  useTheme,
  Stack,
  Switch,
  Divider,
  Tabs,
  Tab,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  FormControlLabel,
  InputAdornment,
} from '@mui/material'
import {
  Save,
  Business,
  Palette,
  Security,
  Language,
  CloudUpload,
  ArrowBack,
  CheckCircle,
  Info,
  Mail,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import { Path } from '../../screens'
import { useOrganization, useUpdateOrganization } from '../../hooks/useAdminQuery'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
  sx?: import('@mui/system').SxProps<import('@mui/material').Theme>
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, sx, ...other } = props
  return (
    <div role='tabpanel' hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3, ...(sx as any) }}>{children}</Box>}
    </div>
  )
}

export default function OrganizationProfile() {
  const { t } = useTranslation('common')
  const navigate = useNavigate()
  const theme = useTheme()
  const { enqueueSnackbar } = useSnackbar()
  const { id } = useParams()
  const [tab, setTab] = useState(0)

  const { data: orgDataQuery, isLoading, isError } = useOrganization(Number(id))
  const updateOrgMutation = useUpdateOrganization()

  const orgData = orgDataQuery?.data

  const [formData, setFormData] = useState<any>(null)

  React.useEffect(() => {
    if (orgData) {
      setFormData(orgData)
    }
  }, [orgData])

  const handleSave = () => {
    if (!id || !formData) return

    updateOrgMutation.mutate(
      {
        id: Number(id),
        data: formData,
      },
      {
        onSuccess: () => {
          enqueueSnackbar(t('auth.admin.success_update_org'), { variant: 'success' })
        },
        onError: (error: any) => {
          enqueueSnackbar(error.message || t('auth.admin.error_update_org'), { variant: 'error' })
        },
      },
    )
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (isError || !orgData) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity='error'>Organization not found or failed to load.</Alert>
      </Box>
    )
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
      {/* Top Banner / Action Area */}
      <Box
        sx={{
          mb: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar
              sx={{
                width: { xs: 56, md: 80 },
                height: { xs: 56, md: 80 },
                borderRadius: '24px',
                fontSize: '2rem',
                bgcolor: 'primary.main',
                boxShadow: (theme) => `0 12px 24px ${alpha(theme.palette.primary.main, 0.2)}`,
              }}
            >
              {orgData.name[0]}
            </Avatar>
            <Box
              sx={{
                position: 'absolute',
                bottom: -4,
                right: -4,
                width: 24,
                height: 24,
                bgcolor: 'success.main',
                borderRadius: '50%',
                border: '4px solid',
                borderColor: 'background.paper',
              }}
            />
          </Box>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
              <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate(Path.admin.organizations)}
                sx={{
                  p: 0,
                  minWidth: 'auto',
                  color: 'text.secondary',
                  '&:hover': { bgcolor: 'transparent', color: 'primary.main' },
                }}
              />
              <Typography
                variant='h4'
                sx={{
                  fontWeight: 900,
                  letterSpacing: '-0.027em',
                  fontSize: { xs: '1.5rem', md: '2.125rem' },
                }}
              >
                {orgData.name}
              </Typography>
            </Box>
            <Stack direction='row' spacing={1} alignItems='center' flexWrap='wrap'>
              <Typography variant='body2' color='text.secondary'>
                ID: {orgData.id} • {orgData.domain || orgData.slug}
              </Typography>
              <Chip
                label={orgData.status || 'ACTIVE'}
                size='small'
                color={orgData.status === 'ACTIVE' ? 'success' : 'default'}
                variant='outlined'
                sx={{ fontWeight: 700, height: 20 }}
              />
            </Stack>
          </Box>
        </Box>
        <Stack
          direction='row'
          spacing={2}
          sx={{ flexShrink: 0, width: { xs: '100%', sm: 'auto' } }}
        >
          <Button
            variant='contained'
            startIcon={<Save />}
            onClick={handleSave}
            disabled={updateOrgMutation.isPending}
            sx={{
              bgcolor: 'info.main',
              color: 'white',
              boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)',
              '&:hover': { bgcolor: 'info.dark' },
              textTransform: 'none',
              fontWeight: 700,
              flex: { xs: 1, sm: 'none' },
              height: 44,
              px: 3,
            }}
          >
            {updateOrgMutation.isPending ? t('auth.common.saving') : t('auth.common.save_settings')}
          </Button>
        </Stack>
      </Box>

      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Tabs
          value={tab}
          onChange={(_: React.SyntheticEvent, v: number) => setTab(v)}
          aria-label='organization tabs'
          sx={{
            mb: 2,
            '& .MuiTab-root': {
              textTransform: 'uppercase',
              fontWeight: 700,
              minWidth: 100,
              fontSize: '0.8125rem',
              letterSpacing: '0.05em',
            },
          }}
        >
          <Tab icon={<Info />} iconPosition='start' label={t('auth.admin.overview')} />
          <Tab icon={<Palette />} iconPosition='start' label={t('auth.admin.branding')} />
          <Tab icon={<Security />} iconPosition='start' label={t('auth.admin.security')} />
          <Tab icon={<Language />} iconPosition='start' label={t('auth.admin.domains')} />
        </Tabs>
      </Box>

      <TabPanel value={tab} index={0}>
        <Grid
          container
          spacing={3}
          direction='row'
          sx={{
            flexWrap: { xs: 'wrap', md: 'nowrap' },
            marginLeft: '0 !important',
            marginRight: '0 !important',
            width: '100% !important',
          }}
        >
          {/* Main Column */}
          <Grid
            size={{ xs: 12, md: 8 }}
            sx={{
              flexGrow: 1,
              flexShrink: 1,
              flexBasis: { xs: '100%', md: '0%' },
            }}
          >
            <Box
              sx={{
                width: '100%',
              }}
            >
              <Box sx={{ width: '100%', mb: 3 }}>
                <Card
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    boxShadow: 'none',
                    width: '100%',
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                      <Business color='primary' sx={{ fontSize: 24 }} />
                      <Typography
                        variant='h6'
                        sx={{
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}
                      >
                        {t('auth.admin.basic_info')}
                      </Typography>
                    </Box>

                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label='Organization Name'
                          value={formData?.name || ''}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          variant='outlined'
                          placeholder='e.g. Acme Corp'
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label='Workspace Slug'
                          value={formData?.slug || ''}
                          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position='start'>
                                <Box sx={{ fontSize: '0.9rem', color: 'text.disabled', mr: -0.5 }}>
                                  /
                                </Box>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label='Primary Domain'
                          value={formData?.domain || ''}
                          onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                          placeholder='example.com'
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position='start'>
                                <Language sx={{ fontSize: 20, color: 'text.disabled' }} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label='Support Email'
                          value={formData?.support_email || ''}
                          onChange={(e) =>
                            setFormData({ ...formData, support_email: e.target.value })
                          }
                          placeholder='support@example.com'
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position='start'>
                                <Mail sx={{ fontSize: 20, color: 'text.disabled' }} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                    </Grid>

                    <Divider sx={{ my: 4, opacity: 0.5 }} />

                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography
                          variant='caption'
                          color='text.secondary'
                          sx={{
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.075em',
                            display: 'block',
                            mb: 0.5,
                          }}
                        >
                          {t('auth.admin.reg_date')}
                        </Typography>
                        <Typography variant='body2' sx={{ fontWeight: 800, color: 'text.primary' }}>
                          {orgData.created_at
                            ? new Date(orgData.created_at).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })
                            : '-'}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography
                          variant='caption'
                          color='text.secondary'
                          sx={{
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.075em',
                            display: 'block',
                            mb: 0.5,
                          }}
                        >
                          {t('auth.admin.last_updated')}
                        </Typography>
                        <Typography variant='body2' sx={{ fontWeight: 800, color: 'text.primary' }}>
                          {orgData.updated_at
                            ? new Date(orgData.updated_at).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })
                            : '-'}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography
                          variant='caption'
                          color='text.secondary'
                          sx={{
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.075em',
                            display: 'block',
                            mb: 0.5,
                          }}
                        >
                          {t('auth.admin.members')}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography
                            variant='body2'
                            sx={{ fontWeight: 800, color: 'text.primary' }}
                          >
                            {orgData.members_count || 0}
                          </Typography>
                          <Typography variant='caption' color='text.secondary'>
                            {t('auth.admin.members_label', {
                              count: orgData.members_count || 0,
                            }).split(' ')[1] || 'Users'}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Box>

              <Box sx={{ width: '100%' }}>
                <Card
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    boxShadow: 'none',
                    bgcolor: (theme) => alpha(theme.palette.info.main, 0.02),
                    mt: 3,
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      variant='h6'
                      sx={{ fontWeight: 800, mb: 2, textTransform: 'uppercase' }}
                    >
                      {t('auth.admin.internal_debug')}
                    </Typography>
                    <Divider sx={{ my: 1, opacity: 0.5 }} />
                    <Box
                      sx={{
                        color: 'text.secondary',
                        fontFamily: 'monospace',
                        wordBreak: 'break-all',
                        lineHeight: 1.5,
                        bgcolor: (theme) => alpha(theme.palette.text.primary, 0.05),
                        p: 2,
                        borderRadius: 0,
                        width: 'calc(100% + 32px)',
                        mx: -2,
                        mb: -2,
                        overflowX: 'auto',
                      }}
                    >
                      <strong>{t('auth.admin.raw_data')}:</strong>
                      <pre style={{ margin: 0, marginTop: '8px' }}>
                        {JSON.stringify(orgData, null, 2)}
                      </pre>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Box>
          </Grid>

          {/* Side Panel */}
          <Grid
            size={{ xs: 12, md: 4 }}
            sx={{
              flexGrow: 1,
              flexShrink: 1,
              flexBasis: { xs: '100%', md: '0%' },
            }}
          >
            <Card
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: 'none',
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.02),
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Business sx={{ color: 'primary.main' }} />
                  <Typography variant='subtitle1' sx={{ fontWeight: 800 }}>
                    {t('auth.admin.quick_actions').toUpperCase()}
                  </Typography>
                </Box>
                <Stack spacing={2}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData?.status === 'ACTIVE'}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            status: e.target.checked ? 'ACTIVE' : 'SUSPENDED',
                          })
                        }
                      />
                    }
                    label={t('auth.admin.active_status')}
                    sx={{ '& .MuiFormControlLabel-label': { fontWeight: 600 } }}
                  />
                  <Divider />
                  <Typography variant='caption' sx={{ fontWeight: 700, color: 'text.secondary' }}>
                    {t('auth.admin.links').toUpperCase()}
                  </Typography>
                  <Button
                    fullWidth
                    variant='outlined'
                    startIcon={<Language />}
                    onClick={() => setTab(3)}
                    sx={{ justifyContent: 'flex-start', textTransform: 'none', fontWeight: 700 }}
                  >
                    {t('auth.admin.manage_domains')}
                  </Button>
                </Stack>
              </CardContent>
            </Card>

            <Box
              sx={{
                mt: 3,
                p: 2,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.info.main, 0.05),
                border: '1px solid',
                borderColor: alpha(theme.palette.info.main, 0.1),
              }}
            >
              <Typography
                variant='subtitle2'
                sx={{
                  fontWeight: 800,
                  mb: 1,
                  color: 'info.main',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Info fontSize='small' />
                PLATFORM TIP
              </Typography>
              <Typography variant='body2' color='text.secondary' sx={{ lineHeight: 1.6 }}>
                The workspace slug is used for **Service Discovery**. If OIDC Discovery is enabled,
                it allows users to find their tenant by entering just their email.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tab} index={1}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              sx={{
                borderRadius: 4,
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: 'none',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant='h6'
                  sx={{ fontWeight: 800, mb: 3, textTransform: 'uppercase' }}
                >
                  {t('auth.admin.logo_assets').toUpperCase()}
                </Typography>
                <Box
                  sx={{
                    p: 4,
                    border: '2px dashed',
                    borderColor: 'divider',
                    borderRadius: 4,
                    textAlign: 'center',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                >
                  <CloudUpload sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                  <Typography variant='body2' sx={{ fontWeight: 600 }}>
                    {t('auth.admin.drop_logo')}
                  </Typography>
                  <Typography variant='caption' color='text.disabled'>
                    PNG, SVG or WebP up to 2MB
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              sx={{
                borderRadius: 4,
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: 'none',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant='h6'
                  sx={{ fontWeight: 800, mb: 3, textTransform: 'uppercase' }}
                >
                  {t('auth.admin.colors_theme').toUpperCase()}
                </Typography>
                <Stack spacing={3}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 2,
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <TextField
                        fullWidth
                        label={t('auth.admin.primary_color')}
                        size='small'
                        value={formData?.primaryColor || ''}
                        onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                        helperText='Hex code (e.g., #6366f1)'
                      />
                    </Box>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        bgcolor: formData?.primaryColor || theme.palette.primary.main,
                        borderRadius: 2,
                        border: '4px solid white',
                        boxShadow: theme.shadows[2],
                        mt: -2.5,
                      }}
                    />
                  </Box>
                  <Divider />
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 2,
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <TextField
                        fullWidth
                        label={t('auth.admin.secondary_color')}
                        size='small'
                        value={formData?.secondaryColor || ''}
                        onChange={(e) =>
                          setFormData({ ...formData, secondaryColor: e.target.value })
                        }
                        helperText='Hex code (e.g., #ec4899)'
                      />
                    </Box>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        bgcolor: formData?.secondaryColor || theme.palette.secondary.main,
                        borderRadius: 2,
                        border: '4px solid white',
                        boxShadow: theme.shadows[2],
                        mt: -2.5,
                      }}
                    />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tab} index={2}>
        <Card
          sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography variant='h6' sx={{ fontWeight: 800, mb: 3, textTransform: 'uppercase' }}>
              {t('auth.admin.tenant_security_policies').toUpperCase()}
            </Typography>
            <Stack divider={<Divider />}>
              <Box
                sx={{
                  py: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box>
                  <Typography variant='body1' sx={{ fontWeight: 700 }}>
                    {t('auth.admin.enforce_mfa_all')}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    {t('auth.admin.enforce_mfa_desc')}
                  </Typography>
                </Box>
                <Switch
                  checked={formData?.enforceMfa || false}
                  onChange={(e) => setFormData({ ...formData, enforceMfa: e.target.checked })}
                />
              </Box>
              <Box
                sx={{
                  py: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box>
                  <Typography variant='body1' sx={{ fontWeight: 700 }}>
                    {t('auth.admin.restrict_sso_only')}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    {t('auth.admin.restrict_sso_desc')}
                  </Typography>
                </Box>
                <Switch
                  checked={formData?.ssoOnly || false}
                  onChange={(e) => setFormData({ ...formData, ssoOnly: e.target.checked })}
                />
              </Box>
              <Box
                sx={{
                  py: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box>
                  <Typography variant='body1' sx={{ fontWeight: 700 }}>
                    {t('auth.admin.allow_public_signup')}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Allow anyone to sign up for this organization.
                  </Typography>
                </Box>
                <Switch
                  checked={formData?.allowPublicSignup || false}
                  onChange={(e) =>
                    setFormData({ ...formData, allowPublicSignup: e.target.checked })
                  }
                />
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value={tab} index={3}>
        <Card
          sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
              <Typography variant='h6' sx={{ fontWeight: 800, textTransform: 'uppercase' }}>
                {t('auth.admin.verified_domains').toUpperCase()}
              </Typography>
              <Button variant='outlined' size='small' startIcon={<Language />}>
                {t('auth.admin.add_domain')}
              </Button>
            </Box>
            <TableContainer sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
              <Table>
                <TableHead sx={{ bgcolor: 'action.hover' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>{t('auth.admin.domain_name')}</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>{t('auth.admin.status')}</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>{t('auth.admin.dns_record')}</TableCell>
                    <TableCell align='right' sx={{ fontWeight: 700 }}>
                      {t('auth.admin.verified_at')}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>
                      {orgData.domain || 'nexus-platform.com'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label='Verified'
                        size='small'
                        color='success'
                        icon={<CheckCircle />}
                        sx={{ fontWeight: 700 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant='caption' sx={{ fontFamily: 'monospace' }}>
                        TXT idp-verify=9fk2...
                      </Typography>
                    </TableCell>
                    <TableCell align='right'>
                      <Typography variant='body2' color='text.secondary'>
                        2 months ago
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </TabPanel>
    </Box>
  )
}
