import { openDB, DBSchema, IDBPDatabase } from 'idb'
import encryption from '../encryption'

// IndexedDB Schema
interface AppDB extends DBSchema {
  jobs: {
    key: string
    value: {
      id: string
      data: any
      timestamp: number
    }
  }
  companies: {
    key: string
    value: {
      id: string
      data: any
      timestamp: number
    }
  }
  profiles: {
    key: string
    value: {
      id: string
      data: any
      timestamp: number
    }
  }
  applications: {
    key: string
    value: {
      id: string
      data: any
      timestamp: number
    }
  }
}

class StorageManager {
  private static dbName = 'cap-platform-scraper-db'
  private static dbVersion = 1
  private static db: IDBPDatabase<AppDB> | null = null

  /**
   * Initialize IndexedDB
   */
  private static async initDB(): Promise<IDBPDatabase<AppDB>> {
    if (this.db) return this.db

    this.db = await openDB<AppDB>(this.dbName, this.dbVersion, {
      upgrade(db) {
        // Create object stores if they don't exist
        if (!db.objectStoreNames.contains('jobs')) {
          db.createObjectStore('jobs', { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains('companies')) {
          db.createObjectStore('companies', { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains('profiles')) {
          db.createObjectStore('profiles', { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains('applications')) {
          db.createObjectStore('applications', { keyPath: 'id' })
        }
      },
    })

    return this.db
  }

  /**
   * Save data to IndexedDB
   * Use for large datasets (job listings, company data)
   */
  static async saveToIndexedDB<T extends keyof AppDB>(
    storeName: T,
    key: string,
    data: any,
  ): Promise<void> {
    try {
      const db = await this.initDB()

      // Encrypt the data
      const json = JSON.stringify(data)
      const encryptedData = await this.encryptData(json)

      await db.put(storeName as any, {
        id: key,
        data: encryptedData,
        timestamp: Date.now(),
      })
    } catch (error) {
      console.error('IndexedDB save error:', error)
      throw error
    }
  }

  /**
   * Get data from IndexedDB
   */
  static async getFromIndexedDB<T extends keyof AppDB>(
    storeName: T,
    key: string,
  ): Promise<any | null> {
    try {
      const db = await this.initDB()
      const result = await db.get(storeName as any, key)
      if (!result?.data) return null

      // Decrypt the data
      const decryptedJson = await this.decryptData(result.data)
      return JSON.parse(decryptedJson)
    } catch (error) {
      console.error('IndexedDB get error:', error)
      return null
    }
  }

  /**
   * Get all data from a store
   */
  static async getAllFromIndexedDB<T extends keyof AppDB>(storeName: T): Promise<any[]> {
    try {
      const db = await this.initDB()
      const results = await db.getAll(storeName as any)

      // Decrypt all results
      const decryptedResults = await Promise.all(
        results.map(async (r) => {
          try {
            const json = await this.decryptData(r.data)
            return JSON.parse(json)
          } catch (err: unknown) {
            console.error('Failed to decrypt data:', err)
            return r.data // Fallback for unencrypted data
          }
        }),
      )

      return decryptedResults
    } catch (error) {
      console.error('IndexedDB getAll error:', error)
      return []
    }
  }

  /**
   * Delete from IndexedDB
   */
  static async deleteFromIndexedDB<T extends keyof AppDB>(
    storeName: T,
    key: string,
  ): Promise<void> {
    try {
      const db = await this.initDB()
      await db.delete(storeName as any, key)
    } catch (error) {
      console.error('IndexedDB delete error:', error)
      throw error
    }
  }

  /**
   * Clear entire store
   */
  static async clearIndexedDBStore<T extends keyof AppDB>(storeName: T): Promise<void> {
    try {
      const db = await this.initDB()
      await db.clear(storeName as any)
    } catch (error) {
      console.error('IndexedDB clear error:', error)
      throw error
    }
  }

  /**
   * Save to LocalStorage
   * Use for user preferences (with optional encryption for sensitive data)
   */
  static async saveToLocalStorage(key: string, data: any, encrypt = false): Promise<void> {
    try {
      const json = JSON.stringify(data)
      const value = encrypt ? await this.encryptData(json) : json
      localStorage.setItem(key, value)
    } catch (error) {
      console.error('LocalStorage save error:', error)
      throw error
    }
  }

  /**
   * Get from LocalStorage
   * Note: If decrypt=true and decryption fails, this throws an error to allow fallback handling
   */
  static async getFromLocalStorage<T = unknown>(key: string, decrypt = false): Promise<T | null> {
    const value = localStorage.getItem(key)
    if (!value) return null

    try {
      const parsed = decrypt ? await this.decryptData(value) : value
      return JSON.parse(parsed)
    } catch (error) {
      // If decryption was requested and failed, throw so caller can handle fallback
      if (decrypt) {
        console.error('LocalStorage decrypt/parse error:', error)
        throw error
      }
      // For non-decrypt operations, log and return null
      console.error('LocalStorage get error:', error)
      return null
    }
  }

  /**
   * Delete from LocalStorage
   */
  static deleteFromLocalStorage(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('LocalStorage delete error:', error)
      throw error
    }
  }

  /**
   * Save to SessionStorage
   * Use for temporary guest data
   */
  static saveToSessionStorage(key: string, data: any): void {
    try {
      sessionStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
      console.error('SessionStorage save error:', error)
      throw error
    }
  }

  /**
   * Get from SessionStorage
   */
  static getFromSessionStorage<T = any>(key: string): T | null {
    try {
      const value = sessionStorage.getItem(key)
      if (!value) return null
      return JSON.parse(value)
    } catch (error) {
      console.error('SessionStorage get error:', error)
      return null
    }
  }

  /**
   * Delete from SessionStorage
   */
  static deleteFromSessionStorage(key: string): void {
    try {
      sessionStorage.removeItem(key)
    } catch (error) {
      console.error('SessionStorage delete error:', error)
      throw error
    }
  }

  /**
   * Clear all user data on logout
   */
  static clearAllUserData(): void {
    try {
      // Clear localStorage
      localStorage.clear()

      // Clear sessionStorage
      sessionStorage.clear()

      // Clear IndexedDB
      this.clearAllIndexedDB()
    } catch (error) {
      console.error('Clear all user data error:', error)
      throw error
    }
  }

  /**
   * Clear all IndexedDB data
   */
  static async clearAllIndexedDB(): Promise<void> {
    try {
      const db = await this.initDB()
      const storeNames: (keyof AppDB)[] = ['jobs', 'companies', 'profiles', 'applications']

      for (const storeName of storeNames) {
        await db.clear(storeName as any)
      }
    } catch (error) {
      console.error('Clear all IndexedDB error:', error)
      throw error
    }
  }

  /**
   * AES-GCM Encryption using Web Crypto API.
   *
   * SECURITY WARNING: Encrypting localStorage data with VITE_STORAGE_ENCRYPTION_KEY acts as data
   * obfuscation for client-side persistence, NOT a true cryptographic security boundary, because
   * build-time environment variables are embedded directly into client JavaScript bundles.
   * Sensitive secrets and refresh tokens MUST be managed via backend-enforced HttpOnly cookies.
   */
  private static async encryptData(data: string): Promise<string> {
    const masterKey =
      (import.meta as any).env?.VITE_STORAGE_ENCRYPTION_KEY || 'cap-platform-default-secure-key'
    return encryption.encryptData(data, masterKey)
  }

  /**
   * AES-GCM Decryption using Web Crypto API
   */
  private static async decryptData(data: string): Promise<string> {
    const masterKey =
      (import.meta as any).env?.VITE_STORAGE_ENCRYPTION_KEY || 'cap-platform-default-secure-key'
    try {
      return await encryption.decryptData(data, masterKey)
    } catch (error) {
      console.error('Decryption failed, data might be legacy Base64 or corrupted')
      throw error
    }
  }

  /**
   * Get storage quota information
   */
  static async getStorageQuota(): Promise<{
    usage: number
    quota: number
    percentUsed: number
  }> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate()
      const usage = estimate.usage || 0
      const quota = estimate.quota || 0
      const percentUsed = quota > 0 ? (usage / quota) * 100 : 0

      return {
        usage,
        quota,
        percentUsed,
      }
    }

    return {
      usage: 0,
      quota: 0,
      percentUsed: 0,
    }
  }

  /**
   * Check if storage is available
   */
  static isStorageAvailable(type: 'localStorage' | 'sessionStorage'): boolean {
    try {
      const storage = window[type]
      const test = '__storage_test__'
      storage.setItem(test, test)
      storage.removeItem(test)
      return true
    } catch (err: unknown) {
      console.error('Storage availability check failed:', err)
      return false
    }
  }
}

export default StorageManager

// Export storage managers for backward compatibility

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'cap-platform-auth-tokens',
  /** @deprecated Refresh tokens are handled via HttpOnly cookies and MUST NOT be stored in localStorage */
  REFRESH_TOKEN: undefined,
  USER_DATA: 'user_data',
  USER_PREFERENCES: 'user_preferences',
  SAVED_JOBS: 'saved_jobs',
  RESUME_PROFILES: 'resume_profiles',
  NOTIFICATIONS: 'notifications',
  GUEST_SESSION: 'guest_session',
  THEME_PREFERENCES: 'theme_preferences',
  LANGUAGE: 'language',
} as const
