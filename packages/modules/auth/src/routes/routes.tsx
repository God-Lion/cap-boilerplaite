import { RouteObject } from 'react-router-dom'
import SignIn from '../screens/SignIn'
import SignUp from '../screens/SignUp'
import SignInV2 from '../screens/SignInSide'
import SignOut from '../screens/SignOut'
import ForgetPassword from '../screens/ForgetPassword'
import VerificationEmail from '../screens/VerificationEmail'
import EmailVerification from '../screens/EmailVerification'
import AccountVerification from '../screens/AccountVerification'
import OtpVerification from '../screens/OtpVerification'
import SetNewPassword from '../screens/SetNewPassword'
import ResetPassword from '../screens/ResetPassword'

export const authRoutes: RouteObject[] = [
  { path: 'signin', element: <SignIn /> },
  { path: 'signup', element: <SignUp /> },
  { path: 'signin2', element: <SignInV2 /> },
  { path: 'signout', element: <SignOut /> },
  { path: 'forgetpassword', element: <ForgetPassword /> },
  { path: 'verification-email', element: <EmailVerification /> },
  { path: 'account-verification', element: <AccountVerification /> },
  { path: 'otp-verification', element: <OtpVerification /> },
  { path: 'set-new-password', element: <SetNewPassword /> },
  { path: 'verification/email', element: <VerificationEmail /> },
  { path: 'verification/email/:email', element: <VerificationEmail /> },
  { path: 'reset-password', element: <ResetPassword /> },
  { path: 'reset-password/:email', element: <ResetPassword /> },
]

export default authRoutes

