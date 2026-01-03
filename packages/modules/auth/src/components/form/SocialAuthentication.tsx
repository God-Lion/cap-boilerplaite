import { Button, Grid } from '@mui/material'
import 'react-phone-input-2/lib/style.css'
import { Facebook, Google } from '@mui/icons-material'
// import { IUserResponse } from '@cap/platform-core'
import FormLayout from './FormLayout'

export default function SocialAuthentication() {
  return (
    <FormLayout
      title='Social Authentication'
      description='Manage your ability to login with a social provider in addition to your email and password'
      warning={''}
    >
      <Grid container spacing={2} sx={{ mt: '30px' }}>
        <Grid size={{ xs: 6 }}>
          <Button fullWidth variant='outlined' color='primary'>
            <Google />
          </Button>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Button fullWidth variant='outlined' color='primary'>
            <Facebook />
          </Button>
        </Grid>
      </Grid>
    </FormLayout>
  )
}
