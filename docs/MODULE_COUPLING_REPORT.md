# Module Coupling Report

- Scope: workspace source files under `app/src` and `packages/**/src`
- Generated: 2026-08-02T00:29:38.456Z
- Source files analyzed: 799
- Workspace packages analyzed: 10
- Sub-modules identified: 67
- Exclusions: `node_modules`, `dist`, `dev-dist`, `public`, `e2e`, `playwright`, tests/specs/stories, type declaration files

## How To Read This

- `Ce` (efferent coupling) is the number of other workspace packages a package depends on.
- `Ca` (afferent coupling) is the number of other workspace packages depending on it.
- `Instability` is `Ce / (Ca + Ce)`; closer to `1.00` means the package mainly depends outward, closer to `0.00` means it is a stable dependency used by others.
- Sub-module keys use the first meaningful source boundary: `modules/<name>`, `domain-kernel`, or the first folder under `src`.

## Package Overview

| Package | Files | Ce | Ca | Instability | Strongest outgoing | Strongest incoming |
| --- | ---: | ---: | ---: | ---: | --- | --- |
| @cap/shared-types | 16 | 0 | 9 | 0.00 | None | @cap/platform-core (23), @cap/theme (19), @cap/platform-store (11) |
| @cap/layout | 193 | 5 | 3 | 0.63 | @cap/platform-core (49), @cap/theme (32), @cap/shared-types (9) | @cap/app (3), @cap/module-auth (2), @cap/module-landing (1) |
| @cap/platform-core | 56 | 3 | 4 | 0.43 | @cap/shared-types (23), @cap/platform-store (20), @cap/theme (13) | @cap/module-auth (76), @cap/layout (49), @cap/app (11) |
| @cap/theme | 119 | 1 | 6 | 0.14 | @cap/shared-types (19) | @cap/layout (32), @cap/platform-core (13), @cap/module-auth (2) |
| @cap/module-auth | 329 | 5 | 1 | 0.83 | @cap/platform-core (76), @cap/shared-types (7), @cap/layout (2) | @cap/layout (8) |
| @cap/platform-store | 26 | 2 | 4 | 0.33 | @cap/shared-types (11), @cap/theme (1) | @cap/platform-core (20), @cap/layout (4), @cap/module-auth (2) |
| @cap/app | 28 | 4 | 0 | 1.00 | @cap/platform-core (11), @cap/layout (3), @cap/shared-types (2) | None |
| @cap/module-landing | 26 | 4 | 0 | 1.00 | @cap/platform-core (9), @cap/layout (1), @cap/shared-types (1) | None |
| @cap/auth-contracts | 4 | 3 | 0 | 1.00 | @cap/shared-types (6), @cap/api-contracts (1), @cap/platform-store (1) | None |
| @cap/api-contracts | 2 | 1 | 1 | 0.50 | @cap/shared-types (1) | @cap/auth-contracts (1) |

## Strongest Package-To-Package Edges

| From | To | File-level edges |
| --- | --- | ---: |
| @cap/module-auth | @cap/platform-core | 76 |
| @cap/layout | @cap/platform-core | 49 |
| @cap/layout | @cap/theme | 32 |
| @cap/platform-core | @cap/shared-types | 23 |
| @cap/platform-core | @cap/platform-store | 20 |
| @cap/theme | @cap/shared-types | 19 |
| @cap/platform-core | @cap/theme | 13 |
| @cap/app | @cap/platform-core | 11 |
| @cap/platform-store | @cap/shared-types | 11 |
| @cap/layout | @cap/shared-types | 9 |
| @cap/module-landing | @cap/platform-core | 9 |
| @cap/layout | @cap/module-auth | 8 |
| @cap/module-auth | @cap/shared-types | 7 |
| @cap/auth-contracts | @cap/shared-types | 6 |
| @cap/layout | @cap/platform-store | 4 |
| @cap/app | @cap/layout | 3 |
| @cap/app | @cap/shared-types | 2 |
| @cap/module-auth | @cap/layout | 2 |
| @cap/module-auth | @cap/platform-store | 2 |
| @cap/module-auth | @cap/theme | 2 |

## Top Sub-Modules By Coupling

| Package | Sub-module | Files | Outgoing sub-modules | Incoming sub-modules | Strongest outgoing | Strongest incoming |
| --- | --- | ---: | ---: | ---: | --- | --- |
| @cap/platform-core | (root) | 2 | 13 | 25 | @cap/platform-core:hooks (7), @cap/platform-core:contexts (3), @cap/platform-core:services (3) | @cap/layout:menu (24), @cap/module-auth:modules/authentication-core (22), @cap/module-auth:modules/user-directory (15) |
| @cap/shared-types | (root) | 15 | 0 | 30 | None | @cap/platform-core:types (10), @cap/theme:overrides (10), @cap/platform-store:store (8) |
| @cap/theme | (root) | 1 | 10 | 17 | @cap/theme:assets (4), @cap/theme:context (3), @cap/theme:components (1) | @cap/layout:menu (15), @cap/layout:components (8), @cap/layout:styles (5) |
| @cap/module-auth | modules/authentication-core | 85 | 11 | 9 | @cap/platform-core:(root) (22), @cap/module-auth:routes (16), @cap/module-auth:domain-kernel (4) | @cap/module-auth:modules/user-directory (26), @cap/module-auth:modules/platform-cluster (18), @cap/module-auth:modules/identity-broker (11) |
| @cap/module-auth | routes | 3 | 10 | 9 | @cap/module-auth:modules/authentication-core (4), @cap/platform-core:(root) (3), @cap/layout:(root) (2) | @cap/module-auth:modules/authentication-core (16), @cap/module-auth:modules/user-directory (13), @cap/module-auth:modules/authorization-engine (11) |
| @cap/module-auth | (root) | 1 | 14 | 4 | @cap/module-auth:domain-kernel (4), @cap/module-auth:modules/authentication-core (3), @cap/module-auth:routes (3) | @cap/module-auth:modules/identity-broker (10), @cap/layout:menu (6), @cap/module-auth:modules/session-manager (3) |
| @cap/module-auth | modules/authorization-engine | 37 | 9 | 6 | @cap/module-auth:routes (11), @cap/platform-core:(root) (5), @cap/module-auth:domain-kernel (4) | @cap/module-auth:modules/user-directory (5), @cap/module-auth:modules/identity-broker (4), @cap/module-auth:(root) (2) |
| @cap/platform-store | (root) | 1 | 2 | 12 | @cap/platform-store:services (1), @cap/platform-store:store (1) | @cap/platform-core:services (8), @cap/platform-core:hooks (5), @cap/layout:components (3) |
| @cap/layout | (root) | 8 | 9 | 4 | @cap/layout:menu (21), @cap/layout:components (18), @cap/layout:styles (7) | @cap/app:(root) (3), @cap/module-auth:routes (2), @cap/layout:menu (1) |
| @cap/layout | menu | 87 | 10 | 3 | @cap/platform-core:(root) (24), @cap/theme:(root) (15), @cap/layout:styles (9) | @cap/layout:(root) (21), @cap/layout:components (12), @cap/layout:styles (10) |
| @cap/module-auth | modules/user-directory | 52 | 6 | 6 | @cap/module-auth:modules/authentication-core (26), @cap/platform-core:(root) (15), @cap/module-auth:routes (13) | @cap/module-auth:modules/authorization-engine (4), @cap/layout:menu (2), @cap/module-auth:modules/authentication-core (2) |
| @cap/layout | components | 70 | 9 | 2 | @cap/platform-core:(root) (14), @cap/layout:menu (12), @cap/layout:utils (12) | @cap/layout:(root) (18), @cap/layout:menu (2) |
| @cap/layout | styles | 15 | 6 | 3 | @cap/layout:menu (10), @cap/theme:(root) (5), @cap/layout:utils (4) | @cap/layout:menu (9), @cap/layout:(root) (7), @cap/layout:components (6) |
| @cap/module-auth | modules/session-manager | 20 | 4 | 5 | @cap/module-auth:(root) (3), @cap/module-auth:routes (3), @cap/platform-core:(root) (3) | @cap/module-auth:(root) (2), @cap/module-auth:modules/authentication-core (2), @cap/module-auth:modules/authorization-engine (1) |
| @cap/platform-core | types | 10 | 4 | 5 | @cap/shared-types:(root) (10), @cap/theme:(root) (3), @cap/platform-store:(root) (2) | @cap/platform-core:(root) (2), @cap/platform-core:contexts (2), @cap/platform-core:hooks (2) |
| @cap/theme | utils | 7 | 4 | 5 | @cap/theme:types (12), @cap/shared-types:(root) (2), @cap/theme:assets (2) | @cap/theme:styled (16), @cap/theme:hooks (4), @cap/theme:overrides (2) |
| @cap/module-auth | modules/platform-cluster | 41 | 5 | 3 | @cap/module-auth:modules/authentication-core (18), @cap/platform-core:(root) (11), @cap/module-auth:routes (6) | @cap/module-auth:(root) (2), @cap/module-auth:modules/authorization-engine (1), @cap/module-auth:routes (1) |
| @cap/module-auth | modules/identity-broker | 30 | 5 | 2 | @cap/module-auth:modules/authentication-core (11), @cap/module-auth:(root) (10), @cap/module-auth:routes (7) | @cap/module-auth:(root) (1), @cap/module-auth:routes (1) |
| @cap/module-auth | modules/mfa-orchestrator | 29 | 4 | 3 | @cap/module-auth:routes (3), @cap/platform-core:(root) (3), @cap/module-auth:modules/authentication-core (2) | @cap/module-auth:modules/authentication-core (2), @cap/module-auth:(root) (1), @cap/module-auth:routes (1) |
| @cap/platform-core | hooks | 8 | 6 | 1 | @cap/platform-store:(root) (5), @cap/shared-types:(root) (3), @cap/platform-core:types (2) | @cap/platform-core:(root) (7) |
| @cap/platform-core | services | 17 | 4 | 3 | @cap/platform-store:(root) (8), @cap/shared-types:(root) (4), @cap/platform-core:types (2) | @cap/platform-core:(root) (3), @cap/module-auth:registry (1), @cap/platform-core:contexts (1) |
| @cap/theme | assets | 24 | 4 | 3 | @cap/theme:context (3), @cap/shared-types:(root) (1), @cap/theme:types (1) | @cap/theme:(root) (4), @cap/theme:utils (2), @cap/theme:styles (1) |
| @cap/theme | context | 4 | 4 | 3 | @cap/theme:types (4), @cap/shared-types:(root) (2), @cap/theme:hooks (1) | @cap/theme:hooks (6), @cap/theme:(root) (3), @cap/theme:assets (3) |
| @cap/theme | types | 7 | 1 | 6 | @cap/shared-types:(root) (2) | @cap/theme:utils (12), @cap/theme:hooks (11), @cap/theme:styled (6) |
| @cap/module-landing | screens | 10 | 4 | 2 | @cap/platform-core:(root) (8), @cap/module-landing:components (2), @cap/layout:(root) (1) | @cap/module-landing:routes (8), @cap/module-landing:(root) (7) |

## Strongest Sub-Module Edges

| From | To | File-level edges |
| --- | --- | ---: |
| @cap/auth-contracts:services | @cap/auth-contracts:types | 163 |
| @cap/module-auth:modules/user-directory | @cap/module-auth:modules/authentication-core | 26 |
| @cap/layout:menu | @cap/platform-core:(root) | 24 |
| @cap/module-auth:modules/authentication-core | @cap/platform-core:(root) | 22 |
| @cap/layout:(root) | @cap/layout:menu | 21 |
| @cap/layout:(root) | @cap/layout:components | 18 |
| @cap/module-auth:modules/platform-cluster | @cap/module-auth:modules/authentication-core | 18 |
| @cap/module-auth:modules/authentication-core | @cap/module-auth:routes | 16 |
| @cap/theme:styled | @cap/theme:utils | 16 |
| @cap/layout:menu | @cap/theme:(root) | 15 |
| @cap/module-auth:modules/user-directory | @cap/platform-core:(root) | 15 |
| @cap/layout:components | @cap/platform-core:(root) | 14 |
| @cap/module-auth:modules/user-directory | @cap/module-auth:routes | 13 |
| @cap/layout:components | @cap/layout:menu | 12 |
| @cap/layout:components | @cap/layout:utils | 12 |
| @cap/theme:utils | @cap/theme:types | 12 |
| @cap/module-auth:modules/authorization-engine | @cap/module-auth:routes | 11 |
| @cap/module-auth:modules/identity-broker | @cap/module-auth:modules/authentication-core | 11 |
| @cap/module-auth:modules/platform-cluster | @cap/platform-core:(root) | 11 |
| @cap/theme:hooks | @cap/theme:types | 11 |
| @cap/layout:styles | @cap/layout:menu | 10 |
| @cap/module-auth:modules/identity-broker | @cap/module-auth:(root) | 10 |
| @cap/platform-core:types | @cap/shared-types:(root) | 10 |
| @cap/theme:overrides | @cap/shared-types:(root) | 10 |
| @cap/layout:menu | @cap/layout:styles | 9 |

## File Hotspots

| File | Package | Sub-module | Internal out | Internal in | Cross-package out | Cross-package in |
| --- | --- | --- | ---: | ---: | ---: | ---: |
| packages/platform-core/src/index.ts | @cap/platform-core | (root) | 20 | 128 | 3 | 128 |
| packages/shared-types/src/index.ts | @cap/shared-types | (root) | 8 | 64 | 0 | 64 |
| packages/layout/src/index.ts | @cap/layout | (root) | 52 | 5 | 0 | 5 |
| packages/theme/src/index.ts | @cap/theme | (root) | 15 | 42 | 0 | 42 |
| packages/modules/auth/src/routes/path.ts | @cap/module-auth | routes | 0 | 55 | 0 | 0 |
| packages/theme/src/overrides/core-overrides/index.ts | @cap/theme | overrides | 37 | 3 | 1 | 0 |
| packages/modules/auth/src/index.ts | @cap/module-auth | (root) | 20 | 17 | 1 | 4 |
| packages/layout/src/menu/types.ts | @cap/layout | menu | 1 | 32 | 1 | 0 |
| packages/modules/auth/src/modules/authentication-core/routes/routes.tsx | @cap/module-auth | modules/authentication-core | 30 | 1 | 1 | 0 |
| packages/platform-store/src/index.ts | @cap/platform-store | (root) | 2 | 25 | 0 | 25 |
| packages/layout/src/menu/utils/menuClasses.ts | @cap/layout | menu | 1 | 24 | 1 | 0 |
| packages/theme/src/types/index.ts | @cap/theme | types | 5 | 19 | 0 | 0 |
| packages/layout/src/components/ui/index.ts | @cap/layout | components | 21 | 1 | 0 | 0 |
| packages/platform-store/src/store/index.ts | @cap/platform-store | store | 10 | 12 | 0 | 0 |
| packages/layout/src/menu/contexts/verticalNavContext.tsx | @cap/layout | menu | 1 | 20 | 0 | 0 |
| packages/modules/auth/src/modules/authentication-core/hooks/useAdminQuery.ts | @cap/module-auth | modules/authentication-core | 2 | 19 | 1 | 0 |
| packages/modules/auth/src/modules/authorization-engine/services/adminService.ts | @cap/module-auth | modules/authorization-engine | 4 | 15 | 2 | 0 |
| packages/theme/src/utils/themeObjectStyles.ts | @cap/theme | utils | 4 | 15 | 0 | 0 |
| packages/modules/auth/src/modules/authentication-core/hooks/useAuthQuery.ts | @cap/module-auth | modules/authentication-core | 5 | 13 | 1 | 0 |
| packages/layout/src/utils/layoutClasses.ts | @cap/layout | utils | 0 | 17 | 0 | 0 |
| packages/layout/src/menu/components/horizontal-menu/SubMenu.tsx | @cap/layout | menu | 15 | 1 | 0 | 0 |
| packages/layout/src/menu/components/vertical-menu/Menu.tsx | @cap/layout | menu | 7 | 9 | 1 | 0 |
| packages/layout/src/menu/components/vertical-menu/VerticalNav.tsx | @cap/layout | menu | 9 | 7 | 0 | 0 |
| packages/modules/auth/src/modules/identity-broker/screens/sso/index.ts | @cap/module-auth | modules/identity-broker | 15 | 1 | 0 | 0 |
| packages/theme/src/styled/index.ts | @cap/theme | styled | 15 | 1 | 0 | 0 |

## Package Deep Dives

### @cap/module-auth
- Files analyzed: 329
- Package efferent coupling (Ce): 5
- Package afferent coupling (Ca): 1
- Strongest package dependencies: @cap/platform-core (76), @cap/shared-types (7), @cap/layout (2), @cap/platform-store (2), @cap/theme (2)
- Strongest package dependents: @cap/layout (8)
- Most referenced external imports: @mui/material (160), react (148), react-i18next (135), @mui/icons-material (111), react-router-dom (96)
- `modules/authentication-core`: 85 files, outgoing to 11 sub-modules, incoming from 9; strongest outgoing @cap/platform-core:(root) (22), @cap/module-auth:routes (16).
- `routes`: 3 files, outgoing to 10 sub-modules, incoming from 9; strongest outgoing @cap/module-auth:modules/authentication-core (4), @cap/platform-core:(root) (3).
- `(root)`: 1 files, outgoing to 14 sub-modules, incoming from 4; strongest outgoing @cap/module-auth:domain-kernel (4), @cap/module-auth:modules/authentication-core (3).
- `modules/authorization-engine`: 37 files, outgoing to 9 sub-modules, incoming from 6; strongest outgoing @cap/module-auth:routes (11), @cap/platform-core:(root) (5).
- `modules/user-directory`: 52 files, outgoing to 6 sub-modules, incoming from 6; strongest outgoing @cap/module-auth:modules/authentication-core (26), @cap/platform-core:(root) (15).
- `modules/session-manager`: 20 files, outgoing to 4 sub-modules, incoming from 5; strongest outgoing @cap/module-auth:(root) (3), @cap/module-auth:routes (3).
- `modules/platform-cluster`: 41 files, outgoing to 5 sub-modules, incoming from 3; strongest outgoing @cap/module-auth:modules/authentication-core (18), @cap/platform-core:(root) (11).
- `modules/identity-broker`: 30 files, outgoing to 5 sub-modules, incoming from 2; strongest outgoing @cap/module-auth:modules/authentication-core (11), @cap/module-auth:(root) (10).

### @cap/layout
- Files analyzed: 193
- Package efferent coupling (Ce): 5
- Package afferent coupling (Ca): 3
- Strongest package dependencies: @cap/platform-core (49), @cap/theme (32), @cap/shared-types (9), @cap/module-auth (8), @cap/platform-store (4)
- Strongest package dependents: @cap/app (3), @cap/module-auth (2), @cap/module-landing (1)
- Most referenced external imports: react (97), @emotion/styled (46), @mui/material (42), @mui/material/styles (37), classnames (32)
- `(root)`: 8 files, outgoing to 9 sub-modules, incoming from 4; strongest outgoing @cap/layout:menu (21), @cap/layout:components (18).
- `menu`: 87 files, outgoing to 10 sub-modules, incoming from 3; strongest outgoing @cap/platform-core:(root) (24), @cap/theme:(root) (15).
- `components`: 70 files, outgoing to 9 sub-modules, incoming from 2; strongest outgoing @cap/platform-core:(root) (14), @cap/layout:menu (12).
- `styles`: 15 files, outgoing to 6 sub-modules, incoming from 3; strongest outgoing @cap/layout:menu (10), @cap/theme:(root) (5).
- `hooks`: 5 files, outgoing to 2 sub-modules, incoming from 3; strongest outgoing @cap/platform-core:(root) (4), @cap/theme:(root) (2).
- `utils`: 3 files, outgoing to 1 sub-modules, incoming from 3; strongest outgoing @cap/theme:(root) (1).
- `assets`: 5 files, outgoing to 0 sub-modules, incoming from 3; strongest outgoing None.

### @cap/theme
- Files analyzed: 119
- Package efferent coupling (Ce): 1
- Package afferent coupling (Ca): 6
- Strongest package dependencies: @cap/shared-types (19)
- Strongest package dependents: @cap/layout (32), @cap/platform-core (13), @cap/module-auth (2), @cap/app (1), @cap/module-landing (1)
- Most referenced external imports: @mui/material/styles (77), react (39), @mui/material (9), @mui/material/Chip (3), @emotion/styled (2)
- `(root)`: 1 files, outgoing to 10 sub-modules, incoming from 17; strongest outgoing @cap/theme:assets (4), @cap/theme:context (3).
- `utils`: 7 files, outgoing to 4 sub-modules, incoming from 5; strongest outgoing @cap/theme:types (12), @cap/shared-types:(root) (2).
- `assets`: 24 files, outgoing to 4 sub-modules, incoming from 3; strongest outgoing @cap/theme:context (3), @cap/shared-types:(root) (1).
- `context`: 4 files, outgoing to 4 sub-modules, incoming from 3; strongest outgoing @cap/theme:types (4), @cap/shared-types:(root) (2).
- `types`: 7 files, outgoing to 1 sub-modules, incoming from 6; strongest outgoing @cap/shared-types:(root) (2).
- `hooks`: 7 files, outgoing to 3 sub-modules, incoming from 3; strongest outgoing @cap/theme:types (11), @cap/theme:context (6).
- `overrides`: 41 files, outgoing to 2 sub-modules, incoming from 2; strongest outgoing @cap/shared-types:(root) (10), @cap/theme:utils (2).
- `styled`: 16 files, outgoing to 3 sub-modules, incoming from 1; strongest outgoing @cap/theme:utils (16), @cap/theme:types (6).

### @cap/platform-core
- Files analyzed: 56
- Package efferent coupling (Ce): 3
- Package afferent coupling (Ca): 4
- Strongest package dependencies: @cap/shared-types (23), @cap/platform-store (20), @cap/theme (13)
- Strongest package dependents: @cap/module-auth (76), @cap/layout (49), @cap/app (11), @cap/module-landing (9)
- Most referenced external imports: react (18), @tanstack/react-query (3), @mui/material (2), react-router-dom (2), @mui/icons-material (1)
- `(root)`: 2 files, outgoing to 13 sub-modules, incoming from 25; strongest outgoing @cap/platform-core:hooks (7), @cap/platform-core:contexts (3).
- `types`: 10 files, outgoing to 4 sub-modules, incoming from 5; strongest outgoing @cap/shared-types:(root) (10), @cap/theme:(root) (3).
- `hooks`: 8 files, outgoing to 6 sub-modules, incoming from 1; strongest outgoing @cap/platform-store:(root) (5), @cap/shared-types:(root) (3).
- `services`: 17 files, outgoing to 4 sub-modules, incoming from 3; strongest outgoing @cap/platform-store:(root) (8), @cap/shared-types:(root) (4).
- `contexts`: 1 files, outgoing to 4 sub-modules, incoming from 2; strongest outgoing @cap/platform-core:types (2), @cap/theme:(root) (2).
- `utils`: 5 files, outgoing to 4 sub-modules, incoming from 2; strongest outgoing @cap/shared-types:(root) (2), @cap/platform-core:configs (1).
- `assembly`: 1 files, outgoing to 3 sub-modules, incoming from 1; strongest outgoing @cap/platform-core:components (2), @cap/platform-core:(root) (1).
- `components`: 3 files, outgoing to 1 sub-modules, incoming from 2; strongest outgoing @cap/platform-store:(root) (1).

### @cap/app
- Files analyzed: 28
- Package efferent coupling (Ce): 4
- Package afferent coupling (Ca): 0
- Strongest package dependencies: @cap/platform-core (11), @cap/layout (3), @cap/shared-types (2), @cap/theme (1)
- Strongest package dependents: None
- Most referenced external imports: react (13), react-i18next (2), react-router-dom (2), recharts (2), @mui/icons-material/ArrowUpward (1)
- `(root)`: 4 files, outgoing to 5 sub-modules, incoming from 0; strongest outgoing @cap/platform-core:(root) (5), @cap/layout:(root) (3).
- `utils`: 12 files, outgoing to 2 sub-modules, incoming from 2; strongest outgoing @cap/platform-core:(root) (3), @cap/shared-types:(root) (1).
- `lib`: 6 files, outgoing to 2 sub-modules, incoming from 0; strongest outgoing @cap/app:utils (4), @cap/platform-core:(root) (1).
- `hooks`: 2 files, outgoing to 1 sub-modules, incoming from 0; strongest outgoing @cap/platform-core:(root) (2).
- `assets`: 4 files, outgoing to 0 sub-modules, incoming from 0; strongest outgoing None.

### @cap/module-landing
- Files analyzed: 26
- Package efferent coupling (Ce): 4
- Package afferent coupling (Ca): 0
- Strongest package dependencies: @cap/platform-core (9), @cap/layout (1), @cap/shared-types (1), @cap/theme (1)
- Strongest package dependents: None
- Most referenced external imports: @mui/material (19), react (16), @mui/material/Grid (9), react-router-dom (9), @mui/icons-material/CheckCircle (5)
- `screens`: 10 files, outgoing to 4 sub-modules, incoming from 2; strongest outgoing @cap/platform-core:(root) (8), @cap/module-landing:components (2).
- `(root)`: 1 files, outgoing to 4 sub-modules, incoming from 0; strongest outgoing @cap/module-landing:screens (7), @cap/module-landing:routes (2).
- `routes`: 2 files, outgoing to 2 sub-modules, incoming from 1; strongest outgoing @cap/module-landing:screens (8), @cap/platform-core:(root) (1).
- `components`: 11 files, outgoing to 1 sub-modules, incoming from 1; strongest outgoing @cap/module-landing:context (1).
- `context`: 2 files, outgoing to 0 sub-modules, incoming from 2; strongest outgoing None.

### @cap/platform-store
- Files analyzed: 26
- Package efferent coupling (Ce): 2
- Package afferent coupling (Ca): 4
- Strongest package dependencies: @cap/shared-types (11), @cap/theme (1)
- Strongest package dependents: @cap/platform-core (20), @cap/layout (4), @cap/module-auth (2), @cap/auth-contracts (1)
- Most referenced external imports: zustand (10), react (2), idb (1), zustand/middleware (1), zustand/middleware/immer (1)
- `(root)`: 1 files, outgoing to 2 sub-modules, incoming from 12; strongest outgoing @cap/platform-store:services (1), @cap/platform-store:store (1).
- `store`: 11 files, outgoing to 3 sub-modules, incoming from 2; strongest outgoing @cap/shared-types:(root) (8), @cap/platform-store:services (2).
- `services`: 14 files, outgoing to 2 sub-modules, incoming from 2; strongest outgoing @cap/shared-types:(root) (3), @cap/platform-store:store (2).

### @cap/shared-types
- Files analyzed: 16
- Package efferent coupling (Ce): 0
- Package afferent coupling (Ca): 9
- Strongest package dependencies: None
- Strongest package dependents: @cap/platform-core (23), @cap/theme (19), @cap/platform-store (11), @cap/layout (9), @cap/module-auth (7)
- Most referenced external imports: react (1), react-toastify (1)
- `(root)`: 15 files, outgoing to 0 sub-modules, incoming from 30; strongest outgoing None.
- `contracts`: 1 files, outgoing to 0 sub-modules, incoming from 0; strongest outgoing None.

### @cap/auth-contracts
- Files analyzed: 4
- Package efferent coupling (Ce): 3
- Package afferent coupling (Ca): 0
- Strongest package dependencies: @cap/shared-types (6), @cap/api-contracts (1), @cap/platform-store (1)
- Strongest package dependents: None
- Most referenced external imports: None
- `services`: 1 files, outgoing to 4 sub-modules, incoming from 1; strongest outgoing @cap/auth-contracts:types (163), @cap/shared-types:(root) (3).
- `types`: 1 files, outgoing to 1 sub-modules, incoming from 2; strongest outgoing @cap/shared-types:(root) (3).
- `(root)`: 1 files, outgoing to 2 sub-modules, incoming from 0; strongest outgoing @cap/auth-contracts:services (1), @cap/auth-contracts:types (1).
- `routes`: 1 files, outgoing to 0 sub-modules, incoming from 0; strongest outgoing None.

### @cap/api-contracts
- Files analyzed: 2
- Package efferent coupling (Ce): 1
- Package afferent coupling (Ca): 1
- Strongest package dependencies: @cap/shared-types (1)
- Strongest package dependents: @cap/auth-contracts (1)
- Most referenced external imports: None
- `(root)`: 1 files, outgoing to 1 sub-modules, incoming from 1; strongest outgoing @cap/api-contracts:types (1).
- `types`: 1 files, outgoing to 1 sub-modules, incoming from 1; strongest outgoing @cap/shared-types:(root) (1).
