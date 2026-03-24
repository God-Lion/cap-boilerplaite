// src/registry/DigitalIdRegistry.ts

import { EligibilityService } from '../modules/eligibility/services/eligibility.service';
import { ApplicationService } from '../modules/application/services/application.service';
import { BiometricService } from '../modules/biometric-capture/services/biometric.service';
import { VerificationService } from '../modules/auto-verification/services/verification.service';
import { BiometricEngineService } from '../modules/auto-verification/services/biometric-engine.service';
import { ICivilRegistryClient } from '../domain-kernel/src/ports/ICivilRegistryClient';
import { IDigitalIdRepository } from '../domain-kernel/src/ports/IDigitalIdRepository';
import { IApplicationRepository } from '../domain-kernel/src/ports/IApplicationRepository';
import { IBiometricEngine } from '../domain-kernel/src/ports/IBiometricEngine';

export class DigitalIdRegistry {
  private static instance: DigitalIdRegistry;
  
  public eligibilityService: EligibilityService;
  public applicationService: ApplicationService;
  public biometricService: BiometricService;
  public verificationService: VerificationService;
  public biometricEngine: BiometricEngineService;

  private constructor(
    civilRegistryClient: ICivilRegistryClient,
    digitalIdRepository: IDigitalIdRepository,
    applicationRepository: IApplicationRepository,
    biometricEngine: BiometricEngineService,
  ) {
    const eventEmitter = { emit: (e: any) => console.log('Event Emitted:', e) };
    
    this.biometricEngine = biometricEngine;
    this.eligibilityService = new EligibilityService(civilRegistryClient, digitalIdRepository);
    this.applicationService = new ApplicationService(applicationRepository, eventEmitter);
    this.biometricService = new BiometricService(biometricEngine);
    this.verificationService = new VerificationService(biometricEngine, applicationRepository, eventEmitter);
  }

  public static getInstance(
    civilRegistryClient?: ICivilRegistryClient,
    digitalIdRepository?: IDigitalIdRepository,
    applicationRepository?: IApplicationRepository,
    biometricEngine?: BiometricEngineService,
  ): DigitalIdRegistry {
    if (!DigitalIdRegistry.instance) {
      if (!civilRegistryClient || !digitalIdRepository || !applicationRepository || !biometricEngine) {
        throw new Error('DigitalIdRegistry must be initialized with dependencies');
      }
      DigitalIdRegistry.instance = new DigitalIdRegistry(civilRegistryClient, digitalIdRepository, applicationRepository, biometricEngine);
    }
    return DigitalIdRegistry.instance;
  }
}
