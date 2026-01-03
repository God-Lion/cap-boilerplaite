# 🛠️ Implementation Guide: ESLint Import Restrictions (Quick Fix)

## Overview

This guide implements **Rule 1: Component Isolation** using ESLint without restructuring your codebase.

## Time Required

- **Setup:** 2-4 hours
- **Testing:** 1 hour

## Step-by-Step Implementation

### Step 1: Install ESLint Import Plugin

```bash
npm install --save-dev eslint-plugin-import
```

### Step 2: Update ESLint Configuration

Create or update `eslint.config.enhanced.js`:

```javascript
import storybook from 'eslint-plugin-storybook'
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import reactPlugin from 'eslint-plugin-react'
import prettierPlugin from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'

export default tseslint.config(
  {
    ignores: ['dist', 'node_modules'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      prettier: prettierPlugin,
      import: importPlugin,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
        },
      },
    },
    rules: {
      ...reactPlugin.configs.flat.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...prettierConfig.rules,
      'prettier/prettier': 'warn',
      'react/react-in-jsx-scope': 'off',

      // RULE 1: Component Isolation
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/apps/**', '../apps/**', '../../apps/**'],
              message:
                '❌ ARCHITECTURAL VIOLATION: UI components in src/app cannot import from apps/ directory. Keep components isolated from business logic.',
            },
            {
              group: ['**/src/app/Modules/**'],
              message:
                '❌ ARCHITECTURAL VIOLATION: Core components cannot import from app-specific modules. Extract to core/ if needed.',
            },
          ],
        },
      ],

      'import/no-restricted-paths': [
        'error',
        {
          zones: [
            {
              target: './src/app/components',
              from: './src/app/Modules',
              message:
                '❌ UI components cannot import from business modules. Extract to @/core if shared.',
            },
            {
              target: './src/core',
              from: './src/app',
              message: '❌ Core cannot depend on app layer. Core should be framework-agnostic.',
            },
          ],
        },
      ],
    },
  },
  storybook.configs['flat/recommended'],
)
```

### Step 3: Create Architecture Boundary Rules

Create `eslint-architecture-rules.js`:

```javascript
/**
 * ESLint configuration specifically for enforcing architectural boundaries
 * RULE 1: Component Isolation
 */

export const architectureRules = {
  // Prevent UI components from importing business logic
  'no-restricted-imports': [
    'error',
    {
      patterns: [
        {
          group: ['**/apps/**'],
          message:
            '❌ UI components cannot import from apps/. Violation of Rule 1: Component Isolation.',
        },
        {
          group: ['**/Modules/**'],
          message: '❌ Components cannot import from Modules/. Extract shared logic to core/.',
        },
        {
          group: ['**/services/**'],
          message: '❌ Direct service imports in components are discouraged. Use hooks from core/.',
        },
      ],
    },
  ],

  'import/no-restricted-paths': [
    'error',
    {
      zones: [
        // src/app/components can only import from:
        // - src/core
        // - src/hooks
        // - node_modules
        {
          target: './src/app/components/**/*',
          from: './src/app/Modules/**/*',
          message: '❌ Component cannot import from Modules. Rule 1 violation.',
        },
        {
          target: './src/app/components/**/*',
          from: './src/services/**/*',
          message: '❌ Component cannot directly import services. Use core hooks.',
        },

        // src/core cannot depend on src/app
        {
          target: './src/core/**/*',
          from: './src/app/**/*',
          message: '❌ Core layer cannot depend on app layer. Dependency inversion violation.',
        },

        // Configs should be pure - no app dependencies
        {
          target: './src/configs/**/*',
          from: './src/app/**/*',
          message: '❌ Configs cannot import from app layer.',
        },
      ],
    },
  ],
}

export default architectureRules
```

### Step 4: Update Validation Script

Update `scripts/architectural/validate-architecture.js`:

```javascript
function runCommand(command, ruleName) {
  try {
    console.log(`${colors.blue}→ Running: ${command}${colors.reset}`)
    execSync(command, { stdio: 'inherit', cwd: join(__dirname, '../..') })
    console.log(`${colors.green}✓ ${ruleName} - PASSED${colors.reset}\n`)
    return true
  } catch (error) {
    console.log(`${colors.red}✗ ${ruleName} - FAILED${colors.reset}\n`)
    return false
  }
}

// Rule 1: Component Isolation (UPDATED)
printRule(1, 'Component Isolation', 'UI components cannot import from apps/ or business logic')
results.isolation = runCommand(
  'npx eslint src/app/components --config eslint.config.enhanced.js',
  'Component Isolation',
)
```

### Step 5: Add Pre-commit Hook

Update `.husky/pre-commit`:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🏗️  Validating architectural rules..."

# Run architectural validation
npm run validate:architecture

# If validation fails, prevent commit
if [ $? -ne 0 ]; then
  echo "❌ Commit blocked: Architectural violations detected"
  exit 1
fi
```

### Step 6: Update Package Scripts

```json
{
  "scripts": {
    "lint:architecture": "eslint src/app/components --config eslint.config.enhanced.js",
    "validate:isolation": "npm run lint:architecture",
    "validate:architecture": "node scripts/architectural/validate-architecture.js"
  }
}
```

## Testing the Implementation

### Test 1: Valid Import (Should Pass)

```typescript
// src/app/components/Button.tsx
import { useTheme } from '@/core/hooks/useTheme' // ✅ OK
import { Icon } from '@/core/components/Icon' // ✅ OK
```

### Test 2: Invalid Import (Should Fail)

```typescript
// src/app/components/Button.tsx
import { UserService } from '@/services/user.service' // ❌ ERROR
import { userModule } from '@/app/Modules/user' // ❌ ERROR
```

### Test 3: Run Validation

```bash
# Should catch architectural violations
npm run validate:isolation

# Should show detailed error message
npm run validate:architecture
```

## Error Messages You'll See

When violations occur:

```
❌ ARCHITECTURAL VIOLATION: UI components in src/app cannot import from apps/ directory.
   Keep components isolated from business logic.

   File: src/app/components/UserProfile.tsx:3
   Import: import { UserService } from '@/services/user.service'

   Fix: Use hooks from core/ layer:
   ✅ import { useUser } from '@/core/hooks/useUser'
```

## CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/architectural-validation.yml
name: Architectural Validation

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run validate:architecture
```

## Migration Guide for Existing Violations

### 1. Identify Violations

```bash
npm run lint:architecture > violations.txt
```

### 2. Fix Pattern: Service Import

**Before:**

```typescript
// src/app/components/UserList.tsx
import { api } from '@/services/api'

function UserList() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    api.get('/users').then(setUsers)
  }, [])
}
```

**After:**

```typescript
// src/core/hooks/useUsers.ts (create this)
export function useUsers() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    api.get('/users').then(setUsers)
  }, [])

  return users
}

// src/app/components/UserList.tsx
import { useUsers } from '@/core/hooks/useUsers'

function UserList() {
  const users = useUsers()
  // Component stays pure
}
```

### 3. Fix Pattern: Module Import

**Before:**

```typescript
// src/app/components/Dashboard.tsx
import { calculateStats } from '@/app/Modules/analytics'
```

**After:**

```typescript
// src/core/utils/analytics.ts (move it)
export { calculateStats }

// src/app/components/Dashboard.tsx
import { calculateStats } from '@/core/utils/analytics'
```

## Maintenance

### Weekly Audit

```bash
# Run architectural report
npm run lint:architecture -- --format json > architecture-report.json
```

### Team Documentation

Create `docs/ARCHITECTURE-RULES.md` explaining:

- Why isolation matters
- How to structure code
- Common patterns
- Examples of good/bad

## Advantages of This Approach

✅ **Pros:**

- Quick to implement (hours, not days)
- No file restructuring needed
- Catches violations in real-time
- Works with existing tooling
- Clear error messages guide developers

⚠️ **Cons:**

- Relies on developer discipline
- Can be bypassed with `// eslint-disable`
- No physical boundaries (just conventions)
- Refactoring can be tedious

## When to Upgrade

Consider moving to full monorepo if:

1. Team grows beyond 5-10 developers
2. Planning multiple apps/packages
3. Need stronger enforcement
4. Want to publish reusable packages

## Support

If you encounter issues:

1. Check ESLint output: `npm run lint:architecture`
2. Verify TypeScript paths: `npx tsc --showConfig`
3. Review import aliases in `tsconfig.json`

## Next Steps

After implementation:

- [ ] Run full lint to find violations
- [ ] Create migration tickets for violations
- [ ] Update team documentation
- [ ] Add to onboarding docs
- [ ] Monitor in CI/CD

## Estimated Impact

**Before:**

- No enforcement of boundaries
- Mixed concerns common
- Hard to reason about dependencies

**After:**

- Immediate feedback on violations
- Clear separation of concerns
- Better code organization
- Easier to onboard new developers
