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

export default function UserListDashboard() {
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

  // Queries
  const { data, isLoading, isError, refetch } = useUsers({
    page,
    limit: 10,
    search: debouncedSearch,
    status: searchParams.status,
    role: searchParams.role,
  })
  const { data: dashboardData } = useAdminDashboard()

  // Mutations
  const banUserMutation = useBanUser()
  const handleExport = () => {
    if (!data?.data?.data) return

    const users = data.data.data
    const headers = [
      t('auth.common.id'),
      t('auth.common.email'),
      t('auth.common.first_name'),
      t('auth.common.last_name'),
      t('auth.common.role'),
      t('auth.common.status'),
      t('auth.common.email_verified'),
      t('auth.common.created_at'),
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
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleAddUser = () => {
    setIsCreateModalOpen(true)
  }

  const deleteUserMutation = useDeleteUser()
  const impersonateUserMutation = useImpersonateUser()

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, user: AdminUser) => {
    setAnchorEl(event.currentTarget)
    setSelectedUser(user)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleClearSelected = () => {
    setSelectedUser(null)
  }

  const handleBanUserRequest = () => {
    handleMenuClose()
    setConfirmBanOpen(true)
  }

  const handleBanUserConfirm = () => {
    if (!selectedUser || banUserMutation.isPending) return
    banUserMutation.mutate(
      { id: selectedUser.id, reason: 'Admin action' },
      {
        onSuccess: () => {
          setConfirmBanOpen(false)
          handleClearSelected()
          enqueueSnackbar(t('auth.admin.success_ban'), { variant: 'success' })
        },
        onError: (error: any) => {
          enqueueSnackbar(error.message || t('auth.admin.error_ban'), { variant: 'error' })
        },
      },
    )
  }

  const handleDeleteUserRequest = () => {
    handleMenuClose()
    setConfirmDeleteOpen(true)
  }

  const handleDeleteUserConfirm = () => {
    if (!selectedUser || deleteUserMutation.isPending) return
    deleteUserMutation.mutate(selectedUser.id, {
      onSuccess: () => {
        setConfirmDeleteOpen(false)
        handleClearSelected()
        enqueueSnackbar(t('auth.admin.success_delete'), { variant: 'success' })
      },
      onError: (error: any) => {
        enqueueSnackbar(error.message || t('auth.admin.error_delete'), { variant: 'error' })
      },
    })
  }

  const handleImpersonate = () => {
    if (selectedUser) {
      impersonateUserMutation.mutate(selectedUser.id, {
        onSuccess: (response) => {
          const token = (response.data as any).token || (response as any).token
          if (token) {
            enqueueSnackbar(t('auth.admin.success_impersonate'), { variant: 'success' })
            const impersonateUrl = `/impersonate?token=${encodeURIComponent(token)}`
            window.open(impersonateUrl, '_blank')
          }
          handleMenuClose()
        },
        onError: (error: any) => {
          enqueueSnackbar(error.message || t('auth.admin.error_impersonate'), { variant: 'error' })
        },
      })
    }
  }

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'success' : 'error'
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
      {/* Header Section */}
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}
      >
        <Box>
          <Typography
            variant='h4'
            sx={{ fontWeight: 900, letterSpacing: '-0.02em', mb: 1, color: 'text.primary' }}
          >
            {t('auth.admin.user_list_title')}
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            {t('auth.admin.user_list_subtitle')}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant='outlined'
            startIcon={<GetApp />}
            sx={{ textTransform: 'none', fontWeight: 600 }}
            onClick={handleExport}
          >
            {t('auth.common.export')}
          </Button>
          <Button
            variant='contained'
            startIcon={<Group />}
            sx={{ textTransform: 'none', fontWeight: 600, boxShadow: 2 }}
            onClick={handleAddUser}
          >
            {t('auth.admin.add_user')}
          </Button>
        </Box>
      </Box>

      {/* Stats Quick View */}
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
            label: t('auth.admin.stat_total_users'),
            value: dashboardData?.data?.totalUsers ?? data?.data?.meta.total ?? '...',
            icon: <Group />,
            color: 'primary',
            onClick: () => {
              setSearchParams((prev) => ({ ...prev, status: '', role: '', search: '' }))
              setPage(1)
            },
          },
          {
            label: t('auth.admin.stat_active_now'),
            value: dashboardData?.data?.activeSessions ?? '...',
            icon: <CheckCircle />,
            color: 'success',
            onClick: () => {
              setSearchParams((prev) => ({ ...prev, status: 'ACTIVE', role: '' }))
              setPage(1)
            },
          },
          {
            label: t('auth.admin.stat_other'),
            value: dashboardData?.data?.failedLogins ?? '...',
            icon: <Block />,
            color: 'error',
            onClick: () => {
              setSearchParams((prev) => ({ ...prev, status: 'SUSPENDED', role: '' }))
              setPage(1)
            },
          },
          {
            label: t('auth.admin.stat_mfa_adoption'),
            value: dashboardData?.data?.mfaAdoption ?? '...',
            icon: <Security />,
            color: 'info',
            onClick: () => {
              // Toggle or just clear search for now as we don't have a direct MFA filter in backend yet
              // but we could filter search for MFA if we wanted or just refresh
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
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': {
                borderColor: (theme.palette as any)[stat.color].main,
                bgcolor: alpha((theme.palette as any)[stat.color].main, 0.02),
                transform: 'translateY(-2px)',
              },
            }}
            onClick={stat.onClick}
          >
            <CardContent
              sx={{ display: 'flex', alignItems: 'center', gap: 2, p: '16px !important' }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2,
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
                <Typography variant='caption' color='text.secondary' sx={{ fontWeight: 600 }}>
                  {stat.label}
                </Typography>
                <Typography variant='h6' sx={{ fontWeight: 800 }}>
                  {stat.value}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Table Controls */}
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
          // bgcolor: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(8px)',
        }}
      >
        <TextField
          placeholder={t('auth.common.search_users')}
          size='small'
          value={searchParams.search}
          onChange={(e) => {
            setSearchParams((prev) => ({ ...prev, search: e.target.value }))
            setPage(1)
          }}
          sx={{ width: { xs: '100%', md: 320 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <Search sx={{ fontSize: 20, color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
        />
        <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', md: 'auto' } }}>
          <Button
            size='small'
            startIcon={<FilterList />}
            onClick={(e) => setStatusAnchorEl(e.currentTarget)}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              color: searchParams.status ? 'primary.main' : 'text.secondary',
            }}
          >
            {searchParams.status
              ? `${t('auth.common.status')}: ${t(`auth.common.${searchParams.status.toLowerCase()}`)}`
              : t('auth.common.status_filter')}
          </Button>

          <Button
            size='small'
            startIcon={<FilterList />}
            onClick={(e) => setRoleAnchorEl(e.currentTarget)}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              color: searchParams.role ? 'primary.main' : 'text.secondary',
            }}
          >
            {searchParams.role
              ? `${t('auth.common.role')}: ${getRoleName(Number(searchParams.role))}`
              : t('auth.common.role_filter')}
          </Button>

          {(searchParams.status || searchParams.role) && (
            <Button
              size='small'
              onClick={() => {
                setSearchParams((prev) => ({ ...prev, status: '', role: '' }))
                setPage(1)
              }}
              sx={{ textTransform: 'none', fontWeight: 600, color: 'error.main' }}
            >
              {t('auth.common.clear_all')}
            </Button>
          )}

          <Box sx={{ flexGrow: 1 }} />
          <Typography variant='body2' color='text.secondary' sx={{ alignSelf: 'center', mr: 1 }}>
            {data?.data?.meta.total
              ? `${data.data.meta.total} ${t('auth.admin.results')}`
              : t('auth.common.loading')}
          </Typography>
        </Box>
      </Paper>

      {/* User Table */}
      <TableContainer
        component={Paper}
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
          boxShadow: 'none',
          overflow: 'hidden',
          minHeight: 300,
        }}
      >
        <Table sx={{ minWidth: 800 }}>
          <TableHead sx={{ bgcolor: alpha(theme.palette.action.hover, 0.4) }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>{t('auth.common.user')}</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>{t('auth.common.status')}</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>{t('auth.common.role')}</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>{t('auth.common.created_at')}</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>{t('auth.common.email_verified')}</TableCell>
              <TableCell align='right' sx={{ fontWeight: 700 }}>
                {t('auth.common.actions')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} align='center' sx={{ py: 10 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={6} align='center' sx={{ py: 10, color: 'error.main' }}>
                  {t('auth.admin.error_load_users')}
                </TableCell>
              </TableRow>
            ) : (
              data?.data?.data.map((user) => (
                <TableRow
                  key={user.id}
                  hover
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: theme.palette.primary.main,
                          fontWeight: 700,
                          fontSize: '0.875rem',
                        }}
                      >
                        {user.firstName[0]}
                        {user.lastName[0]}
                      </Avatar>
                      <Box>
                        <Typography variant='body2' sx={{ fontWeight: 700 }}>
                          {user.firstName} {user.lastName}
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                          {user.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.isActif ? t('auth.common.active') : t('auth.common.inactive')}
                      size='small'
                      color={getStatusColor(user.isActif)}
                      sx={{ fontWeight: 700, fontSize: '0.625rem', height: 20 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant='body2' sx={{ fontWeight: 500 }}>
                        {getRoleName(user.role)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant='body2' color='text.secondary'>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.emailVerified ? t('auth.common.yes') : t('auth.common.no')}
                      size='small'
                      variant='outlined'
                      color={user.emailVerified ? 'success' : 'default'}
                    />
                  </TableCell>
                  <TableCell align='right'>
                    <IconButton size='small' onClick={(e) => handleMenuOpen(e, user)}>
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
            count={data?.data?.meta.total ? Math.ceil(data.data.meta.total / 10) : 1}
            page={page}
            onChange={(_, p) => setPage(p)}
            size='small'
            color='primary'
            disabled={isLoading}
          />
        </Box>
      </TableContainer>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            width: 200,
            mt: 1,
            boxShadow: theme.shadows[4],
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
          },
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
          <Typography variant='body2'>{t('auth.common.edit')}</Typography>
        </MenuItem>

        <MenuItem onClick={handleImpersonate}>
          <ListItemIcon>
            <Security fontSize='small' />
          </ListItemIcon>
          <Typography variant='body2'>{t('auth.admin.impersonate_action')}</Typography>
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleMenuClose()
            navigate(
              (Path.admin as any).userProfile.replace(':id', selectedUser?.id.toString() || ''),
            )
            setTimeout(() => {
              window.location.hash = 'history'
            }, 100)
          }}
        >
          <ListItemIcon>
            <HistoryIcon fontSize='small' />
          </ListItemIcon>
          <Typography variant='body2'>{t('auth.admin.view_logs')}</Typography>
        </MenuItem>
        <MenuItem onClick={handleBanUserRequest} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <Block fontSize='small' color='error' />
          </ListItemIcon>
          <Typography variant='body2'>{t('auth.admin.ban_user')}</Typography>
        </MenuItem>
        <MenuItem onClick={handleDeleteUserRequest} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <Delete fontSize='small' color='error' />
          </ListItemIcon>
          <Typography variant='body2'>{t('auth.admin.delete_user')}</Typography>
        </MenuItem>
      </Menu>

      {/* Status Menu */}
      <Menu
        anchorEl={statusAnchorEl}
        open={Boolean(statusAnchorEl)}
        onClose={() => setStatusAnchorEl(null)}
      >
        <MenuItem
          onClick={() => {
            setSearchParams((prev) => ({ ...prev, status: '' }))
            setStatusAnchorEl(null)
            setPage(1)
          }}
        >
          {t('auth.common.all')}
        </MenuItem>
        {['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING'].map((s) => (
          <MenuItem
            key={s}
            onClick={() => {
              setSearchParams((prev) => ({ ...prev, status: s }))
              setStatusAnchorEl(null)
              setPage(1)
            }}
          >
            {t(`auth.common.${s.toLowerCase()}`)}
          </MenuItem>
        ))}
      </Menu>

      {/* Role Menu */}
      <Menu
        anchorEl={roleAnchorEl}
        open={Boolean(roleAnchorEl)}
        onClose={() => setRoleAnchorEl(null)}
      >
        <MenuItem
          onClick={() => {
            setSearchParams((prev) => ({ ...prev, role: '' }))
            setRoleAnchorEl(null)
            setPage(1)
          }}
        >
          {t('auth.common.all')}
        </MenuItem>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((r) => (
          <MenuItem
            key={r}
            onClick={() => {
              setSearchParams((prev) => ({ ...prev, role: r.toString() }))
              setRoleAnchorEl(null)
              setPage(1)
            }}
          >
            {getRoleName(r)}
          </MenuItem>
        ))}
      </Menu>

      <CreateUserDialog
        open={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false)
          refetch()
        }}
      />

      <ConfirmationDialog
        open={confirmBanOpen}
        onClose={() => {
          setConfirmBanOpen(false)
          handleClearSelected()
        }}
        onConfirm={handleBanUserConfirm}
        title={t('auth.admin.confirm_ban')}
        message={t(
          'auth.admin.confirm_ban_message',
          'Are you sure you want to ban this user? This will prevent them from logging in.',
        )}
        confirmLabel={t('auth.admin.ban_user')}
        severity='error'
        isSubmitting={banUserMutation.isPending}
      />

      <ConfirmationDialog
        open={confirmDeleteOpen}
        onClose={() => {
          setConfirmDeleteOpen(false)
          handleClearSelected()
        }}
        onConfirm={handleDeleteUserConfirm}
        title={t('auth.admin.confirm_delete')}
        message={t(
          'auth.admin.confirm_delete_message',
          'This action is irreversible. All user data will be permanently removed.',
        )}
        confirmLabel={t('auth.admin.delete_user')}
        severity='error'
        isSubmitting={deleteUserMutation.isPending}
      />
    </Box>
  )
}
