import React from 'react'
import { Button, Stack } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Path } from '@cap/module-auth/routes/path'

/**
 * Shared component for authentication buttons (Sign In / Sign Up)
 */
const AuthButtons: React.FC = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <Stack direction='row' spacing={1}>
      <Button variant='outlined' size='small' onClick={() => navigate(Path.auth.signin)}>
        {t('navigation.login', 'Sign In')}
      </Button>
      <Button variant='contained' size='small' onClick={() => navigate(Path.auth.signup)}>
        {t('navigation.register', 'Sign Up')}
      </Button>
    </Stack>
  )
}

export default AuthButtons
