import type {
  AuthenticationResult,
  AuthFactor,
  MfaChallenge,
  CredentialInfo,
} from '../types/authentication'
import type { UserId, TenantId } from '../types/identifiers'

export interface IAuthenticateUser {
  authenticate(
    identifier: string,
    password: string,
    tenantId?: TenantId,
  ): Promise<AuthenticationResult>
}

export interface IVerifyMfa {
  verifyChallenge(userId: UserId, challengeId: string, code: string): Promise<AuthenticationResult>
}

export interface IMfaOrchestrator {
  issueChallenge(userId: UserId, method: AuthFactor): Promise<MfaChallenge>

  listCredentials(userId: UserId): Promise<CredentialInfo[]>

  enrollCredential(userId: UserId, type: AuthFactor, credential: unknown): Promise<CredentialInfo>

  removeCredential(userId: UserId, credentialId: string): Promise<void>
}

export interface IPasswordless {
  sendMagicLink(email: string, tenantId?: TenantId): Promise<{ sent: boolean }>

  verifyMagicLink(token: string): Promise<AuthenticationResult>

  initiatePasskeyRegistration(userId: UserId): Promise<{ options: unknown }>

  verifyPasskeyRegistration(userId: UserId, response: unknown): Promise<{ success: boolean }>

  initiatePasskeyAuthentication(tenantId?: TenantId): Promise<{ options: unknown }>

  verifyPasskeyAuthentication(response: unknown): Promise<AuthenticationResult>
}

export interface ISessionManager {
  getSession(sessionId: string): Promise<unknown>

  listUserSessions(userId: UserId): Promise<unknown[]>

  revokeSession(sessionId: string): Promise<void>

  revokeAllUserSessions(userId: UserId): Promise<void>
}
