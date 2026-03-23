// domain-kernel/src/index.ts

export * from './types/DigitalId';
export * from './types/BiometricRecord';
export * from './types/Application';
export * from './types/VerificationResult';

// Events
export * from './events/ApplicationSubmitted';
export * from './events/AutoVerificationPassed';
export * from './events/AutoVerificationFailed';
export * from './events/ManualReviewRequested';
export * from './events/ReviewPassed';
export * from './events/ReviewDenied';
export * from './events/BiometricCaptured';
export * from './events/IdCardIssued';

// Ports
export * from './ports/IDigitalIdRepository';
export * from './ports/IBiometricEngine';
export * from './ports/IApplicationRepository';
export * from './ports/ICivilRegistryClient';
