type Locale = 'en' | 'ar' | 'fr'
type DictionaryMap = Record<Locale, Record<string, unknown>>

const _modules: DictionaryMap[] = []

export function registerDictionary(dict: DictionaryMap): void {
  _modules.push(dict)
}

export function getMergedDictionary(locale: Locale): Record<string, unknown> {
  return _modules.reduce((acc, mod) => deepMerge(acc, mod[locale] ?? {}), {})
}

export function getAvailableLocales(): Locale[] {
  return ['en', 'ar', 'fr']
}

export function getRegisteredCount(): number {
  return _modules.length
}

function deepMerge(
  target: Record<string, unknown>,
  source: Record<string, unknown>,
): Record<string, unknown> {
  const result: Record<string, unknown> = { ...target }
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const val = source[key]
      if (
        val &&
        typeof val === 'object' &&
        !Array.isArray(val) &&
        !isDate(val)
      ) {
        result[key] = deepMerge(
          (result[key] as Record<string, unknown>) ?? {},
          val as Record<string, unknown>,
        )
      } else {
        result[key] = val
      }
    }
  }
  return result
}

function isDate(value: unknown): boolean {
  return value instanceof Date || 
    (typeof value === 'object' && 
     value !== null && 
     Object.prototype.toString.call(value) === '[object Date]')
}

export function clearRegistries(): void {
  _modules.length = 0
}
