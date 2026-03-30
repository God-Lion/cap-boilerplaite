// modules/certificate-issuance/services/certificate.service.ts

import type { BirthCertificate, CertificateStatus } from '../../../domain-kernel/src/types/BirthCertificate';
import type { IBirthCertificateRepo, CreateDeclarationDto } from '../../../domain-kernel/src/ports/IBirthCertificateRepo';
import type { SsnGeneratorService } from '../../ssn-engine/services/ssn-generator.service';
import type { PdfGeneratorService } from './pdf-generator.service';
import type { INotificationService } from '../../../domain-kernel/src/ports/INotificationService';

export class CertificateService {
  constructor(
    private readonly certRepo: IBirthCertificateRepo,
    private readonly ssnGenerator: SsnGeneratorService,
    private readonly pdfService: PdfGeneratorService,
    private readonly notificationService: INotificationService,
  ) {}

  /** Step 1: Hospital submits declaration */
  async submitDeclaration(
    data: CreateDeclarationDto,
    staffId: string,
    hospitalId: string
  ): Promise<BirthCertificate> {
    const cert = await this.certRepo.create({
      ...data,
      status: 'SUBMITTED',
      certificateNumber: await this.generateCertNumber(),
      declaringStaffId: staffId,
      declaringHospitalId: hospitalId,
      timeline: [{
        timestamp: new Date().toISOString(),
        action: 'DECLARATION_SUBMITTED',
        performedBy: staffId,
      }],
    });

    // Notify civil registrar
    await this.notificationService.notify('REGISTRAR', {
      type: 'NEW_DECLARATION',
      certificateId: cert.id,
      childName: cert.childName,
    });

    return cert;
  }

  /** Step 2: Registrar validates and triggers SSN assignment */
  async validateAndAssignSSN(
    certificateId: string,
    registrarId: string
  ): Promise<BirthCertificate> {
    const cert = await this.certRepo.findById(certificateId);
    if (cert.status !== 'SUBMITTED') {
      throw new Error(`Cannot validate certificate in status: ${cert.status}`);
    }

    // Auto-generate and reserve SSN
    const ssn = await this.ssnGenerator.generateAndReserve(certificateId);

    const updated = await this.certRepo.update(certificateId, {
      status: 'SSN_ASSIGNED',
      ssn,
      timeline: [
        ...cert.timeline,
        {
          timestamp: new Date().toISOString(),
          action: 'SSN_ASSIGNED',
          performedBy: registrarId,
          note: `SSN reserved: ${ssn.value.replace(/\d{4}$/, 'XXXX')}`, // Mask last 4 in log
        }
      ],
    });

    return updated;
  }

  /** Step 3: Director approves and officially issues certificate */
  async issue(
    certificateId: string,
    directorId: string,
    digitalSignature: string
  ): Promise<BirthCertificate> {
    const cert = await this.certRepo.findById(certificateId);
    if (cert.status !== 'SSN_ASSIGNED') {
      throw new Error(`Cannot issue certificate in status: ${cert.status}`);
    }

    // Activate SSN
    await this.ssnGenerator.activate(cert.ssn!.value, certificateId);

    // Generate verification QR code
    const qrCode = await this.generateVerificationQr(cert);

    // Generate PDF
    const pdfUrl = await this.pdfService.generate(cert);

    // Anchor to blockchain (uses your blockchain-idaas module)
    const blockchainTxId = await this.anchorToBlockchain(cert);

    const issued = await this.certRepo.update(certificateId, {
      status: 'ISSUED',
      issuedAt: new Date().toISOString(),
      digitalSignature,
      qrCode,
      blockchainTxId,
      timeline: [
        ...cert.timeline,
        {
          timestamp: new Date().toISOString(),
          action: 'CERTIFICATE_ISSUED',
          performedBy: directorId,
        }
      ],
    });

    // Notify parents (if contact info provided)
    await this.notificationService.notify('PARENTS', {
      type: 'CERTIFICATE_ISSUED',
      certificateId: issued.id,
      pdfUrl,
    });

    return issued;
  }

  private async generateCertNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const sequence = await this.certRepo.getNextSequence(year);
    return `BC-${year}-${sequence.toString().padStart(7, '0')}`;
  }

  private async generateVerificationQr(cert: BirthCertificate): Promise<string> {
    return `https://your-platform.com/verify/certificate/${cert.id}`;
  }

  private async anchorToBlockchain(cert: BirthCertificate): Promise<string> {
    // Calls your existing blockchain-idaas module
    // Creates a DID document for the newborn
    return `0x${cert.id.replace(/-/g, '')}`;
  }
}
