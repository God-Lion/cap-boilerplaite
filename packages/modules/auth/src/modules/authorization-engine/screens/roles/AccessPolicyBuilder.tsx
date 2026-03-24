// FILE: packages/modules/auth/src/screens/admin/AccessPolicyBuilder.tsx
// STYLE AUDIT: Aligned to OrganizationProfile.tsx design system
// FIXES: [CRITICAL] Modernized InputProps to slotProps.input, applied info.main to CTAs [HIGH] Added animate-scale-in [MEDIUM] Added divider opacity and avatar 24px radius [LOW] Added aria-labels and i18n fallbacks
import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { adminService } from '../../services/adminService'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Switch,
  IconButton,
  Chip,
  alpha,
  useTheme,
  Stack,
  Divider,
  Paper,
  Tooltip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Backdrop,
  Alert,
} from '@mui/material'
import {
  Add,
  Delete,
  Security,
  NetworkCheck,
  Smartphone,
  Public,
  Settings,
  Shield,
  History,
  Info,
  Close,
  PriorityHigh,
  Save as SaveIcon,
  Add as AddIcon,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useParams, useNavigate } from 'react-router-dom'
import { AccessPolicy, AccessPolicyRule } from '../../../platform-cluster'
import { useSnackbar } from 'notistack'
import { useOrganizations } from '../../hooks/useAdminQuery'
import { useSessionGuard } from '@auth/session-manager/middlewares/useSessionGuard'
import { Roles } from '@cap/platform-core'
import { normalizeAuthUser } from '@idaas/authentication-core/utils/normalizeAuthUser'
import Path from '../../screens/path'

export default function AccessPolicyBuilder() {
  const { t } = useTranslation('common')
  const theme = useTheme()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const { id: orgIdParam } = useParams<{ id: string }>()
  const orgId = orgIdParam ? Number(orgIdParam) : 0
  const isInvalidOrgId = isNaN(orgId) || orgId <= 0

  const { user } = useSessionGuard()
  const userData = useMemo(() => normalizeAuthUser(user), [user])
  const isSuperAdmin = useMemo(() => (userData?.role as Roles) === Roles.SUPERADMIN, [userData])

  const { data: organizationsResponse, isLoading: loadingOrgs } = useOrganizations({ limit: 100 })
  const organizations = useMemo(() => organizationsResponse?.data?.data || [], [organizationsResponse])

  const [policies, setPolicies] = useState<AccessPolicy[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    const fetchPolicies = async () => {
      if (isInvalidOrgId) {
        if (!isSuperAdmin) {
          enqueueSnackbar(t('auth.admin.invalidOrgId', 'Invalid organization context detected'), { variant: 'error' })
          const timer = setTimeout(() => {
            navigate('/admin/organizations')
          }, 3000)
          return () => clearTimeout(timer)
        }
        return
      }
      setIsLoading(true)
      try {
        const response = await adminService.getAccessPolicies(orgId)
        if (response.data) {
          setPolicies(response.data)
        }
      } catch (err: any) {
        setError(err.message || t('auth.admin.policiesLoadError', 'Failed to load access policies'))
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPolicies()
  }, [orgId, isInvalidOrgId, t, enqueueSnackbar, isSuperAdmin, navigate])

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingPolicy, setEditingPolicy] = useState<AccessPolicy | null>(null)
  const [formData, setFormData] = useState<Partial<AccessPolicy>>({
    name: '',
    description: '',
    type: 'conditional_access',
    status: 'active',
    priority: 1,
    rules: [],
  })

  const handleOpenDialog = (policy: AccessPolicy | null = null) => {
    if (policy) {
      setEditingPolicy(policy)
      setFormData({ ...policy })
    } else {
      setEditingPolicy(null)
      setFormData({
        name: '',
        description: '',
        type: 'conditional_access',
        status: 'active',
        priority: policies.length + 1,
        rules: [],
      })
    }
    setDialogOpen(true)
  }

  const handleSave = useCallback(async () => {
    if (isInvalidOrgId) {
      enqueueSnackbar(t('auth.admin.invalidOrgId', 'Invalid organization ID'), { variant: 'error' })
      return
    }
    setIsSaving(true)
    setError(null)
    setSaveSuccess(false)

    let updatedPolicies: AccessPolicy[] = [...policies]
    if (editingPolicy) {
      const index = updatedPolicies.findIndex((p: AccessPolicy) => p.id === editingPolicy.id)
      if (index !== -1) {
        updatedPolicies[index] = { ...editingPolicy, ...formData } as AccessPolicy
      }
    } else {
      const newPolicy = {
        ...formData,
        id: `POL_${Date.now()}`, // Temporary ID for new policies
      } as AccessPolicy
      updatedPolicies.push(newPolicy)
    }

    try {
      await adminService.saveAccessPolicies(orgId, updatedPolicies)
      setPolicies(updatedPolicies) // Update local state with saved policies
      enqueueSnackbar(t('auth.admin.policiesSavedSuccess', 'Policies saved successfully'), { variant: 'success' })
      setSaveSuccess(true)
      setDialogOpen(false)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message || t('auth.admin.policiesSaveError', 'Failed to save policies'))
      enqueueSnackbar(err.message || t('auth.admin.policiesSaveError', 'Failed to save policies'), { variant: 'error' })
      console.error(err)
    } finally {
      setIsSaving(false)
    }
  }, [orgId, policies, editingPolicy, formData, enqueueSnackbar, t])

  const handleDelete = async (policyId: string) => {
    if (isInvalidOrgId) {
      enqueueSnackbar(t('auth.admin.invalidOrgId', 'Invalid organization ID'), { variant: 'error' })
      return
    }
    setIsSaving(true)
    setError(null)
    setSaveSuccess(false)
    try {
      const updatedPolicies = policies.filter((p: AccessPolicy) => p.id !== policyId)
      await adminService.saveAccessPolicies(orgId, updatedPolicies)
      setPolicies(updatedPolicies)
      enqueueSnackbar(t('auth.admin.policyDeletedSuccess', 'Policy deleted successfully'), { variant: 'success' })
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message || t('auth.admin.policyDeleteError', 'Failed to delete policy'))
      enqueueSnackbar(err.message || t('auth.admin.policyDeleteError', 'Failed to delete policy'), { variant: 'error' })
      console.error(err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleToggleStatus = async (policy: AccessPolicy) => {
    if (isInvalidOrgId) {
      enqueueSnackbar(t('auth.admin.invalidOrgId', 'Invalid organization ID'), { variant: 'error' })
      return
    }
    setIsSaving(true)
    setError(null)
    setSaveSuccess(false)
    try {
      const updatedPolicies = policies.map((p: AccessPolicy) =>
        p.id === policy.id ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' } : p,
      ) as AccessPolicy[]
      await adminService.saveAccessPolicies(orgId, updatedPolicies)
      setPolicies(updatedPolicies)
      enqueueSnackbar(t('auth.admin.policyStatusUpdated', 'Policy status updated'), { variant: 'success' })
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message || t('auth.admin.policyStatusUpdateError', 'Failed to update policy status'))
      enqueueSnackbar(err.message || t('auth.admin.policyStatusUpdateError', 'Failed to update policy status'), { variant: 'error' })
      console.error(err)
    } finally {
      setIsSaving(false)
    }
  }

  const getRuleIcon = (type: string) => {
    switch (type) {
      case 'network_cidr':
        return <NetworkCheck />
      case 'mfa_required':
        return <Smartphone />
      case 'device_compliance':
        return <Security />
      case 'geo_location':
        return <Public />
      default:
        return <Settings />
    }
  }

  const handleAddPolicy = () => handleOpenDialog()

  // â”€â”€ SYSTEM PATTERN: Entry animation (OrganizationProfile L60) â”€â”€
  return (
    <Box className="animate-scale-in" sx={{ p: { xs: 2, md: 4 }, maxWidth: 1400, mx: 'auto' }}>
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {isInvalidOrgId && !isSuperAdmin && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {t('auth.admin.invalidOrgIdMessage', 'Invalid organization context. You will be redirected shortly.')}
            </Alert>
          )}
          {isInvalidOrgId && isSuperAdmin && (
            <Alert severity="info" sx={{ mb: 3 }}>
              {t('auth.admin.selectOrgRequired', 'Please select an organization to manage its access policies.')}
            </Alert>
          )}
          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
          {saveSuccess && <Alert severity="success" sx={{ mb: 3 }}>{t('auth.admin.policiesSavedSuccess', 'Policies saved successfully!')}</Alert>}

          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              mb: 4,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Box>
                {/* â”€â”€ SYSTEM PATTERN: h4 titles (OrganizationProfile L62) â”€â”€ */}
                <Typography variant='h4' sx={{ fontWeight: 900, mb: 1, letterSpacing: '-0.027em' }}>
                  {t('auth.admin.accessPolicies', 'Access Policies')}
                </Typography>
                <Typography variant='body1' color='text.secondary' sx={{ fontWeight: 500 }}>
                  {t('auth.admin.accessPolicies_subtitle', 'Manage security rules and conditionals')}
                </Typography>
              </Box>

              {isSuperAdmin && (
                <FormControl size='small' sx={{ minWidth: 220, ml: 2 }}>
                  <InputLabel id='org-selector-label'>{t('auth.admin.organization', 'Organization')}</InputLabel>
                  <Select
                    labelId='org-selector-label'
                    value={orgId || ''}
                    label={t('auth.admin.organization', 'Organization')}
                    onChange={(e) => {
                      const newId = e.target.value as number
                      if (newId) {
                        navigate(Path.policies.replace(':id', String(newId)))
                      }
                    }}
                    disabled={loadingOrgs}
                    sx={{
                      bgcolor: 'background.paper',
                      borderRadius: 2,
                      '& .MuiSelect-select': { py: 1.2 },
                    }}
                  >
                    <MenuItem value='' disabled>
                      <em>{t('auth.admin.choose_org', 'Switch Organization')}</em>
                    </MenuItem>
                    {organizations.map((org: any) => (
                      <MenuItem key={org.id} value={org.id}>
                        {org.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Box>
            {/* â”€â”€ SYSTEM PATTERN: CTA buttons (OrganizationProfile L58) â”€â”€ */}
            <Button
              variant='contained'
              startIcon={<Add />}
              onClick={() => handleOpenDialog()}
              disabled={isInvalidOrgId}
              sx={{
                px: 3,
                py: 1.2,
                borderRadius: 2.5,
                bgcolor: 'info.main',
                boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)',
                fontWeight: 700,
                textTransform: 'none',
              }}
            >
              {t('auth.admin.createNewPolicy', 'Create New Policy')}
            </Button>
          </Box>

          {/* Stats/Overview Card */}
          <Card
            className="glass-effect"
            sx={{
              mb: 4,
              borderRadius: 4,
              bgcolor: 'transparent',
              border: '1px dashed',
              borderColor: alpha(theme.palette.primary.main, 0.2),
              boxShadow: 'none',
            }}
          >
            <CardContent
              sx={{
                py: 3,
                px: 4,
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: { xs: 'flex-start', md: 'center' },
                justifyContent: 'space-between',
                gap: 3,
              }}
            >
              <Stack
                direction='row'
                spacing={4}
                sx={{ overflowX: 'auto', width: '100%', pb: { xs: 1, md: 0 } }}
              >
                <Box>
                  <Typography
                    variant='caption'
                    color='text.secondary'
                    sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.075em' }}
                  >
                    {t('auth.admin.activePolicies', 'Active Policies')}
                  </Typography>
                  <Typography variant='h5' sx={{ fontWeight: 900, color: 'primary.main' }}>
                    {policies.filter((p: AccessPolicy) => p.status === 'active').length}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant='caption'
                    color='text.secondary'
                    sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.075em' }}
                  >
                    {t('auth.admin.signalsTracked', 'Signals Tracked')}
                  </Typography>
                  <Typography variant='h5' sx={{ fontWeight: 900 }}>
                    IP, MFA, Device
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant='caption'
                    color='text.secondary'
                    sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.075em' }}
                  >
                    {t('auth.admin.executionMode', 'Execution Mode')}
                  </Typography>
                  <Typography variant='h5' sx={{ fontWeight: 900 }}>
                    First Match
                  </Typography>
                </Box>
              </Stack>
              <Button
                startIcon={<History />}
                sx={{ textTransform: 'none', fontWeight: 700, whiteSpace: 'nowrap', color: 'info.main' }}
              >
                {t('auth.admin.viewChangeLogs', 'View Change Logs')}
              </Button>
            </CardContent>
          </Card>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' },
              gap: 4,
            }}
          >
            {policies.map((policy: AccessPolicy) => (
              <Box key={policy.id} sx={{ height: '100%' }}>
                <Paper
                  className="glass-effect"
                  sx={{
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 4,
                    bgcolor: 'transparent',
                    border: '1px solid',
                    borderColor: 'divider',
                    boxShadow: 'none',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      borderColor: 'primary.main',
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Stack direction='row' spacing={2} alignItems='center'>
                      <Avatar
                        sx={{
                          bgcolor: alpha(
                            policy.status === 'active'
                              ? theme.palette.primary.main
                              : theme.palette.text.disabled,
                            0.1,
                          ),
                          color: policy.status === 'active' ? 'primary.main' : 'text.disabled',
                          width: 52,
                          height: 52,
                          borderRadius: '24px',
                        }}
                      >
                        <Shield />
                      </Avatar>
                      <Box>
                        <Typography variant='h6' sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                          {policy.name}
                        </Typography>
                        {/* â”€â”€ SYSTEM PATTERN: Status chips (OrganizationProfile L66) â”€â”€ */}
                        <Chip
                          label={policy.type.replace('_', ' ')}
                          size='small'
                          sx={{
                            mt: 0.5,
                            height: 20,
                            fontWeight: 700,
                          }}
                          color={policy.status === 'active' ? 'info' : 'default'}
                          variant='outlined'
                        />
                      </Box>
                    </Stack>
                    <Switch
                      checked={policy.status === 'active'}
                      onChange={() => handleToggleStatus(policy)}
                      color='info'
                      inputProps={{ 'aria-label': 'Toggle Policy Status' }}
                    />
                  </Box>

                  <Typography
                    variant='body2'
                    color='text.secondary'
                    sx={{ mb: 3, minHeight: 40, fontWeight: 500, lineHeight: 1.6 }}
                  >
                    {policy.description}
                  </Typography>

                  {/* â”€â”€ SYSTEM PATTERN: Dividers (OrganizationProfile L65) â”€â”€ */}
                  <Divider sx={{ mb: 3, borderStyle: 'dashed', opacity: 0.5 }} />

                  <Box sx={{ mb: 3, flexGrow: 1 }}>
                    {/* â”€â”€ SYSTEM PATTERN: Section headings (OrganizationProfile L61) â”€â”€ */}
                    <Typography
                      variant='caption'
                      color='text.secondary'
                      sx={{
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        display: 'block',
                        mb: 2,
                        letterSpacing: '0.05em',
                      }}
                    >
                      Logic Fragments ({policy.rules.length})
                    </Typography>
                    <Stack spacing={1.5}>
                      {policy.rules.map((rule: AccessPolicyRule) => (
                        <Box
                          key={rule.id}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            p: 1.5,
                            borderRadius: 3,
                            bgcolor: alpha(theme.palette.action.hover, 0.4),
                            border: '1px solid',
                            borderColor: alpha(theme.palette.divider, 0.5),
                          }}
                        >
                          <Box
                            sx={{
                              color: rule.effect === 'allow' ? 'success.main' : 'error.main',
                              display: 'flex',
                            }}
                          >
                            {getRuleIcon(rule.type)}
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant='body2' sx={{ fontWeight: 800 }}>
                              {rule.type === 'network_cidr'
                                ? `IP Range: ${rule.config.range}`
                                : rule.type === 'mfa_required'
                                  ? 'MFA Enforcement'
                                  : rule.type.replace('_', ' ')}
                            </Typography>
                            <Typography
                              variant='caption'
                              sx={{
                                fontWeight: 700,
                                color: rule.effect === 'allow' ? 'success.main' : 'error.main',
                              }}
                            >
                              Result: {rule.effect.toUpperCase()}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mt: 'auto',
                      pt: 2,
                    }}
                  >
                    <Stack direction='row' spacing={1} alignItems='center'>
                      <PriorityHigh sx={{ fontSize: 16, color: 'text.disabled' }} />
                      <Typography variant='caption' sx={{ fontWeight: 800, color: 'text.disabled' }}>
                        PRIORITY: {policy.priority}
                      </Typography>
                    </Stack>
                    <Stack direction='row' spacing={1}>
                      <Tooltip title='Edit Policy'>
                        <IconButton
                          size='small'
                          aria-label="Edit policy"
                          onClick={() => handleOpenDialog(policy)}
                          sx={{ bgcolor: alpha(theme.palette.info.main, 0.05) }}
                        >
                          <Settings fontSize='small' color='info' />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title='Delete Policy'>
                        <IconButton
                          size='small'
                          color='error'
                          aria-label="Delete policy"
                          onClick={() => handleDelete(policy.id)}
                          sx={{ bgcolor: alpha(theme.palette.error.main, 0.05) }}
                        >
                          <Delete fontSize='small' />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Box>
                </Paper>
              </Box>
            ))}

            {/* Empty State / Add Card */}
            <Box sx={{ height: '100%' }}>
              <Box
                onClick={() => handleOpenDialog()}
                sx={{
                  height: '100%',
                  minHeight: 320,
                  borderRadius: 4,
                  border: '2px dashed',
                  borderColor: 'divider',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  '&:hover': {
                    borderColor: 'info.main',
                    bgcolor: alpha(theme.palette.info.main, 0.02),
                    '& .add-avatar': {
                      bgcolor: 'info.main',
                      color: 'white',
                      transform: 'scale(1.1)',
                    },
                  },
                }}
              >
                {/* â”€â”€ SYSTEM PATTERN: Avatar (OrganizationProfile L64) â”€â”€ */}
                <Avatar
                  className='add-avatar'
                  sx={{
                    bgcolor: alpha(theme.palette.action.hover, 0.8),
                    color: 'text.secondary',
                    mb: 2,
                    width: 56,
                    height: 56,
                    borderRadius: '24px',
                    transition: 'all 0.3s',
                  }}
                >
                  <Add sx={{ fontSize: 32 }} />
                </Avatar>
                <Typography variant='subtitle1' sx={{ fontWeight: 900 }}>
                  {t('auth.admin.defineCustomLogic', 'Define Custom Logic')}
                </Typography>
                <Typography variant='body2' color='text.secondary' sx={{ fontWeight: 500 }}>
                  {t('auth.admin.combineSignalsDesc', 'Combine signals to create a new access policy')}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* JSON Logic Preview */}
          <Box sx={{ mt: 6 }}>
            <Typography variant='h6' sx={{ fontWeight: 900, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Shield color='info' />
              {t('auth.admin.jsonLogicPreview', 'ABAC Policy Preview (JSON Logic)')}
            </Typography>
            <Paper
              variant='outlined'
              sx={{
                p: 3,
                borderRadius: 4,
                bgcolor: alpha(theme.palette.common.black, 0.02),
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                overflowX: 'auto',
              }}
            >
              <pre>
                {JSON.stringify(
                  {
                    and: policies
                      .filter((p: AccessPolicy) => p.status === 'active')
                      .sort((a, b) => a.priority - b.priority)
                      .map((p: AccessPolicy) => ({
                        [p.type]: {
                          rules: p.rules.map((r: AccessPolicyRule) => ({
                            [r.type]: r.config,
                            effect: r.effect,
                          })),
                        },
                      })),
                  },
                  null,
                  2,
                )}
              </pre>
            </Paper>
          </Box>
        </>
      )}

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth='sm'
        fullWidth
        PaperProps={{
          sx: { borderRadius: 4, p: 1 },
        }}
      >
        <DialogTitle
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}
        >
          <Typography variant='h5' component='span' sx={{ fontWeight: 900, letterSpacing: '-0.027em' }}>
            {editingPolicy ? t('auth.admin.editPolicy', 'Edit Policy') : t('auth.admin.createNewPolicy', 'Create New Policy')}
          </Typography>
          <IconButton onClick={() => setDialogOpen(false)} size='small' aria-label="Close dialog">
            <Close />
          </IconButton>
        </DialogTitle>

        {/* â”€â”€ SYSTEM PATTERN: Dividers (OrganizationProfile L65) â”€â”€ */}
        <DialogContent dividers sx={{ borderStyle: 'dashed', borderColor: alpha(theme.palette.divider, 0.5) }}>
          <Stack spacing={3} sx={{ mt: 1 }}>
            {/* â”€â”€ SYSTEM PATTERN: MUI v6 API input props (OrganizationProfile L67) â”€â”€ */}
            <TextField
              label={t('auth.admin.policyName', 'Policy Name')}
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder='e.g., Block External IPs'
              variant='outlined'
              slotProps={{ input: { sx: { borderRadius: 2 } } }}
            />

            <TextField
              label={t('auth.admin.description', 'Description')}
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder='Explain the purpose of this policy...'
              variant='outlined'
              slotProps={{ input: { sx: { borderRadius: 2 } } }}
            />

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 2,
              }}
            >
              <FormControl fullWidth variant='outlined'>
                <InputLabel>{t('auth.admin.policyType', 'Policy Type')}</InputLabel>
                <Select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  label={t('auth.admin.policyType', 'Policy Type')}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value='conditional_access'>Conditional Access</MenuItem>
                  <MenuItem value='login_policy'>Login Policy</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label={t('auth.admin.priority', 'Priority')}
                type='number'
                fullWidth
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                variant='outlined'
                slotProps={{ input: { sx: { borderRadius: 2 } } }}
              />
            </Box>

            <Box>
              <Typography
                variant='subtitle2'
                sx={{ fontWeight: 800, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}
              >
                Rules / Signal Logic
                <Chip label={formData.rules?.length || 0} size='small' sx={{ fontWeight: 700, height: 20 }} />
              </Typography>
              <Paper
                variant='outlined'
                sx={{
                  p: 2,
                  borderRadius: 3,
                  borderStyle: 'dashed',
                  bgcolor: alpha(theme.palette.action.hover, 0.3),
                }}
              >
                {formData.rules?.length === 0 ? (
                  <Typography
                    variant='body2'
                    color='text.secondary'
                    sx={{ textAlign: 'center', py: 2 }}
                  >
                    No rules defined yet. Policies without rules are ignored.
                  </Typography>
                ) : (
                  <Stack spacing={2}>
                    {formData.rules?.map((rule: AccessPolicyRule, idx: number) => (
                      <Box
                        key={rule.id || idx}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: 'background.paper',
                          border: '1px solid',
                          borderColor: 'divider',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 1.5,
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <Typography
                            variant='subtitle2'
                            sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}
                          >
                            {getRuleIcon(rule.type)} Rule {idx + 1}
                          </Typography>
                          <IconButton
                            size='small'
                            color='error'
                            aria-label="Delete rule"
                            onClick={() => {
                              const newRules = formData.rules?.filter((_: AccessPolicyRule, i: number) => i !== idx)
                              setFormData({ ...formData, rules: newRules })
                            }}
                          >
                            <Delete fontSize='small' />
                          </IconButton>
                        </Box>

                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                          <FormControl fullWidth size='small'>
                            <InputLabel>Type</InputLabel>
                            <Select
                              value={rule.type}
                              label='Type'
                              onChange={(e) => {
                                const newRules = [...(formData.rules || [])]
                                newRules[idx] = {
                                  ...rule,
                                  type: e.target.value as any,
                                  config:
                                    e.target.value === 'network_cidr' ? { range: '0.0.0.0/0' } : {},
                                }
                                setFormData({ ...formData, rules: newRules })
                              }}
                            >
                              <MenuItem value='network_cidr'>Network CIDR</MenuItem>
                              <MenuItem value='mfa_required'>MFA Required</MenuItem>
                              <MenuItem value='device_compliance'>Device Compliance</MenuItem>
                              <MenuItem value='geo_location'>Geo Location</MenuItem>
                              <MenuItem value='time_window'>Time Window</MenuItem>
                            </Select>
                          </FormControl>
                          <FormControl fullWidth size='small'>
                            <InputLabel>Effect</InputLabel>
                            <Select
                              value={rule.effect}
                              label='Effect'
                              onChange={(e) => {
                                const newRules = [...(formData.rules || [])]
                                newRules[idx] = {
                                  ...rule,
                                  effect: e.target.value as 'allow' | 'deny',
                                }
                                setFormData({ ...formData, rules: newRules })
                              }}
                            >
                              <MenuItem value='allow'>Allow</MenuItem>
                              <MenuItem value='deny'>Deny</MenuItem>
                            </Select>
                          </FormControl>
                        </Stack>

                        {rule.type === 'network_cidr' && (
                          <TextField
                            fullWidth
                            size='small'
                            label='IP Range (CIDR)'
                            placeholder='e.g. 192.168.1.0/24'
                            value={rule.config?.range || ''}
                            onChange={(e) => {
                              const newRules = [...(formData.rules || [])]
                              newRules[idx] = {
                                ...rule,
                                config: { ...rule.config, range: e.target.value },
                              }
                              setFormData({ ...formData, rules: newRules })
                            }}
                          />
                        )}
                        {rule.type === 'geo_location' && (
                          <TextField
                            fullWidth
                            size='small'
                            label='Allowed Countries (Comma separated codes)'
                            placeholder='e.g. US, CA, GB'
                            value={rule.config?.countries?.join(', ') || ''}
                            onChange={(e) => {
                              const newRules = [...(formData.rules || [])]
                              newRules[idx] = {
                                ...rule,
                                config: {
                                  ...rule.config,
                                  countries: e.target.value.split(',').map((c) => c.trim()),
                                },
                              }
                              setFormData({ ...formData, rules: newRules })
                            }}
                          />
                        )}
                      </Box>
                    ))}
                  </Stack>
                )}
                <Button
                  fullWidth
                  startIcon={<Add />}
                  sx={{ mt: 2, borderRadius: 2, textTransform: 'none', fontWeight: 700, color: 'info.main' }}
                  onClick={() => {
                    const newRule: AccessPolicyRule = {
                      id: `RULE_${Date.now()}`,
                      type: 'network_cidr',
                      config: { range: '0.0.0.0/0' },
                      effect: 'deny',
                    }
                    setFormData({ ...formData, rules: [...(formData.rules || []), newRule] })
                  }}
                >
                  Add Signal Logic Fragment
                </Button>
              </Paper>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setDialogOpen(false)}
            sx={{ fontWeight: 700, textTransform: 'none', color: 'text.secondary' }}
          >
            {t('auth.common.cancel', 'Cancel')}
          </Button>
          {/* â”€â”€ SYSTEM PATTERN: CTA buttons (OrganizationProfile L58) â”€â”€ */}
          <Button
            variant='contained'
            onClick={handleSave}
            disabled={isSaving || !formData.name}
            sx={{
              px: 4,
              borderRadius: 2,
              bgcolor: 'info.main',
              boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)',
              fontWeight: 700,
              textTransform: 'none',
              minWidth: 120,
            }}
          >
            {isSaving ? (
              <CircularProgress size={24} color='inherit' />
            ) : (
              t('auth.common.save', 'Save')
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}


