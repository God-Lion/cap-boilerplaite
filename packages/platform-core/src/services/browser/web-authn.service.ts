/**
 * WebAuthn Service
 * Wrapper for the Web Authentication API for secure passwordless logins.
 */
export class WebAuthnService {
  private static instance: WebAuthnService

  private constructor() {}

  static getInstance(): WebAuthnService {
    if (!WebAuthnService.instance) {
      WebAuthnService.instance = new WebAuthnService()
    }
    return WebAuthnService.instance
  }

  isSupported(): boolean {
    return (
      'credentials' in navigator &&
      'create' in navigator.credentials &&
      'get' in navigator.credentials
    )
  }

  /**
   * Register a new credential
   */
  async register(options: PublicKeyCredentialCreationOptions): Promise<Credential | null> {
    if (!this.isSupported()) {
      throw new Error('WebAuthn is not supported.')
    }
    try {
      return await navigator.credentials.create({ publicKey: options })
    } catch (error) {
      console.error('WebAuthn registration error:', error)
      throw error
    }
  }

  /**
   * Authenticate with an existing credential
   */
  async authenticate(options: PublicKeyCredentialRequestOptions): Promise<Credential | null> {
    if (!this.isSupported()) {
      throw new Error('WebAuthn is not supported.')
    }
    try {
      return await navigator.credentials.get({ publicKey: options })
    } catch (error) {
      console.error('WebAuthn authentication error:', error)
      throw error
    }
  }

  /**
   * Encode ArrayBuffer to Base64 (helper for transporting creds)
   */
  bufferToBase64(buffer: ArrayBuffer): string {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)))
  }

  /**
   * Decode Base64 to ArrayBuffer
   */
  base64ToBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64)
    const len = binaryString.length
    const bytes = new Uint8Array(len)
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    return bytes.buffer
  }
}

export const webAuthnService = WebAuthnService.getInstance()
