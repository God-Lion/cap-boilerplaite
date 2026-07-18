/**
 * Secure Encryption Utility using Web Crypto API (Standard 2025)
 *
 * NOTE: The current AES-GCM implementation for `localStorage` acts as obfuscation rather
 * than a strict security boundary. Since the Vite master key (VITE_STORAGE_ENCRYPTION_KEY)
 * is compiled and shipped in the client bundle, any client-side decryption key can be
 * recovered by an attacker. Real security boundaries must be enforced on the backend.
 *
 * No Base64, atob, or btoa is used to avoid encoding/security pitfalls.
 * Strictly uses Hex encoding for string representation.
 */

const ENCRYPTION_ALGORITHM = 'AES-GCM'
const KEY_LENGTH = 256
const IV_LENGTH = 12 // 96 bits for AES-GCM

/**
 * Generate a cryptographic key from a password using PBKDF2
 */
async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder()
  const passwordBuffer = encoder.encode(password)

  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey'],
  )

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as any,
      iterations: 200000, // Increased to 200k for 2025 standards
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: ENCRYPTION_ALGORITHM, length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt'],
  )
}

/**
 * Convert Uint8Array to Hex string
 */
export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * Convert Hex string to Uint8Array
 */
export function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16)
  }
  return bytes
}

/**
 * Hash data using SHA-256
 */
export async function hashData(data: string): Promise<string> {
  const encoder = new TextEncoder()
  const dataBuffer = encoder.encode(data)
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', dataBuffer as any)
  return bytesToHex(new Uint8Array(hashBuffer))
}

/**
 * Encrypt data using AES-GCM
 * @param data - The data to encrypt (string)
 * @param password - The encryption password
 * @returns Hex-encoded encrypted data with salt and IV
 */
export async function encryptData(data: string, password: string): Promise<string> {
  try {
    const salt = window.crypto.getRandomValues(new Uint8Array(16))
    const iv = window.crypto.getRandomValues(new Uint8Array(IV_LENGTH))
    const key = await deriveKey(password, salt)

    const encoder = new TextEncoder()
    const dataBuffer = encoder.encode(data)

    const encryptedBuffer = await window.crypto.subtle.encrypt(
      {
        name: ENCRYPTION_ALGORITHM,
        iv: iv,
      },
      key,
      dataBuffer as any,
    )

    const encryptedArray = new Uint8Array(encryptedBuffer)
    const combined = new Uint8Array(salt.length + iv.length + encryptedArray.length)
    combined.set(salt, 0)
    combined.set(iv, salt.length)
    combined.set(encryptedArray, salt.length + iv.length)

    return bytesToHex(combined)
  } catch (error) {
    console.error('Encryption error:', error)
    throw new Error('Failed to encrypt data')
  }
}

/**
 * Decrypt data using AES-GCM
 */
export async function decryptData(encryptedDataHex: string, password: string): Promise<string> {
  try {
    const combined = hexToBytes(encryptedDataHex)
    const salt = combined.slice(0, 16)
    const iv = combined.slice(16, 16 + IV_LENGTH)
    const encryptedBuffer = combined.slice(16 + IV_LENGTH)

    const key = await deriveKey(password, salt)

    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: ENCRYPTION_ALGORITHM,
        iv: iv,
      },
      key,
      encryptedBuffer as any,
    )

    const decoder = new TextDecoder()
    return decoder.decode(decryptedBuffer)
  } catch (error) {
    console.error('Decryption error:', error)
    throw new Error('Failed to decrypt data')
  }
}

/**
 * Generate a random encryption password
 */
export function generateEncryptionPassword(): string {
  const array = new Uint8Array(32)
  window.crypto.getRandomValues(array)
  return bytesToHex(array)
}

/**
 * Check if Web Crypto API is available
 */
export function isWebCryptoAvailable(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.crypto &&
    window.crypto.subtle &&
    typeof window.crypto.subtle.encrypt === 'function'
  )
}

export default {
  encryptData,
  decryptData,
  generateEncryptionPassword,
  hashData,
  isWebCryptoAvailable,
  bytesToHex,
  hexToBytes,
}
