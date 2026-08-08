## 2026-07-28 - [Secure jobId Generation]
**Vulnerability:** Weak PRNG `Math.random` used for `jobId` generation in `module-pipeline.service.ts`
**Learning:** It existed to generate a unique suffix but was not cryptographically secure, which could lead to ID predictability.
**Prevention:** Replaced with `crypto.randomUUID()`.

## 2026-07-28 - [Secure Random Number Generation]
**Vulnerability:** Weak PRNG `Math.random()` used for key generation in React lists and seed generation.
**Learning:** `Math.random()` is not cryptographically secure and can lead to predictability or ID collisions.
**Prevention:** Replaced with `crypto.randomUUID()` and `crypto.getRandomValues()`.
