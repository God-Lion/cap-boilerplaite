/**
 * Lightweight logger utility for the auth module.
 * Wraps console methods behind a structured API so we can swap
 * to a real transport (Pino, Sentry, etc.) later without touching callers.
 *
 * Moved from: src/shared/utils/logger.ts
 */

type LogPayload = Record<string, unknown>

const logger = {
  info(message: string, payload?: LogPayload) {
    console.info(`[auth] ${message}`, payload ?? '')
  },
  warn(message: string, payload?: LogPayload) {
    console.warn(`[auth] ${message}`, payload ?? '')
  },
  error(message: string, payload?: LogPayload) {
    console.error(`[auth] ${message}`, payload ?? '')
  },
}

export default logger
