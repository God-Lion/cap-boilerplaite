import { useState, useCallback } from 'react';
import { apiClient } from '@cap/platform-core'
import { NfcVerificationResult, NfcVerificationParams } from '@cap/platform-core'

export interface NfcVerificationState {
  isVerifying: boolean;
  isVerified: boolean;
  error: string | null;
  result: NfcVerificationResult | null;
}

export const useNfcVerification = () => {
  const [state, setState] = useState<NfcVerificationState>({
    isVerifying: false,
    isVerified: false,
    error: null,
    result: null,
  });

  const verifyTag = useCallback(async (uid: string, ctr: string, cmac: string) => {
    setState(prev => ({ ...prev, isVerifying: true, error: null }));

    try {
      // The verification URL is relative to the Authentication service
      // Assuming the backend is at /api/v1/auth or similar, but for NTAG424
      // it's usually a direct URL like /nfc/verify
      const response = await apiClient.get<any>('/nfc/verify', {
        params: { uid, ctr, cmac }
      });

      if (response.data.verified) {
        setState({
          isVerifying: false,
          isVerified: true,
          error: null,
          result: response.data,
        });
        return true;
      } else {
        throw new Error(response.data.reason || 'Verification failed');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Unknown error during NFC verification';
      setState({
        isVerifying: false,
        isVerified: false,
        error: errorMessage,
        result: null,
      });
      return false;
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      isVerifying: false,
      isVerified: false,
      error: null,
      result: null,
    });
  }, []);

  return {
    ...state,
    verifyTag,
    reset,
  };
};
