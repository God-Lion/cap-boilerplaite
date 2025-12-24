/**
 * Secure Encryption Utility using Web Crypto API
 * 
 * This provides real cryptographic security for sensitive data.
 * Use this for production environments when handling tokens, passwords, or PII.
 * 
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto
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

  // Import the password as a key
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  )

  // Derive a key using PBKDF2
  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as any,
      iterations: 100000, // High iteration count for security
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: ENCRYPTION_ALGORITHM, length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  )
}

/**
 * Encrypt data using AES-GCM
 * @param data - The data to encrypt (string)
 * @param password - The encryption password
 * @returns Base64-encoded encrypted data with salt and IV
 */
export async function encryptData(data: string, password: string): Promise<string> {
  try {
    // Generate random salt and IV
    const salt = window.crypto.getRandomValues(new Uint8Array(16))
    const iv = window.crypto.getRandomValues(new Uint8Array(IV_LENGTH))

    // Derive encryption key
    const key = await deriveKey(password, salt)

    // Encode the data
    const encoder = new TextEncoder()
    const dataBuffer = encoder.encode(data)

    // Encrypt the data
    const encryptedBuffer = await window.crypto.subtle.encrypt(
      {
        name: ENCRYPTION_ALGORITHM,
        iv: iv,
      },
      key,
      dataBuffer as any
    )

    // Combine salt + iv + encrypted data
    const encryptedArray = new Uint8Array(encryptedBuffer)
    const combined = new Uint8Array(salt.length + iv.length + encryptedArray.length)
    combined.set(salt, 0)
    combined.set(iv, salt.length)
    combined.set(encryptedArray, salt.length + iv.length)

    // Convert to base64 for storage
    return arrayBufferToBase64(combined)
  } catch (error) {
    console.error('Encryption error:', error)
    throw new Error('Failed to encrypt data')
  }
}

/**
 * Decrypt data using AES-GCM
 * @param encryptedData - Base64-encoded encrypted data
 * @param password - The decryption password
 * @returns Decrypted data as string
 */
export async function decryptData(encryptedData: string, password: string): Promise<string> {
  try {
    // Decode from base64
    const combined = base64ToArrayBuffer(encryptedData)

    // Extract salt, IV, and encrypted data
    const salt = combined.slice(0, 16)
    const iv = combined.slice(16, 16 + IV_LENGTH)
    const encryptedBuffer = combined.slice(16 + IV_LENGTH)

    // Derive decryption key
    const key = await deriveKey(password, salt)

    // Decrypt the data
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: ENCRYPTION_ALGORITHM,
        iv: iv,
      },
      key,
      encryptedBuffer as any
    )

    // Decode the decrypted data
    const decoder = new TextDecoder()
    return decoder.decode(decryptedBuffer)
  } catch (error) {
    console.error('Decryption error:', error)
    throw new Error('Failed to decrypt data')
  }
}

/**
 * Generate a random encryption password
 * Use this to create a secure app-level encryption key
 */
export function generateEncryptionPassword(): string {
  const array = new Uint8Array(32)
  window.crypto.getRandomValues(array)
  return arrayBufferToBase64(array)
}

/**
 * Convert ArrayBuffer to Base64 string
 */
function arrayBufferToBase64(buffer: Uint8Array): string {
  let binary = ''
  const len = buffer.byteLength
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(buffer[i])
  }
  return btoa(binary)
}

/**
 * Convert Base64 string to Uint8Array
 */
function base64ToArrayBuffer(base64: string): Uint8Array {
  const binary = atob(base64)
  const len = binary.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

/**
 * Hash data using SHA-256
 * Useful for creating fingerprints or checksums
 */
export async function hashData(data: string): Promise<string> {
  const encoder = new TextEncoder()
  const dataBuffer = encoder.encode(data)
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', dataBuffer as any)
  return arrayBufferToBase64(new Uint8Array(hashBuffer))
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

/**
 * Secure Token Storage using Web Crypto API
 * 
 * USAGE EXAMPLE:
 * 
 * // Initialize (do this once when app starts)
 * const encryptionKey = generateEncryptionPassword();
 * // Store this key securely (e.g., in memory, not localStorage)
 * 
 * // Encrypt before storing
 * const token = "my-secure-token";
 * const encrypted = await encryptData(token, encryptionKey);
 * localStorage.setItem('secure_token', encrypted);
 * 
 * // Decrypt when retrieving
 * const stored = localStorage.getItem('secure_token');
 * if (stored) {
 *   const decrypted = await decryptData(stored, encryptionKey);
 *   console.log('Token:', decrypted);
 * }
 */

export default {
  encryptData,
  decryptData,
  generateEncryptionPassword,
  hashData,
  isWebCryptoAvailable,
}
