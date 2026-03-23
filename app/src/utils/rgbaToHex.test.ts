import { describe, it, expect } from 'vitest'
import { rgbaToHex } from './rgbaToHex'

describe('rgbaToHex — slash format (e.g. CSS color-mix output)', () => {
  it('converts "255 0 0 / 1" to full-opacity red', () => {
    expect(rgbaToHex('255 0 0 / 1')).toBe('#ff0000ff')
  })

  it('converts "0 128 0 / 0.5" to 50% green', () => {
    const result = rgbaToHex('0 128 0 / 0.5')
    expect(result).toBe('#00800080')
  })

  it('strips alpha when forceRemoveAlpha=true', () => {
    expect(rgbaToHex('255 0 0 / 1', true)).toBe('#ff0000')
  })

  it('returns original string when format does not match slash pattern', () => {
    const bad = '255 0 0 / bad'
    expect(rgbaToHex(bad)).toBe(bad)
  })

  it('handles "0 0 0 / 0" (fully transparent black)', () => {
    expect(rgbaToHex('0 0 0 / 0')).toBe('#00000000')
  })
})

describe('rgbaToHex — comma format (standard rgba())', () => {
  it('converts rgba(255,0,0,1) to opaque red', () => {
    expect(rgbaToHex('rgba(255, 0, 0, 1)')).toBe('#ff0000ff')
  })

  it('converts rgb(0,0,255) to blue (no alpha channel)', () => {
    // alpha index 3 doesn't exist, map returns NaN → '0' padded to '00'
    // For rgb strings, forceRemoveAlpha=true avoids the NaN alpha byte
    expect(rgbaToHex('rgb(0, 0, 255)', true)).toBe('#0000ff')
  })

  it('strips alpha from rgba when forceRemoveAlpha=true', () => {
    expect(rgbaToHex('rgba(10, 20, 30, 0.5)', true)).toBe('#0a141e')
  })

  it('converts rgba(0,0,0,0) to transparent black', () => {
    expect(rgbaToHex('rgba(0, 0, 0, 0)')).toBe('#00000000')
  })

  it('converts rgba(255,255,255,1) to white', () => {
    expect(rgbaToHex('rgba(255, 255, 255, 1)')).toBe('#ffffffff')
  })

  it('pads single-digit hex values correctly', () => {
    // r=1, g=2, b=3 should produce #010203, not #123
    expect(rgbaToHex('rgba(1, 2, 3, 1)', true)).toBe('#010203')
  })
})
