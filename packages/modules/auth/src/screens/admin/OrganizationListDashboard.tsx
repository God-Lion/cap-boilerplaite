import React, { useState } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Tooltip,
  useTheme,
  alpha,
  Pagination,
  Divider,
  Alert,
} from '@mui/material'
import {
  Search,
  FilterList,
  Add,
  MoreVert,
  Edit,
  Business,
  Launch,
  VpnKey,
  Block,
  Groups,
  SignalCellularAlt,
  Delete,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Path from './path'
import { secureTokenManager } from '@cap/platform-core'
import {
  useOrganizations,
  useCreateOrganization,
  useUpdateOrganization,
  useDeleteOrganization,
  useImpersonateOrganization,
} from '../../hooks/useAdminQuery'

import { Organization } from '../../services/adminService'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Stack from '@mui/material/Stack'

export default function OrganizationListDashboard() {
  const { t } = useTranslation('common')
  const navigate = useNavigate()
  const theme = useTheme()
  const [searchTerm, setSearchTerm] = useState('')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null)

  const [page, setPage] = useState(1)
  const [createOpen, setCreateOpen] = useState(false)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [newOrgData, setNewOrgData] = useState({ name: '', slug: '', domain: '' })

  const {
    data: orgsResponse,
    isLoading,
    refetch,
  } = useOrganizations({
    search: searchTerm || undefined,
    page,
    limit: 5,
  })

  const createOrgMutation = useCreateOrganization({
    onSuccess: () => {
      setCreateOpen(false)
      setNewOrgData({ name: '', slug: '', domain: '' })
      refetch()
    },
  })

  const impersonateMutation = useImpersonateOrganization({
    onSuccess: (response) => {
      const data = response.data
      if (data?.token) {
        secureTokenManager.setTokens({
          accessToken: data.token,
          expiresAt: Date.now() + 3600 * 1000, // Default to 1 hour
        })
        window.location.href = '/' // Redirect to dashboard
      }
    },
  })

  const updateOrgMutation = useUpdateOrganization({
    onSuccess: () => {
      setSuspendDialogOpen(false)
      handleMenuClose()
      refetch()
    },
  })

  const deleteOrgMutation = useDeleteOrganization({
    onSuccess: () => {
      setDeleteDialogOpen(false)
      handleMenuClose()
      refetch()
    },
  })

  // Handle both raw array response and paginated response formats
  const responseData = orgsResponse?.data as any
  const orgs = (Array.isArray(responseData) ? responseData : responseData?.data) || []
  const meta = responseData?.meta

  const handleCreateSubmit = () => {
    if (!newOrgData.name || !newOrgData.slug) return
    createOrgMutation.mutate(newOrgData)
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, org: Organization) => {
    setAnchorEl(event.currentTarget)
    setSelectedOrg(org)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleImpersonate = () => {
    if (selectedOrg?.id) {
      impersonateMutation.mutate(selectedOrg.id)
    }
    handleMenuClose()
  }

  const handleSuspendConfirm = () => {
    if (selectedOrg?.id) {
      updateOrgMutation.mutate({
        id: selectedOrg.id,
        data: { status: selectedOrg.status === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED' },
      })
    }
  }

  const handleDeleteConfirm = () => {
    if (selectedOrg?.id) {
      deleteOrgMutation.mutate(selectedOrg.id)
    }
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1400, mx: 'auto' }}>
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}
      >
        <Box>
          <Typography variant='h4' sx={{ fontWeight: 900, letterSpacing: '-0.02em', mb: 1 }}>
            {t('auth.admin.orgListTitle')}
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            {t('auth.admin.orgListSubtitle')}
          </Typography>
        </Box>
        <Button
          variant='contained'
          startIcon={<Add />}
          onClick={() => setCreateOpen(true)}
          sx={{ textTransform: 'none', fontWeight: 600, px: 3, py: 1.2, borderRadius: 2 }}
        >
          {t('auth.admin.newOrg')}
        </Button>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
          gap: 2,
          mb: 4,
        }}
      >
        {[
          {
            label: t('auth.admin.activeTenants'),
            value: '142',
            icon: <Business />,
            color: 'primary',
          },
          { label: t('auth.admin.totalUsers'), value: '12.4k', icon: <Groups />, color: 'info' },
          {
            label: t('auth.admin.systemHealth'),
            value: '99.4%',
            icon: <SignalCellularAlt />,
            color: 'success',
          },
          { label: t('auth.admin.pendingTrials'), value: '8', icon: <Launch />, color: 'warning' },
        ].map((stat, idx) => (
          <Card
            key={idx}
            sx={{ border: '1px solid', borderColor: 'divider', boxShadow: 'none', borderRadius: 3 }}
          >
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '12px',
                  bgcolor: alpha((theme.palette as any)[stat.color].main, 0.1),
                  color: (theme.palette as any)[stat.color].main,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {stat.icon}
              </Box>
              <Box>
                <Typography
                  variant='caption'
                  color='text.secondary'
                  sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}
                >
                  {stat.label}
                </Typography>
                <Typography variant='h5' sx={{ fontWeight: 800 }}>
                  {stat.value}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Paper
        sx={{
          p: 2,
          mb: 0,
          border: '1px solid',
          borderColor: 'divider',
          borderBottom: 'none',
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          boxShadow: 'none',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
          alignItems: 'center',
          justifyContent: 'space-between',
          backdropFilter: 'blur(8px)',
        }}
      >
        <TextField
          placeholder={t('auth.common.searchOrgs')}
          size='small'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: { xs: '100%', md: 360 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <Search sx={{ fontSize: 20, color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
        />
        <Button
          startIcon={<FilterList />}
          sx={{ color: 'text.secondary', textTransform: 'none', fontWeight: 600 }}
        >
          {t('auth.common.filters')}
        </Button>
      </Paper>

      <TableContainer
        component={Paper}
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: '0 0 16px 16px',
          boxShadow: 'none',
        }}
      >
        <Table sx={{ minWidth: 800 }}>
          <TableHead sx={{ bgcolor: alpha(theme.palette.action.hover, 0.5) }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>{t('auth.admin.colOrganization')}</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>{t('auth.common.status')}</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>{t('auth.admin.colTier')}</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>{t('auth.admin.colMembers')}</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>{t('auth.admin.colEnterprise')}</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>{t('auth.admin.colHealth')}</TableCell>
              <TableCell align='right' sx={{ fontWeight: 700 }}>
                {t('auth.admin.colActions')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} align='center' sx={{ py: 8 }}>
                  <Typography variant='body2' color='text.secondary'>
                    {t('auth.common.loading')}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : orgs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align='center' sx={{ py: 8 }}>
                  <Typography variant='body2' color='text.secondary'>
                    {t('auth.common.noResults')}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              orgs.map((org: Organization) => (
                <TableRow key={org.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        src={org.logo_url || undefined}
                        sx={{
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: 'primary.main',
                          fontWeight: 800,
                        }}
                      >
                        {org.name[0]}
                      </Avatar>
                      <Box>
                        <Typography variant='body2' sx={{ fontWeight: 700 }}>
                          {org.name}
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                          /{org.slug}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={
                        org.status === 'SUSPENDED'
                          ? t('auth.common.suspended')
                          : t('auth.common.active')
                      }
                      size='small'
                      color={org.status === 'SUSPENDED' ? 'error' : 'success'}
                      sx={{ fontWeight: 700, height: 20, fontSize: '0.625rem' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant='body2' sx={{ fontWeight: 600 }}>
                      {t('auth.admin.colEnterprise')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant='body2' color='text.secondary'>
                      {typeof org.members_count === 'number'
                        ? org.members_count.toLocaleString()
                        : '0'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Tooltip title={org.domain ? `SSO Enabled for ${org.domain}` : 'Password Only'}>
                      <Box
                        sx={{
                          color: org.domain ? 'success.main' : 'text.disabled',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <VpnKey sx={{ fontSize: 18 }} />
                      </Box>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 4,
                          bgcolor: alpha(theme.palette.divider, 0.1),
                          borderRadius: 2,
                        }}
                      >
                        <Box
                          sx={{
                            width: '100%',
                            height: '100%',
                            bgcolor: 'success.main',
                            borderRadius: 2,
                          }}
                        />
                      </Box>
                      <Typography variant='caption' sx={{ fontWeight: 700 }}>
                        100%
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align='right'>
                    <IconButton size='small' onClick={(e) => handleMenuOpen(e, org as any)}>
                      <MoreVert fontSize='small' />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <Box
          sx={{
            p: 2,
            display: 'flex',
            justifyContent: 'center',
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Pagination
            count={meta?.lastPage || meta?.last_page || 1}
            page={page}
            onChange={(_, v) => setPage(v)}
            size='small'
            color='primary'
          />
        </Box>
      </TableContainer>

      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth='sm' fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>{t('auth.admin.newOrg')}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label={t('auth.admin.organizationName')}
              fullWidth
              value={newOrgData.name}
              onChange={(e) => setNewOrgData({ ...newOrgData, name: e.target.value })}
            />
            <TextField
              label={t('auth.admin.workspaceSlug')}
              fullWidth
              value={newOrgData.slug}
              onChange={(e) => setNewOrgData({ ...newOrgData, slug: e.target.value })}
            />
            <TextField
              label={t('auth.admin.domainName')}
              fullWidth
              value={newOrgData.domain}
              onChange={(e) => setNewOrgData({ ...newOrgData, domain: e.target.value })}
              placeholder='nexus-corp.com'
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setCreateOpen(false)} color='inherit'>
            {t('auth.common.cancel')}
          </Button>
          <Button
            onClick={handleCreateSubmit}
            variant='contained'
            disabled={createOrgMutation.isPending || !newOrgData.name || !newOrgData.slug}
          >
            {createOrgMutation.isPending ? t('auth.common.loading') : t('auth.admin.create')}
          </Button>
        </DialogActions>
      </Dialog>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => {
          handleMenuClose()
          setSelectedOrg(null)
        }}
      >
        <MenuItem
          onClick={() => {
            handleMenuClose()
            if (selectedOrg?.id) {
              navigate(Path.organizationProfile.replace(':id', selectedOrg.id.toString()))
            }
          }}
        >
          <ListItemIcon>
            <Edit fontSize='small' />
          </ListItemIcon>
          {t('auth.admin.editProfile')}
        </MenuItem>
        <MenuItem onClick={handleImpersonate}>
          <ListItemIcon>
            <Launch fontSize='small' />
          </ListItemIcon>
          {t('auth.admin.loginAsAdmin')}
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose()
            setSuspendDialogOpen(true)
          }}
          sx={{ color: selectedOrg?.status === 'SUSPENDED' ? 'success.main' : 'error.main' }}
        >
          <ListItemIcon>
            {selectedOrg?.status === 'SUSPENDED' ? (
              <Launch fontSize='small' color='success' />
            ) : (
              <Block fontSize='small' color='error' />
            )}
          </ListItemIcon>
          {selectedOrg?.status === 'SUSPENDED'
            ? t('auth.admin.activateTenant')
            : t('auth.admin.suspendTenant')}
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            handleMenuClose()
            setDeleteDialogOpen(true)
          }}
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon>
            <Delete fontSize='small' color='error' />
          </ListItemIcon>
          {t('auth.admin.deleteOrganization')}
        </MenuItem>
      </Menu>

      <Dialog
        open={suspendDialogOpen}
        onClose={() => {
          setSuspendDialogOpen(false)
          setSelectedOrg(null)
        }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>
          {selectedOrg?.status === 'SUSPENDED'
            ? t('auth.admin.activateTenant')
            : t('auth.admin.suspendTenant')}
        </DialogTitle>
        <DialogContent>
          <Typography variant='body1' sx={{ mt: 1 }}>
            {selectedOrg?.status === 'SUSPENDED'
              ? t('auth.admin.activateConfirmMsg', { name: selectedOrg?.name })
              : t('auth.admin.suspendConfirmMsg', { name: selectedOrg?.name })}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setSuspendDialogOpen(false)} color='inherit'>
            {t('auth.common.cancel')}
          </Button>
          <Button
            onClick={handleSuspendConfirm}
            variant='contained'
            color={selectedOrg?.status === 'SUSPENDED' ? 'success' : 'error'}
            disabled={updateOrgMutation.isPending}
          >
            {updateOrgMutation.isPending
              ? t('auth.common.loading')
              : selectedOrg?.status === 'SUSPENDED'
                ? t('auth.admin.activate')
                : t('auth.admin.suspend')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false)
          setSelectedOrg(null)
        }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>{t('auth.admin.deleteOrganization')}</DialogTitle>
        <DialogContent>
          <Typography variant='body1' sx={{ mt: 1 }}>
            {t('auth.admin.deleteConfirmMsg', { name: selectedOrg?.name })}
          </Typography>
          <Alert severity='warning' sx={{ mt: 2 }}>
            {t('auth.admin.deleteWarningMsg')}
          </Alert>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} color='inherit'>
            {t('auth.common.cancel')}
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant='contained'
            color='error'
            disabled={deleteOrgMutation.isPending}
          >
            {deleteOrgMutation.isPending ? t('auth.common.loading') : t('auth.admin.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
