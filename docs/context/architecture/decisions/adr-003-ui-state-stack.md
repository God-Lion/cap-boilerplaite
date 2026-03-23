# ADR-003: MUI + Zustand + TanStack Query Stack

**Status**: Accepted | **Date**: 2025-03

## Context
The project needed UI components, global state management, and server-state management.
Multiple options exist for each. These three choices needed to be compatible, minimal in
boilerplate, and appropriate for a product used by enterprise customers (a11y, RTL, theming).

## Decision
- **UI**: MUI (Material UI) v5+ with Emotion — provides RTL support, comprehensive a11y,
  theming system compatible with tenant customization requirements
- **Server state**: TanStack Query v5 — manages cache, loading/error states, deduplication,
  and background refetching automatically; eliminates manual fetch boilerplate
- **Client state**: Zustand — lightweight, no boilerplate, no Provider required;
  used for auth session, theme preferences, navigation state, offline queue

## Alternatives Considered
- **Tailwind CSS**: RTL support is weaker; enterprise customers expect MUI-standard components
  with built-in accessibility. Rejected.
- **Redux Toolkit**: More powerful than needed for client state; Zustand is simpler and the
  team prefers minimal ceremony. Rejected for client state.
- **SWR**: TanStack Query chosen for better mutation handling and devtools. Rejected.
- **React Context for state**: Too many re-renders at scale; Zustand avoids context overhead.

## Consequences
- ✅ RTL (Arabic) works out-of-box with MUI + `stylis-plugin-rtl`
- ✅ TanStack Query devtools available in dev mode for debugging cache
- ✅ Zustand slices in `platform-core/src/store/slices/` are tree-shaken per bundle
- ✅ MUI theme overrides centralized in `platform-core/src/theme/overrides/` (30+ components)
- ⚠️ MUI's `sx` prop has runtime cost; use `styled()` for frequently-rendered components
- ⚠️ Zustand state is NOT persisted by default; use `platform-core/services/storage/` for persistence
- ⚠️ TanStack Query cache keys must be consistent — define them in `services/query.ts` per module
