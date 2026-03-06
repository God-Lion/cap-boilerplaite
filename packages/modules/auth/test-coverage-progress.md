# Test Coverage Progress — @cap/module-auth

**Last Updated:** 2026-03-04  
**Project Path:** `C:\Node.Js\proj\boilerplate\packages\modules\auth`

---

## Project Context

| Item | Detail |
|---|---|
| Package | `@cap/module-auth` |
| Framework | React 19 + TypeScript |
| Test Framework | **Vitest** + `@testing-library/react` (jsdom) |
| State Management | Zustand v5 + Immer |
| Validation | Zod v3 |
| Data Fetching | TanStack React Query v5 |
| Routing | React Router v6 |

---

## Run Tests

```bash
# From auth module root
npx vitest run

# With coverage report
npx vitest run --coverage
```

---

## All Test Files

| File | Cases | What is covered |
|---|---|---|
| `src/utils/schema.test.ts` | 28 | LoginSchema, RegisterSchema, ChangePasswordSchema, ChangeEmailSchema, UpdateProfileSchema |
| `src/store/store.test.ts` | 22 | AuthSlice + UiSlice — all state mutations, clearAuth, clearUser |
| `src/services/endpoints.test.ts` | 25 | All static + dynamic URL generators |
| `src/hooks/useInterval.test.ts` | 7 | Timing, cleanup, stale closure fix, null delay, delay changes |
| `src/hooks/useSignOut.test.ts` | 10 | signOut(), onSuccess/onError callbacks, custom redirect, custom callbacks |
| `src/hooks/usePasskey.test.ts` | 8 | loginWithPasskey(), loading state, success, all error paths, error clearing |
| `src/hooks/usePasskeyAutofill.test.ts` | 8 | Browser support check, full autofill flow, error handling, AbortError suppression, init guard |
| `src/hooks/useOidcCompliance.test.ts` | 16 | oidcComplianceKeys, useOidcUserInfo, useOidcInfoIntrospect, useOidcTokenRevocation, useOidcEndSession, useInitiateSamlSso |
| `src/middlewares/useSessionGuard.test.ts` | 9 | Pre-hydration state, skip refreshAuth when authed, call refreshAuth, error handling |
| `src/middlewares/AuthRoute.test.tsx` | 11 | Loading, session error, unauthenticated redirect, role access, multi-role, email verification, admin bypass |
| `src/middlewares/GuestRoute.test.tsx` | 7 | Loading, unauthenticated render, redirect with/without user, custom redirectTo, empty user edge cases |
| `src/middlewares/AdminRoute.test.tsx` | 11 | Loading, session error, unauthenticated redirect, 403 for non-admin, all admin roles, minimumRole enforcement |

**Total: ~162 test cases across 12 files**

---

## Coverage Status

### ✅ Fully Covered

| Module | Notes |
|---|---|
| `src/utils/schema.ts` | All 5 schemas, including edge cases |
| `src/store/authSlice.ts` | All actions + clearAuth |
| `src/store/uiSlice.ts` | All actions + clearError |
| `src/services/endpoints.ts` | All static values + dynamic generators |
| `src/hooks/useInterval.ts` | All timing/cleanup scenarios |
| `src/hooks/useSignOut.ts` | All callback branches |
| `src/hooks/usePasskey.ts` | Full success + error paths |
| `src/hooks/usePasskeyAutofill.ts` | Full conditional UI flow |
| `src/hooks/useOidcCompliance.ts` | All 5 hooks |
| `src/middlewares/useSessionGuard.ts` | All session check branches |
| `src/middlewares/AuthRoute.tsx` | All rendering branches |
| `src/middlewares/GuestRoute.tsx` | All rendering branches |
| `src/middlewares/AdminRoute.tsx` | All role + redirect branches |

### ⏳ Not Yet Tested (Lower Priority)

#### Hooks
- `useAuthQuery.ts` — large file; key mutations (useSignin, useSignout, useVerifyMfa) contain complex side-effects requiring full React Query + service mocks. Recommend testing mutation `onSuccess` handlers individually.
- `useProfileQuery.ts`, `useAdminQuery.ts`, `useUserQuery.ts`, `useNotificationsQuery.ts` — straightforward React Query wrappers; follow the same pattern as `useOidcCompliance.test.ts`
- `useSSE.ts` — EventSource mock needed
- `useHealthQuery.ts`, `useUserQuery.ts` — lower complexity

#### Services
- `auth.service.ts`, `user.service.ts`, `adminService.ts`, `health.service.ts` — require fetch/axios mocking; medium priority

#### Components & Screens
- `src/components/**` and `src/screens/**` — RTL render + interaction tests; lowest priority

---

## Mocking Patterns Used

### Module mocks
```ts
// React Router
vi.mock('react-router-dom', () => ({
  Navigate: ({ to }) => <div data-testid="navigate" data-to={to} />,
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: '/', state: null }),
}))

// Platform core
vi.mock('@cap/platform-core', () => ({
  Roles: { USER: 0, ADMIN: 100, SUPERADMINEMPLOYEE: 200, SUPERADMIN: 300 },
  useAuth: () => ({ user: mockUser, isAuthenticated: false, refreshAuth: mockRefreshAuth }),
  useHasHydrated: () => mockHasHydrated,
  StorageManager: { clearAllUserData: vi.fn() },
}))

// Auth store
vi.mock('../store', () => ({
  useAuthStore: () => ({ clearAuth: mockClearAuth, setAuthStep: mockSetAuthStep }),
}))
```

### React Query wrapper for hook tests
```ts
function makeWrapper() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return ({ children }) => React.createElement(QueryClientProvider, { client }, children)
}
```

---

## Continuing in a New Chat

Start with:
> "Continue test coverage analysis — please read `test-coverage-progress.md` to understand where we left off, then proceed with the next phase."

**Next recommended phase:** `useAuthQuery.ts` — test the `useSignin` and `useVerifyMfa` mutation `onSuccess` handlers (store updates, token storage, query invalidation).
