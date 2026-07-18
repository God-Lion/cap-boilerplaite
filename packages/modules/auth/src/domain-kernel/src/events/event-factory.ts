import { DomainEvent } from './event-bus'
import { EventVersions } from './auth-events'

export interface CreateEventOptions {
  correlationId?: string
  causationId?: string
}

export function createEvent<T>(
  type: string,
  payload: T,
  options: CreateEventOptions = {},
): DomainEvent<T> {
  return {
    id: crypto.randomUUID(),
    type,
    version: EventVersions.V1,
    timestamp: new Date().toISOString(),
    correlationId: options.correlationId,
    causationId: options.causationId,
    payload,
  }
}

export function createUserAuthenticatedEvent(
  payload: import('./auth-events').UserAuthenticatedPayload,
  options: CreateEventOptions = {},
): DomainEvent<import('./auth-events').UserAuthenticatedPayload> {
  return createEvent('UserAuthenticated', payload, options)
}

export function createAuthenticationFailedEvent(
  payload: import('./auth-events').AuthenticationFailedPayload,
  options: CreateEventOptions = {},
): DomainEvent<import('./auth-events').AuthenticationFailedPayload> {
  return createEvent('AuthenticationFailed', payload, options)
}

export function createMfaChallengeIssuedEvent(
  payload: import('./auth-events').MfaChallengeIssuedPayload,
  options: CreateEventOptions = {},
): DomainEvent<import('./auth-events').MfaChallengeIssuedPayload> {
  return createEvent('MfaChallengeIssued', payload, options)
}

export function createSessionCreatedEvent(
  payload: import('./auth-events').SessionCreatedPayload,
  options: CreateEventOptions = {},
): DomainEvent<import('./auth-events').SessionCreatedPayload> {
  return createEvent('SessionCreated', payload, options)
}

export function createSessionExpiredEvent(
  payload: import('./auth-events').SessionExpiredPayload,
  options: CreateEventOptions = {},
): DomainEvent<import('./auth-events').SessionExpiredPayload> {
  return createEvent('SessionExpired', payload, options)
}

export function createSessionRevokedEvent(
  payload: import('./auth-events').SessionRevokedPayload,
  options: CreateEventOptions = {},
): DomainEvent<import('./auth-events').SessionRevokedPayload> {
  return createEvent('SessionRevoked', payload, options)
}

export function createTokenIssuedEvent(
  payload: import('./auth-events').TokenIssuedPayload,
  options: CreateEventOptions = {},
): DomainEvent<import('./auth-events').TokenIssuedPayload> {
  return createEvent('TokenIssued', payload, options)
}

export function createTokenRevokedEvent(
  payload: import('./auth-events').TokenRevokedPayload,
  options: CreateEventOptions = {},
): DomainEvent<import('./auth-events').TokenRevokedPayload> {
  return createEvent('TokenRevoked', payload, options)
}

export function createTokenRefreshedEvent(
  payload: import('./auth-events').TokenRefreshedPayload,
  options: CreateEventOptions = {},
): DomainEvent<import('./auth-events').TokenRefreshedPayload> {
  return createEvent('TokenRefreshed', payload, options)
}
