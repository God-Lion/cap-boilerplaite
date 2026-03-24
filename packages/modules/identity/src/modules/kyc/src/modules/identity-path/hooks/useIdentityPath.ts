import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { identityPathService } from '../services/identity-path.service';
import type { PathDetectionInput, PathDetectionResult } from '../services/identity-path.service';

interface UseIdentityPathReturn {
  detectPath: (input: PathDetectionInput) => void;
  pathResult: PathDetectionResult | null;
  isDetecting: boolean;
  error: Error | null;
  reset: () => void;
}

export function useIdentityPath(): UseIdentityPathReturn {
  const [pathResult, setPathResult] = useState<PathDetectionResult | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const mutation = useMutation<PathDetectionResult, Error, PathDetectionInput>({
    mutationFn: (input: PathDetectionInput) => identityPathService.detectPath(input),
    onSuccess: (data: PathDetectionResult) => {
      setPathResult(data);
      setError(null);
    },
    onError: (err: Error) => {
      setError(err);
    },
  });

  const detectPath = useCallback(
    (input: PathDetectionInput) => {
      mutation.mutate(input);
    },
    [mutation]
  );

  const reset = useCallback(() => {
    setPathResult(null);
    setError(null);
    mutation.reset();
  }, [mutation]);

  return {
    detectPath,
    pathResult: pathResult ?? mutation.data ?? null,
    isDetecting: mutation.isPending,
    error: error ?? mutation.error ?? null,
    reset,
  };
}

export type { PathDetectionInput, PathDetectionResult };
