import { describe, it, expect } from 'vitest'
import { isMatch, isPropertyDefined, converTimestampToDate } from './Functions'

// getDepartements() reads a large static zone dataset — tested separately via integration
// because it depends on the imported zone.ts data file

describe('isMatch', () => {
  it('returns false when member is undefined', () => {
    expect(isMatch(undefined as any, [{ property: 'name', value: 'Alice' }])).toBe(false)
  })

  it('returns false when query is undefined', () => {
    expect(isMatch({ name: 'Alice' }, undefined as any)).toBe(false)
  })

  it('returns false when query is an empty array', () => {
    expect(isMatch({ name: 'Alice' }, [])).toBe(false)
  })

  it('returns true when property starts with query value (case-insensitive)', () => {
    expect(isMatch({ name: 'Alice' }, [{ property: 'name', value: 'ali' }])).toBe(true)
  })

  it('returns true when property exactly equals query value', () => {
    expect(isMatch({ city: 'Paris' }, [{ property: 'city', value: 'Paris' }])).toBe(true)
  })

  it('returns false when property does not start with query value', () => {
    // 'indexOf' style — it checks match.index === 0 (starts with), not includes
    expect(isMatch({ name: 'Alice' }, [{ property: 'name', value: 'lice' }])).toBe(false)
  })

  it('returns false when no property matches', () => {
    expect(isMatch({ name: 'Alice' }, [{ property: 'name', value: 'Bob' }])).toBe(false)
  })

  it('returns true when at least one query item matches (OR semantics)', () => {
    expect(
      isMatch({ name: 'Alice' }, [
        { property: 'name', value: 'Bob' },
        { property: 'name', value: 'Ali' },
      ]),
    ).toBe(true)
  })

  it('is case-insensitive for both member value and query', () => {
    expect(isMatch({ name: 'ALICE' }, [{ property: 'name', value: 'ali' }])).toBe(true)
  })
})

describe('isPropertyDefined', () => {
  it('returns true when property exists on object', () => {
    expect(isPropertyDefined({ name: 'Alice', age: 30 }, 'name')).toBe(true)
  })

  it('returns true for a property whose value is undefined', () => {
    const obj = { key: undefined }
    expect(isPropertyDefined(obj, 'key')).toBe(true)
  })

  it('returns false when property does not exist', () => {
    expect(isPropertyDefined({ name: 'Alice' }, 'email')).toBe(false)
  })

  it('returns false on an empty object', () => {
    expect(isPropertyDefined({}, 'anything')).toBe(false)
  })

  it('returns true for numeric property names', () => {
    const obj = { 0: 'zero' }
    expect(isPropertyDefined(obj, '0')).toBe(true)
  })
})

describe('converTimestampToDate', () => {
  it('converts a unix-seconds timestamp to a JS Date', () => {
    const ts = { seconds: 0 }
    expect(converTimestampToDate(ts)).toEqual(new Date(0))
  })

  it('converts a known epoch to the correct date', () => {
    // 2024-01-01T00:00:00Z = 1704067200 seconds
    const ts = { seconds: 1704067200 }
    const result = converTimestampToDate(ts)
    expect(result.toISOString()).toBe('2024-01-01T00:00:00.000Z')
  })

  it('returns a Date instance', () => {
    expect(converTimestampToDate({ seconds: 1000 })).toBeInstanceOf(Date)
  })

  it('handles fractional seconds (truncates sub-second precision)', () => {
    // seconds * 1000 means only seconds-level precision
    const ts = { seconds: 1000 }
    expect(converTimestampToDate(ts).getTime()).toBe(1_000_000)
  })
})
