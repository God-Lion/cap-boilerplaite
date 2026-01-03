import React from 'react'
import { Routes, Route, RoutesProps } from 'react-router-dom'
import { AuthRouteConfig } from '@cap/platform-core/src/assembly'
import SignInV1 from '../screens/signin/SignInV1'
import SignInV2 from '../screens/signin/SignInV2'
import OneAuthSignIn from '../screens/signin/OneAuthSignIn'
import SignUp from '../screens/signup/SignUp'
import SignUpV1 from '../screens/signup/SignUpV1'
import SignUpV2 from '../screens/signup/SignUpV2'
import SignUpV3 from '../screens/signup/SignUpV3'

import SignOut from '../screens/SignOut'
import ForgetPassword from '../screens/ForgetPassword'
import EmailVerification from '../screens/EmailVerification/EmailVerification'
import AccountVerification from '../screens/AccountVerification'
import OtpVerification from '../screens/OtpVerification'
import SetNewPassword from '../screens/SetNewPassword'
import VerificationEmail from '../screens/EmailVerification/VerificationEmail'
import ResetPassword from '../screens/ResetPassword'
import PasskeyRegistration from '../screens/PasskeyRegistration'
import SocialCallback from '../screens/SocialCallback'

export const authRouteConfig: Array<AuthRouteConfig> = [
  { path: '/auth/sign-in', element: <SignInV1 />, layout: 'noLayout' },
  { path: '/auth/sign-in-v2', element: <SignInV2 />, layout: 'noLayout' },
  { path: '/auth/one-auth', element: <OneAuthSignIn />, layout: 'noLayout' },

  { path: '/auth/sign-up', element: <SignUp />, layout: 'noLayout' },
  { path: '/auth/sign-up-v1', element: <SignUpV1 />, layout: 'noLayout' },
  { path: '/auth/sign-up-v2', element: <SignUpV2 />, layout: 'noLayout' },
  { path: '/auth/sign-up-v3', element: <SignUpV3 />, layout: 'noLayout' },

  { path: '/auth/verify/:email', element: <VerificationEmail />, layout: 'noLayout' },

  { path: '/auth/verification/email-sent', element: <EmailVerification />, layout: 'noLayout' },

  { path: '/auth/verification/account', element: <AccountVerification />, layout: 'noLayout' },

  { path: '/auth/sign-out', element: <SignOut /> },
  { path: '/auth/forgot-password', element: <ForgetPassword /> },
  { path: '/auth/verification/otp', element: <OtpVerification />, layout: 'noLayout' },
  { path: '/auth/set-new-password', element: <SetNewPassword />, layout: 'noLayout' },
  { path: '/auth/reset-password', element: <ResetPassword />, layout: 'noLayout' },
  { path: '/auth/reset-password/:email', element: <ResetPassword /> },
  { path: '/auth/passkey-register', element: <PasskeyRegistration />, layout: 'noLayout' },
  { path: '/auth/callback', element: <SocialCallback />, layout: 'noLayout' },
]

export const authRoutes: React.FC<RoutesProps> = ({ location }) => {
  return (
    <Routes location={location}>
      {authRouteConfig.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}
    </Routes>
  )
}
