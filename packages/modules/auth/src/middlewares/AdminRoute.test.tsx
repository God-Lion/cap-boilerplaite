import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import AdminRoute from '../middlewares/AdminRoute'

// ── Mocks ─────────────────────────────────────────────────────────────────────

const mockNavigate = vi.fn()
vi.mock('react-router-dom', () => ({
  Navigate: ({ to }: { to: string }) => <div data-testid='navigate' data-to={to} />,
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: '/admin', state: null }),
  Suspense: ({ children }: any) => <>{children}</>,
}))

const mockUpdateLayoutOverride = vi.fn()
vi.mock('@cap/platform-core', () => ({
  Roles: { USER: 0, ADMIN: 100, SUPERADMINEMPLOYEE: 200, SUPERADMIN: 300 },
  isObjectEmpty: (obj: any) => !obj || Object.keys(obj).length === 0,
  useAppStore: (selector: (s: any) => any) =>
    selector({ updateLayoutOverride: mockUpdateLayoutOverride }),
}))

// Mock the 403 screen used inside AdminRoute
vi.mock('../screens', () => ({
  Page403Forbidden: () => <div data-testid='page-403'>403 Forbidden</div>,
}))

const mockUseSessionGuard = vi.fn()
vi.mock('../middlewares/useSessionGuard', () => ({
  useSessionGuard: () => mockUseSessionGuard(),
}))

// ── Helpers ───────────────────────────────────────────────────────────────────

const makeUser = (role: number = 100, extras: Record<string, any> = {}) => ({
  id: '1',
  email: 'admin@example.com',
  role,
  ...extras,
})

const guard = (overrides: Record<string, any> = {}) =>
  mockUseSessionGuard.mockReturnValue({
    isLoading: false,
    sessionError: null,
    isAuthenticated: true,
    user: makeUser(),
    ...overrides,
  })

const renderRoute = (props: Record<string, any> = {}) =>
  render(<AdminRoute element={<div>Admin Content</div>} {...(props as any)} />)

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('AdminRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ── Loading state ──────────────────────────────────────────────────────────

  it('shows a loading spinner while the session is resolving', () => {
    guard({ isLoading: true })
    renderRoute()
    expect(document.querySelector('.MuiCircularProgress-root')).not.toBeNull()
    expect(screen.queryByText('Admin Content')).toBeNull()
  })

  // ── Session error ──────────────────────────────────────────────────────────

  it('renders a session error alert when sessionError is set', () => {
    guard({ sessionError: 'Session expired', isLoading: false })
    renderRoute()
    expect(screen.getByText('Session expired')).toBeTruthy()
    expect(screen.getByRole('button', { name: /go to login/i })).toBeTruthy()
  })

  // ── Unauthenticated ────────────────────────────────────────────────────────

  it('redirects to /auth/signin when the user is not authenticated', () => {
    guard({ isAuthenticated: false, user: null })
    renderRoute()
    const nav = screen.getByTestId('navigate')
    expect(nav.getAttribute('data-to')).toBe('/auth/signin')
    expect(screen.queryByText('Admin Content')).toBeNull()
  })

  it('redirects when user is an empty object', () => {
    guard({ isAuthenticated: true, user: {} })
    renderRoute()
    expect(screen.getByTestId('navigate')).toBeTruthy()
  })

  // ── Non-admin roles ────────────────────────────────────────────────────────

  it('renders the 403 page when a regular user tries to access an admin route', () => {
    guard({ user: makeUser(0) }) // USER role
    renderRoute()
    expect(screen.getByTestId('page-403')).toBeTruthy()
    expect(screen.queryByText('Admin Content')).toBeNull()
  })

  // ── Admin roles ────────────────────────────────────────────────────────────

  it('renders the admin element for an ADMIN role user (100)', () => {
    guard({ user: makeUser(100) })
    renderRoute()
    expect(screen.getByText('Admin Content')).toBeTruthy()
  })

  it('renders the admin element for a SUPERADMINEMPLOYEE role user (200)', () => {
    guard({ user: makeUser(200) })
    renderRoute()
    expect(screen.getByText('Admin Content')).toBeTruthy()
  })

  it('renders the admin element for a SUPERADMIN role user (300)', () => {
    guard({ user: makeUser(300) })
    renderRoute()
    expect(screen.getByText('Admin Content')).toBeTruthy()
  })

  // ── Minimum role enforcement ───────────────────────────────────────────────

  it('shows "Insufficient Permissions" when ADMIN (100) tries to access a SUPERADMIN (300) route', () => {
    guard({ user: makeUser(100) })
    renderRoute({ minimumRole: 300 })
    expect(screen.getByText(/Insufficient Permissions/i)).toBeTruthy()
    expect(screen.queryByText('Admin Content')).toBeNull()
  })

  it('renders the element when the user meets the exact minimum role', () => {
    guard({ user: makeUser(200) })
    renderRoute({ minimumRole: 200 })
    expect(screen.getByText('Admin Content')).toBeTruthy()
  })

  it('renders the element when the user exceeds the minimum role', () => {
    guard({ user: makeUser(300) })
    renderRoute({ minimumRole: 100 })
    expect(screen.getByText('Admin Content')).toBeTruthy()
  })
})
