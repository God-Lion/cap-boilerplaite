// modules/auto-verification/services/verification.service.ts

import { BiometricEngineService } from './biometric-engine.service';
import { IApplicationRepository } from '../../../domain-kernel/src/ports/IApplicationRepository';
import { AUTO_VERIFICATION_PASSED } from '../../../domain-kernel/src/events/AutoVerificationPassed';
import { AUTO_VERIFICATION_FAILED } from '../../../domain-kernel/src/events/AutoVerificationFailed';
import { MANUAL_REVIEW_REQUESTED } from '../../../domain-kernel/src/events/ManualReviewRequested';

export class VerificationService {
  constructor(
    private readonly biometricEngine: BiometricEngineService,
    private readonly applicationRepository: IApplicationRepository,
    private readonly eventEmitter: { emit: (event: any) => void },
  ) {}

  async runVerification(applicationId: string): Promise<void> {
    const app = await this.applicationRepository.findById(applicationId);
    if (!app) throw new Error('Application not found');

    app.status = 'AUTO_VERIFICATION';
    await this.applicationRepository.save(app);

    // Mock biometric record retrieval (would come from captured data)
    const result = await this.biometricEngine.verify({} as any);

    if (result.decision === 'PASS') {
      app.status = 'AUTO_PASSED';
      await this.applicationRepository.save(app);
      this.eventEmitter.emit({ type: AUTO_VERIFICATION_PASSED, payload: { applicationId } });
    } else if (result.decision === 'UNCERTAIN') {
      app.status = 'MANUAL_REVIEW';
      await this.applicationRepository.save(app);
      this.eventEmitter.emit({ type: MANUAL_REVIEW_REQUESTED, payload: { applicationId, reason: 'UNCERTAIN' } });
    } else {
      app.status = 'REJECTED';
      await this.applicationRepository.save(app);
      this.eventEmitter.emit({ type: AUTO_VERIFICATION_FAILED, payload: { applicationId, reason: 'AUTO_FAILED' } });
    }
  }
}
