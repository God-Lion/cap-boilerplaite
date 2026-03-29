import { describe, it, expect } from 'vitest'
import { Path as AuthPath } from '@cap/module-auth'
import { Path } from './path'

describe('AdminPath', () => {
  describe('basic path structure', () => {
    it('should extend AuthPath', () => {
      expect(Path.Root).toBeDefined()
      expect(Path.Dashboard).toBeDefined()
    })

    it('should have admin namespace', () => {
      expect(Path.admin).toBeDefined()
      expect(Path.admin.root).toBeDefined()
    })

    it('should have monitoring namespace', () => {
      expect(Path.monitoring).toBeDefined()
    })

    it('should have identity namespace', () => {
      expect(Path.identity).toBeDefined()
    })

    it('should have apiTokens namespace', () => {
      expect(Path.apiTokens).toBeDefined()
    })
  })

  describe('dashboard path', () => {
    it('should have dashboard path defined', () => {
      expect(Path.Dashboard).toBe('/admin/dashboard')
    })
  })

  describe('admin routes', () => {
    it('should include user management paths', () => {
      expect(Path.admin.users).toBeDefined()
      expect(typeof Path.admin.users).toBe('string')
    })

    it('should include organization paths', () => {
      expect(Path.admin.organizations).toBeDefined()
      expect(typeof Path.admin.organizations).toBe('string')
    })

    it('should include api tokens path', () => {
      expect(Path.admin.apiTokens).toBeDefined()
    })
  })

  describe('apiTokens paths', () => {
    it('should have dashboard path', () => {
      expect(Path.apiTokens.dashboard).toBeDefined()
    })
  })
})
