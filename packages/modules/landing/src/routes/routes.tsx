import { RouteObject } from 'react-router-dom'
import FeatureComparison from '../screens/FeatureComparison'
import PrivacyPolicy from '../screens/PrivacyPolicy'
import TermsOfService from '../screens/TermsOfService'
import ContactUs from '../screens/ContactUs'
import AboutUs from '../screens/AboutUs'
import Pricing from '../screens/Pricing'
import Home from '../screens/Home'

export const landingRoutes: RouteObject[] = [
  { path: '/', element: <Home /> },
  { path: '/features', element: <FeatureComparison /> },
  { path: '/privacy-policy', element: <PrivacyPolicy /> },
  { path: '/terms-of-service', element: <TermsOfService /> },
  { path: '/contact', element: <ContactUs /> },
  { path: '/about', element: <AboutUs /> },
  { path: '/pricing', element: <Pricing /> },
]

export default landingRoutes

