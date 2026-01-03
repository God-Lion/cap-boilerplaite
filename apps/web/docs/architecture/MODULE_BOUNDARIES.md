# Module Boundaries

This document defines the module structure and boundaries for the boilerplate project architecture.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         apps/                                │
│                    (Business Logic)                          │
│              [Future - Not Yet Implemented]                  │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │ imports allowed
                            │
┌─────────────────────────────────────────────────────────────┐
│                      src/services/                           │
│                    (Service Layer)                           │
│              API calls, data transformations                 │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │ imports allowed
                            │
┌─────────────────────────────────────────────────────────────┐
│                        src/app/                              │
│                      (UI Layer)                              │
│            Components, Layouts, Pages                        │
│                                                              │
│  CAN import: core, configs, types, hooks, services, store   │
│  CANNOT import: apps/, Modules/ (direct)                    │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │ imports allowed
                            │
┌──────────────┬──────────────┬──────────────┬────────────────┐
│  src/core/   │src/configs/  │ src/types/   │  src/hooks/    │
│              │              │              │                │
│ Primitives   │ Config       │ Contracts    │ Custom Hooks   │
│ Components   │ Theme        │ Interfaces   │                │
│ Contexts     │ i18n         │              │                │
└──────────────┴──────────────┴──────────────┴────────────────┘
```

## Module Descriptions

### `src/core/` - The Core Library

**Purpose**: Foundation layer providing reusable primitives that never depend on app-specific logic.

**Contains**:

- `components/` - Base UI components (Custom MUI wrappers, option menus)
- `contexts/` - React contexts (Settings, Theme)
- `hooks/` - Core hooks
- `styles/` - Global styles and CSS modules
- `types.ts` - Core type definitions
- `index.ts` - Public API exports

**Dependency Rules**:

- ✅ Can import: React, MUI, external libraries
- ❌ Cannot import: `src/app`, `apps/`, `src/services`
- ✅ Can be imported by: Everything

**Example Exports**:

```typescript
// Core types
export type { Layout, Skin, Mode, Direction }

// Core contexts
export { SettingsProvider, useSettings }

// Core components (when uncommented)
export { CustomAvatar, CustomChip, OptionMenu }
```

---

### `src/configs/` - Configuration

**Purpose**: Centralized configuration for the entire application.

**Contains**:

- `themeConfig.ts` - Theme settings and defaults
- `primaryColorConfig.ts` - Color palette configuration
- `guestConfig.ts` - Guest user configuration
- `i18n.ts` - Internationalization setup
- `store/` - Store configuration

**Dependency Rules**:

- ✅ Can import: `src/core/types`, external libraries
- ❌ Cannot import: `src/app`, `apps/`, components
- ✅ Can be imported by: Everything except `src/core`

**Example**:

```typescript
// themeConfig.ts
import type { Mode, Skin, Layout } from '@/core/types'

export const themeConfig = {
  mode: 'system' as Mode,
  skin: 'default' as Skin,
  layout: 'vertical' as Layout,
  // ...
}
```

---

### `src/types/` - Type Contracts

**Purpose**: Shared TypeScript interfaces and types that define contracts between modules.

**Contains**:

- `contracts/` - Service interface contracts
- `IAuth.ts` - Authentication types
- `IUser.ts` - User types
- `Response.ts` - API response types
- `job.ts` - Job-related types
- `profile.ts` - Profile types
- `types.ts` - General type definitions
- `*.d.ts` - Type declarations (MUI, PWA, styled)

**Dependency Rules**:

- ✅ Can import: Only other types
- ❌ Cannot import: Components, services, implementations
- ✅ Can be imported by: Everything

**Example**:

```typescript
// contracts/IUserService.ts
export interface IUserService {
  getUser(id: string): Promise<IUser>
  updateUser(id: string, data: Partial<IUser>): Promise<IUser>
  deleteUser(id: string): Promise<void>
}

export interface IUser {
  id: string
  name: string
  email: string
  role: UserRole
}
```

---

### `src/hooks/` - Custom React Hooks

**Purpose**: Reusable React hooks for common functionality.

**Dependency Rules**:

- ✅ Can import: `src/core`, `src/types`, `src/services`, React
- ❌ Cannot import: `src/app` components
- ✅ Can be imported by: `src/app`, other hooks

**Example**:

```typescript
// useUserData.ts
import { useQuery } from '@tanstack/react-query'
import type { IUser } from '@/types/IUser'
import { userService } from '@/services/api/user.service'

export function useUserData(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => userService.getUser(userId),
  })
}
```

---

### `src/services/` - Service Layer

**Purpose**: Abstraction layer for API calls, data transformations, and external integrations.

**Contains**:

- `api/` - API service implementations
- `storage/` - LocalStorage, IndexedDB wrappers
- `sync/` - Offline sync services

**Dependency Rules**:

- ✅ Can import: `src/types`, `src/configs`, external libraries
- ✅ Can import: `apps/` (if needed to call business logic)
- ❌ Cannot import: `src/app` components
- ✅ Can be imported by: `src/app`, `src/hooks`

**Example**:

```typescript
// api/user.service.ts
import type { IUserService, IUser } from '@/types/contracts/IUserService'

class UserService implements IUserService {
  async getUser(id: string): Promise<IUser> {
    const response = await fetch(`/api/users/${id}`)
    return response.json()
  }

  async updateUser(id: string, data: Partial<IUser>): Promise<IUser> {
    const response = await fetch(`/api/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
    return response.json()
  }
}

export const userService = new UserService()
```

---

### `src/store/` - State Management

**Purpose**: Global state management using Zustand.

**Dependency Rules**:

- ✅ Can import: `src/types`, `src/services`
- ❌ Cannot import: `src/app` components
- ✅ Can be imported by: `src/app`, `src/hooks`

**Example**:

```typescript
// slices/userSlice.ts
import { create } from 'zustand'
import type { IUser } from '@/types/IUser'

interface UserState {
  currentUser: IUser | null
  setCurrentUser: (user: IUser | null) => void
}

export const useUserStore = create<UserState>((set) => ({
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
}))
```

---

### `src/app/` - UI Layer

**Purpose**: User interface components, layouts, and pages. This is the presentation layer.

**Contains**:

- `components/` - UI components
- `layouts/` - Layout components
- `Modules/` - Feature modules (grouped components)
- `App.tsx` - Main app component
- `Providers.tsx` - Provider wrappers

**Dependency Rules**:

- ✅ Can import: `@/core`, `@/configs`, `@/types`, `@/hooks`, `@/services`, `@/store`
- ❌ **Cannot import: `apps/`** ⚠️ **RULE 1 VIOLATION**
- ❌ **Cannot import: `../Modules/` from other modules** (use services)
- ✅ Can be imported by: Nothing (top of the dependency tree)

**Example**:

```typescript
// components/UserProfile.tsx
import { useUserData } from '@/hooks/useUserData'  // ✅ Allowed
import { CustomAvatar } from '@/core'              // ✅ Allowed
import type { IUser } from '@/types/IUser'         // ✅ Allowed

export function UserProfile({ userId }: { userId: string }) {
  const { data: user } = useUserData(userId)

  return (
    <div>
      <CustomAvatar src={user?.avatarUrl} />
      <h2>{user?.name}</h2>
    </div>
  )
}
```

---

### `src/menu/` - Menu Components

**Purpose**: Specialized menu components and configurations.

**Dependency Rules**:

- ✅ Can import: `src/core`, React, MUI
- ❌ Cannot import: `src/app` (except for being used by app)
- ✅ Can be imported by: `src/app/layouts`

---

### `apps/` - Business Logic (Future)

**Purpose**: Business logic layer, domain models, complex calculations.

**Status**: Not yet implemented, but architecture is prepared for it.

**When Implemented, Will Contain**:

- `users/` - User domain logic
- `analytics/` - Analytics calculations
- `billing/` - Billing logic
- Each with: `models/`, `services/`, `repositories/`

**Dependency Rules (When Implemented)**:

- ✅ Can import: `src/types`, `src/services`, domain models
- ❌ Cannot import: `src/app` UI components
- ✅ Can be imported by: `src/services` (NOT `src/app` directly!)

---

## Import Path Examples

### ✅ Allowed Import Patterns

```typescript
// In src/app/components/Dashboard.tsx

// Core imports - always allowed
import { useSettings } from '@/core/contexts'
import { CustomAvatar } from '@/core/components/mui'
import type { Layout } from '@/core/types'

// Config imports - always allowed
import { themeConfig } from '@/configs/themeConfig'

// Type imports - always allowed
import type { IUser } from '@/types/IUser'

// Hook imports - always allowed
import { useUserData } from '@/hooks/useUserData'

// Service imports - always allowed
import { userService } from '@/services/api/user.service'

// Store imports - always allowed
import { useUserStore } from '@/store/slices/userSlice'

// Relative imports within same feature
import { DashboardHeader } from './DashboardHeader'
import { DashboardStats } from './DashboardStats'
```

### ❌ Forbidden Import Patterns

```typescript
// In src/app/components/Dashboard.tsx

// ❌ Direct import from apps/ - RULE 1 VIOLATION
import { calculateUserScore } from 'apps/analytics/scoring'

// ❌ Direct import from apps/ using @/ alias - RULE 1 VIOLATION
import { UserModel } from '@/apps/users/models'

// ❌ Direct cross-module import - Use services instead
import { BillingWidget } from '../Modules/billing/BillingWidget'

// ❌ Going up to parent's sibling - Bad architecture
import { AdminPanel } from '../../admin/AdminPanel'
```

---

## Rationale

### Why These Boundaries?

**1. Maintainability**

- Clear structure makes it easy to find code
- Changes have predictable impact zones
- New developers understand the architecture quickly

**2. Testability**

- Mock dependencies at module boundaries
- Test UI without business logic
- Test business logic without UI

**3. Reusability**

- Core components work in any context
- Services can be reused across features
- Types define clear contracts

**4. Scalability**

- Add new features without touching core
- Extract modules to packages easily
- Team can work in parallel on different layers

---

## Dependency Flow

### The Golden Rule

> **Dependencies flow DOWNWARD only. Higher layers can import lower layers, but never the reverse.**

```
apps/           ← Top (Business Logic)
    ↓ can import
services/       ← Middle (Service Layer)
    ↓ can import
app/            ← UI Layer
    ↓ can import
core/           ← Bottom (Foundation)
configs/        ← Bottom (Configuration)
types/          ← Bottom (Contracts)
```

### Why This Matters

When backend API changes:

1. Update contract in `src/types/`
2. TypeScript shows errors in `src/services/`
3. Fix service implementations
4. TypeScript shows errors in `src/hooks/`
5. Fix hooks
6. TypeScript shows errors in `src/app/`
7. Fix UI components

**Result**: Compile-time errors instead of runtime crashes! 🎉

---

## Checklist for New Code

Before adding new code, ask:

- [ ] Am I in the right module for this code?
- [ ] Are my imports following the dependency rules?
- [ ] If I'm in `src/app`, am I importing from `apps/`? (DON'T!)
- [ ] Are my interfaces defined in `src/types/`?
- [ ] Does my component have a Storybook story?
- [ ] Are my types strict (no `any`)?

---

## See Also

- [Architectural Rules (RULES.md)](./RULES.md) - The three core rules
- [Storybook Guidelines](../storybook/README.md) - Component documentation
- [TypeScript Patterns](../typescript/PATTERNS.md) - Type contract patterns
