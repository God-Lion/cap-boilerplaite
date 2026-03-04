import { describe, it, expect } from 'vitest'
import Filters from '../Filters'
import type { ITableData } from '../../components/table/types'

// ─── Fixture ─────────────────────────────────────────────────────────────────

const makeTable = (rows: ITableData['rows']): ITableData => ({
  header: [
    { key: 'firstname', label: 'First Name' },
    { key: 'phone', label: 'Phone' },
  ],
  rows,
})

const sampleRows: ITableData['rows'] = [
  { id: 1, firstname: 'Alice', phone: '0600000001' },
  { id: 2, firstname: 'Bob', phone: '0600000002' },
  { id: 3, firstname: 'Charlie', phone: '0700000003' },
]

// ─── Filters.search — string query ───────────────────────────────────────────

describe('Filters.search — string query', () => {
  it('returns all rows when query is empty string', () => {
    const table = makeTable(sampleRows)
    expect(Filters.search(table, '').rows).toHaveLength(3)
  })

  it('returns all rows when query is only whitespace', () => {
    const table = makeTable(sampleRows)
    expect(Filters.search(table, '   ').rows).toHaveLength(3)
  })

  it('filters rows by a partial string match (case-insensitive)', () => {
    const table = makeTable(sampleRows)
    const result = Filters.search(table, 'ali')
    expect(result.rows).toHaveLength(1)
    expect(result.rows[0].firstname).toBe('Alice')
  })

  it('matches across all string columns', () => {
    const table = makeTable(sampleRows)
    const result = Filters.search(table, '070')
    expect(result.rows).toHaveLength(1)
    expect(result.rows[0].firstname).toBe('Charlie')
  })

  it('returns empty rows when no row matches', () => {
    const table = makeTable(sampleRows)
    expect(Filters.search(table, 'xyz').rows).toHaveLength(0)
  })

  it('preserves the header in the result', () => {
    const table = makeTable(sampleRows)
    const result = Filters.search(table, 'bob')
    expect(result.header).toEqual(table.header)
  })

  it('returns data unchanged when rows is not an array', () => {
    const table = { header: [], rows: null as any }
    expect(Filters.search(table, 'test')).toStrictEqual(table)
  })
})

// ─── Filters.search — object query (IQuery) ──────────────────────────────────

describe('Filters.search — object query (IQuery)', () => {
  it('returns data unchanged when query.value is undefined', () => {
    const table = makeTable(sampleRows)
    const result = Filters.search(table, { value: undefined as any, columns: ['firstname'] })
    expect(result.rows).toHaveLength(3)
  })

  it('returns data unchanged when query.value is blank', () => {
    const table = makeTable(sampleRows)
    const result = Filters.search(table, { value: '  ', columns: ['firstname'] })
    expect(result.rows).toHaveLength(3)
  })

  it('filters only the specified columns', () => {
    const table = makeTable(sampleRows)
    // "060" appears in phone but not firstname
    const result = Filters.search(table, { value: '060', columns: ['phone'] })
    expect(result.rows).toHaveLength(2) // Alice + Bob
  })

  it('is case-insensitive for object queries', () => {
    const table = makeTable(sampleRows)
    const result = Filters.search(table, { value: 'ALICE', columns: ['firstname'] })
    expect(result.rows).toHaveLength(1)
    expect(result.rows[0].firstname).toBe('Alice')
  })

  it('returns empty rows when no column matches', () => {
    const table = makeTable(sampleRows)
    const result = Filters.search(table, { value: 'zzz', columns: ['firstname'] })
    expect(result.rows).toHaveLength(0)
  })
})
