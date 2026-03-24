import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  Switch,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  alpha,
} from '@mui/material'
import {
  UsbOutlined,
  Usb,
  Delete,
  Edit,
  Add,
  ArrowBack,
  Key,
  FiberManualRecord,
  Block,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

interface SecurityKey {
  id: string
  name: string
  serialNumber: string
  lastUsed: string
  addedDate: string
  status: 'active' | 'revoked'
}

const MOCK_KEYS: SecurityKey[] = [
  {
    id: '1',
    name: 'Office Key',
    serialNumber: 'SN-001',
    lastUsed: '2 mins ago',
    addedDate: 'Jan 12, 2023',
    status: 'active',
  },
  {
    id: '2',
    name: 'Backup Key',
    serialNumber: 'SN-002',
    lastUsed: '3 months ago',
    addedDate: 'Dec 05, 2022',
    status: 'active',
  },
  {
    id: '3',
    name: 'Titan Key',
    serialNumber: 'SN-003',
    lastUsed: '-',
    addedDate: 'Sep 10, 2023',
    status: 'revoked',
  },
]

export default function SecurityKeyManagement() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [keys] = useState<SecurityKey[]>(MOCK_KEYS)
  const [requirePin, setRequirePin] = useState(true)
  const [allowTap, setAllowTap] = useState(false)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')

  return (
    <Container maxWidth='md' sx={{ py: 4 }}>
      {/* Breadcrumb */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ textTransform: 'none', color: 'text.secondary', fontWeight: 500 }}
        >
          {t('auth.security.settings', 'Settings')}
        </Button>
        <Typography variant='body2' color='text.secondary'>
          /
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          {t('auth.mfa.security', 'Security')}
        </Typography>
      </Box>

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 3,
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Key sx={{ fontSize: 24, color: 'primary.main' }} />
          </Box>
          <Box>
            <Typography variant='h5' fontWeight={700} letterSpacing='-0.02em'>
              {t('auth.security.key_management_title', 'Security Key Management')}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {t(
                'auth.security.key_management_description',
                'Manage your physical security keys, PINs, and usage policies for secure authentication.',
              )}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Connected Device Hero */}
      <Card
        sx={{
          mb: 3,
          borderRadius: 3,
          border: 1,
          borderColor: 'primary.main',
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.03),
        }}
      >
        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 3, py: 3 }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: 3,
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Usb sx={{ fontSize: 32, color: 'primary.main' }} />
          </Box>
          <Box>
            <Typography variant='subtitle1' fontWeight={700}>
              YubiKey 5 NFC
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              S/N 12345678 • Added Oct 24, 2023
            </Typography>
            <Chip
              label={t('auth.security.connected', 'Connected')}
              size='small'
              color='success'
              sx={{ mt: 1, height: 22, fontSize: '0.7rem' }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Authentication Rules */}
      <Card sx={{ mb: 3, borderRadius: 3, border: 1, borderColor: 'divider' }}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ px: 3, py: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant='subtitle1' fontWeight={600}>
              {t('auth.security.auth_rules', 'Authentication Rules')}
            </Typography>
          </Box>
          <Box
            sx={{
              px: 3,
              py: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: 1,
              borderColor: 'divider',
            }}
          >
            <Box>
              <Typography variant='subtitle2' fontWeight={600}>
                {t('auth.security.require_pin', 'Require PIN for every login')}
              </Typography>
              <Typography variant='caption' color='text.secondary'>
                {t('auth.security.require_pin_desc', 'Forces PIN entry even for trusted devices.')}
              </Typography>
            </Box>
            <Switch checked={requirePin} onChange={(e) => setRequirePin(e.target.checked)} />
          </Box>
          <Box
            sx={{
              px: 3,
              py: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Typography variant='subtitle2' fontWeight={600}>
                {t('auth.security.allow_tap', 'Allow simplified tap')}
              </Typography>
              <Typography variant='caption' color='text.secondary'>
                {t(
                  'auth.security.allow_tap_desc',
                  'Enable one-touch verification for non-sensitive actions.',
                )}
              </Typography>
            </Box>
            <Switch checked={allowTap} onChange={(e) => setAllowTap(e.target.checked)} />
          </Box>
        </CardContent>
      </Card>

      {/* Registered Keys */}
      <Card sx={{ borderRadius: 3, border: 1, borderColor: 'divider' }}>
        <CardContent sx={{ p: 0 }}>
          <Box
            sx={{
              px: 3,
              py: 2,
              borderBottom: 1,
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant='subtitle1' fontWeight={600}>
              {t('auth.security.registered_keys', 'Registered Keys')}
            </Typography>
            <Button
              size='small'
              startIcon={<Add />}
              onClick={() => setShowAddDialog(true)}
              sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
            >
              {t('auth.security.add_key', 'Add Key')}
            </Button>
          </Box>
          <List disablePadding>
            {keys.map((key, index) => (
              <ListItem
                key={key.id}
                sx={{
                  px: 3,
                  py: 2,
                  borderBottom: index < keys.length - 1 ? 1 : 0,
                  borderColor: 'divider',
                  opacity: key.status === 'revoked' ? 0.6 : 1,
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <UsbOutlined
                    sx={{
                      color: key.status === 'active' ? 'primary.main' : 'text.disabled',
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant='subtitle2' fontWeight={600}>
                        {key.name}
                      </Typography>
                      <Chip
                        icon={
                          key.status === 'active' ? (
                            <FiberManualRecord sx={{ fontSize: '10px !important' }} />
                          ) : (
                            <Block sx={{ fontSize: '14px !important' }} />
                          )
                        }
                        label={key.status === 'active' ? 'Active' : 'Revoked'}
                        size='small'
                        color={key.status === 'active' ? 'success' : 'default'}
                        variant='outlined'
                        sx={{ height: 20, fontSize: '0.65rem' }}
                      />
                    </Box>
                  }
                  secondary={
                    key.status === 'revoked'
                      ? `Revoked on ${key.addedDate}`
                      : `Last used ${key.lastUsed} • Added ${key.addedDate}`
                  }
                />
                <ListItemSecondaryAction>
                  {key.status === 'active' && (
                    <>
                      <IconButton size='small' sx={{ mr: 0.5 }}>
                        <Edit fontSize='small' />
                      </IconButton>
                      <IconButton size='small' color='error'>
                        <Delete fontSize='small' />
                      </IconButton>
                    </>
                  )}
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Add Key Dialog */}
      <Dialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        maxWidth='xs'
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          {t('auth.security.register_key', 'Register Security Key')}
        </DialogTitle>
        <DialogContent>
          <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
            {t(
              'auth.security.register_key_instruction',
              'Insert your security key and give it a name for easy identification.',
            )}
          </Typography>
          <TextField
            fullWidth
            label={t('auth.security.key_name', 'Key Name')}
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            placeholder='e.g., Office Key'
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setShowAddDialog(false)}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            {t('common.cancel', 'Cancel')}
          </Button>
          <Button
            variant='contained'
            disabled={!newKeyName.trim()}
            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
          >
            {t('auth.security.register', 'Register')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
