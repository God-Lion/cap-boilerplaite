# Component Deep Dive — Theme & Layout Packages

## `@cap/theme`
Per its own README, this is the single source of truth for UI/UX:
- **Design tokens** (`src/tokens/`) — colors, typography, spacing, shapes, z-index scale (`src/theme/zIndex.ts`)
- **Global styles** via Emotion (`src/styles/GlobalStyles.tsx`)
- **MUI theme overrides** (`src/overrides/`, `src/theme/`)
- **Tenant-driven dynamic theming context** (`src/context/`) — this is what `useTenant()` (consumed in `app/src/Providers.tsx`) ultimately resolves against
- **Shared styled primitives** (e.g. `GlassCard`, `GlassButton` — glassmorphism effects are a named, first-class theme feature, confirmed by the `effects.glassmorphism` field in the preset config shape)

Presets are declared in a `THEME_PRESETS` dictionary conforming to a `TenantThemeConfig` shape (`metadata`, `tokens`, `effects`, `preview`), which is how a tenant is mapped to a concrete look-and-feel — supports the multi-tenant white-labeling noted in Phase 1.

Convention: other packages should import tokens directly (`colors`, `zIndexScale`) rather than hardcoding values, and apply them via `@emotion/styled` or MUI's `sx` prop.

## `@cap/layout`
Provides the structural shell components consumed by `app/src/layout.tsx`:
- `LayoutWrapper` — the actual layout **selector**. Reads `layoutOverride` from the Zustand store (`useAppStore`) and `settings.layout` (vertical/horizontal), and picks one of four render paths:
  - `layoutOverride === 'noLayout'` → renders the bare `noLayout` slot (chrome-free)
  - `layoutOverride === 'admin'` → renders `verticalLayout` or `horizontalLayout` (per `settings.layout`) inside an admin-flavored wrapper (`data-skin`)
  - anything else (including the default `'none'`) → renders `publicLayout`
  - Note: `layoutOverride === 'public'` is explicitly checked and also falls through to the public branch — effectively redundant with the default, but harmless.
- Also handles a **hydration flow**: while `isHydrating` (from `useStateHydration`), it pre-renders the final layout tree invisibly behind a spinner overlay to avoid layout shift/flicker on load, rather than showing a blank loading state.
- `VerticalLayout` / `HorizontalLayout` / `PublicLayout` / `BlankLayout` are the concrete layout shells; `VerticalNavigation` / `HorizontalNavigation` / menu components (`VerticalMenu`, `AdminMenu`, `HorizontalMenu`) render navigation sourced from the merged nav-item registry built by `assembleApp`.

## Key Takeaway for This Codebase
Because `LayoutWrapper`'s default (no override set) is **`publicLayout`**, not the dashboard/vertical layout, the practical impact of the routing gap described in `technical-issues.md` is that affected auth screens (sign-in, sign-up, etc.) render wrapped in the **public site header/footer chrome** instead of full-bleed/chrome-free — a real but more cosmetic issue than initially assumed, not a security issue and not a "wrong dashboard visible to logged-out users" issue.
