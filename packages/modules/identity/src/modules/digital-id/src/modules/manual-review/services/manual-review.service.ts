// modules/manual-review/services/manual-review.service.ts

import { IApplicationRepository } from '../../../domain-kernel/src/ports/IApplicationRepository';
import { REVIEW_PASSED, REVIEW_DENIED } from '../../../domain-kernel/src';

export class ManualReviewService {
  constructor(
    private readonly applicationRepository: IApplicationRepository,
    private readonly eventEmitter: { emit: (event: any) => void },
  ) {}

  async approve(applicationId: string, officerId: string, notes: string): Promise<void> {
    const app = await this.applicationRepository.findById(applicationId);
    if (!app) throw new Error('Application not found');

    app.status = 'APPROVED';
    app.updatedAt = new Date().toISOString();
    
    // In a real app, record manual review details in the application
    await this.applicationRepository.save(app);
    this.eventEmitter.emit({ type: REVIEW_PASSED, payload: { applicationId, officerId, notes } });
  }

  async deny(applicationId: string, officerId: string, notes: string): Promise<void> {
    const app = await this.applicationRepository.findById(applicationId);
    if (!app) throw new Error('Application not found');

    app.status = 'REJECTED';
    app.updatedAt = new Date().toISOString();
    
    await this.applicationRepository.save(app);
    this.eventEmitter.emit({ type: REVIEW_DENIED, payload: { applicationId, officerId, notes } });
  }

  async getPendingApplications() {
    return this.applicationRepository.findByStatus('MANUAL_REVIEW');
  }
}
