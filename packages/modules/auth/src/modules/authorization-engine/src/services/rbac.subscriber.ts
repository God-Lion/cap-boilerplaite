import { eventBus } from '../../../../domain-kernel/src/events/event-bus'
import {
  AuthEventTypes,
  SessionEventTypes,
  TokenEventTypes,
} from '../../../../domain-kernel/src/events/auth-events'

export interface RbacSubscriberConfig {
  tenantId?: string
}

export class RbacSubscriber {
  private tenantId?: string

  constructor(config: RbacSubscriberConfig = {}) {
    this.tenantId = config.tenantId
  }

  async handleUserAuthenticated(event: any): Promise<void> {
    const { userId, sessionId } = event.payload
    console.log(`[RbacSubscriber] User ${userId} authenticated, session: ${sessionId}`)
  }

  async handleSessionCreated(event: any): Promise<void> {
    const { userId, sessionId } = event.payload
    console.log(`[RbacSubscriber] Session ${sessionId} created for user ${userId}`)
  }

  async handleSessionRevoked(event: any): Promise<void> {
    const { userId, sessionId, reason } = event.payload
    console.log(
      `[RbacSubscriber] Session ${sessionId} revoked for user ${userId}, reason: ${reason}`,
    )
  }

  async handleTokenIssued(event: any): Promise<void> {
    const { userId, tokenType, scopes } = event.payload
    console.log(
      `[RbacSubscriber] ${tokenType} token issued for user ${userId}, scopes: ${scopes.join(', ')}`,
    )
  }

  subscribe(): void {
    eventBus.subscribe(AuthEventTypes.USER_AUTHENTICATED, this.handleUserAuthenticated.bind(this))
    eventBus.subscribe(SessionEventTypes.SESSION_CREATED, this.handleSessionCreated.bind(this))
    eventBus.subscribe(SessionEventTypes.SESSION_REVOKED, this.handleSessionRevoked.bind(this))
    eventBus.subscribe(TokenEventTypes.TOKEN_ISSUED, this.handleTokenIssued.bind(this))
  }

  unsubscribe(): void {
    eventBus.unsubscribe(AuthEventTypes.USER_AUTHENTICATED, this.handleUserAuthenticated.bind(this))
    eventBus.unsubscribe(SessionEventTypes.SESSION_CREATED, this.handleSessionCreated.bind(this))
    eventBus.unsubscribe(SessionEventTypes.SESSION_REVOKED, this.handleSessionRevoked.bind(this))
    eventBus.unsubscribe(TokenEventTypes.TOKEN_ISSUED, this.handleTokenIssued.bind(this))
  }
}

export const rbacSubscriber = new RbacSubscriber()
rbacSubscriber.subscribe()

