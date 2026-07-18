import { describe, it, expect } from 'vitest'
import { ENDPOINTS } from '@idaas/authentication-core/services/endpoints'

// ---------------------------------------------------------------------------
// Static endpoint sanity checks
// ---------------------------------------------------------------------------
describe('ENDPOINTS static values', () => {
  it('auth.login is correct', () => {
    expect(ENDPOINTS.auth.login).toBe('/api/auth/login')
  })

  it('auth.register is correct', () => {
    expect(ENDPOINTS.auth.register).toBe('/api/auth/signup')
  })

  it('auth.logout is correct', () => {
    expect(ENDPOINTS.auth.logout).toBe('/api/auth/logout')
  })

  it('user.me is correct', () => {
    expect(ENDPOINTS.user.me).toBe('/api/user/me')
  })
})

// ---------------------------------------------------------------------------
// Dynamic endpoint generators
// ---------------------------------------------------------------------------
describe('ENDPOINTS dynamic generators', () => {
  describe('auth.verifyEmail', () => {
    it('builds the correct URL with email and signature', () => {
      const url = ENDPOINTS.auth.verifyEmail('user@example.com', 'abc123sig')
      expect(url).toBe('/api/auth/verification/email/user@example.com?signature=abc123sig')
    })
  })

  describe('auth.verifyResetPassword', () => {
    it('builds the correct URL with email and signature', () => {
      const url = ENDPOINTS.auth.verifyResetPassword('user@example.com', 'resetSig')
      expect(url).toBe('/api/auth/reset-password/user@example.com?signature=resetSig')
    })
  })

  describe('auth.validateUser', () => {
    it('builds the correct URL with numeric id and token', () => {
      const url = ENDPOINTS.auth.validateUser(42, 'tokenXYZ')
      expect(url).toBe('/api/auth/validate/42/tokenXYZ')
    })

    it('builds the correct URL with string id', () => {
      const url = ENDPOINTS.auth.validateUser('user-uuid', 'tokenABC')
      expect(url).toBe('/api/auth/validate/user-uuid/tokenABC')
    })
  })

  describe('auth.revokeSession', () => {
    it('builds the correct URL for a session ID', () => {
      expect(ENDPOINTS.auth.revokeSession('sess_001')).toBe('/api/auth/sessions/sess_001')
    })
  })

  describe('auth.social', () => {
    it('builds the redirect URL for a provider', () => {
      expect(ENDPOINTS.auth.social.redirect('google')).toBe('/api/auth/social/google/redirect')
    })

    it('builds the callback URL for a provider', () => {
      expect(ENDPOINTS.auth.social.callback('github')).toBe('/api/auth/social/github/callback')
    })
  })

  describe('auth.oidcInteraction', () => {
    it('builds the correct login interaction URL', () => {
      expect(ENDPOINTS.auth.oidcInteraction.login('uid-123')).toBe(
        '/api/auth/oidc/interaction/uid-123/login',
      )
    })

    it('builds the correct consent interaction URL', () => {
      expect(ENDPOINTS.auth.oidcInteraction.consent('uid-123')).toBe(
        '/api/auth/oidc/interaction/uid-123/consent',
      )
    })

    it('builds the correct abort interaction URL', () => {
      expect(ENDPOINTS.auth.oidcInteraction.abort('uid-abc')).toBe(
        '/api/auth/oidc/interaction/uid-abc/abort',
      )
    })
  })

  describe('user passkey endpoints', () => {
    it('builds the update passkey URL', () => {
      expect(ENDPOINTS.user.passkeys.update(5)).toBe('/api/user/passkeys/5')
    })

    it('builds the destroy passkey URL', () => {
      expect(ENDPOINTS.user.passkeys.destroy('pk-uuid')).toBe('/api/user/passkeys/pk-uuid')
    })
  })

  describe('user token endpoints', () => {
    it('builds the destroy token URL', () => {
      expect(ENDPOINTS.user.tokens.destroy(99)).toBe('/api/user/tokens/99')
    })
  })

  describe('admin.users dynamic endpoints', () => {
    it('builds the correct byId URL', () => {
      expect(ENDPOINTS.admin.users.byId(7)).toBe('/api/admin/users/7')
    })

    it('builds the correct activate URL', () => {
      expect(ENDPOINTS.admin.users.activate(7)).toBe('/api/admin/users/7/activate')
    })

    it('builds the correct impersonate URL', () => {
      expect(ENDPOINTS.admin.users.impersonate(7)).toBe('/api/admin/users/7/impersonate')
    })

    it('builds the correct ban URL', () => {
      expect(ENDPOINTS.admin.users.ban(3)).toBe('/api/admin/users/3/ban')
    })
  })

  describe('admin.organizations dynamic endpoints', () => {
    it('builds the correct byId URL', () => {
      expect(ENDPOINTS.admin.organizations.byId(10)).toBe('/api/admin/organizations/10')
    })

    it('builds the revokeInvitation URL', () => {
      expect(ENDPOINTS.admin.organizations.revokeInvitation(10, 'inv-abc')).toBe(
        '/api/admin/organizations/10/invitations/inv-abc/revoke',
      )
    })
  })

  describe('admin.rbac dynamic endpoints', () => {
    it('builds the roles permissions URL', () => {
      expect(ENDPOINTS.rbac.roles.permissions('admin')).toBe(
        '/api/admin/rbac/roles/admin/permissions',
      )
    })

    it('builds the syncParents URL', () => {
      expect(ENDPOINTS.rbac.roles.syncParents(2)).toBe('/api/admin/rbac/roles/2/parents')
    })
  })

  describe('notifications dynamic endpoints', () => {
    it('builds the markAsRead URL', () => {
      expect(ENDPOINTS.notifications.markAsRead(55)).toBe('/api/notifications/55/read')
    })

    it('builds the delete notification URL', () => {
      expect(ENDPOINTS.notifications.delete(55)).toBe('/api/notifications/55')
    })
  })

  describe('backup dynamic endpoints', () => {
    it('builds the byId URL', () => {
      expect(ENDPOINTS.backup.byId('backup-xyz')).toBe('/api/backup/backup-xyz')
    })

    it('builds the testRestore URL', () => {
      expect(ENDPOINTS.backup.testRestore(3)).toBe('/api/backup/3/test')
    })
  })
})

