import { registerSW } from 'virtual:pwa-register'

/**
 * Worker Service
 * Wrapper for the Service Worker API for offline and background tasks.
 * Enhanced to work with vite-plugin-pwa.
 */
export class WorkerService {
  private static instance: WorkerService
  private updateSW: ((reloadPage?: boolean) => Promise<void>) | undefined

  // Callbacks
  private onNeedRefreshCallback: (() => void) | null = null
  private onOfflineReadyCallback: (() => void) | null = null

  private constructor() {}

  static getInstance(): WorkerService {
    if (!WorkerService.instance) {
      WorkerService.instance = new WorkerService()
    }
    return WorkerService.instance
  }

  isSupported(): boolean {
    return 'serviceWorker' in navigator
  }

  /**
   * Initialize PWA service worker registration
   */
  init(onNeedRefresh?: () => void, onOfflineReady?: () => void): void {
    if (!this.isSupported()) return

    this.onNeedRefreshCallback = onNeedRefresh || null
    this.onOfflineReadyCallback = onOfflineReady || null

    this.updateSW = registerSW({
      immediate: true,
      onNeedRefresh: () => {
        console.log('New content available, click on reload button to update.')
        this.onNeedRefreshCallback?.()
      },
      onOfflineReady: () => {
        console.log('App is ready to work offline.')
        this.onOfflineReadyCallback?.()
      },
      onRegistered: (registration) => {
        console.log('Service Worker registered:', registration)
      },
      onRegisterError: (error) => {
        console.error('Service Worker registration failed:', error)
      },
    })
  }

  /**
   * Trigger the update of the Service Worker
   */
  async updateServiceWorker(reloadPage: boolean = true): Promise<void> {
    if (this.updateSW) {
      await this.updateSW(reloadPage)
    }
  }

  /**
   * Send a message to the active service worker
   */
  sendMessage(message: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.isSupported() || !navigator.serviceWorker.controller) {
        reject(new Error('No active Service Worker controller.'))
        return
      }

      const messageChannel = new MessageChannel()
      messageChannel.port1.onmessage = (event) => {
        if (event.data && event.data.error) {
          reject(event.data.error)
        } else {
          resolve(event.data)
        }
      }

      navigator.serviceWorker.controller.postMessage(message, [messageChannel.port2])
    })
  }
}

export const workerService = WorkerService.getInstance()
