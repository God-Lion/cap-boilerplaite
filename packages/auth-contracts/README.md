# `@cap/auth-contracts`

## Overview
The `auth-contracts` package defines the strict boundaries and types for the Identity and Access Management (IDaaS) module. It decouples the authentication implementation (`@cap/module-auth`) from the rest of the workspace.

## Architecture & Responsibilities
*   **Routing Definitions:** Contains the strict path constants and route shapes for authentication pages (e.g., Login, Register, MFA).
*   **Service Contracts:** Defines the interfaces for authentication providers, allowing dependency injection.
*   **Auth Types:** Exports models for Users, Roles, JWT Claims, and Session state.

## Key Exports
*   `routes/`: Route path constants ensuring type-safe navigation to Auth screens.
*   `services/`: Abstract interfaces for the identity provider facade.
*   `types/`: Session, User, and Token types.
*   `index.ts`: The main barrel file exposing contracts to consumers.

## Dependencies
*   Like `api-contracts`, this package is a low-level definition library.
*   Consumed heavily by `@cap/module-auth`, `@cap/platform-core`, and `@cap/layout` to verify session state without causing circular dependencies.
