# Context Engineering Progress

> **For new chat sessions**: Read this file to understand the project, methodology,
> and what has been completed. Then continue with the tasks listed under "Next Steps".

---

## How to Continue in a New Chat

Start with:
> *"Continue context engineering — please read `docs/context/context-engineering-progress.md`
> to understand our methodology and where we left off, then help me with [your task]."*

---

## Project Identity

- **Project**: CAP Boilerplate — React/TypeScript identity and authentication frontend monorepo
- **Root path**: `C:\Node.Js\proj\boilerplate\`
- **Package namespace**: `@cap/*`
- **Package manager**: pnpm workspaces
- **Primary tech**: React 18, TypeScript, Vite, MUI v5, TanStack Query v5, Zustand, React Router v6

## Key Architectural Facts (memorize these)
1. `app/` is the host shell — it imports and assembles all `@cap/*` packages
2. `packages/platform-core` = shared foundation (services, state, theme engine)
3. `packages/modules/auth` = the primary deliverable — has 8 internal sub-modules
4. No sibling module imports — `module-auth` and `module-admin` must NOT import each other
5. All new screens → go into the appropriate sub-module under `packages/modules/auth/src/modules/`
6. All user-facing strings → use i18next, add to `src/data/dictionaries/{en,ar,fr}.json`
7. `app/src/menu/` is legacy — canonical menu code is `packages/layout/src/menu/`

---

## Completed Phases

### ✅ Phase 1 — Discovery (completed this session)
- Full recursive directory tree generated (entire monorepo explored)
- Identified all packages, sub-modules, key files, and patterns
- Confirmed: pnpm workspaces, `@cap/*` namespace, 8 auth sub-modules, hexagonal layer pattern

### ✅ Phase 2 — Core Documentation (completed this session)
All files written to `docs/context/`:

| File | Status | Description |
|---|---|---|
| `project-overview.md` | ✅ Done | Master index with nav table, monorepo map, AI collab notes |
| `architecture/system-design.md` | ✅ Done | Dep graph, layer pattern, auth sub-module map, tooling |
| `architecture/decisions/adr-001-pnpm-monorepo.md` | ✅ Done | Why pnpm monorepo |
| `architecture/decisions/adr-002-module-pattern.md` | ✅ Done | Feature module + sub-module pattern + new module checklist |
| `architecture/decisions/adr-003-ui-state-stack.md` | ✅ Done | MUI + Zustand + TanStack Query rationale |
| `components/auth-module.md` | ✅ Done | All 8 auth sub-modules documented |
| `components/platform-core.md` | ✅ Done | All services, hooks, store slices, theme layer, types |
| `components/theme-system.md` | ✅ Done | Tenant theme context, tokens, styled components, utils |
| `components/layout-package.md` | ✅ Done | Layout variants, nav components, menu system, migration status |
| `workflows/development.md` | ✅ Done | Install, scripts, testing, code quality, naming conventions |
| `context-engineering-progress.md` | ✅ Done | This file |

### Phase 3 — Integration (optional, not yet started)
Could include: component-level docs for `shared-types`, `module-admin`, `module-landing`,
`theme-admin`; onboarding guide; ADR for i18n strategy; ADR for tenant theming approach.

---

## Current Status: COMPLETE (Phase 2)

The core context system is fully operational. All major packages, patterns,
architectural decisions, and development workflows are documented.

---

## Suggested Next Steps

### Immediate Value (Phase 3 options — pick what you need):

1. **ADR-004: i18n Strategy** — document the 3-language (AR/EN/FR) setup, RTL handling,
   and dictionary-per-module convention. File: `architecture/decisions/adr-004-i18n.md`

2. **ADR-005: Tenant Theming** — document runtime tenant theme injection, design token
   contract, and how `@cap/theme-admin` connects to `@cap/theme`.
   File: `architecture/decisions/adr-005-tenant-theming.md`

3. **Component doc: `module-admin`** — document `domain-kernel`, `idaas-facade`, dashboard,
   and theme-customizer sub-modules. File: `components/admin-module.md`

4. **Component doc: `shared-types`** — document the compiled type contract (IAuth, IUser, ICommon).
   File: `components/shared-types.md`

5. **Onboarding guide** — step-by-step: clone → install → run → add first screen.
   File: `workflows/onboarding.md`

6. **Update existing docs** — if code has changed since documentation was written,
   re-read specific source files and update the corresponding context doc.

### To update any doc:
> *"Read `[file path]` and update `docs/context/components/[doc].md` to reflect the current code."*

---

## Methodology Notes

- **Chunked writes**: All files written in ≤30-line chunks via Desktop Commander
- **Directory creation**: Used `Windows-MCP:FileSystem` write to create dirs (no mkdir tool)
- **No content was deleted**: All documentation is additive
- **Source of truth**: Actual directory tree explored via `desktop-commander:list_directory`
  with depth 5-6, excluding `node_modules`, `.git`, `dist`, `dev-dist`
