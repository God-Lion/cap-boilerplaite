import React from 'react'
import { Routes, Route, type RoutesProps } from 'react-router-dom'
import FeatureComparison from '../screens/FeatureComparison'
import PrivacyPolicy from '../screens/PrivacyPolicy'
import TermsOfService from '../screens/TermsOfService'
import ContactUs from '../screens/ContactUs'
import AboutUs from '../screens/AboutUs'
import Pricing from '../screens/Pricing'
import Home from '../screens/Home'

export const landingRoutes: React.FC<RoutesProps> = ({ location }) => {
  return (
    <Routes location={location}>
      <Route path='/' element={<Home />} />
      <Route path='/features' element={<FeatureComparison />} />
      <Route path='/privacy-policy' element={<PrivacyPolicy />} />
      <Route path='/terms-of-service' element={<TermsOfService />} />
      <Route path='/contact' element={<ContactUs />} />
      <Route path='/about' element={<AboutUs />} />
      <Route path='/pricing' element={<Pricing />} />
      <Route path='*' element={null} />
    </Routes>
  )
}

export default landingRoutes
