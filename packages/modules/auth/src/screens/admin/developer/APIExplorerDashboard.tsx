import React, { useState, useEffect, useMemo, useCallback } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  InputAdornment,
  alpha,
  useTheme,
  Stack,
  Chip,
  IconButton,
  Divider,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material'
import { Search, PlayArrow, Lock, Terminal, ContentCopy, Security } from '@mui/icons-material'
import { apiClient } from '@cap/platform-core'
import { ENDPOINTS } from '../../../services/endpoints'
import { APIEndpoint } from '../../../types/developer.types'

/** Minimal OpenAPI path-item shape for extracting endpoint data */
interface OpenAPIPathItem {
  summary?: string
  description?: string
  security?: Array<Record<string, string[]>>
  [key: string]: unknown
}

interface OpenAPISpec {
  paths?: Record<string, Record<string, OpenAPIPathItem>>
}

/**
 * Parses an OpenAPI JSON spec into a flat list of APIEndpoint items.
 */
function parseOpenAPISpec(spec: OpenAPISpec): APIEndpoint[] {
  const endpoints: APIEndpoint[] = []
  const paths = spec.paths ?? {}
  let idx = 0

  for (const [path, methods] of Object.entries(paths)) {
    for (const [method, operation] of Object.entries(methods)) {
      if (['get', 'post', 'put', 'delete', 'patch'].includes(method)) {
        const op = operation as OpenAPIPathItem
        const scopes: string[] = []
        if (Array.isArray(op.security)) {
          for (const sec of op.security) {
            for (const scopeList of Object.values(sec)) {
              scopes.push(...scopeList)
            }
          }
        }

        endpoints.push({
          id: `ep_${idx++}`,
          path,
          method: method.toUpperCase() as APIEndpoint['method'],
          summary: op.summary ?? `${method.toUpperCase()} ${path}`,
          description: op.description,
          requiredScopes: scopes,
          isPublic: scopes.length === 0,
        })
      }
    }
  }

  return endpoints
}

export default function APIExplorerDashboard() {
  const theme = useTheme()
  const [searchTerm, setSearchTerm] = useState('')
  const [endpoints, setEndpoints] = useState<APIEndpoint[]>([])
  const [selectedEndpoint, setSelectedEndpoint] = useState<APIEndpoint | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchSpec() {
      setIsLoading(true)
      setError(null)

      try {
        const response = await apiClient.get<OpenAPISpec>(ENDPOINTS.admin.docs)
        if (!cancelled && response.data) {
          const parsed = parseOpenAPISpec(response.data)
          setEndpoints(parsed)
          if (parsed.length > 0) {
            setSelectedEndpoint(parsed[0])
          }
        }
      } catch (err: unknown) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'Failed to load API documentation'
          setError(message)
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    fetchSpec()
    return () => {
      cancelled = true
    }
  }, [])

  const filteredEndpoints = useMemo(() => {
    if (!searchTerm) return endpoints
    const term = searchTerm.toLowerCase()
    return endpoints.filter(
      (ep) =>
        ep.path.toLowerCase().includes(term) ||
        ep.summary.toLowerCase().includes(term) ||
        ep.method.toLowerCase().includes(term),
    )
  }, [endpoints, searchTerm])

  const getMethodColor = useCallback((method: string) => {
    switch (method) {
      case 'GET':
        return 'success'
      case 'POST':
        return 'primary'
      case 'PUT':
        return 'warning'
      case 'DELETE':
        return 'error'
      case 'PATCH':
        return 'info'
      default:
        return 'default'
    }
  }, [])

  const active = selectedEndpoint

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1400, mx: 'auto' }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 4,
        }}
      >
        <Box>
          <Typography variant='h4' sx={{ fontWeight: 900, mb: 1, letterSpacing: '-0.02em' }}>
            API Explorer
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            Interactive documentation and live testing environment for TrustKey APIs.
          </Typography>
        </Box>
        <Stack direction='row' spacing={2}>
          <Button
            variant='outlined'
            startIcon={<Terminal />}
            sx={{ px: 3, py: 1.2, borderRadius: 2, fontWeight: 700, textTransform: 'none' }}
          >
            SDK Guides
          </Button>
          <Button
            variant='contained'
            startIcon={<PlayArrow />}
            sx={{ px: 3, py: 1.2, borderRadius: 2, fontWeight: 700, textTransform: 'none' }}
          >
            Live Sandbox
          </Button>
        </Stack>
      </Box>

      {/* Error state */}
      {error && (
        <Alert severity='error' sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Loading state */}
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Main Explorer */}
      {!isLoading && !error && (
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              sx={{
                p: 2,
                borderRadius: 4,
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: 'none',
              }}
            >
              <TextField
                fullWidth
                placeholder='Filter endpoints...'
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
                sx={{ mb: 2 }}
              />
              <Typography variant='caption' color='text.secondary' sx={{ mb: 1, display: 'block' }}>
                {filteredEndpoints.length} endpoint{filteredEndpoints.length !== 1 ? 's' : ''}
              </Typography>
              <Stack spacing={1} sx={{ maxHeight: 600, overflow: 'auto' }}>
                {filteredEndpoints.map((ep) => (
                  <Box
                    key={ep.id}
                    onClick={() => setSelectedEndpoint(ep)}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      cursor: 'pointer',
                      border: '1px solid',
                      borderColor:
                        active?.id === ep.id
                          ? alpha(theme.palette.primary.main, 0.3)
                          : 'transparent',
                      bgcolor:
                        active?.id === ep.id
                          ? alpha(theme.palette.primary.main, 0.05)
                          : 'transparent',
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        borderColor: alpha(theme.palette.primary.main, 0.1),
                      },
                    }}
                  >
                    <Stack direction='row' spacing={1.5} alignItems='center'>
                      <Typography
                        variant='caption'
                        sx={{
                          fontWeight: 900,
                          color: `${getMethodColor(ep.method)}.main`,
                          width: 50,
                          flexShrink: 0,
                        }}
                      >
                        {ep.method}
                      </Typography>
                      <Typography
                        variant='body2'
                        sx={{
                          fontWeight: 700,
                          flex: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {ep.path}
                      </Typography>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            {active ? (
              <Card
                sx={{
                  borderRadius: 4,
                  border: '1px solid',
                  borderColor: 'divider',
                  boxShadow: 'none',
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Box>
                      <Stack direction='row' spacing={2} alignItems='center' sx={{ mb: 1 }}>
                        <Chip
                          label={active.method}
                          color={
                            getMethodColor(active.method) as
                              | 'success'
                              | 'primary'
                              | 'warning'
                              | 'error'
                              | 'info'
                          }
                          size='small'
                          sx={{ fontWeight: 900 }}
                        />
                        <Typography variant='h6' sx={{ fontWeight: 800 }}>
                          {active.path}
                        </Typography>
                      </Stack>
                      <Typography variant='body2' color='text.secondary'>
                        {active.summary}
                      </Typography>
                      {active.description && (
                        <Typography variant='body2' color='text.secondary' sx={{ mt: 0.5 }}>
                          {active.description}
                        </Typography>
                      )}
                    </Box>
                    <IconButton
                      onClick={() => navigator.clipboard.writeText(active.path)}
                      size='small'
                    >
                      <ContentCopy />
                    </IconButton>
                  </Box>

                  <Divider sx={{ mb: 3 }} />

                  <Box sx={{ mb: 4 }}>
                    <Typography variant='subtitle2' sx={{ fontWeight: 800, mb: 2 }}>
                      SECURITY
                    </Typography>
                    <Stack direction='row' spacing={2} flexWrap='wrap'>
                      {active.isPublic ? (
                        <Chip
                          label='Public'
                          color='success'
                          size='small'
                          sx={{ fontWeight: 700 }}
                        />
                      ) : (
                        <Chip
                          icon={<Lock sx={{ fontSize: 16 }} />}
                          label='Bearer Token'
                          variant='filled'
                          size='small'
                          sx={{
                            fontWeight: 700,
                            bgcolor: alpha(theme.palette.text.primary, 0.1),
                            color: 'text.primary',
                          }}
                        />
                      )}
                      {active.requiredScopes.map((scope) => (
                        <Chip
                          key={scope}
                          icon={<Security sx={{ fontSize: 16 }} />}
                          label={`Scope: ${scope}`}
                          variant='filled'
                          color='info'
                          size='small'
                          sx={{
                            fontWeight: 700,
                            bgcolor: alpha(theme.palette.info.main, 0.15),
                            color: 'info.main',
                          }}
                        />
                      ))}
                    </Stack>
                  </Box>

                  <Box>
                    <Typography variant='subtitle2' sx={{ fontWeight: 800, mb: 2 }}>
                      REQUEST PREVIEW
                    </Typography>
                    <Paper
                      sx={{
                        bgcolor: alpha(theme.palette.text.primary, 0.05),
                        p: 3,
                        borderRadius: 3,
                        fontFamily: 'Monospace',
                        position: 'relative',
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <Typography variant='caption' sx={{ color: 'primary.main', fontWeight: 700 }}>
                        {active.method}
                      </Typography>
                      <Typography variant='body2' component='pre' sx={{ mt: 1, overflow: 'auto' }}>
                        {`curl -X ${active.method} "https://api.trustkey.com${active.path}" \\
  -H "Authorization: Bearer <TOKEN>"`}
                      </Typography>
                      <IconButton
                        sx={{ position: 'absolute', top: 8, right: 8 }}
                        size='small'
                        onClick={() =>
                          navigator.clipboard.writeText(
                            `curl -X ${active.method} "https://api.trustkey.com${active.path}" -H "Authorization: Bearer <TOKEN>"`,
                          )
                        }
                      >
                        <ContentCopy fontSize='inherit' />
                      </IconButton>
                    </Paper>
                  </Box>

                  <Button
                    variant='contained'
                    fullWidth
                    startIcon={<PlayArrow />}
                    sx={{
                      mt: 4,
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: 700,
                      textTransform: 'none',
                      fontSize: '1rem',
                    }}
                  >
                    Send Sandbox Request
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 12 }}>
                <Typography color='text.secondary'>Select an endpoint to view details.</Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      )}
    </Box>
  )
}
