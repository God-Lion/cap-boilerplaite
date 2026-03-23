// modules/eligibility/services/eligibility.service.ts

import { differenceInYears, parseISO } from 'date-fns';
import { ICivilRegistryClient } from '../../../domain-kernel/src/ports/ICivilRegistryClient';
import { IDigitalIdRepository } from '../../../domain-kernel/src/ports/IDigitalIdRepository';

export interface EligibilityStatus {
  isEligible: boolean;
  citizenAge: number;
  dateOfBirth: string;
  turnsEighteenOn: string;
  daysUntilEligible: number;
  birthCertificateId: string;
  existingApplicationId?: string;
  existingCardId?: string;
  reason?: 'UNDER_18' | 'ALREADY_HAS_ACTIVE_ID' | 'APPLICATION_IN_PROGRESS';
}

export class EligibilityService {
  constructor(
    private readonly civilRegistryClient: ICivilRegistryClient,
    private readonly digitalIdRepository: IDigitalIdRepository,
  ) {}

  async checkEligibility(citizenId: string): Promise<EligibilityStatus> {
    // 1. Fetch birth certificate from civil-registry module
    const birthCert = await this.civilRegistryClient
      .getBirthCertificateByCitizenId(citizenId);

    if (!birthCert) {
      throw new Error('No birth certificate found. Cannot issue digital ID without civil record.');
    }

    const dobString = birthCert.birthDetails.dateOfBirth;
    if (!dobString) {
        throw new Error('Birth date not found in certificate.');
    }

    const dob = parseISO(dobString);
    const today = new Date();
    const age = differenceInYears(today, dob);

    // 2. Check age
    if (age < 18) {
      const eighteenthBirthday = new Date(dob);
      eighteenthBirthday.setFullYear(dob.getFullYear() + 18);
      const daysUntil = Math.ceil(
        (eighteenthBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      return {
        isEligible: false,
        citizenAge: age,
        dateOfBirth: dobString,
        turnsEighteenOn: eighteenthBirthday.toISOString(),
        daysUntilEligible: daysUntil,
        birthCertificateId: birthCert.id,
        reason: 'UNDER_18',
      };
    }

    // 3. Check for existing active ID
    const existingId = await this.digitalIdRepository
      .findActiveByCitizenId(citizenId);

    if (existingId) {
      return {
        isEligible: false,
        citizenAge: age,
        dateOfBirth: dobString,
        turnsEighteenOn: dobString,
        daysUntilEligible: 0,
        birthCertificateId: birthCert.id,
        existingCardId: existingId.id,
        reason: 'ALREADY_HAS_ACTIVE_ID',
      };
    }

    // 4. Check for existing in-progress application
    const existingApp = await this.digitalIdRepository
      .findPendingApplicationByCitizenId(citizenId);

    return {
      isEligible: true,
      citizenAge: age,
      dateOfBirth: dobString,
      turnsEighteenOn: dobString,
      daysUntilEligible: 0,
      birthCertificateId: birthCert.id,
      existingApplicationId: existingApp?.id,
    };
  }
}
