# @cap/platform-core — Component Context

## Purpose
The shared foundation package. All modules import from it; it imports from no module.
Provides: API client, auth/user services, Zustand store, MUI theme engine, encryption,
storage utilities, browser service wrappers, and cross-cutting hooks.

## Package Location
`packages/platform-core/`

## Key Files

### Services Layer (`src/services/`)
| File | Purpose |
|---|---|
| `api/api.client.ts` | Axios-based HTTP client with auth headers, interceptors, token refresh |
| `api/offline-sync.service.ts` | Queues requests when offline; syncs on reconnect |
| `auth/auth.service.ts` | Login, logout, token management, session refresh |
| `auth-security.service.ts` | CSRF, rate limiting, security header checks |
| `browser/web-authn.service.ts` | WebAuthn/passkey browser API wrapper |
| `browser/geolocation.service.ts` | Geolocation browser API wrapper |
| `browser/file-system.service.ts` | File System Access API wrapper |
| `browser/worker.service.ts` | Web Worker management |
| `storage/session-management.service.ts` | Session storage with TTL and events |
| `storage/storage.service.ts` | Unified storage facade (local/session/indexedDB) |
| `secureTokenManager.ts` | Encrypted token storage (uses `Encrypt.ts`) |
| `tenantService.ts` | Tenant configuration fetch and cache |
| `user/user.service.ts` | Current user profile fetch and update |

### Hooks Layer (`src/services/hooks/`)
| Hook | Purpose |
|---|---|
| `useApi.ts` | Wraps API client with TanStack Query integration |
| `useSSE.ts` | Server-Sent Events subscription hook |
| `useTabSync.ts` | Cross-tab state synchronization (BroadcastChannel) |
| `useOptimisticUpdate.ts` | Zustand + TanStack Query optimistic update pattern |
| `usePersistentForm.ts` | React Hook Form with localStorage draft persistence |
| `useDeduplicatedRequest.ts` | Deduplicates in-flight identical requests |
| `useRouteState.ts` | Passes state between routes via React Router |
| `useDebounce.ts` | Standard debounce hook |

### Top-level Hooks (`src/hooks/`)
| Hook | Purpose |
|---|---|
| `useAuth.ts` | Current auth state from Zustand authSlice |
| `useUser.ts` | Current user profile |
| `usePermissions.ts` | Permission checks (role-based) |
| `useDynamicTheme.ts` | Tenant theme application |
| `useNetworkSync.ts` | Network status + offline queue management |

### Store Layer (`src/store/slices/`)
| Slice | State Managed |
|---|---|
| `authSlice.ts` | Auth session: token, user, isAuthenticated, roles |
| `profileSlice.ts` | Current user profile data |
| `settingsSlice.ts` | App settings (language, layout mode) |
| `themeSlice.ts` | Active theme mode (light/dark/system) |
| `navigationSlice.ts` | Sidebar open/collapsed, active route |
| `notificationSlice.ts` | In-app notification queue |
| `networkSlice.ts` | Online/offline status |
| `offlineQueueSlice.ts` | Queued API requests while offline |
| `guestSlice.ts` | Guest user state (unauthenticated browsing) |
| `jobsSlice.ts` | Background job tracking |
| `preferences/` | User preferences (density, theme customizations) |

### Theme Layer (`src/theme/`)
- **`index.ts`**: Builds the MUI theme via `createTheme()` with all overrides applied
- **`overrides/`**: 30+ individual MUI component overrides (button, card, dialog, input,
  table, tooltip, chip, avatar, pagination, etc.) — each in its own file for easy modification
- **`colorSchemes.ts`**: Light/dark color token definitions
- **`customShadows.ts`** / **`shadows.ts`**: Shadow elevation system
- **`typography.ts`**: Font scale and variant definitions
- **`spacing.ts`** / **`zIndex.ts`**: Spacing and z-index scales
- **`GlobalZIndexStyles.tsx`**: Global CSS z-index overrides via MUI GlobalStyles
- **`theme.d.ts`**: TypeScript augmentation for custom MUI theme tokens

### Key Contexts (`src/contexts/`)
- **`settingsContext.tsx`**: App-level settings provider (color scheme, language, RTL)
- **`tenantContext.tsx`**: Tenant config provider (branding, features, theme tokens)

### Types (`src/types/`)
- **`contracts/`**: `api.contracts.ts` + `service.contracts.ts` — defines API response/request shapes
- **`IAuth.ts`**: Auth session interface
- **`IPermission.ts`** / **`IRole.ts`**: RBAC interfaces
- **`auth-plugin.types.ts`**: Plugin registration type for extending auth flows
- **`app-types.ts`**: Global app-level TypeScript types
- **`tenant.ts`**: Tenant configuration shape

## Integration Pattern
```tsx
// Typical module hook pattern using platform-core:
import { useApi } from '@cap/platform-core/services/hooks/useApi';
import { useAuth } from '@cap/platform-core/hooks/useAuth';
import { authSlice } from '@cap/platform-core/store/slices/authSlice';
```
