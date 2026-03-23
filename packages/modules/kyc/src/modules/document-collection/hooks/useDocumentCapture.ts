import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import type { DocumentUpload, OcrResult } from '../types';
import type { AlternativeIdType } from '../../../domain-kernel/src/types/AlternativeId';
import { documentService } from '../services/document.service';

interface UseDocumentCaptureReturn {
  documents: DocumentUpload[];
  uploadDocument: (type: AlternativeIdType, file: File, kycProfileId: string) => void;
  removeDocument: (id: string) => void;
  runOcr: (documentId: string) => Promise<OcrResult | null>;
  ocrResults: Record<string, OcrResult>;
  isUploading: boolean;
  isProcessing: string | null;
  error: Error | null;
}

export function useDocumentCapture(): UseDocumentCaptureReturn {
  const [documents, setDocuments] = useState<DocumentUpload[]>([]);
  const [ocrResults, setOcrResults] = useState<Record<string, OcrResult>>({});
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const uploadMutation = useMutation({
    mutationFn: async ({
      kycProfileId,
      documentType,
      file,
    }: {
      kycProfileId: string;
      documentType: AlternativeIdType;
      file: File;
    }) => {
      return documentService.uploadDocument(kycProfileId, documentType, file);
    },
    onSuccess: () => {
      setError(null);
    },
    onError: (err) => {
      setError(err instanceof Error ? err : new Error('Upload failed'));
    },
  });

  const uploadDocument = useCallback(
    (type: AlternativeIdType, file: File, kycProfileId: string) => {
      const id = `${type}-${Date.now()}`;
      const upload: DocumentUpload = {
        id,
        type,
        file,
        previewUrl: URL.createObjectURL(file),
        status: 'UPLOADING',
        progress: 0,
      };

      setDocuments((prev) => [...prev, upload]);
      uploadMutation.mutate({ kycProfileId, documentType: type, file });
    },
    [uploadMutation]
  );

  const removeDocument = useCallback((id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    setOcrResults((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const runOcr = useCallback(async (documentId: string): Promise<OcrResult | null> => {
    setIsProcessing(documentId);
    try {
      const result = await documentService.runOcr(documentId);
      setOcrResults((prev) => ({ ...prev, [documentId]: result as OcrResult }));
      return result as OcrResult;
    } catch {
      return null;
    } finally {
      setIsProcessing(null);
    }
  }, []);

  return {
    documents,
    uploadDocument,
    removeDocument,
    runOcr,
    ocrResults,
    isUploading: uploadMutation.isPending,
    isProcessing,
    error: error ?? uploadMutation.error ?? null,
  };
}

export type { DocumentUpload, OcrResult };
