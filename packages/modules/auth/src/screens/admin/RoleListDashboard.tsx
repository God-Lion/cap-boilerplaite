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
  Public,
  Business,
  Shield,
  ContentCopy,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Path from '../path'

import { useRoles } from '../../hooks/useAdminQuery'
import { Role } from '../../services/adminService'

export default function RoleListDashboard() {
  const { t } = useTranslation('common')
  const navigate = useNavigate()
  const theme = useTheme()
  const [searchTerm, setSearchTerm] = useState('')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)

  const { data: rolesResponse, isLoading } = useRoles()
  const roles = rolesResponse?.data || []

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, role: Role) => {
    setAnchorEl(event.currentTarget)
    setSelectedRole(role)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedRole(null)
  }

  const filteredRoles = useMemo(() => {
    return roles.filter(
      (role) =>
        role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.description?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [searchTerm, roles])

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1400, mx: 'auto' }}>
      {/* Header section */}
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}
      >
        <Box>
          <Typography variant='h4' sx={{ fontWeight: 900, letterSpacing: '-0.02em', mb: 1 }}>
            {t('auth.admin.role_list_title')}
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            {t('auth.admin.role_list_subtitle')}
          </Typography>
        </Box>
        <Button
          variant='contained'
          startIcon={<Add />}
          sx={{ textTransform: 'none', fontWeight: 600, px: 3, py: 1.2, borderRadius: 2 }}
        >
          {t('auth.admin.create_role')}
        </Button>
      </Box>

      {/* Summary Stats */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
          gap: 2,
          mb: 4,
        }}
      >
        {[
          { label: t('auth.admin.total_roles'), value: '24', icon: <Security />, color: 'primary' },
          {
            label: t('auth.admin.mapped_permissions'),
            value: '1.2k',
            icon: <Shield />,
            color: 'success',
          },
          {
            label: t('auth.admin.active_memberships'),
            value: '18k',
            icon: <Group />,
            color: 'info',
          },
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

      {/* Search & Filter Bar */}
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
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(8px)',
        }}
      >
        <TextField
          placeholder={t('auth.admin.search_roles')}
          size='small'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: { xs: '100%', md: 400 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <Search sx={{ fontSize: 20, color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
        />
        <Stack direction='row' spacing={1}>
          <Button
            startIcon={<FilterList />}
            sx={{ color: 'text.secondary', textTransform: 'none', fontWeight: 600 }}
          >
            {t('auth.common.filters')}
          </Button>
        </Stack>
      </Paper>

      {/* Table section */}
      <TableContainer
        component={Paper}
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: '0 0 16px 16px',
          boxShadow: 'none',
          overflow: 'hidden',
        }}
      >
        <Table sx={{ minWidth: 800 }}>
          <TableHead sx={{ bgcolor: alpha(theme.palette.action.hover, 0.5) }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>{t('auth.admin.col_role_name')}</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>{t('auth.admin.col_scope')}</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>{t('auth.admin.col_permissions')}</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>{t('auth.admin.col_members')}</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>{t('auth.admin.col_last_updated')}</TableCell>
              <TableCell align='right' sx={{ fontWeight: 700 }}>
                {t('auth.admin.col_actions')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} align='center' sx={{ py: 8 }}>
                  <Typography variant='body2' color='text.secondary'>
                    {t('auth.common.loading')}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : roles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align='center' sx={{ py: 8 }}>
                  <Typography variant='body2' color='text.secondary'>
                    {t('auth.common.no_results')}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredRoles.map((role) => (
                <TableRow key={role.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: 'primary.main',
                        }}
                      >
                        <Shield sx={{ fontSize: 18 }} />
                      </Avatar>
                      <Box>
                        <Typography variant='body2' sx={{ fontWeight: 700 }}>
                          {role.name}
                        </Typography>
                        {role.description && (
                          <Typography
                            variant='caption'
                            color='text.secondary'
                            sx={{ display: 'block' }}
                          >
                            {role.description}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={role.guard_name === 'api' ? 'API' : 'Web'}
                      size='small'
                      icon={
                        role.guard_name === 'api' ? (
                          <Public sx={{ fontSize: 14 }} />
                        ) : (
                          <Business sx={{ fontSize: 14 }} />
                        )
                      }
                      sx={{ fontWeight: 700, height: 22 }}
                      color={role.guard_name === 'api' ? 'primary' : 'secondary'}
                      variant='outlined'
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant='body2' sx={{ fontWeight: 600 }}>
                      {t('auth.admin.permissions_label', { count: role.permissions?.length || 0 })}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Group sx={{ fontSize: 16, color: 'text.disabled' }} />
                      <Typography variant='body2' color='text.secondary'>
                        {t('auth.admin.members_label', { count: role.users_count || 0 })}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant='body2' color='text.secondary'>
                      {new Date(role.updated_at).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell align='right'>
                    <IconButton size='small' onClick={(e) => handleMenuOpen(e, role)}>
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
          <Pagination count={3} size='small' color='primary' />
        </Box>
      </TableContainer>

      {/* Actions Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem
          onClick={() => {
            handleMenuClose()
            navigate(Path.admin.roles + '/' + selectedRole?.id)
          }}
        >
          <ListItemIcon>
            <Edit fontSize='small' />
          </ListItemIcon>
          {t('auth.admin.edit_permissions')}
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <ContentCopy fontSize='small' />
          </ListItemIcon>
          {t('auth.admin.duplicate_role')}
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <Delete fontSize='small' color='error' />
          </ListItemIcon>
          {t('auth.admin.delete_role')}
        </MenuItem>
      </Menu>
    </Box>
  )
}
