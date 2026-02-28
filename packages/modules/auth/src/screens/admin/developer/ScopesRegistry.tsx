import React, { useState } from 'react'
import {
  Box,
  Typography,
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
  alpha,
  useTheme,
  Stack,
  Tooltip,
} from '@mui/material'
import { Search, Add, Delete, Layers, Edit } from '@mui/icons-material'
import { AuthScope } from '../../../types/developer.types'

const mockScopes: AuthScope[] = [
  {
    id: 's_1',
    name: 'openid',
    displayName: 'OpenID Connect',
    description: 'Basic OIDC identity claim.',
    isSystem: true,
    permissionsMapping: ['user:read'],
  },
  {
    id: 's_2',
    name: 'profile',
    displayName: 'User Profile',
    description: 'Access to name, picture, and gender.',
    isSystem: true,
    permissionsMapping: ['user:profile:read'],
  },
  {
    id: 's_3',
    name: 'finance:manage',
    displayName: 'Finance Management',
    description: 'Manage organization billing and invoices.',
    isSystem: false,
    permissionsMapping: ['billing:manage', 'invoice:read'],
  },
]

export default function ScopesRegistry() {
  const theme = useTheme()
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1400, mx: 'auto' }}>
      {/* Header */}
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}
      >
        <Box>
          <Typography variant='h4' sx={{ fontWeight: 900, mb: 1, letterSpacing: '-0.02em' }}>
            Scopes Registry
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            Define OAuth2/OIDC scopes and map them to internal granular permissions.
          </Typography>
        </Box>
        <Button
          variant='contained'
          startIcon={<Add />}
          sx={{ px: 3, py: 1.2, borderRadius: 2, fontWeight: 700, textTransform: 'none' }}
        >
          Create New Scope
        </Button>
      </Box>

      {/* Main Content */}
      <Paper
        sx={{
          borderRadius: 4,
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: 'none',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            p: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
            bgcolor: alpha(theme.palette.background.paper, 0.5),
          }}
        >
          <TextField
            placeholder='Search scopes...'
            size='small'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <Search sx={{ fontSize: 20, color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
            sx={{ maxWidth: 400 }}
          />
        </Box>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: alpha(theme.palette.action.hover, 0.3) }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Scope Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Mapped Permissions</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
                <TableCell align='right' sx={{ fontWeight: 700 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockScopes.map((scope) => (
                <TableRow key={scope.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '8px',
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: 'primary.main',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Layers sx={{ fontSize: 18 }} />
                      </Box>
                      <Box>
                        <Typography variant='body2' sx={{ fontWeight: 800 }}>
                          {scope.name}
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                          {scope.displayName}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={scope.isSystem ? 'System' : 'Custom'}
                      size='small'
                      color={scope.isSystem ? 'secondary' : 'primary'}
                      variant='filled'
                      sx={{
                        fontWeight: 900,
                        height: 20,
                        fontSize: '0.65rem',
                        textTransform: 'uppercase',
                        bgcolor: alpha(
                          theme.palette[scope.isSystem ? 'secondary' : 'primary'].main,
                          0.15,
                        ),
                        color: `${scope.isSystem ? 'secondary' : 'primary'}.main`,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction='row' spacing={0.5} flexWrap='wrap'>
                      {scope.permissionsMapping.map((perm) => (
                        <Chip
                          key={perm}
                          label={perm}
                          size='small'
                          variant='outlined'
                          sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                        />
                      ))}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant='body2' color='text.secondary'>
                      {scope.description}
                    </Typography>
                  </TableCell>
                  <TableCell align='right'>
                    <Stack direction='row' spacing={1} justifyContent='flex-end'>
                      <Tooltip title='Edit Scope'>
                        <IconButton size='small'>
                          <Edit fontSize='small' />
                        </IconButton>
                      </Tooltip>
                      {!scope.isSystem && (
                        <Tooltip title='Delete Scope'>
                          <IconButton size='small' color='error'>
                            <Delete fontSize='small' />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  )
}
