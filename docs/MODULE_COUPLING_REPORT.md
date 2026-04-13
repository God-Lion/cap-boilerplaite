# Module Coupling Report

- Scope: workspace source files under `app/src` and `packages/**/src`
- Generated: 2026-03-30T07:40:00.145Z
- Source files analyzed: 1080
- Workspace packages analyzed: 19
- Sub-modules identified: 126
- Exclusions: `node_modules`, `dist`, `dev-dist`, `public`, `e2e`, `playwright`, tests/specs/stories, type declaration files

## How To Read This

- `Ce` (efferent coupling) is the number of other workspace packages a package depends on.
- `Ca` (afferent coupling) is the number of other workspace packages depending on it.
- `Instability` is `Ce / (Ca + Ce)`; closer to `1.00` means the package mainly depends outward, closer to `0.00` means it is a stable dependency used by others.
- Sub-module keys use the first meaningful source boundary: `modules/<name>`, `domain-kernel`, or the first folder under `src`.

## Package Overview

| Package | Files | Ce | Ca | Instability | Strongest outgoing | Strongest incoming |
| --- | ---: | ---: | ---: | ---: | --- | --- |
| @cap/shared-types | 15 | 0 | 17 | 0.00 | None | @cap/platform-core (22), @cap/theme (17), @cap/platform-store (12) |
| @cap/platform-core | 57 | 4 | 11 | 0.27 | @cap/shared-types (22), @cap/platform-store (13), @cap/theme (12) | @cap/layout (55), @cap/module-auth (49), @cap/module-admin (16) |
| @cap/app | 28 | 13 | 0 | 1.00 | @cap/platform-core (11), @cap/layout (2), @cap/civil-registry (1) | None |
| @cap/module-auth | 333 | 6 | 4 | 0.60 | @cap/platform-core (49), @cap/platform-store (19), @cap/shared-types (7) | @cap/module-admin (48), @cap/layout (9), @cap/app (1) |
| @cap/module-admin | 122 | 8 | 1 | 0.89 | @cap/module-auth (48), @cap/theme (20), @cap/platform-core (16) | @cap/app (1) |
| @cap/theme | 114 | 2 | 7 | 0.22 | @cap/shared-types (17), @cap/layout (8) | @cap/layout (35), @cap/module-admin (20), @cap/platform-core (12) |
| @cap/layout | 192 | 4 | 3 | 0.57 | @cap/platform-core (55), @cap/theme (35), @cap/module-auth (9) | @cap/theme (8), @cap/app (2), @cap/module-admin (1) |
| @cap/platform-store | 26 | 1 | 5 | 0.17 | @cap/shared-types (12) | @cap/module-auth (19), @cap/platform-core (13), @cap/module-kyc (3) |
| @cap/civil-registry | 17 | 2 | 2 | 0.50 | @cap/platform-core (1), @cap/shared-types (1) | @cap/app (1), @cap/module-digital-id (1) |
| @cap/module-digital-id | 46 | 3 | 1 | 0.75 | @cap/civil-registry (1), @cap/platform-core (1), @cap/shared-types (1) | @cap/app (1) |
| @cap/module-kyc | 39 | 3 | 1 | 0.75 | @cap/platform-store (3), @cap/platform-core (1), @cap/shared-types (1) | @cap/app (1) |
| @cap/module-landing | 25 | 3 | 1 | 0.75 | @cap/platform-core (9), @cap/theme (2), @cap/shared-types (1) | @cap/app (1) |
| @cap/module-monitoring-alerts | 32 | 3 | 1 | 0.75 | @cap/platform-core (4), @cap/platform-store (1), @cap/shared-types (1) | @cap/app (1) |
| @cap/module-user | 8 | 3 | 1 | 0.75 | @cap/platform-core (6), @cap/module-auth (1), @cap/shared-types (1) | @cap/app (1) |
| @cap/api-contracts | 1 | 0 | 3 | 0.00 | None | @cap/module-admin (2), @cap/module-auth (1), @cap/platform-api (1) |
| @cap/auth-contracts | 3 | 1 | 2 | 0.33 | @cap/shared-types (4) | @cap/module-auth (3), @cap/module-admin (1) |
| @cap/module-blockchain-idaas | 12 | 2 | 1 | 0.67 | @cap/platform-core (6), @cap/shared-types (1) | @cap/app (1) |
| @cap/platform-ui | 9 | 2 | 1 | 0.67 | @cap/theme (6), @cap/shared-types (1) | @cap/platform-core (1) |
| @cap/platform-api | 1 | 2 | 0 | 1.00 | @cap/api-contracts (1), @cap/shared-types (1) | None |

## Strongest Package-To-Package Edges

| From | To | File-level edges |
| --- | --- | ---: |
| @cap/layout | @cap/platform-core | 55 |
| @cap/module-auth | @cap/platform-core | 49 |
| @cap/module-admin | @cap/module-auth | 48 |
| @cap/layout | @cap/theme | 35 |
| @cap/platform-core | @cap/shared-types | 22 |
| @cap/module-admin | @cap/theme | 20 |
| @cap/module-auth | @cap/platform-store | 19 |
| @cap/theme | @cap/shared-types | 17 |
| @cap/module-admin | @cap/platform-core | 16 |
| @cap/platform-core | @cap/platform-store | 13 |
| @cap/platform-core | @cap/theme | 12 |
| @cap/platform-store | @cap/shared-types | 12 |
| @cap/app | @cap/platform-core | 11 |
| @cap/layout | @cap/module-auth | 9 |
| @cap/module-landing | @cap/platform-core | 9 |
| @cap/module-admin | @cap/shared-types | 8 |
| @cap/theme | @cap/layout | 8 |
| @cap/module-auth | @cap/shared-types | 7 |
| @cap/module-blockchain-idaas | @cap/platform-core | 6 |
| @cap/module-user | @cap/platform-core | 6 |

## Top Sub-Modules By Coupling

| Package | Sub-module | Files | Outgoing sub-modules | Incoming sub-modules | Strongest outgoing | Strongest incoming |
| --- | --- | ---: | ---: | ---: | --- | --- |
| @cap/platform-core | (root) | 1 | 14 | 39 | @cap/platform-core:hooks (7), @cap/platform-core:contexts (2), @cap/platform-core:services (2) | @cap/layout:menu (24), @cap/layout:components (19), @cap/module-auth:modules/authentication-core (16) |
| @cap/shared-types | (root) | 14 | 0 | 40 | None | @cap/platform-core:types (10), @cap/theme:overrides (10), @cap/platform-store:store (9) |
| @cap/theme | (root) | 1 | 10 | 18 | @cap/layout:components (8), @cap/theme:assets (4), @cap/theme:context (3) | @cap/layout:menu (15), @cap/module-admin:modules/theme-customizer (10), @cap/layout:components (9) |
| @cap/module-auth | (root) | 1 | 15 | 10 | @cap/module-auth:domain-kernel (4), @cap/module-auth:modules/authentication-core (3), @cap/module-auth:modules/authorization-engine (3) | @cap/module-auth:modules/identity-broker (10), @cap/layout:menu (6), @cap/module-admin:modules/authorization (3) |
| @cap/module-auth | modules/authentication-core | 86 | 11 | 14 | @cap/module-auth:routes (17), @cap/platform-core:(root) (16), @cap/platform-store:(root) (7) | @cap/module-auth:modules/user-directory (27), @cap/module-auth:modules/platform-cluster (19), @cap/module-admin:modules/user-management (13) |
| @cap/module-auth | routes | 3 | 10 | 10 | @cap/module-auth:modules/authentication-core (4), @cap/auth-contracts:(root) (2), @cap/module-auth:modules/authorization-engine (2) | @cap/module-auth:modules/authentication-core (17), @cap/module-auth:modules/user-directory (13), @cap/module-auth:modules/authorization-engine (11) |
| @cap/module-admin | routes | 3 | 10 | 8 | @cap/module-admin:modules/authorization (2), @cap/module-admin:modules/sso (2), @cap/module-auth:(root) (2) | @cap/module-admin:modules/sso (9), @cap/module-admin:modules/user-management (5), @cap/module-admin:modules/authorization (3) |
| @cap/module-auth | modules/authorization-engine | 42 | 10 | 8 | @cap/module-auth:routes (11), @cap/module-auth:domain-kernel (4), @cap/module-auth:modules/authentication-core (4) | @cap/module-auth:modules/identity-broker (5), @cap/module-auth:modules/user-directory (4), @cap/module-auth:(root) (3) |
| @cap/platform-store | (root) | 1 | 2 | 16 | @cap/platform-store:services (1), @cap/platform-store:store (1) | @cap/platform-core:services (8), @cap/module-auth:modules/authentication-core (7), @cap/module-auth:modules/platform-cluster (5) |
| @cap/layout | menu | 87 | 11 | 3 | @cap/platform-core:(root) (24), @cap/theme:(root) (15), @cap/layout:styles (9) | @cap/layout:(root) (22), @cap/layout:components (12), @cap/layout:styles (10) |
| @cap/module-admin | (root) | 1 | 13 | 1 | @cap/module-admin:domain-kernel (2), @cap/module-admin:modules/sso (2), @cap/module-admin:plugins (2) | @cap/app:(root) (1) |
| @cap/module-auth | modules/user-directory | 52 | 8 | 6 | @cap/module-auth:modules/authentication-core (27), @cap/module-auth:routes (13), @cap/platform-core:(root) (10) | @cap/module-auth:modules/authorization-engine (4), @cap/layout:menu (2), @cap/module-auth:modules/authentication-core (2) |
| @cap/app | (root) | 4 | 13 | 0 | @cap/platform-core:(root) (5), @cap/layout:(root) (2), @cap/app:utils (1) | None |
| @cap/platform-core | types | 9 | 4 | 9 | @cap/shared-types:(root) (10), @cap/theme:(root) (3), @cap/platform-store:(root) (2) | @cap/platform-core:guards (3), @cap/platform-core:(root) (2), @cap/platform-core:contexts (2) |
| @cap/layout | components | 69 | 9 | 3 | @cap/platform-core:(root) (19), @cap/layout:menu (12), @cap/layout:utils (12) | @cap/layout:(root) (16), @cap/theme:(root) (8), @cap/layout:menu (2) |
| @cap/layout | (root) | 8 | 8 | 3 | @cap/layout:menu (22), @cap/layout:components (16), @cap/layout:styles (7) | @cap/app:(root) (2), @cap/layout:menu (1), @cap/module-admin:components (1) |
| @cap/module-digital-id | routes | 2 | 5 | 6 | @cap/module-digital-id:modules/application (2), @cap/module-digital-id:modules/manual-review (2), @cap/module-digital-id:modules/eligibility (1) | @cap/module-digital-id:(root) (2), @cap/module-digital-id:modules/application (2), @cap/module-digital-id:modules/manual-review (2) |
| @cap/module-auth | modules/identity-broker | 30 | 6 | 3 | @cap/module-auth:modules/authentication-core (11), @cap/module-auth:(root) (10), @cap/module-auth:routes (7) | @cap/module-admin:modules/sso (1), @cap/module-auth:(root) (1), @cap/module-auth:routes (1) |
| @cap/module-auth | modules/platform-cluster | 39 | 5 | 4 | @cap/module-auth:modules/authentication-core (19), @cap/module-auth:routes (6), @cap/platform-store:(root) (5) | @cap/module-auth:(root) (2), @cap/module-admin:modules/user-management (1), @cap/module-auth:modules/authorization-engine (1) |
| @cap/module-auth | modules/session-manager | 20 | 4 | 5 | @cap/module-auth:(root) (3), @cap/module-auth:routes (3), @cap/platform-core:(root) (3) | @cap/module-auth:(root) (2), @cap/module-auth:modules/authentication-core (2), @cap/module-auth:modules/authorization-engine (1) |
| @cap/platform-core | hooks | 8 | 6 | 3 | @cap/platform-core:store (5), @cap/platform-core:types (2), @cap/shared-types:(root) (2) | @cap/platform-core:(root) (7), @cap/platform-core:guards (3), @cap/platform-core:components (1) |
| @cap/theme | utils | 7 | 4 | 5 | @cap/theme:types (12), @cap/shared-types:(root) (2), @cap/theme:assets (2) | @cap/theme:styled (16), @cap/theme:hooks (4), @cap/theme:overrides (2) |
| @cap/module-admin | modules/authorization | 8 | 6 | 2 | @cap/module-admin:routes (3), @cap/module-auth:(root) (3), @cap/module-auth:modules/authentication-core (3) | @cap/module-admin:routes (2), @cap/module-admin:(root) (1) |
| @cap/theme | context | 4 | 4 | 4 | @cap/theme:types (4), @cap/shared-types:(root) (2), @cap/theme:hooks (1) | @cap/theme:hooks (6), @cap/theme:(root) (3), @cap/theme:assets (3) |
| @cap/layout | styles | 15 | 4 | 3 | @cap/layout:menu (10), @cap/layout:utils (4), @cap/theme:(root) (3) | @cap/layout:menu (9), @cap/layout:(root) (7), @cap/layout:components (6) |

## Strongest Sub-Module Edges

| From | To | File-level edges |
| --- | --- | ---: |
| @cap/module-auth:modules/user-directory | @cap/module-auth:modules/authentication-core | 27 |
| @cap/layout:menu | @cap/platform-core:(root) | 24 |
| @cap/layout:(root) | @cap/layout:menu | 22 |
| @cap/layout:components | @cap/platform-core:(root) | 19 |
| @cap/module-auth:modules/platform-cluster | @cap/module-auth:modules/authentication-core | 19 |
| @cap/module-auth:modules/authentication-core | @cap/module-auth:routes | 17 |
| @cap/layout:(root) | @cap/layout:components | 16 |
| @cap/module-auth:modules/authentication-core | @cap/platform-core:(root) | 16 |
| @cap/theme:styled | @cap/theme:utils | 16 |
| @cap/layout:menu | @cap/theme:(root) | 15 |
| @cap/module-monitoring-alerts:modules/anomaly-detection | @cap/module-monitoring-alerts:domain-kernel | 15 |
| @cap/module-admin:modules/user-management | @cap/module-auth:modules/authentication-core | 13 |
| @cap/module-auth:modules/user-directory | @cap/module-auth:routes | 13 |
| @cap/layout:components | @cap/layout:menu | 12 |
| @cap/layout:components | @cap/layout:utils | 12 |
| @cap/theme:utils | @cap/theme:types | 12 |
| @cap/module-auth:modules/authorization-engine | @cap/module-auth:routes | 11 |
| @cap/module-auth:modules/identity-broker | @cap/module-auth:modules/authentication-core | 11 |
| @cap/theme:hooks | @cap/theme:types | 11 |
| @cap/layout:styles | @cap/layout:menu | 10 |
| @cap/module-admin:modules/theme-customizer | @cap/theme:(root) | 10 |
| @cap/module-auth:modules/identity-broker | @cap/module-auth:(root) | 10 |
| @cap/module-auth:modules/user-directory | @cap/platform-core:(root) | 10 |
| @cap/platform-core:types | @cap/shared-types:(root) | 10 |
| @cap/theme:overrides | @cap/shared-types:(root) | 10 |

## File Hotspots

| File | Package | Sub-module | Internal out | Internal in | Cross-package out | Cross-package in |
| --- | --- | --- | ---: | ---: | ---: | ---: |
| packages/platform-core/src/index.ts | @cap/platform-core | (root) | 23 | 134 | 4 | 134 |
| packages/theme/src/index.ts | @cap/theme | (root) | 22 | 65 | 8 | 65 |
| packages/shared-types/src/index.ts | @cap/shared-types | (root) | 8 | 66 | 0 | 66 |
| packages/modules/auth/src/routes/path.ts | @cap/module-auth | routes | 1 | 57 | 1 | 1 |
| packages/layout/src/index.ts | @cap/layout | (root) | 51 | 2 | 1 | 2 |
| packages/modules/auth/src/index.ts | @cap/module-auth | (root) | 22 | 25 | 2 | 12 |
| packages/modules/auth/src/modules/authentication-core/hooks/useAdminQuery.ts | @cap/module-auth | modules/authentication-core | 3 | 37 | 1 | 18 |
| packages/theme/src/overrides/core-overrides/index.ts | @cap/theme | overrides | 37 | 3 | 1 | 0 |
| packages/platform-store/src/index.ts | @cap/platform-store | (root) | 2 | 37 | 0 | 37 |
| packages/layout/src/menu/types.ts | @cap/layout | menu | 1 | 32 | 1 | 0 |
| packages/modules/auth/src/modules/authentication-core/routes/routes.tsx | @cap/module-auth | modules/authentication-core | 29 | 1 | 0 | 0 |
| packages/layout/src/menu/utils/menuClasses.ts | @cap/layout | menu | 1 | 24 | 1 | 0 |
| packages/modules/admin/src/routes/path.ts | @cap/module-admin | routes | 1 | 24 | 1 | 0 |
| packages/layout/src/components/ui/index.ts | @cap/layout | components | 22 | 2 | 1 | 1 |
| packages/theme/src/types/index.ts | @cap/theme | types | 5 | 19 | 0 | 0 |
| packages/modules/auth/src/modules/authorization-engine/services/adminService.ts | @cap/module-auth | modules/authorization-engine | 4 | 19 | 3 | 3 |
| packages/modules/monitoring-alerts/src/domain-kernel/src/types/index.ts | @cap/module-monitoring-alerts | domain-kernel | 6 | 17 | 0 | 0 |
| packages/platform-store/src/store/index.ts | @cap/platform-store | store | 10 | 12 | 0 | 0 |
| packages/layout/src/menu/contexts/verticalNavContext.tsx | @cap/layout | menu | 1 | 20 | 0 | 0 |
| packages/modules/auth/src/modules/authentication-core/hooks/useAuthQuery.ts | @cap/module-auth | modules/authentication-core | 6 | 13 | 2 | 0 |
| packages/theme/src/utils/themeObjectStyles.ts | @cap/theme | utils | 4 | 15 | 0 | 0 |
| packages/modules/admin/src/modules/sso/screens/sso/index.ts | @cap/module-admin | modules/sso | 15 | 3 | 0 | 0 |
| packages/modules/auth/src/modules/authentication-core/utils/logger.ts | @cap/module-auth | modules/authentication-core | 0 | 18 | 0 | 7 |
| packages/layout/src/utils/layoutClasses.ts | @cap/layout | utils | 0 | 17 | 0 | 0 |
| packages/modules/admin/src/index.ts | @cap/module-admin | (root) | 16 | 1 | 1 | 1 |

## Package Deep Dives

### @cap/module-auth
- Files analyzed: 333
- Package efferent coupling (Ce): 6
- Package afferent coupling (Ca): 4
- Strongest package dependencies: @cap/platform-core (49), @cap/platform-store (19), @cap/shared-types (7), @cap/auth-contracts (3), @cap/api-contracts (1)
- Strongest package dependents: @cap/module-admin (48), @cap/layout (9), @cap/app (1), @cap/module-user (1)
- Most referenced external imports: @mui/material (160), react (153), react-i18next (134), @mui/icons-material (112), react-router-dom (98)
- `(root)`: 1 files, outgoing to 15 sub-modules, incoming from 10; strongest outgoing @cap/module-auth:domain-kernel (4), @cap/module-auth:modules/authentication-core (3).
- `modules/authentication-core`: 86 files, outgoing to 11 sub-modules, incoming from 14; strongest outgoing @cap/module-auth:routes (17), @cap/platform-core:(root) (16).
- `routes`: 3 files, outgoing to 10 sub-modules, incoming from 10; strongest outgoing @cap/module-auth:modules/authentication-core (4), @cap/auth-contracts:(root) (2).
- `modules/authorization-engine`: 42 files, outgoing to 10 sub-modules, incoming from 8; strongest outgoing @cap/module-auth:routes (11), @cap/module-auth:domain-kernel (4).
- `modules/user-directory`: 52 files, outgoing to 8 sub-modules, incoming from 6; strongest outgoing @cap/module-auth:modules/authentication-core (27), @cap/module-auth:routes (13).
- `modules/identity-broker`: 30 files, outgoing to 6 sub-modules, incoming from 3; strongest outgoing @cap/module-auth:modules/authentication-core (11), @cap/module-auth:(root) (10).
- `modules/platform-cluster`: 39 files, outgoing to 5 sub-modules, incoming from 4; strongest outgoing @cap/module-auth:modules/authentication-core (19), @cap/module-auth:routes (6).
- `modules/session-manager`: 20 files, outgoing to 4 sub-modules, incoming from 5; strongest outgoing @cap/module-auth:(root) (3), @cap/module-auth:routes (3).

### @cap/layout
- Files analyzed: 192
- Package efferent coupling (Ce): 4
- Package afferent coupling (Ca): 3
- Strongest package dependencies: @cap/platform-core (55), @cap/theme (35), @cap/module-auth (9), @cap/shared-types (4)
- Strongest package dependents: @cap/theme (8), @cap/app (2), @cap/module-admin (1)
- Most referenced external imports: react (95), @emotion/styled (46), @mui/material (40), @mui/material/styles (36), classnames (32)
- `menu`: 87 files, outgoing to 11 sub-modules, incoming from 3; strongest outgoing @cap/platform-core:(root) (24), @cap/theme:(root) (15).
- `components`: 69 files, outgoing to 9 sub-modules, incoming from 3; strongest outgoing @cap/platform-core:(root) (19), @cap/layout:menu (12).
- `(root)`: 8 files, outgoing to 8 sub-modules, incoming from 3; strongest outgoing @cap/layout:menu (22), @cap/layout:components (16).
- `styles`: 15 files, outgoing to 4 sub-modules, incoming from 3; strongest outgoing @cap/layout:menu (10), @cap/layout:utils (4).
- `hooks`: 5 files, outgoing to 3 sub-modules, incoming from 3; strongest outgoing @cap/platform-core:(root) (4), @cap/theme:(root) (2).
- `utils`: 3 files, outgoing to 1 sub-modules, incoming from 3; strongest outgoing @cap/theme:(root) (1).
- `assets`: 5 files, outgoing to 0 sub-modules, incoming from 3; strongest outgoing None.

### @cap/module-admin
- Files analyzed: 122
- Package efferent coupling (Ce): 8
- Package afferent coupling (Ca): 1
- Strongest package dependencies: @cap/module-auth (48), @cap/theme (20), @cap/platform-core (16), @cap/shared-types (8), @cap/api-contracts (2)
- Strongest package dependents: @cap/app (1)
- Most referenced external imports: @mui/material (87), react (81), react-i18next (50), @mui/icons-material (38), notistack (35)
- `routes`: 3 files, outgoing to 10 sub-modules, incoming from 8; strongest outgoing @cap/module-admin:modules/authorization (2), @cap/module-admin:modules/sso (2).
- `(root)`: 1 files, outgoing to 13 sub-modules, incoming from 1; strongest outgoing @cap/module-admin:domain-kernel (2), @cap/module-admin:modules/sso (2).
- `modules/authorization`: 8 files, outgoing to 6 sub-modules, incoming from 2; strongest outgoing @cap/module-admin:routes (3), @cap/module-auth:(root) (3).
- `modules/developer-console`: 11 files, outgoing to 5 sub-modules, incoming from 2; strongest outgoing @cap/module-auth:modules/authentication-core (7), @cap/module-admin:routes (2).
- `modules/user-management`: 16 files, outgoing to 5 sub-modules, incoming from 2; strongest outgoing @cap/module-auth:modules/authentication-core (13), @cap/module-admin:routes (5).
- `modules/sso`: 22 files, outgoing to 4 sub-modules, incoming from 2; strongest outgoing @cap/module-admin:routes (9), @cap/module-auth:modules/authentication-core (7).
- `modules/theme-customizer`: 22 files, outgoing to 4 sub-modules, incoming from 2; strongest outgoing @cap/theme:(root) (10), @cap/module-admin:routes (1).
- `modules/dashboard`: 3 files, outgoing to 3 sub-modules, incoming from 2; strongest outgoing @cap/module-admin:routes (1), @cap/platform-core:(root) (1).

### @cap/theme
- Files analyzed: 114
- Package efferent coupling (Ce): 2
- Package afferent coupling (Ca): 7
- Strongest package dependencies: @cap/shared-types (17), @cap/layout (8)
- Strongest package dependents: @cap/layout (35), @cap/module-admin (20), @cap/platform-core (12), @cap/platform-ui (6), @cap/module-landing (2)
- Most referenced external imports: @mui/material/styles (74), react (37), @mui/material (6), @mui/lab/themeAugmentation (3), @mui/material/Chip (3)
- `(root)`: 1 files, outgoing to 10 sub-modules, incoming from 18; strongest outgoing @cap/layout:components (8), @cap/theme:assets (4).
- `utils`: 7 files, outgoing to 4 sub-modules, incoming from 5; strongest outgoing @cap/theme:types (12), @cap/shared-types:(root) (2).
- `context`: 4 files, outgoing to 4 sub-modules, incoming from 4; strongest outgoing @cap/theme:types (4), @cap/shared-types:(root) (2).
- `assets`: 24 files, outgoing to 4 sub-modules, incoming from 3; strongest outgoing @cap/theme:context (3), @cap/shared-types:(root) (1).
- `types`: 7 files, outgoing to 1 sub-modules, incoming from 6; strongest outgoing @cap/shared-types:(root) (1).
- `hooks`: 7 files, outgoing to 3 sub-modules, incoming from 3; strongest outgoing @cap/theme:types (11), @cap/theme:context (6).
- `overrides`: 41 files, outgoing to 2 sub-modules, incoming from 2; strongest outgoing @cap/shared-types:(root) (10), @cap/theme:utils (2).
- `styled`: 16 files, outgoing to 3 sub-modules, incoming from 1; strongest outgoing @cap/theme:utils (16), @cap/theme:types (6).

### @cap/platform-core
- Files analyzed: 57
- Package efferent coupling (Ce): 4
- Package afferent coupling (Ca): 11
- Strongest package dependencies: @cap/shared-types (22), @cap/platform-store (13), @cap/theme (12), @cap/platform-ui (1)
- Strongest package dependents: @cap/layout (55), @cap/module-auth (49), @cap/module-admin (16), @cap/app (11), @cap/module-landing (9)
- Most referenced external imports: react (20), react-router-dom (4), @mui/material (3), @mui/material/styles (3), @tanstack/react-query (3)
- `(root)`: 1 files, outgoing to 14 sub-modules, incoming from 39; strongest outgoing @cap/platform-core:hooks (7), @cap/platform-core:contexts (2).
- `types`: 9 files, outgoing to 4 sub-modules, incoming from 9; strongest outgoing @cap/shared-types:(root) (10), @cap/theme:(root) (3).
- `hooks`: 8 files, outgoing to 6 sub-modules, incoming from 3; strongest outgoing @cap/platform-core:store (5), @cap/platform-core:types (2).
- `contexts`: 1 files, outgoing to 4 sub-modules, incoming from 2; strongest outgoing @cap/platform-core:types (2), @cap/platform-core:services (1).
- `services`: 15 files, outgoing to 4 sub-modules, incoming from 2; strongest outgoing @cap/platform-store:(root) (8), @cap/platform-core:types (2).
- `utils`: 5 files, outgoing to 3 sub-modules, incoming from 3; strongest outgoing @cap/shared-types:(root) (3), @cap/platform-core:configs (1).
- `guards`: 4 files, outgoing to 4 sub-modules, incoming from 1; strongest outgoing @cap/platform-core:hooks (3), @cap/platform-core:types (3).
- `i18n`: 2 files, outgoing to 0 sub-modules, incoming from 5; strongest outgoing None.

### @cap/module-digital-id
- Files analyzed: 46
- Package efferent coupling (Ce): 3
- Package afferent coupling (Ca): 1
- Strongest package dependencies: @cap/civil-registry (1), @cap/platform-core (1), @cap/shared-types (1)
- Strongest package dependents: @cap/app (1)
- Most referenced external imports: react (14), @mui/material (11), react-router-dom (8), @hookform/resolvers/zod (1), @mui/icons-material (1)
- `routes`: 2 files, outgoing to 5 sub-modules, incoming from 6; strongest outgoing @cap/module-digital-id:modules/application (2), @cap/module-digital-id:modules/manual-review (2).
- `domain-kernel`: 19 files, outgoing to 1 sub-modules, incoming from 6; strongest outgoing @cap/civil-registry:(root) (1).
- `modules/eligibility`: 3 files, outgoing to 3 sub-modules, incoming from 2; strongest outgoing @cap/module-digital-id:domain-kernel (2), @cap/module-digital-id:registry (1).
- `modules/application`: 4 files, outgoing to 3 sub-modules, incoming from 1; strongest outgoing @cap/module-digital-id:domain-kernel (5), @cap/module-digital-id:routes (2).
- `modules/index.ts`: 1 files, outgoing to 4 sub-modules, incoming from 0; strongest outgoing @cap/module-digital-id:modules/biometric-capture (1), @cap/module-digital-id:modules/eligibility (1).
- `modules/manual-review`: 3 files, outgoing to 2 sub-modules, incoming from 2; strongest outgoing @cap/module-digital-id:domain-kernel (2), @cap/module-digital-id:routes (2).
- `(root)`: 1 files, outgoing to 2 sub-modules, incoming from 1; strongest outgoing @cap/module-digital-id:routes (2), @cap/shared-types:(root) (1).
- `modules/biometric-capture`: 4 files, outgoing to 2 sub-modules, incoming from 1; strongest outgoing @cap/module-digital-id:domain-kernel (3), @cap/module-digital-id:routes (1).

### @cap/module-kyc
- Files analyzed: 39
- Package efferent coupling (Ce): 3
- Package afferent coupling (Ca): 1
- Strongest package dependencies: @cap/platform-store (3), @cap/platform-core (1), @cap/shared-types (1)
- Strongest package dependents: @cap/app (1)
- Most referenced external imports: react (7), @mui/material (6), @mui/icons-material (3), @tanstack/react-query (2), react-router-dom (1)
- `domain-kernel`: 13 files, outgoing to 0 sub-modules, incoming from 6; strongest outgoing None.
- `(root)`: 1 files, outgoing to 4 sub-modules, incoming from 1; strongest outgoing @cap/module-kyc:routes (4), @cap/module-kyc:domain-kernel (1).
- `routes`: 2 files, outgoing to 4 sub-modules, incoming from 1; strongest outgoing @cap/module-kyc:modules/document-collection (1), @cap/module-kyc:modules/identity-path (1).
- `modules/document-collection`: 6 files, outgoing to 2 sub-modules, incoming from 1; strongest outgoing @cap/module-kyc:domain-kernel (7), @cap/platform-store:(root) (1).
- `modules/identity-path`: 7 files, outgoing to 2 sub-modules, incoming from 1; strongest outgoing @cap/module-kyc:domain-kernel (4), @cap/platform-store:(root) (1).
- `modules/kyc-profile`: 4 files, outgoing to 2 sub-modules, incoming from 1; strongest outgoing @cap/module-kyc:domain-kernel (6), @cap/platform-store:(root) (1).
- `registry`: 1 files, outgoing to 1 sub-modules, incoming from 2; strongest outgoing @cap/module-kyc:domain-kernel (1).
- `idaas-facade`: 1 files, outgoing to 1 sub-modules, incoming from 0; strongest outgoing @cap/module-kyc:registry (1).

### @cap/module-monitoring-alerts
- Files analyzed: 32
- Package efferent coupling (Ce): 3
- Package afferent coupling (Ca): 1
- Strongest package dependencies: @cap/platform-core (4), @cap/platform-store (1), @cap/shared-types (1)
- Strongest package dependents: @cap/app (1)
- Most referenced external imports: @mui/material (6), react-i18next (6), @mui/icons-material (4), @tanstack/react-query (4), react-router-dom (2)
- `modules/anomaly-detection`: 19 files, outgoing to 4 sub-modules, incoming from 1; strongest outgoing @cap/module-monitoring-alerts:domain-kernel (15), @cap/platform-core:(root) (2).
- `(root)`: 1 files, outgoing to 3 sub-modules, incoming from 1; strongest outgoing @cap/module-monitoring-alerts:modules/anomaly-detection (2), @cap/module-monitoring-alerts:domain-kernel (1).
- `domain-kernel`: 12 files, outgoing to 0 sub-modules, incoming from 2; strongest outgoing None.

### @cap/app
- Files analyzed: 28
- Package efferent coupling (Ce): 13
- Package afferent coupling (Ca): 0
- Strongest package dependencies: @cap/platform-core (11), @cap/layout (2), @cap/civil-registry (1), @cap/module-admin (1), @cap/module-auth (1)
- Strongest package dependents: None
- Most referenced external imports: react (12), react-i18next (2), react-router-dom (2), recharts (2), @mui/icons-material/ArrowUpward (1)
- `(root)`: 4 files, outgoing to 13 sub-modules, incoming from 0; strongest outgoing @cap/platform-core:(root) (5), @cap/layout:(root) (2).
- `utils`: 12 files, outgoing to 2 sub-modules, incoming from 2; strongest outgoing @cap/platform-core:(root) (3), @cap/shared-types:(root) (1).
- `lib`: 6 files, outgoing to 2 sub-modules, incoming from 0; strongest outgoing @cap/app:utils (4), @cap/platform-core:(root) (1).
- `hooks`: 2 files, outgoing to 1 sub-modules, incoming from 0; strongest outgoing @cap/platform-core:(root) (2).
- `assets`: 4 files, outgoing to 0 sub-modules, incoming from 0; strongest outgoing None.

### @cap/platform-store
- Files analyzed: 26
- Package efferent coupling (Ce): 1
- Package afferent coupling (Ca): 5
- Strongest package dependencies: @cap/shared-types (12)
- Strongest package dependents: @cap/module-auth (19), @cap/platform-core (13), @cap/module-kyc (3), @cap/module-admin (2), @cap/module-monitoring-alerts (1)
- Most referenced external imports: zustand (10), react (2), crypto-js (1), idb (1), zustand/middleware (1)
- `(root)`: 1 files, outgoing to 2 sub-modules, incoming from 16; strongest outgoing @cap/platform-store:services (1), @cap/platform-store:store (1).
- `services`: 14 files, outgoing to 2 sub-modules, incoming from 2; strongest outgoing @cap/shared-types:(root) (3), @cap/platform-store:store (2).
- `store`: 11 files, outgoing to 2 sub-modules, incoming from 2; strongest outgoing @cap/shared-types:(root) (9), @cap/platform-store:services (2).

### @cap/module-landing
- Files analyzed: 25
- Package efferent coupling (Ce): 3
- Package afferent coupling (Ca): 1
- Strongest package dependencies: @cap/platform-core (9), @cap/theme (2), @cap/shared-types (1)
- Strongest package dependents: @cap/app (1)
- Most referenced external imports: @mui/material (18), react (15), @mui/material/Grid (9), react-router-dom (9), @mui/icons-material/CheckCircle (5)
- `(root)`: 1 files, outgoing to 4 sub-modules, incoming from 1; strongest outgoing @cap/module-landing:screens (6), @cap/module-landing:routes (2).
- `screens`: 9 files, outgoing to 3 sub-modules, incoming from 2; strongest outgoing @cap/platform-core:(root) (8), @cap/module-landing:components (2).
- `routes`: 2 files, outgoing to 2 sub-modules, incoming from 1; strongest outgoing @cap/module-landing:screens (7), @cap/platform-core:(root) (1).
- `components`: 11 files, outgoing to 1 sub-modules, incoming from 1; strongest outgoing @cap/module-landing:context (1).
- `context`: 2 files, outgoing to 0 sub-modules, incoming from 2; strongest outgoing None.

### @cap/civil-registry
- Files analyzed: 17
- Package efferent coupling (Ce): 2
- Package afferent coupling (Ca): 2
- Strongest package dependencies: @cap/platform-core (1), @cap/shared-types (1)
- Strongest package dependents: @cap/app (1), @cap/module-digital-id (1)
- Most referenced external imports: react (4), @mui/material (3), @hookform/resolvers/zod (1), crypto (1), react-hook-form (1)
- `(root)`: 1 files, outgoing to 3 sub-modules, incoming from 2; strongest outgoing @cap/civil-registry:routes (2), @cap/civil-registry:domain-kernel (1).
- `routes`: 2 files, outgoing to 3 sub-modules, incoming from 1; strongest outgoing @cap/civil-registry:modules/birth-declaration (1), @cap/civil-registry:modules/registry-dashboard (1).
- `domain-kernel`: 6 files, outgoing to 0 sub-modules, incoming from 3; strongest outgoing None.
- `modules/birth-declaration`: 2 files, outgoing to 0 sub-modules, incoming from 1; strongest outgoing None.
- `modules/certificate-issuance`: 3 files, outgoing to 1 sub-modules, incoming from 0; strongest outgoing @cap/civil-registry:domain-kernel (4).
- `modules/registry-dashboard`: 1 files, outgoing to 0 sub-modules, incoming from 1; strongest outgoing None.
- `modules/ssn-engine`: 2 files, outgoing to 1 sub-modules, incoming from 0; strongest outgoing @cap/civil-registry:domain-kernel (2).

### @cap/shared-types
- Files analyzed: 15
- Package efferent coupling (Ce): 0
- Package afferent coupling (Ca): 17
- Strongest package dependencies: None
- Strongest package dependents: @cap/platform-core (22), @cap/theme (17), @cap/platform-store (12), @cap/module-admin (8), @cap/module-auth (7)
- Most referenced external imports: react (1), react-toastify (1)
- `(root)`: 14 files, outgoing to 0 sub-modules, incoming from 40; strongest outgoing None.
- `contracts`: 1 files, outgoing to 0 sub-modules, incoming from 0; strongest outgoing None.

### @cap/module-blockchain-idaas
- Files analyzed: 12
- Package efferent coupling (Ce): 2
- Package afferent coupling (Ca): 1
- Strongest package dependencies: @cap/platform-core (6), @cap/shared-types (1)
- Strongest package dependents: @cap/app (1)
- Most referenced external imports: react (4), @mui/icons-material (2), @mui/material (2), framer-motion (2), zod (1)
- `(root)`: 1 files, outgoing to 3 sub-modules, incoming from 1; strongest outgoing @cap/module-blockchain-idaas:routes (4), @cap/module-blockchain-idaas:idaas-facade (1).
- `routes`: 3 files, outgoing to 3 sub-modules, incoming from 1; strongest outgoing @cap/module-blockchain-idaas:components (1), @cap/module-blockchain-idaas:idaas-facade (1).
- `idaas-facade`: 1 files, outgoing to 0 sub-modules, incoming from 2; strongest outgoing None.
- `components`: 1 files, outgoing to 0 sub-modules, incoming from 1; strongest outgoing None.
- `domain-kernel`: 5 files, outgoing to 1 sub-modules, incoming from 0; strongest outgoing @cap/platform-core:(root) (3).
- `hooks`: 1 files, outgoing to 1 sub-modules, incoming from 0; strongest outgoing @cap/platform-core:(root) (2).

### @cap/platform-ui
- Files analyzed: 9
- Package efferent coupling (Ce): 2
- Package afferent coupling (Ca): 1
- Strongest package dependencies: @cap/theme (6), @cap/shared-types (1)
- Strongest package dependents: @cap/platform-core (1)
- Most referenced external imports: @mui/material/styles (4), @mui/material (2), @mui/lab/themeAugmentation (1), @mui/material/Alert (1), react (1)
- `(root)`: 1 files, outgoing to 2 sub-modules, incoming from 1; strongest outgoing @cap/platform-ui:components (1), @cap/platform-ui:theme (1).
- `theme`: 4 files, outgoing to 2 sub-modules, incoming from 1; strongest outgoing @cap/theme:(root) (6), @cap/shared-types:(root) (1).
- `components`: 4 files, outgoing to 0 sub-modules, incoming from 1; strongest outgoing None.

### @cap/module-user
- Files analyzed: 8
- Package efferent coupling (Ce): 3
- Package afferent coupling (Ca): 1
- Strongest package dependencies: @cap/platform-core (6), @cap/module-auth (1), @cap/shared-types (1)
- Strongest package dependents: @cap/app (1)
- Most referenced external imports: react (5), @mui/material (3), @mui/icons-material (2), react-i18next (2), @cap/platform-core/types/nfc (1)
- `(root)`: 1 files, outgoing to 3 sub-modules, incoming from 1; strongest outgoing @cap/module-user:routes (2), @cap/module-user:domain-kernel (1).
- `domain-kernel`: 5 files, outgoing to 2 sub-modules, incoming from 2; strongest outgoing @cap/platform-core:(root) (3), @cap/platform-core:i18n (2).
- `routes`: 2 files, outgoing to 3 sub-modules, incoming from 1; strongest outgoing @cap/module-user:domain-kernel (3), @cap/module-auth:(root) (1).

### @cap/auth-contracts
- Files analyzed: 3
- Package efferent coupling (Ce): 1
- Package afferent coupling (Ca): 2
- Strongest package dependencies: @cap/shared-types (4)
- Strongest package dependents: @cap/module-auth (3), @cap/module-admin (1)
- Most referenced external imports: None
- `(root)`: 1 files, outgoing to 2 sub-modules, incoming from 3; strongest outgoing @cap/auth-contracts:routes (1), @cap/auth-contracts:types (1).
- `types`: 1 files, outgoing to 1 sub-modules, incoming from 1; strongest outgoing @cap/shared-types:(root) (4).
- `routes`: 1 files, outgoing to 0 sub-modules, incoming from 1; strongest outgoing None.
