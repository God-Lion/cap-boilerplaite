import React, { useState } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Stack,
  Chip,
  LinearProgress,
  Alert,
  AlertTitle,
  Divider,
} from '@mui/material'
import { History, FileDownload, CloudDownload, Analytics } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

export default function ExportAuditTrail() {
  const { t } = useTranslation('common')
  const [isExporting, setIsExporting] = useState(false)
  const [progress, setProgress] = useState(0)

  const [reportType, setReportType] = useState('security')
  const [format, setFormat] = useState('csv')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const handleExport = async () => {
    setIsExporting(true)
    setProgress(25)

    try {
      const { adminService } = await import('../../services/adminService')
      const response = await adminService.exportAuditLogs({
        format: format as 'json' | 'csv',
        start_date: startDate,
        end_date: endDate,
      })

      setProgress(75)

      // Create a download link for the blob
      const url = window.URL.createObjectURL(response.data)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute(
        'download',
        `audit_logs_${new Date().toISOString().split('T')[0]}.${format}`,
      )
      document.body.appendChild(link)
      link.click()
      link.parentNode?.removeChild(link)

      setProgress(100)
    } catch (error) {
      console.error('Export failed:', error)
      setProgress(0)
    } finally {
      setTimeout(() => {
        setIsExporting(false)
        setProgress(0)
      }, 1000)
    }
  }

  const exportHistory = [
    { id: '1', date: '2023-10-25 09:00', type: 'Full Audit', format: 'PDF', status: 'ready' },
    {
      id: '2',
      date: '2023-10-20 14:30',
      type: 'Security Events Only',
      format: 'CSV',
      status: 'expired',
    },
  ]

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1000, mx: 'auto' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant='h4' sx={{ fontWeight: 900, mb: 1 }}>
          {t('auth.admin.export_audit')}
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          {t('auth.admin.export_audit_subtitle')}
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant='h6' sx={{ fontWeight: 800, mb: 3 }}>
                {t('auth.admin.export_parameters')}
              </Typography>

              <Stack spacing={3}>
                <FormControl fullWidth>
                  <InputLabel>{t('auth.admin.report_type')}</InputLabel>
                  <Select
                    label={t('auth.admin.report_type')}
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                  >
                    <MenuItem value='security'>Security & Access Events</MenuItem>
                    <MenuItem value='iam'>IAM & Perm Change Logs</MenuItem>
                    <MenuItem value='full'>Comprehensive System Audit</MenuItem>
                  </Select>
                </FormControl>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <TextField
                      fullWidth
                      label='Start Date'
                      type='date'
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <TextField
                      fullWidth
                      label='End Date'
                      type='date'
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                </Grid>

                <FormControl fullWidth>
                  <InputLabel>{t('auth.admin.output_format')}</InputLabel>
                  <Select
                    label={t('auth.admin.output_format')}
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                  >
                    <MenuItem value='pdf'>PDF Document (.pdf)</MenuItem>
                    <MenuItem value='csv'>Spreadsheet (.csv)</MenuItem>
                    <MenuItem value='json'>JSON Data (.json)</MenuItem>
                  </Select>
                </FormControl>

                <Box sx={{ mt: 2 }}>
                  <Button
                    fullWidth
                    variant='contained'
                    size='large'
                    startIcon={isExporting ? undefined : <CloudDownload />}
                    disabled={isExporting}
                    onClick={handleExport}
                    sx={{
                      height: 56,
                      fontWeight: 800,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '1.1rem',
                      boxShadow: 'none',
                    }}
                  >
                    {isExporting
                      ? `${t('auth.admin.generating')} ${progress}%`
                      : t('auth.admin.start_export')}
                  </Button>
                </Box>

                {isExporting && (
                  <LinearProgress
                    variant='determinate'
                    value={progress}
                    sx={{ height: 4, borderRadius: 2 }}
                  />
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Stack spacing={3}>
            <Alert severity='info' icon={<Analytics />} sx={{ borderRadius: 2 }}>
              <AlertTitle sx={{ fontWeight: 700 }}>{t('auth.admin.compliance_title')}</AlertTitle>
              {t('auth.admin.compliance_desc')}
            </Alert>

            <Card sx={{ border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
              <CardContent>
                <Typography
                  variant='subtitle1'
                  sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center' }}
                >
                  <History sx={{ mr: 1, fontSize: 20 }} /> {t('auth.admin.recent_exports')}
                </Typography>
                <Stack spacing={2}>
                  {exportHistory.map((item) => (
                    <Box key={item.id}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                        }}
                      >
                        <Box>
                          <Typography variant='body2' sx={{ fontWeight: 700 }}>
                            {item.type}
                          </Typography>
                          <Typography variant='caption' color='text.secondary'>
                            {item.date}
                          </Typography>
                        </Box>
                        <Chip
                          label={item.status}
                          size='small'
                          color={item.status === 'ready' ? 'success' : 'default'}
                          sx={{
                            textTransform: 'uppercase',
                            fontWeight: 900,
                            fontSize: '0.55rem',
                            height: 16,
                          }}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                        <Button
                          size='small'
                          startIcon={<FileDownload />}
                          disabled={item.status !== 'ready'}
                          sx={{
                            textTransform: 'none',
                            p: 0,
                            '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' },
                          }}
                        >
                          {t('auth.admin.download_format', { format: item.format })}
                        </Button>
                      </Box>
                      <Divider sx={{ mt: 1 }} />
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  )
}
