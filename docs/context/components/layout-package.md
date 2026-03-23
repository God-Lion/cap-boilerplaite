# @cap/layout — Component Context

## Purpose
Provides the application shell: layout wrappers, navigation components (vertical sidebar,
horizontal top nav), header, footer, and menu system. Consumed by the `app/` host shell.
This package is actively being stabilized — the `app/src/menu/` directory contains legacy
menu code being migrated here.

## Package Location
`packages/layout/`

## Layout Variants

| Component | Use Case |
|---|---|
| `VerticalLayout.tsx` | Admin/dashboard — sidebar + topbar + content area |
| `HorizontalLayout.tsx` | Marketing/app — top navigation bar + content |
| `BlankLayout.tsx` | Auth screens — no nav, full-page content |
| `PublicLayout.tsx` | Public pages — minimal header, full-page content |
| `LayoutWrapper.tsx` | Selects layout variant based on route metadata |

## Key Files
- `src/index.ts` — exports all layouts and components
- `src/hooks/useLayoutInit.tsx` — initializes layout state (sidebar mode, theme, breakpoints)
- `src/hooks/useSignOut.ts` — sign-out action wired into nav components
- `src/types.ts` — layout configuration types (nav mode, skin, content width)
- `src/utils/layoutClasses.ts` — CSS class name constants for layout elements
- `src/utils/avatarUtils.ts` — avatar initial/color generation utility

## Navigation Components

### Vertical Nav (`src/components/vertical/`)
- `Navigation.tsx` — renders menu tree from config
- `NavToggle.tsx` — collapse/expand sidebar button
- `LayoutContent.tsx` — main content area with scroll
- `Footer.tsx` / `FooterContent.tsx` — footer bar

### Horizontal Nav (`src/components/horizontal/`)
- `Header.tsx` / `Navbar.tsx` — top navigation bar
- `Navigation.tsx` — horizontal menu rendering
- `VerticalNavContent.tsx` — vertical drawer inside horizontal layout (mobile)

### Shared Components
- `Avatar.tsx` — MUI Avatar with initials fallback
- `DrawerMenu.tsx` — mobile drawer navigation
- `Icon.tsx` — Iconify icon wrapper
- `UserMenu.tsx` — user avatar dropdown (profile, sign out)

## Menu System (`src/menu/`)
The layout package contains a full menu system matching the one in `app/src/menu/`.
- **Contexts**: `horizontalNavContext`, `verticalNavContext`, `horizontalMenuContext`
- **Styles**: Styled components for both horizontal and vertical menu items/nav
- **Hooks**: `useMediaQuery` — breakpoint detection for responsive layout

## Migration Status
⚠️ `app/src/menu/` is a near-duplicate of `packages/layout/src/menu/`.
The canonical source is `packages/layout/`. New menu changes should go in the package.
