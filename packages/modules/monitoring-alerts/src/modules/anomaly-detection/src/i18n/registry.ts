/**
 * I18n Registry for Monitoring Alerts Module
 * 
 * Re-exports the canonical implementation from @cap/platform-core.
 * All modules should use this pattern for consistency.
 */

export {
  registerDictionary,
  getMergedDictionary,
  getAvailableLocales,
  type DictionaryMap
} from '@cap/platform-core/i18n/registry'

export { i18n, type Locale } from '@cap/platform-core/i18n/i18n'
