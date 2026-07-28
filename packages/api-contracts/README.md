# `@cap/api-contracts`

## Overview
The `api-contracts` package is a foundational library within the `cap-boilerplaite` monorepo. Its primary responsibility is to serve as the single source of truth for all external and internal API interactions.

## Architecture & Responsibilities
*   **Strict Typings:** Provides Zod/TypeScript schemas to validate payloads at the boundaries.
*   **Request/Response Schemas:** Defines the exact shape of network data expected by the frontend.
*   **Endpoint Definitions:** Maps URLs and HTTP methods to specific contracts.

## Key Exports
*   `types/`: Contains the base TypeScript interfaces for standard API responses, pagination, and error handling.
*   `index.ts`: The central barrel file exporting all validated schemas and types.

## Dependencies
This package is strictly a leaf node in the dependency graph. It should have **zero** dependencies on other internal `@cap/*` packages to ensure it can be safely imported by any module, core library, or even external services if published.
