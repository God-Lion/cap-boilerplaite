# Architectural Rules

This document defines the three core architectural rules that govern this boilerplate project. These rules ensure maintainability, scalability, and code quality.

## Overview

The architecture is based on three fundamental principles:

1. **Component Isolation** - Clear boundaries between UI and business logic
2. **Documentation-Driven Development** - All components must exist in Storybook
3. **Strict Type Contracts** - TypeScript interfaces for all module boundaries

## Rule 1: Component Isolation

### Principle

> **If a UI component in `src/app` tries to import something from `apps/`, the build should fail.**

UI components must remain isolated from business logic. This separation ensures:
- Components are reusable across different business contexts
- Testing is easier (mock business logic at the boundary)
- Refactoring business logic doesn't break UI components
- Clear architectural layers

### Implementation

**ESLint Enforcement**: The `no-restricted-imports` rule prevents prohibited imports:

```javascript
// ❌ VIOLATION - Will fail build
import { getUserData } from 'apps/users/services'
import { BusinessLogic } from '../Modules/something'

// ✅ CORRECT - Use service layer
import { useUserData } from '@/services/api/user.service'
import { Layout } from '@/core/types'
```

**Allowed Imports for `src/app` components**:
- ✅ `@/core/*` - Core primitives (components, hooks, contexts)
- ✅ `@/configs/*` - Configuration files
- ✅ `@/types/*` - Shared type contracts
- ✅ `@/hooks/*` - Custom React hooks
- ✅ `@/services/*` - Service layer abstractions
- ✅ `@/store/*` - State management
- ❌ `apps/*` - Business logic (FORBIDDEN)
- ❌ `src/app/Modules/**` - Direct module imports (FORBIDDEN)

### Validation

Run validation:
```bash
npm run lint
npm run validate:isolation
```

Build automatically runs validation:
```bash
npm run build  # Fails if Rule 1 is violated
```

### Examples

#### ❌ Bad: Direct Business Logic Import

```typescript
// src/app/components/UserProfile.tsx
import { calculateUserScore } from 'apps/analytics/scoring'  // VIOLATION!

export function UserProfile() {
  const score = calculateUserScore(user)
  return <div>{score}</div>
}
```

#### ✅ Good: Service Layer Abstraction

```typescript
// src/app/components/UserProfile.tsx
import { useUserScore } from '@/hooks/useUserScore'  // ✓ Allowed

export function UserProfile() {
  const { score } = useUserScore()
  return <div>{score}</div>
}
```

---

## Rule 2: Documentation-Driven Development

### Principle

> **Every component must be in Storybook. If it's not in Storybook, it doesn't exist.**

All UI components must have Storybook stories. This ensures:
- Components are documented with real examples
- New developers can explore the component library
- Visual regression testing is possible
- Design system consistency
- Props and variants are clearly demonstrated

### Implementation

**Story Naming Convention**: For every component file, create a corresponding `.stories.tsx`:

```
src/app/components/UserCard.tsx           → src/stories/UserCard.stories.tsx
src/app/components/layout/Header.tsx      → src/stories/Header.stories.tsx
```

**Story Template**:

```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { UserCard } from '@/app/components/UserCard'

const meta = {
  title: 'Components/UserCard',
  component: UserCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    // Define prop controls
  },
} satisfies Meta<typeof UserCard>

export default meta
type Story = StoryObj<typeof meta>

// Default state
export const Default: Story = {
  args: {
    name: 'John Doe',
    email: 'john@example.com',
  },
}

// Variations
export const Loading: Story = {
  args: {
    isLoading: true,
  },
}

export const WithAvatar: Story = {
  args: {
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
  },
}
```

### Validation

Check coverage:
```bash
npm run validate:documentation
```

The script will report missing stories:
```
✗ FAILURE: 12 components are missing Storybook stories:
  ✗ UserProfile
    └─ ./src/app/components/UserProfile.tsx
    └─ Expected story: src/stories/UserProfile.stories.tsx
```

### Exceptions

Components that DON'T need stories:
- `index.ts` barrel exports
- Utility files (not components)
- Custom hooks (starting with `use`)
- Type definition files

### Running Storybook

```bash
npm run storybook  # Opens http://localhost:6006
```

---

## Rule 3: Strict Type Contracts

### Principle

> **Use TypeScript interfaces for all module contracts so that when the Backend changes, the Frontend "LEGO" pieces show errors immediately.**

All module boundaries must have explicit TypeScript interfaces. This ensures:
- Changes propagate as compile-time errors (not runtime bugs)
- Clear contracts between modules
- IntelliSense and autocomplete work properly
- Refactoring is safe and automated

### Implementation

**Interface Over Type for Contracts**:

```typescript
// ❌ Avoid for public contracts
export type UserData = {
  id: string
  name: string
}

// ✅ Prefer interfaces for contracts
export interface IUser {
  id: string
  name: string
  email: string
}

// ✅ Also good for service contracts
export interface IUserService {
  getUser(id: string): Promise<IUser>
  updateUser(id: string, data: Partial<IUser>): Promise<IUser>
}
```

**Type Contracts Location**:
- `src/types/contracts/` - Service contract interfaces
- `src/core/types.ts` - Core UI type contracts
- `src/types/*.ts` - Domain-specific contracts

### TSConfig Strict Mode

The project uses TypeScript strict mode:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### Validation

```bash
npm run type-check
npm run validate:types
```

Build fails on type errors:
```bash
npm run build  # Runs type-check before build
```

### Examples

#### Contract Definition

```typescript
// src/types/contracts/IAuthService.ts
export interface IAuthService {
  login(credentials: ILoginCredentials): Promise<IAuthResponse>
  logout(): Promise<void>
  getCurrentUser(): Promise<IUser | null>
}

export interface ILoginCredentials {
  email: string
  password: string
}

export interface IAuthResponse {
  user: IUser
  token: string
  refreshToken: string
}
```

#### Using Contracts

```typescript
// src/services/auth.service.ts
import type { IAuthService, ILoginCredentials } from '@/types/contracts/IAuthService'

export const authService: IAuthService = {
  async login(credentials: ILoginCredentials) {
    // Implementation
  },
  async logout() {
    // Implementation
  },
  async getCurrentUser() {
    // Implementation
  },
}
```

When backend changes (e.g., adds `expiresAt` to `IAuthResponse`):
1. Update the interface
2. TypeScript shows errors everywhere the contract is used
3. Fix all errors before deployment
4. No runtime surprises! 🎉

---

## Enforcement

### Pre-commit Hooks

Husky + lint-staged runs validation before commit:

```json
{
  "lint-staged": {
    "src/app/**/*.{ts,tsx}": [
      "npm run validate:isolation",
      "npm run validate:documentation"
    ],
    "**/*.{ts,tsx}": [
      "npm run validate:types"
    ]
  }
}
```

### CI/CD Integration

Build script validates all rules:

```bash
npm run build
# Runs: validate:architecture && tsc -b && vite build
```

### Manual Validation

```bash
# Validate all rules
npm run validate:architecture

# Individual rules
npm run validate:isolation      # Rule 1
npm run validate:documentation  # Rule 2
npm run validate:types          # Rule 3
```

---

## Benefits

### For Developers
- 🧩 Clear boundaries make code easier to understand
- 🔍 Component library (Storybook) serves as living documentation
- 🛡️ Type safety catches bugs at compile time
- ♻️ Reusable components across projects

### For Teams
- 📚 New developers onboard faster with Storybook
- 🤝 Clear contracts reduce integration issues
- 🎯 Architectural standards are automated
- 🚀 Faster development with validated patterns

### For Projects
- 🏗️ Scalable architecture that grows with the project
- 🔧 Easy to refactor with type safety
- 📦 Components can be extracted to packages
- ✅ Quality gates enforced automatically

---

## Troubleshooting

### "Cannot import from apps/"

This is Rule 1 violation. Solution:
1. Move business logic to a service layer
2. Import the service in your component
3. Keep UI and business logic separated

### "Component missing Storybook story"

This is Rule 2 violation. Solution:
1. Create `src/stories/YourComponent.stories.tsx`
2. Document all component variants
3. Add interactive examples

### "Type error after interface change"

This is Rule 3 working correctly! Solution:
1. Find all TypeScript errors
2. Update code to match new contract
3. This prevents runtime bugs

---

## Further Reading

- [Module Boundaries](./MODULE_BOUNDARIES.md) - Detailed module structure
- [Storybook Best Practices](../storybook/README.md)
- [TypeScript Patterns](../typescript/PATTERNS.md)
