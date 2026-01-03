import { useState, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  IconButton,
  Snackbar,
  TextField,
  Typography,
  MenuItem,
  TypographyProps,
} from '@mui/material'
import Grid from '@mui/material/Grid'
import { Description, Person, CreditCard } from '@mui/icons-material'
import { styled, useTheme } from '@mui/material/styles'
import { useForm, Controller, Control, FieldErrors } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Alert as MAlert, AdaptiveLogo } from '@cap/platform-core'
import { themeConfig } from '@cap/platform-core'

import { IStatus, Roles, IAuth } from '@cap/platform-core'
import { useRegister, RegisterRequest, ADMIN_ROLES } from '../../index'
import { useAuth } from '@cap/platform-core'
import Stepper from '@mui/material/Stepper'
import MuiStep, { StepProps } from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import useMediaQuery from '@mui/material/useMediaQuery'
import CustomAvatar from '../../components/CustomAvatar'
import DirectionalIcon from '../../components/DirectionalIcon'
import CustomInputVertical from '../../components/custom-inputs/Vertical'
import { CustomInputVerticalData } from '../../components/custom-inputs/types'
import { IllustrationWrapper } from '../../components/IllustrationWrapper'

const StepperWrapper = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    maxWidth: 400,
    marginInline: 'auto',
  },
}))

const Logo = AdaptiveLogo
const authBackground = '/images/pages/auth-v2-mask-light.png' // Placeholder

const EMAIL_PATTERN = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

interface SignUpFormData {
  email: string
  password: string
  confirmPassword: string
  terms: boolean
  username: string
  profileLink: string
  firstName: string
  lastName: string
  mobile: string
  pinCode: string
  address: string
  landmark: string
  city: string
  state: string
  plan: string
  cardNumber: string
  nameOnCard: string
  expiryDate: string
  cvv: string
}

const DEFAULT_FORM_VALUES: SignUpFormData = {
  email: '',
  password: '',
  confirmPassword: '',
  terms: false,
  username: '',
  profileLink: '',
  firstName: '',
  lastName: '',
  mobile: '',
  pinCode: '',
  address: '',
  landmark: '',
  city: '',
  state: '',
  plan: 'standard',
  cardNumber: '',
  nameOnCard: '',
  expiryDate: '',
  cvv: '',
}

// Utility functions
const normalizeRole = (role: string | number): string => {
  return typeof role === 'string' ? role.toUpperCase() : String(role)
}

const isUserRole = (role: string): boolean => {
  return role === String(Roles.USER) || role === 'USER'
}

const isAdminRole = (role: string): boolean => {
  return ADMIN_ROLES.includes(role as any)
}

const getNavigationPath = (role: string): string => {
  if (isUserRole(role)) return '/'
  if (isAdminRole(role)) return '/admin/dashboard'
  return '/dashboard'
}

// Styled Custom Components
const RegisterIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  maxBlockSize: 550,
  marginBlock: theme.spacing(12),
}))

const MaskImg = styled('img')({
  blockSize: 'auto',
  maxBlockSize: 250,
  inlineSize: '100%',
  position: 'absolute',
  insetBlockEnd: 0,
  zIndex: -1,
})

// Vars
const steps = [
  {
    title: 'Account',
    icon: Description,
    subtitle: 'Enter your Account Details',
  },
  {
    title: 'Personal',
    icon: Person,
    subtitle: 'Setup Information',
  },
  {
    title: 'Billing',
    icon: CreditCard,
    subtitle: 'Add Social Links',
  },
]

const Step = styled(MuiStep)<StepProps>(({ theme }) => ({
  paddingInline: theme.spacing(7),
  paddingBlock: theme.spacing(1),
  '& + i': {
    color: theme.palette.text.secondary,
  },
  '&:first-of-type': {
    paddingInlineStart: 0,
  },
  '&:last-of-type': {
    paddingInlineEnd: 0,
  },
  '& .MuiStepLabel-iconContainer': {
    display: 'none',
  },
  '&.Mui-completed + i': {
    color: theme.palette.primary.main,
  },
  [theme.breakpoints.down('md')]: {
    padding: 0,
    ':not(:last-of-type)': {
      marginBlockEnd: theme.spacing(6),
    },
  },
}))

const getStepContent = (
  step: number,
  handleNext: () => void,
  handlePrev: () => void,
  control: Control<SignUpFormData>,
  errors: FieldErrors<SignUpFormData>,
) => {
  switch (step) {
    case 0:
      return <StepAccountDetails handleNext={handleNext} control={control} errors={errors} />
    case 1:
      return (
        <StepPersonalInfo
          handleNext={handleNext}
          handlePrev={handlePrev}
          control={control}
          errors={errors}
        />
      )
    case 2:
      return <StepBillingDetails handlePrev={handlePrev} control={control} errors={errors} />

    default:
      return null
  }
}

const StepAccountDetails = ({
  handleNext,
  control,
  errors,
}: {
  handleNext: () => void
  control: Control<SignUpFormData>
  errors: FieldErrors<SignUpFormData>
}) => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState<boolean>(false)
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState<boolean>(false)

  const handleClickShowPassword = () => {
    setIsPasswordShown(!isPasswordShown)
  }

  const handleClickShowConfirmPassword = () => {
    setIsConfirmPasswordShown(!isConfirmPasswordShown)
  }

  return (
    <>
      <Box sx={{ mb: 5 }}>
        <Typography variant='h4'>Account Information</Typography>
        <Typography>Enter Your Account Details</Typography>
      </Box>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name='username'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <TextField
                fullWidth
                value={value}
                label='Username'
                onChange={onChange}
                placeholder='johnDoe'
                error={Boolean(errors.username)}
                {...(errors.username && { helperText: 'This field is required' })}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name='email'
            control={control}
            rules={{ required: true, pattern: EMAIL_PATTERN }}
            render={({ field: { value, onChange } }) => (
              <TextField
                fullWidth
                type='email'
                value={value}
                label='Email'
                onChange={onChange}
                placeholder='john.deo@gmail.com'
                error={Boolean(errors.email)}
                {...(errors.email && { helperText: 'Enter a valid email' })}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name='password'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <TextField
                fullWidth
                value={value}
                label='Password'
                onChange={onChange}
                placeholder='············'
                id='outlined-adornment-password'
                type={isPasswordShown ? 'text' : 'password'}
                error={Boolean(errors.password)}
                {...(errors.password && { helperText: 'This field is required' })}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        onClick={handleClickShowPassword}
                        onMouseDown={(e) => e.preventDefault()}
                        aria-label='toggle password visibility'
                      >
                        <i className={isPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name='confirmPassword'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <TextField
                fullWidth
                value={value}
                label='Confirm Password'
                onChange={onChange}
                placeholder='············'
                id='outlined-confirm-password'
                type={isConfirmPasswordShown ? 'text' : 'password'}
                error={Boolean(errors.confirmPassword)}
                {...(errors.confirmPassword && { helperText: 'This field is required' })}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        onClick={handleClickShowConfirmPassword}
                        onMouseDown={(e) => e.preventDefault()}
                        aria-label='toggle confirm password visibility'
                      >
                        <i className={isConfirmPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Controller
            name='profileLink'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <TextField
                fullWidth
                value={value}
                label='Profile Link'
                onChange={onChange}
                placeholder='johndoe/profile'
                error={Boolean(errors.profileLink)}
                {...(errors.profileLink && { helperText: 'This field is required' })}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            disabled
            variant='contained'
            color='secondary'
            startIcon={
              <DirectionalIcon ltrIconClass='tabler-arrow-left' rtlIconClass='tabler-arrow-right' />
            }
          >
            Previous
          </Button>
          <Button
            variant='contained'
            onClick={handleNext}
            endIcon={
              <DirectionalIcon ltrIconClass='tabler-arrow-right' rtlIconClass='tabler-arrow-left' />
            }
          >
            Next
          </Button>
        </Grid>
      </Grid>
    </>
  )
}

const Content = styled(Typography, {
  name: 'MuiCustomInputVertical',
  slot: 'content',
})<TypographyProps>(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: 'center',
}))

// Vars
const customInputData: CustomInputVerticalData[] = [
  {
    title: 'Basic',
    value: 'basic',
    content: (
      <Content
        component='div'
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          gap: 2,
        }}
      >
        <Typography>A simple start for start ups & Students</Typography>
        <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
          <Typography component='sup' sx={{ alignSelf: 'flex-start' }} color='primary'>
            $
          </Typography>
          <Typography component='span' variant='h3' color='primary'>
            0
          </Typography>
          <Typography component='sub' sx={{ alignSelf: 'baseline', color: 'text.disabled' }}>
            /month
          </Typography>
        </Box>
      </Content>
    ),
  },
  {
    title: 'Standard',
    value: 'standard',
    content: (
      <Content
        component='div'
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          gap: 2,
        }}
      >
        <Typography>For small to medium businesses</Typography>
        <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
          <Typography component='sup' sx={{ alignSelf: 'flex-start' }} color='primary'>
            $
          </Typography>
          <Typography component='span' variant='h3' color='primary'>
            99
          </Typography>
          <Typography component='sub' sx={{ alignSelf: 'baseline', color: 'text.disabled' }}>
            /month
          </Typography>
        </Box>
      </Content>
    ),
    isSelected: true,
  },
  {
    title: 'Enterprise',
    value: 'enterprise',
    content: (
      <Content
        component='div'
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          gap: 2,
        }}
      >
        <Typography>Solution for enterprise & organizations</Typography>
        <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
          <Typography component='sup' sx={{ alignSelf: 'flex-start' }} color='primary'>
            $
          </Typography>
          <Typography component='span' variant='h3' color='primary'>
            499
          </Typography>
          <Typography component='sub' sx={{ alignSelf: 'baseline', color: 'text.disabled' }}>
            /month
          </Typography>
        </Box>
      </Content>
    ),
  },
]

const StepBillingDetails = ({
  handlePrev,
  control,
  errors,
}: {
  handlePrev: () => void
  control: Control<SignUpFormData>
  errors: FieldErrors<SignUpFormData>
}) => {
  return (
    <>
      <Box sx={{ mb: 5 }}>
        <Typography variant='h4'>Select Plan</Typography>
        <Typography>Select plan as per your requirement</Typography>
      </Box>
      <Grid container spacing={5}>
        {customInputData.map((item, index) => (
          <Controller
            key={index}
            name='plan'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomInputVertical
                type='radio'
                data={item}
                gridProps={{ size: { xs: 12, sm: 4 } }}
                selected={value}
                name='custom-radios-basic'
                handleChange={(val) => onChange(val)}
              />
            )}
          />
        ))}
      </Grid>
      <Box sx={{ mt: 6, mb: 6 }}>
        <Typography variant='h4'>Payment Information</Typography>
        <Typography>Enter your card information</Typography>
      </Box>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <Controller
            name='cardNumber'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <TextField
                fullWidth
                value={value}
                label='Card Number'
                onChange={onChange}
                placeholder='1356 3215 6548 7898'
                error={Boolean(errors.cardNumber)}
                {...(errors.cardNumber && { helperText: 'This field is required' })}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name='nameOnCard'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <TextField
                fullWidth
                value={value}
                label='Name On Card'
                onChange={onChange}
                placeholder='John Doe'
                error={Boolean(errors.nameOnCard)}
                {...(errors.nameOnCard && { helperText: 'This field is required' })}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 3 }}>
          <Controller
            name='expiryDate'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <TextField
                fullWidth
                value={value}
                label='Expiry Date'
                onChange={onChange}
                placeholder='MM/YY'
                error={Boolean(errors.expiryDate)}
                {...(errors.expiryDate && { helperText: 'This field is required' })}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 3 }}>
          <Controller
            name='cvv'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <TextField
                fullWidth
                value={value}
                label='CVV Code'
                onChange={onChange}
                placeholder='654'
                error={Boolean(errors.cvv)}
                {...(errors.cvv && { helperText: 'This field is required' })}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant='contained'
            color='secondary'
            onClick={handlePrev}
            startIcon={
              <DirectionalIcon ltrIconClass='tabler-arrow-left' rtlIconClass='tabler-arrow-right' />
            }
          >
            Previous
          </Button>
          <Button type='submit' variant='contained' color='success'>
            Submit
          </Button>
        </Grid>
      </Grid>
    </>
  )
}

const StepPersonalInfo = ({
  handleNext,
  handlePrev,
  control,
  errors,
}: {
  handleNext: () => void
  handlePrev: () => void
  control: Control<SignUpFormData>
  errors: FieldErrors<SignUpFormData>
}) => {
  return (
    <>
      <Box sx={{ mb: 5 }}>
        <Typography variant='h4'>Personal Information</Typography>
        <Typography>Enter Your Personal Information</Typography>
      </Box>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name='firstName'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <TextField
                fullWidth
                value={value}
                label='First Name'
                onChange={onChange}
                placeholder='John'
                error={Boolean(errors.firstName)}
                {...(errors.firstName && { helperText: 'This field is required' })}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name='lastName'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <TextField
                fullWidth
                value={value}
                label='Last Name'
                onChange={onChange}
                placeholder='Doe'
                error={Boolean(errors.lastName)}
                {...(errors.lastName && { helperText: 'This field is required' })}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name='mobile'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <TextField
                fullWidth
                type='number'
                value={value}
                label='Mobile'
                onChange={onChange}
                placeholder='202 555 0111'
                error={Boolean(errors.mobile)}
                {...(errors.mobile && { helperText: 'This field is required' })}
                InputProps={{
                  startAdornment: <InputAdornment position='start'>US (+1)</InputAdornment>,
                }}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name='pinCode'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <TextField
                fullWidth
                type='number'
                value={value}
                label='Pin Code'
                onChange={onChange}
                placeholder='689421'
                error={Boolean(errors.pinCode)}
                {...(errors.pinCode && { helperText: 'This field is required' })}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Controller
            name='address'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <TextField
                fullWidth
                value={value}
                label='Address'
                onChange={onChange}
                placeholder='1456, Liberty Street'
                error={Boolean(errors.address)}
                {...(errors.address && { helperText: 'This field is required' })}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Controller
            name='landmark'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <TextField
                fullWidth
                value={value}
                label='Landmark'
                onChange={onChange}
                placeholder='Nr. Wall Street'
                error={Boolean(errors.landmark)}
                {...(errors.landmark && { helperText: 'This field is required' })}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name='city'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <TextField
                fullWidth
                value={value}
                label='City'
                onChange={onChange}
                placeholder='Miami'
                error={Boolean(errors.city)}
                {...(errors.city && { helperText: 'This field is required' })}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name='state'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <TextField
                select
                fullWidth
                value={value}
                label='State'
                onChange={onChange}
                defaultValue='new-york'
                error={Boolean(errors.state)}
                {...(errors.state && { helperText: 'This field is required' })}
              >
                <MenuItem value='new-york'>New York</MenuItem>
                <MenuItem value='california'>California</MenuItem>
                <MenuItem value='texas'>Texas</MenuItem>
                <MenuItem value='florida'>Florida</MenuItem>
                <MenuItem value='washington'>Washington</MenuItem>
              </TextField>
            )}
          />
        </Grid>
        <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant='contained'
            color='secondary'
            onClick={handlePrev}
            startIcon={
              <DirectionalIcon ltrIconClass='tabler-arrow-left' rtlIconClass='tabler-arrow-right' />
            }
          >
            Previous
          </Button>
          <Button
            variant='contained'
            onClick={handleNext}
            endIcon={
              <DirectionalIcon ltrIconClass='tabler-arrow-right' rtlIconClass='tabler-arrow-left' />
            }
          >
            Next
          </Button>
        </Grid>
      </Grid>
    </>
  )
}

export default function SignUpV3() {
  const { t } = useTranslation()
  const theme = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const { setUser } = useAuth()

  const controlForm = useForm<SignUpFormData>({
    defaultValues: DEFAULT_FORM_VALUES,
  })

  const [status, setStatus] = useState<IStatus>({
    open: location.state?.data?.page === 'close-cashier',
    type: location.state?.data?.type || 'success',
    state: location.state?.data?.state || '',
    msg: location.state?.data?.msg || '',
  })

  // Wizard State
  const [activeStep, setActiveStep] = useState<number>(0)
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'))

  const handleNext = async () => {
    let fieldsToValidate: (keyof SignUpFormData)[] = []

    if (activeStep === 0) {
      fieldsToValidate = ['username', 'email', 'password', 'confirmPassword', 'profileLink']
    } else if (activeStep === 1) {
      fieldsToValidate = [
        'firstName',
        'lastName',
        'mobile',
        'pinCode',
        'address',
        'landmark',
        'city',
        'state',
      ]
    }

    if (fieldsToValidate.length > 0) {
      const isValid = await controlForm.trigger(fieldsToValidate)

      if (isValid) {
        setActiveStep((prev) => prev + 1)
      }
    } else {
      setActiveStep((prev) => prev + 1)
    }
  }

  const handlePrev = () => {
    if (activeStep !== 0) {
      setActiveStep((prev) => prev - 1)
    }
  }

  const handleCloseStatus = useCallback(() => {
    setStatus((prev) => ({ ...prev, open: false }))
  }, [])

  const handleRegisterSuccess = useCallback(
    async (response: any) => {
      // Depending on API, registration might return user/token or just success.
      // If it returns user/token, we can auto-login.
      // If verification is needed, we should tell the user.

      // Assuming similar behavior to existing SignUp or direct login:
      // For now, let's assume we redirect to login or show success.
      // But looking at SignIn logic, `setUser` is used.
      // Let's use the same logic as SignIn if the response provides token, otherwise show message.

      const { user, token, refresh_token } = response.data || {}

      if (user && token) {
        const normalizedRole = normalizeRole(user.role || '')
        const authData: IAuth = {
          ...user,
          user,
          token,
          refreshToken: refresh_token,
        }
        setUser(authData)

        setStatus({
          open: true,
          type: 'success',
          state: 'success',
          msg: t('auth.login.login_successful'),
        })

        await new Promise((resolve) => setTimeout(resolve, 100))
        const navigationPath = getNavigationPath(normalizedRole)
        navigate(navigationPath, { replace: true })
      } else {
        // Just verification sent or success message
        setStatus({
          open: true,
          type: 'success',
          state: 'success',
          msg: t('auth.register.verification_sent_title'), // Or generic success
        })
        // Optionally redirect to sign-in after delay
      }
    },
    [navigate, setUser, t],
  )

  const handleRegisterError = useCallback(
    (error: any) => {
      setStatus({
        open: true,
        type: 'error',
        state: 'error',
        msg: error.response?.data?.detail || t('auth.login.login_failed'), // Or register specific error
      })
    },
    [t],
  )

  const registerMutation = useRegister({
    onSuccess: handleRegisterSuccess,
    onError: handleRegisterError,
  })

  const onSubmit = useCallback(
    (data: SignUpFormData) => {
      const { email, password, confirmPassword, firstName, lastName, terms } = data

      const registerData: RegisterRequest = {
        email,
        password,
        confirmPassword,
        firstname: firstName,
        lastname: lastName,
        isTermsSign: terms,
      }
      registerMutation.mutate({ data: registerData })
    },
    [registerMutation],
  )

  return (
    <>
      <title>
        {t('auth.register.title_page')} - {themeConfig.templateName}
      </title>
      <meta
        name='description'
        content={`${t('auth.register.meta_desc')} - ${themeConfig.templateName}`}
      />
      <meta
        name='keywords'
        content={`sign up, register, authentication, ${themeConfig.templateName}`}
      />
      <Box sx={{ display: 'flex', minHeight: '100vh', overflow: 'hidden' }}>
        <Backdrop
          open={registerMutation.isPending}
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <CircularProgress color='inherit' />
        </Backdrop>

        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          open={status.open}
          autoHideDuration={6000}
          onClose={handleCloseStatus}
        >
          <MAlert onClose={handleCloseStatus} severity={status.type} sx={{ width: '100%' }}>
            {status.msg}
          </MAlert>
        </Snackbar>
        <Box
          sx={{
            display: 'flex',
            height: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {/* <Box
            sx={{
              display: { xs: 'none', lg: 'flex' },
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              width: { lg: 450, md: 380 },
              position: 'relative',
              p: 6,
              ...(themeConfig.skin === 'bordered' && {
                borderInlineEnd: '1px solid',
                borderColor: 'divider',
              }),
            }}
          >
            <RegisterIllustration
              src='/images/illustrations/characters/7.png'
              alt='character-illustration'
              sx={{ transform: theme.direction === 'rtl' ? 'scaleX(-1)' : 'unset' }}
            />
            {!isSmallScreen && (
              <MaskImg
                alt='mask'
                src={authBackground}
                sx={{ transform: theme.direction === 'rtl' ? 'scaleX(-1)' : 'unset' }}
              />
            )}
          </Box> */}
          <IllustrationWrapper>
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                maxWidth: 600,
                height: 'auto',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <Box
                sx={{
                  // bgcolor: alpha(theme.palette.primary.main, 0.1),
                  borderRadius: '50%',
                  p: 6,
                  mb: 4,
                }}
              >
                <AdaptiveLogo width={120} height={120} />
              </Box>
              <Typography variant='h3' fontWeight='bold' textAlign='center' color='primary.main'>
                {themeConfig.templateName}
              </Typography>
              <Typography variant='h6' textAlign='center' color='text.secondary'>
                Your gateway to seamless management
              </Typography>
            </Box>
          </IllustrationWrapper>

          <Box
            sx={{
              display: 'flex',
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              bgcolor: 'background.paper',
            }}
          >
            <Box sx={{ position: 'absolute', top: { xs: 20, sm: 33 }, left: { xs: 24, sm: 38 } }}>
              <Logo />
            </Box>
            <StepperWrapper
              as='form'
              onSubmit={controlForm.handleSubmit(onSubmit)}
              sx={{ p: { xs: 6, sm: 8 }, maxWidth: '46.25rem', mt: { xs: 11, sm: 14, lg: 0 } }}
            >
              <Stepper
                activeStep={activeStep}
                connector={
                  !isSmallScreen ? (
                    <DirectionalIcon
                      ltrIconClass='tabler-chevron-right'
                      rtlIconClass='tabler-chevron-left'
                      style={{ fontSize: '1.25rem' }}
                    />
                  ) : null
                }
                sx={{ mb: { xs: 6, md: 12 } }}
              >
                {steps.map((step, index) => {
                  return (
                    <Step key={index}>
                      <StepLabel>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                          <CustomAvatar
                            variant='rounded'
                            skin={activeStep === index ? 'filled' : 'light'}
                            {...(activeStep >= index && { color: 'primary' })}
                            sx={{
                              ...(activeStep === index && { boxShadow: 3 }),
                            }}
                            size={38}
                          >
                            <step.icon sx={{ fontSize: 22 }} />
                          </CustomAvatar>
                          <div>
                            <Typography
                              variant='h6'
                              sx={{
                                color: activeStep > index ? 'text.disabled' : 'text.primary',
                                fontWeight: 500,
                              }}
                            >
                              {step.title}
                            </Typography>
                            <Typography
                              variant='caption'
                              sx={{
                                color: activeStep > index ? 'text.disabled' : 'text.secondary',
                              }}
                            >
                              {step.subtitle}
                            </Typography>
                          </div>
                        </Box>
                      </StepLabel>
                    </Step>
                  )
                })}
              </Stepper>
              {getStepContent(
                activeStep,
                handleNext,
                handlePrev,
                controlForm.control,
                controlForm.formState.errors,
              )}
            </StepperWrapper>
          </Box>
        </Box>
      </Box>
    </>
  )
}
