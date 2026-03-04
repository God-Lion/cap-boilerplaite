import React, { useMemo, useState } from 'react'
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
  useTheme,
  alpha,
  Stack,
  Tooltip,
  Avatar,
  CircularProgress,
} from '@mui/material'
import {
  Search,
  Add,
  Shield,
  VpnKey,
  Info,
  Layers,
  Group,
  Business,
  Settings,
  Download,
  FilterList,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

import { usePermissions } from '../../hooks/useAdminQuery'
import { Permission } from '../../services/adminService'

// ─── Category icon map (extend as needed) ────────────────────────────────────
const CATEGORY_ICON: Record<string, React.ReactNode> = {
  user: <Group />,
  org: <Business />,
  default: <Shield />,
}

function getCategoryIcon(resource: string) {
  return CATEGORY_ICON[resource.toLowerCase()] ?? CATEGORY_ICON.default
}

export default function PermissionRegistry() {
  const { t } = useTranslation('common')
  const theme = useTheme()

  const { data: permissionsResponse, isLoading } = usePermissions()
  const permissions: Permission[] = useMemo(
    () => permissionsResponse?.data || [],
    [permissionsResponse?.data],
  )

  // ── Local search / filter ───────────────────────────────────────────────────
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  // ── Category summary cards ──────────────────────────────────────────────────
  const categories = useMemo(() => {
    const counts: Record<string, number> = {}
    permissions.forEach((p) => {
      const cat = p.resource || 'General'
      counts[cat] = (counts[cat] || 0) + 1
    })
    return Object.entries(counts).map(([label, count]) => ({ label, count }))
  }, [permissions])

  // ── Filtered rows ───────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return permissions.filter((p) => {
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.resource || '').toLowerCase().includes(search.toLowerCase()) ||
        (p.description || '').toLowerCase().includes(search.toLowerCase())
      const matchCat = !activeCategory || (p.resource || 'General') === activeCategory
      return matchSearch && matchCat
    })
  }, [permissions, search, activeCategory])

  // ── Export ──────────────────────────────────────────────────────────────────
  const handleExport = () => {
    const blob = new Blob([JSON.stringify(permissions, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'permissions.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1400, mx: 'auto' }}>
      {/* ── Header ─────────────────────────────────────────────────────────── */}
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
        <Box>
          <Typography variant='h4' sx={{ fontWeight: 900, letterSpacing: '-0.027em', mb: 0.5 }}>
            {t('auth.admin.permissionRegistry')}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            {t('auth.admin.permissionRegistry_subtitle')}
          </Typography>
        </Box>

        <Stack
          direction='row'
          spacing={1.5}
          sx={{ flexShrink: 0, width: { xs: '100%', sm: 'auto' } }}
        >
          <Button
            variant='outlined'
            startIcon={<Download />}
            onClick={handleExport}
            sx={{ textTransform: 'none', fontWeight: 700, flex: { xs: 1, sm: 'none' } }}
          >
            {t('auth.admin.exportJson')}
          </Button>
          <Button
            variant='contained'
            startIcon={<Add />}
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
            {t('auth.admin.defineNewAction')}
          </Button>
        </Stack>
      </Box>

      {/* ── Category Pills ──────────────────────────────────────────────────── */}
      {!isLoading && categories.length > 0 && (
        <Stack direction='row' spacing={2} sx={{ mb: 4, overflowX: 'auto', pb: 1 }}>
          {/* "All" pill */}
          <Card
            onClick={() => setActiveCategory(null)}
            sx={{
              minWidth: 160,
              borderRadius: 3,
              border: '1px solid',
              borderColor: activeCategory === null ? 'primary.main' : 'divider',
              boxShadow: 'none',
              cursor: 'pointer',
              bgcolor:
                activeCategory === null
                  ? (th) => alpha(th.palette.primary.main, 0.04)
                  : 'background.paper',
              transition: 'border-color 0.15s, background 0.15s',
              '&:hover': { borderColor: 'primary.main' },
            }}
          >
            <CardContent
              sx={{ display: 'flex', alignItems: 'center', gap: 2, py: '12px !important' }}
            >
              <Avatar
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: 'primary.main',
                  width: 36,
                  height: 36,
                }}
              >
                <Layers sx={{ fontSize: 18 }} />
              </Avatar>
              <Box>
                <Typography variant='body2' sx={{ fontWeight: 800 }}>
                  All
                </Typography>
                <Typography
                  variant='caption'
                  color='text.secondary'
                  sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.075em' }}
                >
                  {permissions.length} Actions
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {categories.map((cat) => (
            <Card
              key={cat.label}
              onClick={() => setActiveCategory(cat.label === activeCategory ? null : cat.label)}
              sx={{
                minWidth: 160,
                borderRadius: 3,
                border: '1px solid',
                borderColor: activeCategory === cat.label ? 'primary.main' : 'divider',
                boxShadow: 'none',
                cursor: 'pointer',
                bgcolor:
                  activeCategory === cat.label
                    ? (th) => alpha(th.palette.primary.main, 0.04)
                    : 'background.paper',
                transition: 'border-color 0.15s, background 0.15s',
                '&:hover': { borderColor: 'primary.main' },
              }}
            >
              <CardContent
                sx={{ display: 'flex', alignItems: 'center', gap: 2, py: '12px !important' }}
              >
                <Avatar
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: 'primary.main',
                    width: 36,
                    height: 36,
                  }}
                >
                  {getCategoryIcon(cat.label)}
                </Avatar>
                <Box>
                  <Typography variant='body2' sx={{ fontWeight: 800, textTransform: 'capitalize' }}>
                    {cat.label}
                  </Typography>
                  <Typography
                    variant='caption'
                    color='text.secondary'
                    sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.075em' }}
                  >
                    {cat.count} Actions
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      {/* ── Toolbar ─────────────────────────────────────────────────────────── */}
      <Paper
        sx={{
          px: 2,
          py: 1.5,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: '16px 16px 0 0',
          boxShadow: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          flexWrap: { xs: 'wrap', sm: 'nowrap' },
        }}
      >
        <TextField
          placeholder={
            t('auth.admin.filterPermissions') || 'Filter by slug, resource, or description…'
          }
          size='small'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: { xs: '100%', sm: 360 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <Search sx={{ fontSize: 20, color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />

        <Stack direction='row' spacing={1} alignItems='center' sx={{ flexShrink: 0 }}>
          {activeCategory && (
            <Chip
              label={activeCategory}
              size='small'
              onDelete={() => setActiveCategory(null)}
              icon={<FilterList sx={{ fontSize: '14px !important' }} />}
              sx={{ fontWeight: 700, textTransform: 'capitalize' }}
            />
          )}
          <Typography variant='caption' color='text.secondary' sx={{ fontWeight: 600 }}>
            {filtered.length} of {permissions.length}
          </Typography>
        </Stack>
      </Paper>

      {/* ── Table ───────────────────────────────────────────────────────────── */}
      <TableContainer
        component={Paper}
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderTop: 'none',
          borderRadius: '0 0 16px 16px',
          boxShadow: 'none',
        }}
      >
        <Table>
          <TableHead sx={{ bgcolor: 'action.hover' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>{t('auth.admin.actionSlug')}</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>{t('auth.admin.resource')}</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>{t('auth.admin.guard')}</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>{t('auth.admin.description')}</TableCell>
              <TableCell align='right' sx={{ fontWeight: 700 }}>
                {t('auth.common.actions')}
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} align='center' sx={{ py: 8 }}>
                  <CircularProgress size={28} />
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align='center' sx={{ py: 8 }}>
                  <Shield
                    sx={{
                      fontSize: 40,
                      color: 'text.disabled',
                      mb: 1,
                      display: 'block',
                      mx: 'auto',
                    }}
                  />
                  <Typography variant='body2' color='text.secondary' sx={{ fontWeight: 600 }}>
                    {search || activeCategory
                      ? t('auth.common.noResults')
                      : t('auth.admin.noPermissions') || 'No permissions defined yet'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((perm) => (
                <TableRow key={perm.id} hover>
                  {/* Slug */}
                  <TableCell>
                    <Chip
                      label={perm.name}
                      size='small'
                      icon={<VpnKey sx={{ fontSize: '12px !important' }} />}
                      sx={{
                        fontWeight: 800,
                        fontFamily: 'monospace',
                        borderRadius: 1.5,
                        maxWidth: 260,
                        height: 20,
                      }}
                      color='primary'
                      variant='outlined'
                    />
                  </TableCell>

                  {/* Resource */}
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ color: 'text.disabled', display: 'flex', fontSize: 16 }}>
                        {getCategoryIcon(perm.resource || '')}
                      </Box>
                      <Typography
                        variant='body2'
                        sx={{ fontWeight: 600, textTransform: 'capitalize' }}
                      >
                        {perm.resource || '—'}
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* Guard */}
                  <TableCell>
                    <Chip
                      label={perm.guard_name}
                      size='small'
                      variant='outlined'
                      sx={{ fontWeight: 700, height: 20, fontSize: '0.7rem' }}
                    />
                  </TableCell>

                  {/* Description */}
                  <TableCell sx={{ maxWidth: 340 }}>
                    <Typography
                      variant='body2'
                      color='text.secondary'
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {perm.description || '—'}
                    </Typography>
                  </TableCell>

                  {/* Actions */}
                  <TableCell align='right'>
                    <Stack direction='row' spacing={0.5} justifyContent='flex-end'>
                      <Tooltip title={t('auth.admin.editDefinition') || 'Edit Definition'}>
                        <IconButton size='small'>
                          <Settings fontSize='small' />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('auth.admin.viewDetails') || 'View Details'}>
                        <IconButton size='small'>
                          <Info fontSize='small' />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ── Footer count ────────────────────────────────────────────────────── */}
      {!isLoading && permissions.length > 0 && (
        <Box sx={{ mt: 1.5, px: 0.5 }}>
          <Typography
            variant='caption'
            color='text.disabled'
            sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.075em' }}
          >
            Showing {filtered.length} of {permissions.length} permissions
            {activeCategory ? ` in "${activeCategory}"` : ''}
          </Typography>
        </Box>
      )}
    </Box>
  )
}
