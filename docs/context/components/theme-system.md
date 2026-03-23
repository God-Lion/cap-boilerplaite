# @cap/theme — Component Context

## Purpose
Tenant-aware theming engine. Allows runtime switching of visual styles per tenant
without recompiling. Provides design tokens, styled component variants (glass, neumorphic,
adaptive), and a React context for theme propagation.

## Package Location
`packages/theme/`

## Key Architecture

### Context (`src/context/`)
- **`TenantThemeContext.tsx`**: React context that holds the active tenant's resolved theme.
  Wrap the app with this provider to enable tenant-specific styling throughout.

### Hooks (`src/hooks/`)
- **`useTenantTheme.ts`**: Reads the active tenant theme from context
- **`useThemeVariables.ts`**: Returns CSS custom properties derived from the tenant theme tokens

### Design Token Types (`src/types/`)
| File | Purpose |
|---|---|
| `designTokens.ts` | Base token shapes: colors, spacing, radii, shadows |
| `componentStyles.ts` | Per-component style overrides shape |
| `effects.ts` | Visual effect tokens: blur, glow, opacity |
| `presets.ts` | Named preset themes (e.g., "glass", "neumorphic", "flat") |

### Styled Components (`src/styled/`)
Pre-built MUI-compatible styled components with variant support:

| Component | Style Variant |
|---|---|
| `GlassCard.tsx` / `GlassButton.tsx` | Glassmorphism (backdrop-filter blur) |
| `NeuCard.tsx` / `NeuButton.tsx` | Neumorphism (inset/outset shadows) |
| `AdaptiveCard.tsx` / `AdaptiveButton.tsx` / `AdaptiveInput.tsx` | Adapts to tenant preset |

### Utilities (`src/utils/`)
- **`applyThemeVariables.ts`**: Converts token object to CSS custom properties on `:root`
- **`computeEffects.ts`**: Derives effect CSS (blur, glow) from token values
- **`mergeTheme.ts`**: Deep merges tenant overrides onto default theme tokens

## Usage Pattern
```tsx
// In app root:
<TenantThemeContext.Provider value={resolvedTenantTheme}>
  <AdaptiveCard>Content styled per tenant</AdaptiveCard>
</TenantThemeContext.Provider>

// In a component:
const theme = useTenantTheme();
const vars = useThemeVariables(); // { '--primary': '#3B82F6', ... }
```
