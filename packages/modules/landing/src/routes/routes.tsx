import React from 'react'
import { Route, type RoutesProps } from 'react-router-dom'
import type { AuthRouteConfig } from '@cap/platform-core'

const Home = React.lazy(() => import('../screens/Home'))
const ChronosMycelium = React.lazy(() => import('../screens/ChronosMycelium'))
const FeatureComparison = React.lazy(() => import('../screens/FeatureComparison'))
const PrivacyPolicy = React.lazy(() => import('../screens/PrivacyPolicy'))
const TermsOfService = React.lazy(() => import('../screens/TermsOfService'))
const ContactUs = React.lazy(() => import('../screens/ContactUs'))
const AboutUs = React.lazy(() => import('../screens/AboutUs'))
const Pricing = React.lazy(() => import('../screens/Pricing'))

export const landingRouteConfig: AuthRouteConfig[] = [
  { path: '/', element: <Home /> },
  { path: '/chronos-mycelium', element: <ChronosMycelium /> },
  { path: '/features', element: <FeatureComparison /> },
  { path: '/privacy-policy', element: <PrivacyPolicy /> },
  { path: '/terms-of-service', element: <TermsOfService /> },
  { path: '/contact', element: <ContactUs /> },
  { path: '/about', element: <AboutUs /> },
  { path: '/pricing', element: <Pricing /> },
]

// Returns Route elements only - assembleApp wraps in <Routes> for proper React Router matching
export const landingRoutes: React.FC<RoutesProps> = () => (
  <>
    {landingRouteConfig.map((route) => (
      <Route key={route.path} path={route.path} element={route.element} />
    ))}
  </>
)

export default landingRoutes
