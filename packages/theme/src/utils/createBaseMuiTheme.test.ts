import { describe, it, expect } from 'vitest'
import { createBaseMuiTheme } from '../createBaseMuiTheme'
import type { SystemMode, Direction } from '@cap/shared-types'

describe('createBaseMuiTheme', () => {
  describe('basic theme creation', () => {
    it('should create a light theme', () => {
      const theme = createBaseMuiTheme({
        mode: 'light' as SystemMode,
        direction: 'ltr' as Direction,
        primaryColor: '#1976d2',
        secondaryColor: '#dc004e',
      })

      expect(theme.palette.mode).toBe('light')
      expect(theme.direction).toBe('ltr')
    })

    it('should create a dark theme', () => {
      const theme = createBaseMuiTheme({
        mode: 'dark' as SystemMode,
        direction: 'ltr' as Direction,
        primaryColor: '#1976d2',
        secondaryColor: '#dc004e',
      })

      expect(theme.palette.mode).toBe('dark')
    })

    it('should apply primary color', () => {
      const theme = createBaseMuiTheme({
        mode: 'light' as SystemMode,
        direction: 'ltr' as Direction,
        primaryColor: '#ff5722',
        secondaryColor: '#dc004e',
      })

      expect(theme.palette.primary.main).toBe('#ff5722')
    })

    it('should apply secondary color', () => {
      const theme = createBaseMuiTheme({
        mode: 'light' as SystemMode,
        direction: 'ltr' as Direction,
        primaryColor: '#1976d2',
        secondaryColor: '#ff5722',
      })

      expect(theme.palette.secondary.main).toBe('#ff5722')
    })

    it('should set RTL direction', () => {
      const theme = createBaseMuiTheme({
        mode: 'light' as SystemMode,
        direction: 'rtl' as Direction,
        primaryColor: '#1976d2',
        secondaryColor: '#dc004e',
      })

      expect(theme.direction).toBe('rtl')
    })
  })

  describe('typography', () => {
    it('should include default typography', () => {
      const theme = createBaseMuiTheme({
        mode: 'light' as SystemMode,
        direction: 'ltr' as Direction,
        primaryColor: '#1976d2',
        secondaryColor: '#dc004e',
      })

      expect(theme.typography).toBeDefined()
      expect(theme.typography.fontFamily).toBeDefined()
    })
  })

  describe('shape', () => {
    it('should include shape configuration', () => {
      const theme = createBaseMuiTheme({
        mode: 'light' as SystemMode,
        direction: 'ltr' as Direction,
        primaryColor: '#1976d2',
        secondaryColor: '#dc004e',
      })

      expect(theme.shape).toBeDefined()
      expect(theme.shape.borderRadius).toBeDefined()
    })
  })

  describe('shadows', () => {
    it('should include shadows', () => {
      const theme = createBaseMuiTheme({
        mode: 'light' as SystemMode,
        direction: 'ltr' as Direction,
        primaryColor: '#1976d2',
        secondaryColor: '#dc004e',
      })

      expect(theme.shadows).toBeDefined()
      expect(Array.isArray(theme.shadows)).toBe(true)
      expect(theme.shadows.length).toBeGreaterThan(0)
    })
  })
})
