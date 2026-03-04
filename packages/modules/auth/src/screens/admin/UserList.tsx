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
  Pagination,
  alpha,
  useTheme,
  CircularProgress,
  Stack,
  Tooltip,
  Divider,
} from '@mui/material'
import {
  Search,
  FilterList,
  GetApp,
  MoreVert,
  Edit,
  Delete,
  Block,
  Group,
  History as HistoryIcon,
  Security,
  CheckCircle,
  Person,
  ChevronRight,
  Add,
} from '@mui/icons-material'
import { CreateUserDialog } from '../admin'
import { ConfirmationDialog } from '../../components/shared'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useDebounce } from 'use-debounce'
import { useSnackbar } from 'notistack'
import {
  useUsers,
  useBanUser,
  useDeleteUser,
  useImpersonateUser,
  useAdminDashboard,
} from '../../hooks/useAdminQuery'
import Path from '../path'
import { AdminUser } from '../../services/adminService'

export default function UserList() {
  const { t } = useTranslation('common')
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()
  const theme = useTheme()
  const [searchParams, setSearchParams] = useState({
    page: 1,
    limit: 10,
    search: '',
    status: '',
    role: '',
  })
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [confirmBanOpen, setConfirmBanOpen] = useState(false)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [debouncedSearch] = useDebounce(searchParams.search, 500)
  const [page, setPage] = useState(1)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)

  // ── Queries ──────────────────────────────────────────────────────────────
  const { data, isLoading, isError } = useUsers({
    page,
    limit: 10,
    search: debouncedSearch,
    status: searchParams.status,
    role: searchParams.role,
  })
  const { data: dashboardData } = useAdminDashboard()

  // ── Mutations ────────────────────────────────────────────────────────────
  const banUserMutation = useBanUser()
  const deleteUserMutation = useDeleteUser()
  const impersonateUserMutation = useImpersonateUser()

  const handleExport = () => {
    if (!data?.data?.data) return
    const users = data.data.data
    const headers = [
      t('auth.common.id'),
      t('auth.common.email'),
      t('auth.common.firstName'),
      t('auth.common.lastName'),
      t('auth.common.role'),
      t('auth.common.status'),
      t('auth.common.emailVerified'),
      t('auth.common.createdAt'),
    ]

    const csvContent = [
      headers.join(','),
      ...users.map((user) =>
        [
          user.id,
          `"${user.email}"`,
          `"${user.firstName}"`,
          `"${user.lastName}"`,
          user.role,
          user.isActif ? t('auth.common.active') : t('auth.common.inactive'),
          user.emailVerified ? t('auth.common.yes') : t('auth.common.no'),
          `"${new Date(user.createdAt).toLocaleDateString()}"`,
        ].join(','),
      ),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `user-list-${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, user: AdminUser) => {
    setAnchorEl(event.currentTarget)
    setSelectedUser(user)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleBanUserRequest = () => {
    setConfirmBanOpen(true)
    handleMenuClose()
  }

  const handleDeleteUserRequest = () => {
    setConfirmDeleteOpen(true)
    handleMenuClose()
  }

  const handleBanUserConfirm = () => {
    if (!selectedUser) return
    banUserMutation.mutate(
      { id: selectedUser.id, reason: 'Admin action' },
      {
        onSuccess: () => {
          setConfirmBanOpen(false)
          setSelectedUser(null)
          enqueueSnackbar(t('auth.admin.successBan'), { variant: 'success' })
        },
        onError: (error: unknown) => {
          const message = error instanceof Error ? error.message : String(error)
          enqueueSnackbar(message || t('auth.admin.errorBan'), { variant: 'error' })
        },
      },
    )
  }

  const handleDeleteUserConfirm = () => {
    if (!selectedUser) return
    deleteUserMutation.mutate(selectedUser.id, {
      onSuccess: () => {
        setConfirmDeleteOpen(false)
        setSelectedUser(null)
        enqueueSnackbar(t('auth.admin.successDelete'), { variant: 'success' })
      },
      onError: (error: unknown) => {
        const message = error instanceof Error ? error.message : String(error)
        enqueueSnackbar(message || t('auth.admin.errorDelete'), { variant: 'error' })
      },
    })
  }

  const handleImpersonate = () => {
    if (selectedUser) {
      impersonateUserMutation.mutate(selectedUser.id, {
        onSuccess: (response) => {
          const token = (response.data as any).token || (response as any).token
          if (token) {
            enqueueSnackbar(t('auth.admin.successImpersonate'), { variant: 'success' })
            window.open(`/impersonate?token=${encodeURIComponent(token)}`, '_blank')
          }
          handleMenuClose()
        },
        onError: (error: unknown) => {
          const message = error instanceof Error ? error.message : String(error)
          enqueueSnackbar(message || t('auth.admin.errorImpersonate'), { variant: 'error' })
        },
      })
    }
  }

  const getRoleName = (roleId: number) => {
    const roles: Record<number, string> = {
      1: t('auth.roles.user'),
      2: t('auth.roles.participant'),
      3: t('auth.roles.judge'),
      4: t('auth.roles.provider_employee'),
      5: t('auth.roles.provider_admin'),
      6: t('auth.roles.admin'),
      7: t('auth.roles.super_admin_employee'),
      8: t('auth.roles.super_admin'),
    }
    return roles[roleId] || t('auth.roles.unknown')
  }

  const [statusAnchorEl, setStatusAnchorEl] = useState<null | HTMLElement>(null)
  const [roleAnchorEl, setRoleAnchorEl] = useState<null | HTMLElement>(null)

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1400, mx: 'auto' }}>
      {/* ── Premium Banner Header ────────────────────────────────────────── */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 3,
          mb: 5,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
          <Avatar
            sx={{
              width: 64,
              height: 64,
              borderRadius: '20px',
              bgcolor: alpha(theme.palette.info.main, 0.1),
              color: 'info.main',
              boxShadow: `0 8px 24px ${alpha(theme.palette.info.main, 0.12)}`,
            }}
          >
            <Person sx={{ fontSize: 32 }} />
          </Avatar>
          <Box>
            <Typography
              variant='h4'
              sx={{ fontWeight: 900, letterSpacing: '-0.03em', mb: 0.5, lineHeight: 1.1 }}
            >
              {t('auth.admin.userListTitle')}
            </Typography>
            <Typography
              variant='body1'
              color='text.secondary'
              sx={{ fontWeight: 500, opacity: 0.8 }}
            >
              {t('auth.admin.userListSubtitle')}
            </Typography>
          </Box>
        </Box>

        <Stack direction='row' spacing={2} sx={{ width: { xs: '100%', sm: 'auto' } }}>
          <Button
            variant='outlined'
            startIcon={<GetApp />}
            sx={{
              textTransform: 'none',
              fontWeight: 800,
              height: 48,
              borderRadius: 3,
              px: 3,
              borderColor: 'divider',
              color: 'text.primary',
              '&:hover': { bgcolor: 'action.hover', borderColor: 'text.primary' },
            }}
            onClick={handleExport}
          >
            {t('auth.common.export')}
          </Button>
          <Button
            variant='contained'
            startIcon={<Add />}
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              boxShadow: `0 4px 14px 0 ${alpha(theme.palette.primary.main, 0.4)}`,
              '&:hover': {
                bgcolor: 'primary.dark',
                boxShadow: `0 6px 20px 0 ${alpha(theme.palette.primary.main, 0.5)}`,
              },
              textTransform: 'none',
              fontWeight: 800,
              height: 48,
              px: 3.5,
              borderRadius: 3,
              fontSize: '0.95rem',
            }}
            onClick={() => setIsCreateModalOpen(true)}
          >
            {t('auth.admin.addUser')}
          </Button>
        </Stack>
      </Box>

      {/* ── Refined Stat Cards ───────────────────────────────────────────── */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
          gap: 3,
          mb: 5,
        }}
      >
        {[
          {
            label: t('auth.admin.statTotalUsers'),
            value: dashboardData?.data?.totalUsers ?? data?.data?.meta.total ?? '...',
            icon: <Group />,
            color: 'primary',
            onClick: () => {
              setSearchParams((prev) => ({ ...prev, status: '', role: '', search: '' }))
              setPage(1)
            },
          },
          {
            label: t('auth.admin.statActiveNow'),
            value: dashboardData?.data?.activeSessions ?? '...',
            icon: <CheckCircle />,
            color: 'success',
            onClick: () => {
              setSearchParams((prev) => ({ ...prev, status: 'ACTIVE', role: '' }))
              setPage(1)
            },
          },
          {
            label: t('auth.admin.statOther'),
            value: dashboardData?.data?.failedLogins ?? '...',
            icon: <Block />,
            color: 'error',
            onClick: () => {
              setSearchParams((prev) => ({ ...prev, status: 'SUSPENDED', role: '' }))
              setPage(1)
            },
          },
          {
            label: t('auth.admin.statMfaAdoption'),
            value: dashboardData?.data?.mfaAdoption ?? '...',
            icon: <Security />,
            color: 'info',
            onClick: () => {
              setSearchParams((prev) => ({ ...prev, status: '', role: '' }))
              setPage(1)
            },
          },
        ].map((stat, idx) => (
          <Card
            key={idx}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              transition: 'transform 0.2s, border-color 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                borderColor: (theme.palette as any)[stat.color].main,
              },
            }}
            onClick={stat.onClick}
          >
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2.5, p: 3 }}>
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '14px',
                  bgcolor: alpha((theme.palette as any)[stat.color].main, 0.1),
                  color: (theme.palette as any)[stat.color].main,
                }}
              >
                {React.cloneElement(stat.icon as any, { fontSize: 'small' })}
              </Avatar>
              <Box>
                <Typography
                  variant='caption'
                  color='text.secondary'
                  sx={{
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    display: 'block',
                    mb: 0.25,
                    fontSize: '0.65rem',
                  }}
                >
                  {stat.label}
                </Typography>
                <Typography variant='h5' sx={{ fontWeight: 900, letterSpacing: '-0.02em' }}>
                  {stat.value}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* ── Toolbar ─────────────────────────────────────────────────────────── */}
      <Paper
        sx={{
          p: 2,
          mb: 0,
          border: '1px solid',
          borderColor: 'divider',
          borderBottom: 'none',
          borderRadius: '20px 20px 0 0',
          boxShadow: 'none',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(12px)',
        }}
      >
        <TextField
          placeholder={t('auth.common.searchUsers') || 'Search users…'}
          size='small'
          value={searchParams.search}
          onChange={(e) => {
            setSearchParams((prev) => ({ ...prev, search: e.target.value }))
            setPage(1)
          }}
          sx={{
            width: { xs: '100%', md: 360 },
            '& .MuiOutlinedInput-root': { borderRadius: 2.5, bgcolor: 'background.default' },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <Search sx={{ fontSize: 20, color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
        <Stack direction='row' spacing={1} alignItems='center'>
          <Button
            size='small'
            startIcon={<FilterList />}
            onClick={(e) => setStatusAnchorEl(e.currentTarget)}
            sx={{
              textTransform: 'none',
              fontWeight: 800,
              color: searchParams.status ? 'primary.main' : 'text.primary',
              borderRadius: 2,
              px: 2,
            }}
          >
            {searchParams.status
              ? `${t('auth.common.status')}: ${t(`auth.common.${searchParams.status.toLowerCase()}`)}`
              : t('auth.common.statusFilter')}
          </Button>

          <Button
            size='small'
            startIcon={<FilterList />}
            onClick={(e) => setRoleAnchorEl(e.currentTarget)}
            sx={{
              textTransform: 'none',
              fontWeight: 800,
              color: searchParams.role ? 'primary.main' : 'text.primary',
              borderRadius: 2,
              px: 2,
            }}
          >
            {searchParams.role
              ? `${t('auth.common.role')}: ${getRoleName(Number(searchParams.role))}`
              : t('auth.common.roleFilter')}
          </Button>

          {(searchParams.status || searchParams.role) && (
            <IconButton
              size='small'
              color='error'
              onClick={() => {
                setSearchParams((prev) => ({ ...prev, status: '', role: '' }))
                setPage(1)
              }}
            >
              <Delete fontSize='small' />
            </IconButton>
          )}

          <Divider
            orientation='vertical'
            flexItem
            sx={{ mx: 1, height: 24, alignSelf: 'center' }}
          />
          <Typography
            variant='caption'
            color='text.secondary'
            sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}
          >
            {data?.data?.meta.total || 0} Records
          </Typography>
        </Stack>
      </Paper>

      {/* ── Table ───────────────────────────────────────────────────────────── */}
      <TableContainer
        component={Paper}
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: '0 0 20px 20px',
          boxShadow: 'none',
          overflow: 'hidden',
        }}
      >
        <Table sx={{ minWidth: 900 }}>
          <TableHead sx={{ bgcolor: alpha(theme.palette.action.hover, 0.5) }}>
            <TableRow>
              <TableCell
                sx={{
                  py: 2,
                  fontWeight: 800,
                  fontSize: '0.7rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.075em',
                }}
              >
                {t('auth.common.user')}
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 800,
                  fontSize: '0.7rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.075em',
                }}
              >
                {t('auth.common.status')}
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 800,
                  fontSize: '0.7rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.075em',
                }}
              >
                {t('auth.common.role')}
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 800,
                  fontSize: '0.7rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.075em',
                }}
              >
                Active Since
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 800,
                  fontSize: '0.7rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.075em',
                }}
              >
                Identity
              </TableCell>
              <TableCell
                align='right'
                sx={{
                  fontWeight: 800,
                  fontSize: '0.7rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.075em',
                }}
              >
                {t('auth.common.actions')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} align='center' sx={{ py: 10 }}>
                  <CircularProgress size={28} />
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={6} align='center' sx={{ py: 10, color: 'error.main' }}>
                  {t('auth.admin.errorLoadUsers')}
                </TableCell>
              </TableRow>
            ) : (
              data?.data?.data.map((user) => (
                <TableRow
                  key={user.id}
                  hover
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell
                    onClick={() =>
                      navigate((Path.admin as any).userProfile.replace(':id', user.id.toString()))
                    }
                    sx={{ cursor: 'pointer', py: 2 }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        sx={{
                          width: 42,
                          height: 42,
                          borderRadius: '12px',
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: 'primary.main',
                          fontWeight: 800,
                          fontSize: '0.9rem',
                        }}
                      >
                        {user.firstName[0]}
                        {user.lastName[0]}
                      </Avatar>
                      <Box>
                        <Typography variant='body2' sx={{ fontWeight: 700, color: 'text.primary' }}>
                          {user.firstName} {user.lastName}
                        </Typography>
                        <Typography
                          variant='caption'
                          color='text.secondary'
                          sx={{ fontWeight: 500 }}
                        >
                          {user.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.isActif ? 'Active' : 'Suspended'}
                      size='small'
                      sx={{
                        fontWeight: 800,
                        fontSize: '0.6rem',
                        height: 20,
                        borderRadius: 1.5,
                        textTransform: 'uppercase',
                        bgcolor: alpha(
                          user.isActif ? theme.palette.success.main : theme.palette.error.main,
                          0.08,
                        ),
                        color: user.isActif ? 'success.main' : 'error.main',
                        border: '1px solid',
                        borderColor: alpha(
                          user.isActif ? theme.palette.success.main : theme.palette.error.main,
                          0.2,
                        ),
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant='body2' sx={{ fontWeight: 700, color: 'text.secondary' }}>
                      {getRoleName(user.role)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.secondary' }}>
                      {new Date(user.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.emailVerified ? 'Verified' : 'Unverified'}
                      size='small'
                      variant='outlined'
                      sx={{
                        fontWeight: 700,
                        height: 20,
                        borderRadius: 1.2,
                        fontSize: '0.625rem',
                        textTransform: 'uppercase',
                        borderColor: 'divider',
                        color: user.emailVerified ? 'success.main' : 'text.disabled',
                      }}
                    />
                  </TableCell>
                  <TableCell align='right'>
                    <Stack direction='row' spacing={0.5} justifyContent='flex-end'>
                      <Tooltip title='View Profile'>
                        <IconButton
                          size='small'
                          onClick={() =>
                            navigate(
                              (Path.admin as any).userProfile.replace(':id', user.id.toString()),
                            )
                          }
                        >
                          <ChevronRight fontSize='small' />
                        </IconButton>
                      </Tooltip>
                      <IconButton size='small' onClick={(e) => handleMenuOpen(e, user)}>
                        <MoreVert fontSize='small' />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* ── Pagination ──────────────────────────────────────────────────────── */}
        <Box
          sx={{
            p: 2.5,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant='caption' color='text.secondary' sx={{ fontWeight: 600 }}>
            {data?.data?.meta.total || 0} Total Records
          </Typography>
          <Pagination
            count={data?.data?.meta.total ? Math.ceil(data.data.meta.total / 10) : 1}
            page={page}
            onChange={(_, p) => setPage(p)}
            size='small'
            color='primary'
            disabled={isLoading}
            sx={{ '& .MuiPaginationItem-root': { fontWeight: 700, borderRadius: 1.5 } }}
          />
        </Box>
      </TableContainer>

      {/* ── Dialogs & Menus ─────────────────────────────────────────────────── */}
      <CreateUserDialog open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />

      <ConfirmationDialog
        open={confirmBanOpen}
        onClose={() => setConfirmBanOpen(false)}
        title={t('auth.admin.confirmBanTitle')}
        message={t('auth.admin.confirmBanMessage', {
          name: `${selectedUser?.firstName} ${selectedUser?.lastName}`,
        })}
        onConfirm={handleBanUserConfirm}
        isSubmitting={banUserMutation.isPending}
        severity='error'
      />

      <ConfirmationDialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        title={t('auth.admin.confirmDeleteTitle')}
        message={t('auth.admin.confirmDeleteMessage', {
          name: `${selectedUser?.firstName} ${selectedUser?.lastName}`,
        })}
        onConfirm={handleDeleteUserConfirm}
        isSubmitting={deleteUserMutation.isPending}
        severity='error'
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.1)', minWidth: 200, mt: 1 },
        }}
      >
        <MenuItem
          onClick={() => {
            handleMenuClose()
            navigate(
              (Path.admin as any).userProfile.replace(':id', selectedUser?.id.toString() || ''),
            )
          }}
        >
          <ListItemIcon>
            <Edit fontSize='small' />
          </ListItemIcon>
          Edit Profile
        </MenuItem>
        <MenuItem onClick={handleImpersonate}>
          <ListItemIcon>
            <Security fontSize='small' />
          </ListItemIcon>
          Impersonate
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose()
            navigate(
              (Path.admin as any).userProfile.replace(':id', selectedUser?.id.toString() || ''),
            )
            setTimeout(() => (window.location.hash = 'history'), 100)
          }}
        >
          <ListItemIcon>
            <HistoryIcon fontSize='small' />
          </ListItemIcon>
          Audit Logs
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleBanUserRequest} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <Block fontSize='small' color='error' />
          </ListItemIcon>
          Ban User
        </MenuItem>
        <MenuItem onClick={handleDeleteUserRequest} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <Delete fontSize='small' color='error' />
          </ListItemIcon>
          Delete User
        </MenuItem>
      </Menu>

      <Menu
        anchorEl={statusAnchorEl}
        open={Boolean(statusAnchorEl)}
        onClose={() => setStatusAnchorEl(null)}
      >
        <MenuItem
          onClick={() => {
            setSearchParams((p) => ({ ...p, status: '' }))
            setStatusAnchorEl(null)
            setPage(1)
          }}
        >
          All Statuses
        </MenuItem>
        {['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING'].map((s) => (
          <MenuItem
            key={s}
            onClick={() => {
              setSearchParams((p) => ({ ...p, status: s }))
              setStatusAnchorEl(null)
              setPage(1)
            }}
          >
            {s}
          </MenuItem>
        ))}
      </Menu>

      <Menu
        anchorEl={roleAnchorEl}
        open={Boolean(roleAnchorEl)}
        onClose={() => setRoleAnchorEl(null)}
      >
        <MenuItem
          onClick={() => {
            setSearchParams((p) => ({ ...p, role: '' }))
            setRoleAnchorEl(null)
            setPage(1)
          }}
        >
          All Roles
        </MenuItem>
        {[1, 5, 6, 8].map((r) => (
          <MenuItem
            key={r}
            onClick={() => {
              setSearchParams((p) => ({ ...p, role: r.toString() }))
              setRoleAnchorEl(null)
              setPage(1)
            }}
          >
            {getRoleName(r)}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  )
}
