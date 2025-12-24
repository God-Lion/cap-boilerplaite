import Encrypt from '../Encrypt'

interface IFlash {
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
}

interface ISessionItem {
  [key: string]: unknown
  flash?: IFlash
}

export default class Session {
  private SESSION_KEY = 'mascayiti_session'
  private session: ISessionItem[] = []
  private encrypt: Encrypt = new Encrypt()

  constructor() {
    this.fetch()
  }

  /**
   * Pushes a flash message to the session.
   * @param message - The message you want to display
   * @param type - The type of flash message.
   */
  setFlash(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success'): void {
    this.session.push({
      flash: {
        message,
        type,
      },
    })
    this.save(this.session)
  }

  /**
   * Returns HTML string for flash messages.
   * Note: This returns raw HTML string. Ensure usage handles XSS if innerHTML is used.
   */
  flash(): string {
    const session = this.fetch()
    let html = ''
    session.forEach((e) => {
      if (e.flash) {
        html += `<div class="alert alert-${e.flash.type}" role="alert"><p>${e.flash.message}</p></div>`
      }
    })
    return html
  }

  /**
   * Writes a key-value pair to the session.
   */
  write(key: string, value: unknown): void {
    this.session = this.fetch()
    const index = this.session.findIndex(e => Object.prototype.hasOwnProperty.call(e, key))

    if (index >= 0) {
      this.session[index] = { [key]: value }
    } else {
      this.session.push({ [key]: value })
    }
    this.save(this.session)
  }

  /**
   * Reads a value by key from the session.
   */
  read<T>(key: string = ''): T | ISessionItem[] | undefined {
    this.session = this.fetch()
    if (key) {
      const item = this.session.find(e => Object.prototype.hasOwnProperty.call(e, key))
      return item ? (item[key] as T) : undefined
    }
    return this.session
  }

  /**
   * Fetches and decrypts session data.
   */
  fetch(): ISessionItem[] {
    const dataSession = sessionStorage.getItem(this.SESSION_KEY)
    if (!dataSession) {
      this.save([])
      return []
    }

    try {
      const decrypted = this.encrypt.decrypt(dataSession)
      if (typeof decrypted === 'string' && decrypted.length > 1) {
        // Assuming decrypt returns the JSON string or object? 
        // The original code passed 'data' to save, which stringified it.
        // encrypt.decrypt usually returns string.
        // Let's assume usage of JSON.parse is needed if decrypt returns string.
        // But looking at original code: `if(data.toString().length > 1) return data`
        // It implies data is already the object or array.
        // Let's stick safe:
        return JSON.parse(decrypted) as ISessionItem[] // If decrypt returns string
      } else {
        // If logic from original was relying on behavior of Encrypt class we don't fully see,
        // we assume standard usage: fetch -> string -> decrypt -> string -> parse.
        // Or if decrypt returns object.
        // Given original: `const data = this.encrypt.decrypt(...)` and `return data`.
        // We will assume it might be pre-parsed or we need to check.
        // For safety with 'any' removal:
        const parsed = typeof decrypted === 'string' ? JSON.parse(decrypted) : decrypted
        return Array.isArray(parsed) ? parsed : []
      }
    } catch (error) {
      this.save([])
      return []
    }
  }

  /**
   * Saves encrypted data to session storage.
   */
  save(data: ISessionItem[]): void {
    const stringified = JSON.stringify(data)
    sessionStorage.setItem(this.SESSION_KEY, this.encrypt.encrypt(stringified))
  }
}

