/**
 * I18n Registry for Admin Module
 * 
 * Re-exports only the i18n functions needed by this module.
 * Do not re-export all of @cap/platform-core.
 */

export { 
  registerDictionary, 
  getMergedDictionary,
  getAvailableLocales,
  type DictionaryMap
} from '@cap/platform-core/i18n/registry'

export { i18n, type Locale } from '@cap/platform-core/i18n/i18n'
