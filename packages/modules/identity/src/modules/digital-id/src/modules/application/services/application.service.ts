// modules/application/services/application.service.ts

import { IApplicationRepository } from '../../../domain-kernel/src/ports/IApplicationRepository';
import { DigitalIdApplication, ApplicationStatus } from '../../../domain-kernel/src/types/Application';
import { DomainEvent } from '../../../domain-kernel/src/types/DigitalId';
import { ApplicationSubmitted } from '../../../domain-kernel/src/events/ApplicationSubmitted';

export class ApplicationService {
  constructor(
    private readonly applicationRepository: IApplicationRepository,
    private readonly eventEmitter: { emit: (event: DomainEvent) => void },
  ) {}

  async createApplication(data: Partial<DigitalIdApplication>): Promise<DigitalIdApplication> {
    const application: DigitalIdApplication = {
      id: crypto.randomUUID(),
      citizenId: data.citizenId!,
      status: 'PENDING_BIOMETRICS',
      personalInfo: data.personalInfo!,
      birthCertificateId: data.birthCertificateId!,
      supportingDocuments: data.supportingDocuments || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await this.applicationRepository.save(application);

    this.eventEmitter.emit({
      type: ApplicationSubmitted,
      payload: { applicationId: application.id, citizenId: application.citizenId },
      occurredAt: application.createdAt,
    });

    return application;
  }

  async getApplication(id: string): Promise<DigitalIdApplication | null> {
    return this.applicationRepository.findById(id);
  }

  async updateStatus(id: string, status: ApplicationStatus): Promise<void> {
    const app = await this.applicationRepository.findById(id);
    if (!app) throw new Error('Application not found');

    app.status = status;
    app.updatedAt = new Date().toISOString();
    await this.applicationRepository.save(app);
  }
}
