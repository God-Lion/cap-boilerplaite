/**
 * Common Module Exports
 *
 * Central export point for all common module components
 */

// Routes
export { default as CommonRoutes } from './routes/routes'

// Screens
export { default as FeatureComparison } from './screens/FeatureComparison'
export { default as ContactUs } from './screens/ContactUs'
export { default as PrivacyPolicy } from './screens/PrivacyPolicy'
export { default as TermsOfService } from './screens/TermsOfService'
export { default as AboutUs } from './screens/AboutUs'
export { default as Pricing } from './screens/Pricing'

// Context - Workflow Pipeline
export {
  WorkflowProvider,
  useWorkflow,
  WORKFLOW_STEPS,
  type UserProfile,
  type RecommendedRole,
  type RawJob,
  type NormalizedJob,
  type RankedJob,
  type Application,
  type WorkflowStep,
  type WorkflowState,
} from './context'

import { CAPModule } from '@cap/platform-core'
import { landingRoutes } from './routes/routes'

export const LandingModule: CAPModule = {
  id: 'landing-module',
  version: '1.0.0',
  routes: landingRoutes,
}
