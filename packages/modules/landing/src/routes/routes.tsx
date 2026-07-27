import React from 'react'
import { Route, type RoutesProps } from 'react-router-dom'
import { AuthRouteConfig } from '@cap/platform-core'
import FeatureComparison from '../screens/FeatureComparison'
import PrivacyPolicy from '../screens/PrivacyPolicy'
import TermsOfService from '../screens/TermsOfService'
import ContactUs from '../screens/ContactUs'
import AboutUs from '../screens/AboutUs'
import Pricing from '../screens/Pricing'
import Home from '../screens/Home'
import ChronosMycelium from '../screens/ChronosMycelium'

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
