# `@cap/api-contracts`

## Overview
The `api-contracts` package is a foundational library within the `cap-boilerplate` monorepo. Its primary responsibility is to serve as the single source of truth for all external and internal API interactions.

## Architecture & Responsibilities
*   **Strict Typings:** Provides TypeScript interfaces and `as const` object literals to type-check payloads at the boundaries (pure TypeScript, no runtime validation library).
*   **Request/Response Schemas:** Defines the exact shape of network data expected by the frontend.
*   **Endpoint Definitions:** Maps URLs and HTTP methods to specific contracts via the `API_ENDPOINTS` and `API_QUERY_KEYS` constants.

## Key Exports
*   `API_ENDPOINTS`: Centralized URL constant map (`ENDPOINTS` alias) for every backend endpoint.
*   `API_QUERY_KEYS`: React Query key factories (`QUERY_KEYS` alias) for cache invalidation.
*   `types/`: Contains the base TypeScript interfaces for standard API responses, pagination, and module contracts.
*   `index.ts`: The central barrel file exporting all validated schemas and types.

## Dependencies
This package is a leaf node in the dependency graph: it depends only on `@cap/shared-types` (type-only contracts) and has **zero** React or runtime dependencies, so it can be safely imported by any module, core library, or even external services if published.
