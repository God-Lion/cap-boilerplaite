import type { AlternativeIdDocument } from '../../../domain-kernel/src/types/AlternativeId';
import type { AlternativeIdType } from '../../../domain-kernel/src/types/AlternativeId';
import type { KycDocument } from '../../../domain-kernel/src/types/KycProfile';
import { apiClient } from '@cap/platform-core';

export class DocumentService {
  async uploadDocument(
    kycProfileId: string,
    documentType: AlternativeIdType,
    frontImage: File,
    backImage?: File,
    selfieWithDocument?: File
  ): Promise<KycDocument> {
    const formData = new FormData();
    formData.append('kycProfileId', kycProfileId);
    formData.append('documentType', documentType);
    formData.append('frontImage', frontImage);
    if (backImage) formData.append('backImage', backImage);
    if (selfieWithDocument) formData.append('selfieWithDocument', selfieWithDocument);

    const response = await apiClient.post<KycDocument>('/api/kyc/documents/upload', formData);

    return response.data;
  }

  async deleteDocument(documentId: string): Promise<void> {
    await apiClient.delete(`/api/kyc/documents/${documentId}`);
  }

  async getDocuments(kycProfileId: string): Promise<KycDocument[]> {
    const response = await apiClient.get<KycDocument[]>(`/api/kyc/${kycProfileId}/documents`);
    return response.data;
  }

  async verifyDocument(documentId: string): Promise<KycDocument> {
    const response = await apiClient.post<KycDocument>(`/api/kyc/documents/${documentId}/verify`);
    return response.data;
  }

  async runOcr(documentId: string): Promise<AlternativeIdDocument> {
    const response = await apiClient.post<AlternativeIdDocument>(`/api/kyc/documents/${documentId}/ocr`);
    return response.data;
  }

  validateDocumentRequirements(
    documents: KycDocument[],
    requiredTypes: AlternativeIdType[]
  ): { valid: boolean; missing: AlternativeIdType[] } {
    const uploadedTypes = new Set(documents.map((d) => d.type as AlternativeIdType));
    const missing = requiredTypes.filter((type) => !uploadedTypes.has(type));
    return {
      valid: missing.length === 0,
      missing,
    };
  }
}

export const documentService = new DocumentService();
