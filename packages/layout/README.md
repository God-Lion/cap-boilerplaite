# `@cap/layout`

## Overview
The `layout` package provides the structural UI chrome and layout templates for the `cap-boilerplaite` host application. It wraps domain modules in a cohesive, responsive app shell while remaining completely decoupled from business logic.

## Architecture & Responsibilities
*   **App Shell Templates:** Exposes standardized wrappers (`VerticalLayout`, `HorizontalLayout`, `BlankLayout`, `PublicLayout`).
*   **Navigation & Chrome:** Contains the Header, Footer, and Sidebar menu components.
*   **Theme Integration:** Works closely with `@cap/theme` and the TenantProvider to render multi-tenant, white-labeled UIs.
*   **Advanced UI Components:** Houses high-performance components like the **Virtualized React Tables** used across dashboards.

## Key Exports
*   `LayoutWrapper.tsx`: The primary High-Order Component that injects the selected layout template based on route config.
*   `components/`: Reusable layout building blocks (e.g., Header, Sidebar).
*   `index.ts`: The main entry point for importing layouts into the host app.

## Dependencies
*   Depends on `@cap/platform-core` for hooks like `useTenant` and `useSessionGuard`.
*   Depends on `@cap/theme` for design tokens and styling configurations.
*   Does **not** depend on specific domain modules like `@cap/module-auth` directly; it strictly renders based on configuration passed down from the router.
