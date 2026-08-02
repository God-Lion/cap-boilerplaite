/**
 * Common Module Exports
 *
 * Central export point for all common module components
 */

// Routes
export {
  default as CommonRoutes,
  landingRoutes,
  LandingRoutes,
  landingRouteConfig,
  LandingPath,
  LandingPath as Path,
} from './routes'

// Screens
export { default as FeatureComparison } from './screens/FeatureComparison'
export { default as ContactUs } from './screens/ContactUs'
export { default as PrivacyPolicy } from './screens/PrivacyPolicy'
export { default as TermsOfService } from './screens/TermsOfService'
export { default as AboutUs } from './screens/AboutUs'
export { default as Pricing } from './screens/Pricing'
export { default as ChronosMycelium } from './screens/ChronosMycelium'

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

// I18n Registry & Dictionaries
export {
  landingDictionaries,
  registerDictionary,
  getMergedDictionary,
  getAvailableLocales,
  i18n,
  type Locale,
} from './i18n/registry'

import type { CAPModule } from '@cap/shared-types';
import { landingRouteConfig } from './routes/routes';
import { landingDictionaries } from './i18n/registry';

export const LandingModule: CAPModule = {
  id: 'landing-module',
  version: '1.0.0',
  routes: landingRouteConfig,
  i18n: landingDictionaries,
}
