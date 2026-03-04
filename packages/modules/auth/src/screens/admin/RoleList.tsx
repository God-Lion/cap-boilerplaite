import React, { useState, useMemo } from 'react'
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
  useTheme,
  alpha,
  Pagination,
  Stack,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Tooltip,
} from '@mui/material'
import {
  Search,
  FilterList,
  Add,
  MoreVert,
  Edit,
  Delete,
  Security,
  Group,
  Shield,
  ContentCopy,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useDebounce } from 'use-debounce'
import { useSnackbar } from 'notistack'
import Path from '../path'

import { useRoles, useDeleteRole, useDuplicateRole, useRoleStats } from '../../hooks/useAdminQuery'
import { Role } from '../../services/adminService'

export default function RoleList() {
  const { t } = useTranslation('common')
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()
  const theme = useTheme()
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch] = useDebounce(searchTerm, 500)
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const { data: rolesResponse, isLoading } = useRoles({ page, limit, search: debouncedSearch })
  const { data: statsResponse } = useRoleStats()
  const deleteRole = useDeleteRole()
  const duplicateRole = useDuplicateRole()

  const roles = useMemo(() => rolesResponse?.data?.data || [], [rolesResponse])
  const stats = statsResponse?.data
  const totalItems = useMemo(() => rolesResponse?.data?.meta?.total || 0, [rolesResponse])
  const totalPages = useMemo(() => Math.ceil(totalItems / limit), [totalItems, limit])

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, role: Role) => {
    setAnchorEl(event.currentTarget)
    setSelectedRole(role)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedRole(null)
  }

  const handleDeleteRole = () => {
    setAnchorEl(null)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedRole) return
    try {
      await deleteRole.mutateAsync(selectedRole.id)
      enqueueSnackbar(t('auth.admin.successDelete'), { variant: 'success' })
      setDeleteDialogOpen(false)
      setSelectedRole(null)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      enqueueSnackbar(message || t('auth.admin.errorDelete'), { variant: 'error' })
    }
  }

  const handleDuplicateRole = async () => {
    if (!selectedRole) return
    handleMenuClose()
    try {
      const timestamp = new Date().getTime().toString().slice(-4)
      await duplicateRole.mutateAsync({
        role: selectedRole,
        newName: `${selectedRole.name} (${t('auth.common.copy')}) ${timestamp}`,
      })
      enqueueSnackbar(t('auth.admin.successDuplicate'), { variant: 'success' })
      setSelectedRole(null)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      enqueueSnackbar(message || t('auth.admin.errorDuplicate'), { variant: 'error' })
    }
  }

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false)
    setSelectedRole(null)
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1400, mx: 'auto' }}>
      {/* ── Premium Banner Style Header ────────────────────────────────────── */}
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
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: 'primary.main',
              boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.12)}`,
            }}
          >
            <Security sx={{ fontSize: 32 }} />
          </Avatar>
          <Box>
            <Typography
              variant='h4'
              sx={{ fontWeight: 900, letterSpacing: '-0.03em', mb: 0.5, lineHeight: 1.1 }}
            >
              {t('auth.admin.roleListTitle')}
            </Typography>
            <Typography
              variant='body1'
              color='text.secondary'
              sx={{ fontWeight: 500, opacity: 0.8 }}
            >
              {t('auth.admin.roleListSubtitle')}
            </Typography>
          </Box>
        </Box>

        <Button
          variant='contained'
          startIcon={<Add />}
          sx={{
            bgcolor: 'info.main',
            color: 'white',
            boxShadow: `0 4px 14px 0 ${alpha(theme.palette.info.main, 0.4)}`,
            '&:hover': {
              bgcolor: 'info.dark',
              boxShadow: `0 6px 20px 0 ${alpha(theme.palette.info.main, 0.5)}`,
            },
            textTransform: 'none',
            fontWeight: 800,
            height: 48,
            px: 3.5,
            borderRadius: 3,
            width: { xs: '100%', sm: 'auto' },
            fontSize: '0.95rem',
          }}
          onClick={() => navigate(Path.admin.roleDetail.replace(':id', 'new'))}
        >
          {t('auth.admin.createRole')}
        </Button>
      </Box>

      {/* ── Standardized Stat Cards ────────────────────────────────────────── */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
          gap: 3,
          mb: 5,
        }}
      >
        {[
          {
            label: t('auth.admin.totalRoles'),
            value: stats?.totalRoles ?? totalItems ?? 0,
            icon: <Security />,
            color: 'primary',
          },
          {
            label: t('auth.admin.mappedPermissions'),
            value: stats?.totalPermissions ?? '...',
            icon: <Shield />,
            color: 'success',
          },
          {
            label: t('auth.admin.activeMemberships'),
            value: stats?.totalMemberships ?? '...',
            icon: <Group />,
            color: 'info',
          },
        ].map((stat, idx) => (
          <Card
            key={idx}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: 'none',
              borderRadius: 4,
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-2px)' },
            }}
          >
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2.5, p: 3 }}>
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '14px',
                  bgcolor: alpha((theme.palette as any)[stat.color].main, 0.1),
                  color: (theme.palette as any)[stat.color].main,
                  boxShadow: `0 6px 12px ${alpha((theme.palette as any)[stat.color].main, 0.1)}`,
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
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(12px)',
        }}
      >
        <TextField
          placeholder={t('auth.admin.searchRolesPlaceholder') || 'Search roles…'}
          size='small'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            width: { xs: '100%', sm: 360 },
            '& .MuiOutlinedInput-root': {
              borderRadius: 2.5,
              bgcolor: 'background.default',
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <Search sx={{ fontSize: 20, color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
        <Stack direction='row' spacing={2} alignItems='center'>
          <Typography
            variant='caption'
            color='text.secondary'
            sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}
          >
            {totalItems} {t('auth.admin.results')}
          </Typography>
          <Button
            startIcon={<FilterList />}
            sx={{
              color: 'text.primary',
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: 2,
              '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.05) },
            }}
          >
            {t('auth.common.filters')}
          </Button>
        </Stack>
      </Paper>

      {/* ── Table Container ─────────────────────────────────────────────────── */}
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
        <Table sx={{ minWidth: 800 }}>
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
                {t('auth.admin.colRoleName')}
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 800,
                  fontSize: '0.7rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.075em',
                }}
              >
                {t('auth.admin.colScope')}
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 800,
                  fontSize: '0.7rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.075em',
                }}
              >
                {t('auth.admin.colPermissions')}
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 800,
                  fontSize: '0.7rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.075em',
                }}
              >
                {t('auth.admin.colMembers')}
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 800,
                  fontSize: '0.7rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.075em',
                }}
              >
                {t('auth.admin.colLastUpdated')}
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
                {t('auth.admin.colActions')}
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
            ) : roles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align='center' sx={{ py: 12 }}>
                  <Stack spacing={2} alignItems='center'>
                    <Avatar
                      sx={{
                        width: 64,
                        height: 64,
                        bgcolor: 'action.hover',
                        color: 'text.disabled',
                      }}
                    >
                      <Shield sx={{ fontSize: 32 }} />
                    </Avatar>
                    <Box>
                      <Typography variant='h6' sx={{ fontWeight: 800, mb: 0.5 }}>
                        No Roles Found
                      </Typography>
                      <Typography
                        variant='body2'
                        color='text.secondary'
                        sx={{ maxWidth: 300, mx: 'auto' }}
                      >
                        Try refining your search or filters to find what you&apos;re looking for.
                      </Typography>
                    </Box>
                  </Stack>
                </TableCell>
              </TableRow>
            ) : (
              roles.map((role) => (
                <TableRow
                  key={role.id}
                  hover
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell
                    onClick={() =>
                      navigate(Path.admin.roleDetail.replace(':id', role.id.toString()))
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
                          fontSize: '1rem',
                        }}
                      >
                        {role.name[0]}
                      </Avatar>
                      <Box>
                        <Typography variant='body2' sx={{ fontWeight: 700, color: 'text.primary' }}>
                          {role.name}
                        </Typography>
                        <Typography
                          variant='caption'
                          color='text.secondary'
                          sx={{ display: 'block', fontWeight: 500, opacity: 0.8 }}
                        >
                          {role.description || 'No description provided'}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={role.guard_name === 'api' ? 'API Engine' : 'Web Portal'}
                      size='small'
                      variant='outlined'
                      sx={{
                        fontWeight: 800,
                        height: 20,
                        borderRadius: 1.5,
                        fontSize: '0.65rem',
                        textTransform: 'uppercase',
                        borderColor: alpha(
                          role.guard_name === 'api'
                            ? theme.palette.primary.main
                            : theme.palette.secondary.main,
                          0.3,
                        ),
                        color: role.guard_name === 'api' ? 'primary.main' : 'secondary.main',
                        bgcolor: alpha(
                          role.guard_name === 'api'
                            ? theme.palette.primary.main
                            : theme.palette.secondary.main,
                          0.04,
                        ),
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant='body2' sx={{ fontWeight: 700 }}>
                      {role.permissions?.length || 0}
                    </Typography>
                    <Typography variant='caption' color='text.secondary' sx={{ fontWeight: 600 }}>
                      Defined Actions
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant='body2' sx={{ fontWeight: 700 }}>
                        {role.users_count || 0}
                      </Typography>
                      <Typography variant='caption' color='text.secondary' sx={{ fontWeight: 600 }}>
                        Members
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.secondary' }}>
                      {new Date(role.updated_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </Typography>
                  </TableCell>
                  <TableCell align='right'>
                    <Stack direction='row' spacing={0.5} justifyContent='flex-end'>
                      <Tooltip title='Edit Role'>
                        <IconButton
                          size='small'
                          onClick={() =>
                            navigate(Path.admin.roleDetail.replace(':id', role.id.toString()))
                          }
                        >
                          <Edit fontSize='small' />
                        </IconButton>
                      </Tooltip>
                      <IconButton size='small' onClick={(e) => handleMenuOpen(e, role)}>
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
            Page {page} of {totalPages || 1}
          </Typography>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            size='small'
            color='primary'
            sx={{
              '& .MuiPaginationItem-root': {
                fontWeight: 700,
                borderRadius: 1.5,
              },
            }}
          />
        </Box>
      </TableContainer>

      {/* ── Menus & Dialogs ─────────────────────────────────────────────────── */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            minWidth: 180,
            mt: 1,
          },
        }}
      >
        <MenuItem
          onClick={() => {
            handleMenuClose()
            navigate(Path.admin.roleDetail.replace(':id', selectedRole?.id.toString() || ''))
          }}
        >
          <ListItemIcon>
            <Security fontSize='small' />
          </ListItemIcon>
          Permissions
        </MenuItem>
        <MenuItem onClick={handleDuplicateRole} disabled={duplicateRole.isPending}>
          <ListItemIcon>
            <ContentCopy fontSize='small' />
          </ListItemIcon>
          Duplicate
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDeleteRole} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <Delete fontSize='small' color='error' />
          </ListItemIcon>
          Delete Role
        </MenuItem>
      </Menu>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        PaperProps={{
          sx: { borderRadius: 4, p: 1, backgroundImage: 'none' },
        }}
      >
        <DialogTitle sx={{ fontWeight: 900, fontSize: '1.5rem', letterSpacing: '-0.02em' }}>
          Delete &quot;{selectedRole?.name}&quot;?
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontWeight: 500 }}>
            This action is permanent. All users currently assigned this role will lose its
            associated permissions immediately.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={handleCancelDelete} sx={{ fontWeight: 700, color: 'text.secondary' }}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color='error'
            variant='contained'
            disabled={deleteRole.isPending}
            sx={{
              fontWeight: 800,
              borderRadius: 2.5,
              px: 3,
              boxShadow: (theme) => `0 4px 12px ${alpha(theme.palette.error.main, 0.4)}`,
            }}
          >
            {deleteRole.isPending ? 'Deleting…' : 'Delete Role'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
