export interface DomainEvent<T = unknown> {
  id: string
  type: string
  version: string
  timestamp: string
  correlationId?: string
  causationId?: string
  payload: T
}

export interface EventSubscription {
  eventType: string
  handler: (event: DomainEvent) => void | Promise<void>
  version?: string
}

export interface EventBusConfig {
  enableLogging?: boolean
  enableTracing?: boolean
}

type EventHandler = (event: DomainEvent) => void | Promise<void>

export class EventBus {
  private subscriptions: Map<string, Set<EventHandler>> = new Map()
  private config: EventBusConfig

  constructor(config: EventBusConfig = {}) {
    this.config = {
      enableLogging: false,
      enableTracing: false,
      ...config,
    }
  }

  subscribe(eventType: string, handler: EventHandler, version: string = 'v1'): void {
    const key = `${eventType}:${version}`
    if (!this.subscriptions.has(key)) {
      this.subscriptions.set(key, new Set())
    }
    this.subscriptions.get(key)!.add(handler)
  }

  unsubscribe(eventType: string, handler: EventHandler, version: string = 'v1'): void {
    const key = `${eventType}:${version}`
    this.subscriptions.get(key)?.delete(handler)
  }

  async publish<T>(event: DomainEvent<T>): Promise<void> {
    if (this.config.enableLogging) {
      console.log(`[EventBus] Publishing event: ${event.type}@${event.version}`, event.payload)
    }

    const key = `${event.type}:${event.version}`
    const handlers = this.subscriptions.get(key)

    if (handlers) {
      const promises = Array.from(handlers).map((handler) =>
        Promise.resolve(handler(event)).catch((err) => {
          console.error(`[EventBus] Handler error for ${event.type}:`, err)
        }),
      )
      await Promise.all(promises)
    }

    const wildcardHandlers = this.subscriptions.get(`${event.type}:*`)
    if (wildcardHandlers) {
      const promises = Array.from(wildcardHandlers).map((handler) =>
        Promise.resolve(handler(event)).catch((err) => {
          console.error(`[EventBus] Wildcard handler error for ${event.type}:`, err)
        }),
      )
      await Promise.all(promises)
    }
  }

  getSubscribers(eventType: string, version?: string): number {
    const key = version ? `${eventType}:${version}` : `${eventType}:*`
    return this.subscriptions.get(key)?.size ?? 0
  }

  clear(): void {
    this.subscriptions.clear()
  }
}

export const eventBus = new EventBus()
