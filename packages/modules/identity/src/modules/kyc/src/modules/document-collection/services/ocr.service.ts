import { AlternativeIdType } from '../../../domain-kernel/src';

export interface OcrExtractionResult {
  documentType: AlternativeIdType;
  confidence: number;              // 0-1 overall confidence
  extractedFields: Record<string, {
    value: string;
    confidence: number;
  }>;
  qualityIssues: string[];         // e.g. 'BLURRY', 'GLARE', 'PARTIAL_CROP'
  isAuthentic: boolean;
  authenticityChecks: {
    mrz_valid?: boolean;           // Machine Readable Zone
    security_features_detected?: boolean;
    document_not_expired: boolean;
    no_signs_of_tampering: boolean;
  };
  rawText?: string;
}

export interface IOcrProvider {
  analyze(imageUrl: string): Promise<any>;
}

export class OcrService {
  constructor(
    private readonly ocrProvider: IOcrProvider,   // e.g. AWS Textract, Google Vision
  ) {}

  async extractFromDocument(
    imageUrl: string,
    documentType: AlternativeIdType
  ): Promise<OcrExtractionResult> {
    // Get raw OCR results from provider
    const rawResult = await this.ocrProvider.analyze(imageUrl);

    // Parse based on document type
    const extracted = this.parseByDocumentType(rawResult, documentType);

    // Validate MRZ if present (passports, travel docs)
    const mrzValid = this.validateMrz(rawResult, documentType);

    // Check expiry
    const notExpired = this.checkExpiry(extracted.expiryDate?.value);

    return {
      documentType,
      confidence: rawResult.overallConfidence,
      extractedFields: extracted,
      qualityIssues: rawResult.qualityIssues ?? [],
      isAuthentic: mrzValid && notExpired && rawResult.overallConfidence > 0.7,
      authenticityChecks: {
        mrz_valid: mrzValid,
        security_features_detected: rawResult.securityFeaturesFound,
        document_not_expired: notExpired,
        no_signs_of_tampering: !rawResult.tamperingDetected,
      },
      rawText: rawResult.rawText,
    };
  }

  private parseByDocumentType(
    raw: any,
    type: AlternativeIdType
  ): Record<string, { value: string; confidence: number }> {
    // Different parsing strategies per document type
    const parsers: Partial<Record<AlternativeIdType, (r: any) => any>> = {
      PASSPORT: this.parsePassport,
      UNHCR_REFUGEE_CARD: this.parseUnhcrCard,
      RESIDENCE_PERMIT: this.parseResidencePermit,
      ASYLUM_SEEKER_CERTIFICATE: this.parseAsylumCert,
      FOREIGN_NATIONAL_ID: this.parseForeignId,
    };

    const parser = parsers[type];
    return parser ? parser(raw) : this.parseGenericDocument(raw);
  }

  private parsePassport = (raw: any) => ({
    surname:         { value: raw.mrz?.surname ?? raw.fields?.surname, confidence: 0.95 },
    givenNames:      { value: raw.mrz?.givenNames ?? raw.fields?.given_names, confidence: 0.95 },
    documentNumber:  { value: raw.mrz?.documentNumber, confidence: 0.99 },
    dateOfBirth:     { value: raw.mrz?.dateOfBirth, confidence: 0.99 },
    nationality:     { value: raw.mrz?.nationality, confidence: 0.99 },
    expiryDate:      { value: raw.mrz?.expiryDate, confidence: 0.99 },
    sex:             { value: raw.mrz?.sex, confidence: 0.99 },
    issuingCountry:  { value: raw.mrz?.issuingState, confidence: 0.99 },
  });

  private parseUnhcrCard = (raw: any) => ({
    caseNumber:      { value: raw.fields?.case_number, confidence: 0.90 },
    fullName:        { value: raw.fields?.full_name, confidence: 0.85 },
    dateOfBirth:     { value: raw.fields?.date_of_birth, confidence: 0.85 },
    nationality:     { value: raw.fields?.nationality, confidence: 0.80 },
    cardNumber:      { value: raw.fields?.card_number, confidence: 0.90 },
    expiryDate:      { value: raw.fields?.expiry_date, confidence: 0.85 },
    countryOfAsylum: { value: raw.fields?.country_of_asylum, confidence: 0.80 },
  });

  private parseAsylumCert = (raw: any) => ({
    referenceNumber: { value: raw.fields?.reference_number, confidence: 0.85 },
    fullName:        { value: raw.fields?.full_name, confidence: 0.80 },
    dateOfBirth:     { value: raw.fields?.date_of_birth, confidence: 0.80 },
    nationality:     { value: raw.fields?.nationality, confidence: 0.75 },
    issueDate:       { value: raw.fields?.issue_date, confidence: 0.85 },
    // Asylum certs often have no expiry — they're renewed at hearings
    expiryDate:      { value: raw.fields?.expiry_date ?? 'PENDING_DECISION', confidence: 0.70 },
  });

  private parseResidencePermit = (raw: any) => ({
    permitNumber:    { value: raw.fields?.permit_number, confidence: 0.90 },
    fullName:        { value: raw.fields?.full_name, confidence: 0.85 },
    dateOfBirth:     { value: raw.fields?.date_of_birth, confidence: 0.85 },
    nationality:     { value: raw.fields?.nationality, confidence: 0.80 },
    permitType:      { value: raw.fields?.permit_type, confidence: 0.80 },
    expiryDate:      { value: raw.fields?.expiry_date, confidence: 0.90 },
    issuingAuthority:{ value: raw.fields?.issuing_authority, confidence: 0.75 },
  });

  private parseForeignId = (raw: any) => ({
    idNumber:        { value: raw.fields?.id_number, confidence: 0.85 },
    fullName:        { value: raw.fields?.full_name, confidence: 0.80 },
    dateOfBirth:     { value: raw.fields?.date_of_birth, confidence: 0.85 },
    nationality:     { value: raw.fields?.nationality, confidence: 0.75 },
    expiryDate:      { value: raw.fields?.expiry_date, confidence: 0.80 },
  });

  private parseGenericDocument = (raw: any) => ({
    fullName:        { value: raw.fields?.name ?? raw.fields?.full_name, confidence: 0.70 },
    dateOfBirth:     { value: raw.fields?.date_of_birth ?? raw.fields?.dob, confidence: 0.65 },
    documentNumber:  { value: raw.fields?.number ?? raw.fields?.reference, confidence: 0.65 },
  });

  private validateMrz(raw: any, type: AlternativeIdType): boolean {
    const mrzTypes: AlternativeIdType[] = [
      'PASSPORT', 'CONVENTION_TRAVEL_DOCUMENT',
      'STATELESS_PERSON_DOCUMENT', 'RESIDENCE_PERMIT',
    ];
    if (!mrzTypes.includes(type)) return true; // Not applicable
    return raw.mrz?.isValid ?? false;
  }

  private checkExpiry(expiryDate?: string): boolean {
    if (!expiryDate || expiryDate === 'PENDING_DECISION') return true;
    return new Date(expiryDate) > new Date();
  }
}
