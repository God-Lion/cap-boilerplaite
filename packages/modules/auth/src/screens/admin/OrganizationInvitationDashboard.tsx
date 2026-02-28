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
  alpha,
  useTheme,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Tooltip,
} from '@mui/material'
import {
  Search,
  MoreVert,
  Email,
  PersonAdd,
  Timer,
  CheckCircle,
  Cancel,
  ArrowBack,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Path from '../path'

interface Invitation {
  id: string
  email: string
  role: string
  status: 'Pending' | 'Accepted' | 'Expired' | 'Revoked'
  invitedAt: string
  expiresAt: string
}

const mockInvitations: Invitation[] = [
  {
    id: '1',
    email: 'new_hire@startup.com',
    role: 'Member',
    status: 'Pending',
    invitedAt: '2024-02-14',
    expiresAt: '2024-02-21',
  },
  {
    id: '2',
    email: 'lead_dev@another.io',
    role: 'Admin',
    status: 'Accepted',
    invitedAt: '2024-02-10',
    expiresAt: '2024-02-17',
  },
  {
    id: '3',
    email: 'consultant@agency.net',
    role: 'Auditor',
    status: 'Expired',
    invitedAt: '2024-01-05',
    expiresAt: '2024-01-12',
  },
]

export default function OrganizationInvitationDashboard() {
  const { t } = useTranslation('common')
  const navigate = useNavigate()
  const theme = useTheme()
  const [searchTerm, setSearchTerm] = useState('')
  const [inviteModalOpen, setInviteModalOpen] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accepted':
        return 'success'
      case 'Pending':
        return 'warning'
      case 'Expired':
        return 'error'
      default:
        return 'default'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Accepted':
        return <CheckCircle sx={{ fontSize: 14 }} />
      case 'Pending':
        return <Timer sx={{ fontSize: 14 }} />
      case 'Expired':
        return <Cancel sx={{ fontSize: 14 }} />
      default:
        return undefined
    }
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1400, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(Path.admin.organizations)}
          sx={{ mb: 2, color: 'text.secondary', textTransform: 'none', fontWeight: 600 }}
        >
          {t('auth.admin.back_to_orgs')}
        </Button>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant='h4' sx={{ fontWeight: 900, mb: 1 }}>
              {t('auth.admin.member_invitations')}
            </Typography>
            <Typography variant='body1' color='text.secondary'>
              {t('auth.admin.member_invitations_subtitle')}
            </Typography>
          </Box>
          <Button
            variant='contained'
            startIcon={<PersonAdd />}
            onClick={() => setInviteModalOpen(true)}
            sx={{ px: 3, py: 1.2, borderRadius: 2, fontWeight: 700, textTransform: 'none' }}
          >
            {t('auth.admin.invite_new_member')}
          </Button>
        </Box>
      </Box>

      {/* Stats */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 2,
          mb: 4,
        }}
      >
        {[
          { label: 'Total Sent', count: 48, icon: <Email />, color: theme.palette.primary.main },
          {
            label: 'Pending Acceptance',
            count: 12,
            icon: <Timer />,
            color: theme.palette.warning.main,
          },
          {
            label: 'Acceptance Rate',
            count: '85%',
            icon: <CheckCircle />,
            color: theme.palette.success.main,
          },
        ].map((stat, i) => (
          <Card
            key={i}
            sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}
          >
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                sx={{ bgcolor: alpha(stat.color, 0.1), color: stat.color, width: 44, height: 44 }}
              >
                {stat.icon}
              </Avatar>
              <Box>
                <Typography variant='caption' color='text.secondary' sx={{ fontWeight: 700 }}>
                  {stat.label}
                </Typography>
                <Typography variant='h5' sx={{ fontWeight: 800 }}>
                  {stat.count}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Table */}
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
          sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', gap: 2 }}
        >
          <TextField
            fullWidth
            placeholder={t('auth.common.search_by_email')}
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
            <TableHead sx={{ bgcolor: alpha(theme.palette.action.hover, 0.5) }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>{t('auth.admin.invited_email')}</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{t('auth.admin.assigned_role')}</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{t('auth.admin.status')}</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{t('auth.admin.sent_date')}</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{t('auth.admin.expires_at')}</TableCell>
                <TableCell align='right' sx={{ fontWeight: 700 }}>
                  {t('auth.common.actions')}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockInvitations.map((invite) => (
                <TableRow key={invite.id} hover>
                  <TableCell>
                    <Typography variant='body2' sx={{ fontWeight: 600 }}>
                      {invite.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={invite.role}
                      size='small'
                      variant='outlined'
                      sx={{ fontWeight: 700 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={getStatusIcon(invite.status)}
                      label={invite.status}
                      size='small'
                      color={getStatusColor(invite.status) as any}
                      variant='filled'
                      sx={{ fontWeight: 800, px: 0.5 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant='body2' color='text.secondary'>
                      {invite.invitedAt}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant='body2' color='text.secondary'>
                      {invite.expiresAt}
                    </Typography>
                  </TableCell>
                  <TableCell align='right'>
                    <Tooltip title={t('auth.admin.invitation_settings')}>
                      <IconButton size='small'>
                        <MoreVert />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Invite Modal */}
      <Dialog
        open={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        fullWidth
        maxWidth='xs'
        PaperProps={{ sx: { borderRadius: 4 } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>
          {t('auth.admin.invite_member_modal_title')}
        </DialogTitle>
        <DialogContent>
          <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
            {t('auth.admin.invite_member_modal_subtitle')}
          </Typography>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label={t('auth.common.email_address')}
              placeholder='user@example.com'
            />
            <TextField select fullWidth label={t('auth.admin.assigned_role')} defaultValue='Member'>
              <MenuItem value='Admin'>{t('auth.common.admin')}</MenuItem>
              <MenuItem value='Member'>{t('auth.common.member')}</MenuItem>
              <MenuItem value='Auditor'>{t('auth.common.auditor')}</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={() => setInviteModalOpen(false)}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            {t('auth.common.cancel')}
          </Button>
          <Button
            variant='contained'
            onClick={() => setInviteModalOpen(false)}
            sx={{ borderRadius: 2, fontWeight: 700, textTransform: 'none', px: 3 }}
          >
            {t('auth.admin.send_invitation')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
