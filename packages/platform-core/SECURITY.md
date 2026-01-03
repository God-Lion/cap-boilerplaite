# 🔐 CAP Platform Security (Enterprise 2025)

This document outlines the security architecture and developer responsibilities for the Client Application Platform (CAP).

## 1. Core Security Guarantees

### RBAC Enforcement

- **Mechanism:** Strict numeric `Roles` enum validation.
- **Fail-Closed:** All route guards and permission checks default to `Forbidden` if context or roles are missing or malformed.
- **Developer Rule:** Never use string-based checks (e.g., `role === "admin"`) for sensitive logic.

### Encrypted Storage at Rest

- **Engine:** AES-GCM (256-bit) via native Web Crypto API.
- **Key Derivation:** PBKDF2 with 200,000 iterations.
- **Encoding:** Hex (No Base64/atob/btoa to avoid encoding-to-string exploitation).
- **Scope:**
  - `localStorage`: Auth tokens, Zustand store state.
  - `IndexedDB`: All cached business entities (Jobs, Profiles, etc.).

## 2. Using Secure Storage

All storage operations in `@cap/platform-core` are asynchronous and support transparent encryption.

```ts
import { localStorageManager } from '@cap/platform-core'

// Save sensitive data (automatically encrypted)
await localStorageManager.set('my_secret_key', { sensitive: 'data' }, true)

// Retrieve and decrypt
const data = await localStorageManager.get<MyType>('my_secret_key', true)
```

## 3. Threat Model & Responsibilities

### Platform Responsibilities (What we handle)

- Local persistence protection (prevents at-rest data theft).
- Hardened middleware patterns (prevents client-side state manipulation bypasses).
- Purging of unsafe legacy encoding primitives.

### Developer Responsibilities (What YOU handle)

- **Backend Enforcement:** The frontend RBAC is for UX only. All API endpoints MUST re-verify JWT roles.
- **Secret Management:** Ensure `VITE_STORAGE_ENCRYPTION_KEY` is not committed to source control and is managed via secure CI/CD secrets.
- **XSS Prevention:** Always sanitize user-provided content. Encrypted storage mitigates but does not fully prevent token theft in the event of an XSS compromise.

## 4. Security Audit Policy

Any modifications to the `encryption.ts` or `AdminRoute.tsx` files require mandatory review by the Security Architecture team.
