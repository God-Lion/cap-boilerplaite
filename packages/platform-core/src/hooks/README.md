# Domain Hooks
This directory contains domain-specific React hooks (e.g. auth, navigation, user state) for the application logic.

**Canonical hooks in this directory:**
- `useAuth` - Authentication state and methods
- `useNavigation` - Navigation utilities
- `usePermissions` - Role and permission checks
- `useObjectCookie` - Cookie-based object storage (canonical implementation)
- `useDynamicTheme` - Dynamic theme switching
- `useNetworkSync` - Network state synchronization
- `useUser` - User data and preferences

For infrastructure or technical utility hooks (like debouncing, API calls, optimistic updates, SSE connections), see the `src/services/hooks` directory.

## Re-exports
Components can re-export hooks from this directory for convenience:
```ts
export { useObjectCookie } from '@cap/platform-core'
```
