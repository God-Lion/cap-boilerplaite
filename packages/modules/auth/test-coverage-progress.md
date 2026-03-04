# Test Coverage Progress — @cap/module-auth

**Last Updated:** 2025-03-02  
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

## Files Created

| File | Purpose |
|---|---|
| `vitest.config.ts` | Vitest configuration for this package |
| `src/test-setup.ts` | Global test setup (jest-dom matchers) |
| `src/utils/schema.test.ts` | Zod schema validation tests |
| `src/store/store.test.ts` | AuthSlice + UiSlice store tests |
| `src/services/endpoints.test.ts` | Static & dynamic endpoint URL tests |
| `src/hooks/useInterval.test.ts` | useInterval hook behavior tests |

---

## Coverage Status

### ✅ Completed

| Module | Tests | Coverage |
|---|---|---|
| `src/utils/schema.ts` | 28 test cases | LoginSchema, RegisterSchema, ChangePasswordSchema, ChangeEmailSchema, UpdateProfileSchema |
| `src/store/authSlice.ts` | 14 test cases | All state mutations, clearAuth, clearUser |
| `src/store/uiSlice.ts` | 8 test cases | All state mutations, clearError |
| `src/services/endpoints.ts` | 25 test cases | All dynamic URL generators |
| `src/hooks/useInterval.ts` | 7 test cases | Timing, cleanup, stale closure, null delay |

### ⏳ Not Yet Tested

#### Hooks (high priority)
- `useAuthQuery.ts` — requires React Query + API mock setup
- `useSignOut.ts` — requires navigate mock + auth store + API mock
- `usePasskey.ts` / `usePasskeyAutofill.ts` — requires `@simplewebauthn/browser` mock
- `useOidcCompliance.ts` — requires React Query + service mock
- `useProfileQuery.ts`, `useAdminQuery.ts`, `useUserQuery.ts` — React Query hooks
- `useSessionGuard.ts`, `useSSE.ts` — side-effect heavy

#### Services (medium priority)
- `auth.service.ts` — HTTP calls, needs fetch/axios mock
- `user.service.ts`, `adminService.ts`, `health.service.ts` — same

#### Middlewares (medium priority)
- `AuthRoute.tsx`, `GuestRoute.tsx`, `AdminRoute.tsx` — need router + store integration
- `useSessionGuard.ts` — needs auth store + navigate

#### Components / Screens (lower priority)
- All `src/components/**` and `src/screens/**` — RTL render tests

---

## Install Required Dev Dependencies

```bash
cd packages/modules/auth
pnpm add -D vitest @vitest/coverage-v8 @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitejs/plugin-react
```

## Run Tests

```bash
# From auth module root
npx vitest run

# With coverage
npx vitest run --coverage
```

---

## Continuing in a New Chat

Start with:
> "Continue test coverage analysis — please read `test-coverage-progress.md` to understand where we left off, then proceed with the next phase."

**Next recommended phase:** Hook testing (`useSignOut`, `useAuthQuery`) with React Query wrapper and mock API setup.
