# @cap/layout

`@cap/layout` is the shared layout and navigation package for the boilerplate. It provides the page shells, menu primitives, navigation wrappers, auth-adjacent header components, and theme-bridge utilities that apps use to assemble admin, public, and blank experiences.

## Overview

This package sits between `@cap/platform-core` and `@cap/theme`:

- It reads application state from `@cap/platform-core` for settings, auth, hydration state, dictionaries, and module-declared navigation.
- It consumes design tokens and UI primitives from `@cap/theme`.
- It exports ready-to-compose React components for vertical, horizontal, public, and blank layouts.

At a high level, the package is responsible for:

1. Rendering the top-level page shell for different layout modes.
2. Providing a reusable vertical and horizontal menu system.
3. Translating module navigation config into rendered menu items.
4. Bridging theme CSS variables into the names expected by the layout styles.
5. Supplying shared UI pieces used in headers, navbars, and auth-aware surfaces.

## Main Exports

The public entry point is [src/index.ts](/C:/Node.Js/proj/boilerplate/packages/layout/src/index.ts). The package exports:

- Layout shells: `VerticalLayout`, `HorizontalLayout`, `PublicLayout`, `BlankLayout`, `LayoutWrapper`
- Navigation wrappers: `VerticalNavigation`, `HorizontalNavigation`, `VerticalNavbar`, `PublicNavbar`, `GuestNavbar`
- Menu systems: `VerticalNav`, `HorizontalNav`, `VerticalMenu`, `HorizontalMenu`, `AdminMenu`, `ModuleMenuRenderer`
- Shared UI: `UserMenu`, `ScrollToTop`, `Grid`, `Logo`, auth components
- Hooks and helpers: `useLayoutTokens`, nav context hooks, `buildLayoutSurfaceEffect`
- Style helpers: vertical and horizontal menu style factories, styled expand icons, layout class names

## Layout Modes

### `LayoutWrapper`

[src/LayoutWrapper.tsx](/C:/Node.Js/proj/boilerplate/packages/layout/src/LayoutWrapper.tsx) is the orchestration component. It:

- Reads `settings`, hydration state, and `layoutOverride` from `@cap/platform-core`
- Initializes layout-level color preference behavior through `useLayoutInit`
- Chooses between:
  - admin layout (`verticalLayout` or `horizontalLayout` based on settings)
  - public layout
  - no-layout rendering
- Renders the final layout invisibly during hydration and shows a centered spinner to avoid visible layout shift
- Injects `ThemeBridge` for admin layouts so layout CSS variables match the active theme

### `VerticalLayout`

[src/VerticalLayout.tsx](/C:/Node.Js/proj/boilerplate/packages/layout/src/VerticalLayout.tsx) is the standard admin shell with:

- optional sidebar navigation
- optional navbar
- main content area
- optional footer

It is a structural wrapper only; the actual nav and header behavior is provided by child components.

### `HorizontalLayout`

[src/HorizontalLayout.tsx](/C:/Node.Js/proj/boilerplate/packages/layout/src/HorizontalLayout.tsx) is the top-navigation shell. It wraps content in a horizontal-nav context and renders:

- optional header
- main content area
- optional footer

### `PublicLayout`

[src/PublicLayout.tsx](/C:/Node.Js/proj/boilerplate/packages/layout/src/PublicLayout.tsx) is the unauthenticated or marketing-facing shell. It keeps a simple full-height stack:

- header
- content
- footer

### `BlankLayout`

[src/BlankLayout.tsx](/C:/Node.Js/proj/boilerplate/packages/layout/src/BlankLayout.tsx) is the minimal shell used when the app should render without a navigation frame, such as standalone auth or utility screens.

## Navigation Architecture

The menu system is one of the main responsibilities of this package.

### Core idea

Instead of hardcoding most navigation inside the layout package, menu rendering is driven by `useNavigationMenu(...)` from `@cap/platform-core`. That means feature modules can declare navigation items and this package focuses on presentation, grouping, and interaction.

### `ModuleMenuRenderer`

[src/menu/layouts/ModuleMenuRenderer.tsx](/C:/Node.Js/proj/boilerplate/packages/layout/src/menu/layouts/ModuleMenuRenderer.tsx) is the connector between module metadata and rendered menus. It:

- requests filtered navigation items for a variant (`admin`, `vertical`, or `horizontal`)
- resolves labels through the provided dictionary
- recursively renders `MenuItem` and `SubMenu`
- groups items into `MenuSection` blocks when section metadata is present

This component is what allows the package to stay generic while still rendering module-specific navigation.

### Vertical navigation

Vertical navigation is built from these layers:

- [src/components/vertical/Navigation.tsx](/C:/Node.Js/proj/boilerplate/packages/layout/src/components/vertical/Navigation.tsx): sidebar wrapper with logo, collapse controls, scroll shadow, and breakpoint-aware behavior
- [src/menu/layouts/VerticalMenu.tsx](/C:/Node.Js/proj/boilerplate/packages/layout/src/menu/layouts/VerticalMenu.tsx): configures menu styles, expand icons, scrollbar behavior, and renders `ModuleMenuRenderer`
- `src/menu/vertical-menu/` and `src/menu/components/vertical-menu/`: low-level nav primitives such as `Menu`, `MenuItem`, `SubMenu`, `MenuSection`, `NavHeader`, and collapse icons

### Horizontal navigation

Horizontal navigation mirrors the same approach:

- [src/components/horizontal/Navigation.tsx](/C:/Node.Js/proj/boilerplate/packages/layout/src/components/horizontal/Navigation.tsx): spacing and width wrapper for top navigation
- [src/menu/layouts/HorizontalMenu.tsx](/C:/Node.Js/proj/boilerplate/packages/layout/src/menu/layouts/HorizontalMenu.tsx): configures top-nav behavior and responsive fallback to a vertical nav
- `src/menu/horizontal-menu/` and `src/menu/components/horizontal-menu/`: horizontal menu primitives and flyout behavior

### Admin menu note

[src/menu/layouts/AdminMenu.tsx](/C:/Node.Js/proj/boilerplate/packages/layout/src/menu/layouts/AdminMenu.tsx) currently renders the same module-driven menu pattern for the `admin` variant.

[src/menu/adminMenu.ts](/C:/Node.Js/proj/boilerplate/packages/layout/src/menu/adminMenu.ts) exists as a placeholder export but is currently an empty static array, so the real navigation source of truth is the module registry exposed by `@cap/platform-core`.

## Theme Integration

This package does not own the full design system. Instead, it adapts layout surfaces to the theme package.

### `ThemeBridge`

[src/styles/ThemeBridge.tsx](/C:/Node.Js/proj/boilerplate/packages/layout/src/styles/ThemeBridge.tsx) injects CSS custom properties that map layout expectations to theme tokens. Examples include:

- `--border-color`
- `--border-radius`
- `--header-z-index`
- `--drawer-z-index`
- `--header-height`

This lets layout components keep stable variable names while the underlying theme system evolves independently.

### `useLayoutTokens`

[src/hooks/useLayoutTokens.ts](/C:/Node.Js/proj/boilerplate/packages/layout/src/hooks/useLayoutTokens.ts) exposes structural layout values derived from the tenant theme, including:

- layout padding
- compact content width
- header height

### `buildLayoutSurfaceEffect`

[src/utils/buildLayoutSurfaceEffect.ts](/C:/Node.Js/proj/boilerplate/packages/layout/src/utils/buildLayoutSurfaceEffect.ts) converts effect config from `@cap/theme` into style overrides for layout surfaces such as headers, footers, and drawers. It supports the package's named effect modes:

- `glass`
- `neu`
- `brutalism`
- `bento`
- `organic`
- `immersive`
- `standard`

## Shared UI and Auth-Aware Components

The package also contains reusable UI pieces that are layout-adjacent rather than domain-specific:

- `components/auth/`: auth buttons, profile display, guest banner, and feature-locked modal
- [src/components/UserMenu.tsx](/C:/Node.Js/proj/boilerplate/packages/layout/src/components/UserMenu.tsx): account dropdown built on `useAuth` and a local `useSignOut` helper
- `menu/shared/`: language, mode, notifications, shortcuts, user dropdowns, nav toggle, and logo
- `menu/search/`: command-palette style search UI built around `kbar`
- [src/components/ScrollToTop.tsx](/C:/Node.Js/proj/boilerplate/packages/layout/src/components/ScrollToTop.tsx): route-level scroll restoration helper

These exports make the package a shared shell toolkit, not just a container for page layout primitives.

## Directory Guide

```text
src/
|-- index.ts                     Public package exports
|-- LayoutWrapper.tsx            Top-level layout selection and hydration handling
|-- VerticalLayout.tsx           Admin/sidebar shell
|-- HorizontalLayout.tsx         Admin/top-nav shell
|-- PublicLayout.tsx             Public-facing shell
|-- BlankLayout.tsx              Minimal shell
|-- components/                  Layout-specific UI pieces
|   |-- vertical/                Sidebar navigation, footer, content wrappers
|   |-- horizontal/              Header, footer, nav, content wrappers
|   `-- auth/                    Auth and guest-facing shared components
|-- hooks/                       Layout initialization and token helpers
|-- menu/                        Reusable menu framework, contexts, layouts, styles, search
|-- styles/                      Styled wrappers and menu style factories
|-- utils/                       Layout class names and surface-effect helpers
|-- assets/svg/                  Inline SVG logo and icon assets
`-- types.ts                     Shared menu type definitions
```

## Important Dependencies

The package depends most directly on:

- `@cap/platform-core` for settings, hydration, auth, dictionaries, roles, and module navigation
- `@cap/theme` for themed primitives, color scheme management, and tenant token access
- `@mui/material` and Emotion for component styling
- `react-router-dom` for menu links and post-sign-out navigation
- `react-perfect-scrollbar` for desktop nav scrolling
- `kbar` for command-palette style search

## What This Package Is Not

This package is not:

- the source of truth for application business routes
- the source of truth for tenant theme definitions
- a standalone design system

Those concerns live primarily in `@cap/platform-core` and `@cap/theme`. `@cap/layout` is the composition layer that turns those inputs into a consistent application frame.

## Summary

`@cap/layout` is the monorepo's shared application shell package. Its main value is not a single component, but the combination of:

- layout selection and shell composition
- module-driven navigation rendering
- reusable menu primitives for vertical and horizontal layouts
- theme-variable bridging and surface styling helpers
- shared auth and navbar UI used across apps

If you are building a new screen or app shell in this boilerplate, this is the package that provides the frame around your page content.
