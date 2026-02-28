import React, { useState } from 'react'
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  alpha,
  useTheme,
  Stack,
  Switch,
  Tabs,
  Tab,
  IconButton,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import { Save, Shield, ArrowBack, Group, VpnKey, Settings, Add, Delete } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import Path from '../path'

export default function RoleDetailView() {
  const { t } = useTranslation('common')
  const navigate = useNavigate()
  const theme = useTheme()
  const { id } = useParams()
  const [tab, setTab] = useState(0)

  const [roleData] = useState({
    name: 'Organization Admin',
    description: 'Full management access within the context of a single tenant.',
    scope: 'System',
    permissions: [
      { resource: 'users', action: 'read', status: true },
      { resource: 'users', action: 'write', status: true },
      { resource: 'users', action: 'delete', status: false },
      { resource: 'org', action: 'read', status: true },
      { resource: 'org', action: 'write', status: true },
      { resource: 'billing', action: 'manage', status: false },
    ],
    members: [
      { id: '1', name: 'Jane Doe', email: 'jane@example.com', assignedAt: '2024-01-15' },
      { id: '2', name: 'John Smith', email: 'john@example.com', assignedAt: '2024-02-10' },
    ],
  })

  const resources = Array.from(new Set(roleData.permissions.map((p) => p.resource)))

  return (
    <Box sx={{ pb: 8 }}>
      {/* Header */}
      <Box
        sx={{
          bgcolor: alpha(theme.palette.background.paper, 0.5),
          borderBottom: '1px solid',
          borderColor: 'divider',
          mb: 4,
        }}
      >
        <Container maxWidth='lg' sx={{ py: 3 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate(Path.admin.roles)}
            sx={{ mb: 2, color: 'text.secondary', textTransform: 'none', fontWeight: 600 }}
          >
            {t('auth.admin.back_to_roles')}
          </Button>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  bgcolor: 'primary.main',
                  borderRadius: '16px',
                  boxShadow: (theme) => `0 10px 20px ${alpha(theme.palette.primary.main, 0.2)}`,
                }}
              >
                <Shield sx={{ fontSize: 32 }} />
              </Avatar>
              <Box>
                <Typography variant='h4' sx={{ fontWeight: 900, letterSpacing: '-0.02em' }}>
                  {roleData.name}
                </Typography>
                <Stack direction='row' spacing={1} sx={{ mt: 1 }}>
                  <Chip
                    label={roleData.scope.toUpperCase()}
                    size='small'
                    color='info'
                    sx={{ fontWeight: 800, height: 20, fontSize: '0.625rem' }}
                  />
                  <Typography variant='body2' color='text.secondary'>
                    ID: {id || 'role_admin_...'}
                  </Typography>
                </Stack>
              </Box>
            </Box>
            <Button
              variant='contained'
              startIcon={<Save />}
              sx={{ px: 4, py: 1.2, borderRadius: 2, fontWeight: 700, textTransform: 'none' }}
            >
              {t('auth.common.save_changes')}
            </Button>
          </Box>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{
              mt: 3,
              '& .MuiTab-root': { textTransform: 'none', fontWeight: 700, minWidth: 100 },
            }}
          >
            <Tab
              icon={<VpnKey sx={{ fontSize: 20 }} />}
              iconPosition='start'
              label={t('auth.admin.permissions')}
            />
            <Tab
              icon={<Group sx={{ fontSize: 20 }} />}
              iconPosition='start'
              label={t('auth.admin.members')}
            />
            <Tab
              icon={<Settings sx={{ fontSize: 20 }} />}
              iconPosition='start'
              label={t('auth.common.settings')}
            />
          </Tabs>
        </Container>
      </Box>

      <Container maxWidth='lg'>
        {tab === 0 && (
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Card
                sx={{
                  borderRadius: 4,
                  border: '1px solid',
                  borderColor: 'divider',
                  boxShadow: 'none',
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography variant='h6' sx={{ fontWeight: 800, mb: 3 }}>
                    Permission Assignment
                  </Typography>
                  <Stack spacing={4} divider={<Divider />}>
                    {resources.map((resource) => (
                      <Box key={resource}>
                        <Typography
                          variant='subtitle2'
                          sx={{
                            textTransform: 'uppercase',
                            color: 'primary.main',
                            fontWeight: 800,
                            mb: 2,
                          }}
                        >
                          {resource} Management
                        </Typography>
                        <List disablePadding>
                          {roleData.permissions
                            .filter((p) => p.resource === resource)
                            .map((perm) => (
                              <ListItem
                                key={`${perm.resource}-${perm.action}`}
                                sx={{ px: 0, py: 1.5 }}
                                secondaryAction={<Switch checked={perm.status} />}
                              >
                                <ListItemText
                                  primary={
                                    <Typography
                                      variant='body1'
                                      sx={{ fontWeight: 700, textTransform: 'capitalize' }}
                                    >
                                      {perm.action}
                                    </Typography>
                                  }
                                  secondary={t('auth.admin.allow_role_to_action_resource', {
                                    action: perm.action,
                                    resource: resource,
                                  })}
                                />
                              </ListItem>
                            ))}
                        </List>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card
                sx={{
                  borderRadius: 4,
                  bgcolor: alpha(theme.palette.primary.main, 0.03),
                  border: '1px solid',
                  borderColor: alpha(theme.palette.primary.main, 0.1),
                  boxShadow: 'none',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant='subtitle1' sx={{ fontWeight: 800, mb: 2 }}>
                    {t('auth.admin.inheritance')}
                  </Typography>
                  <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
                    {t('auth.admin.inheritance_desc')}
                  </Typography>
                  <Button
                    fullWidth
                    variant='outlined'
                    startIcon={<Add />}
                    sx={{ borderRadius: 2, fontWeight: 700, textTransform: 'none' }}
                  >
                    {t('auth.admin.add_parent_role')}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {tab === 1 && (
          <Card
            sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}
          >
            <CardContent sx={{ p: 0 }}>
              <Box
                sx={{
                  p: 3,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography variant='h6' sx={{ fontWeight: 800 }}>
                  {t('auth.admin.role_members')}
                </Typography>
                <Button variant='outlined' size='small' startIcon={<Add />}>
                  {t('auth.admin.assign_to_user')}
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead sx={{ bgcolor: 'action.hover' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>{t('auth.common.user')}</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>{t('auth.admin.assigned_at')}</TableCell>
                      <TableCell align='right' sx={{ fontWeight: 700 }}>
                        {t('auth.common.actions')}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {roleData.members.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ width: 32, height: 32 }}>{member.name[0]}</Avatar>
                            <Box>
                              <Typography variant='body2' sx={{ fontWeight: 700 }}>
                                {member.name}
                              </Typography>
                              <Typography variant='caption' color='text.secondary'>
                                {member.email}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant='body2' color='text.secondary'>
                            {member.assignedAt}
                          </Typography>
                        </TableCell>
                        <TableCell align='right'>
                          <IconButton size='small' color='error'>
                            <Delete fontSize='small' />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}

        {tab === 2 && (
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Card
                sx={{
                  borderRadius: 4,
                  border: '1px solid',
                  borderColor: 'divider',
                  boxShadow: 'none',
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography variant='h6' sx={{ fontWeight: 800, mb: 3 }}>
                    {t('auth.admin.role_metadata')}
                  </Typography>
                  <Stack spacing={3}>
                    <TextField fullWidth label={t('auth.common.role_name')} value={roleData.name} />
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label={t('auth.common.description')}
                      value={roleData.description}
                    />
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        bgcolor: alpha(theme.palette.warning.main, 0.05),
                        border: '1px solid',
                        borderColor: alpha(theme.palette.warning.main, 0.2),
                      }}
                    >
                      <Typography
                        variant='subtitle2'
                        color='warning.main'
                        sx={{ fontWeight: 800, mb: 1 }}
                      >
                        {t('auth.admin.danger_zone')}
                      </Typography>
                      <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
                        {t('auth.admin.delete_role_desc', { count: roleData.members.length })}
                      </Typography>
                      <Button
                        variant='contained'
                        color='error'
                        size='small'
                        sx={{ fontWeight: 700 }}
                      >
                        {t('auth.admin.delete_role')}
                      </Button>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  )
}
