export interface NfcCardEvent {
  uid: string;
  cardType: string;
  timestamp: string; // ISO string for frontend
  readerName: string;
}

export type ReaderStatus = 'disconnected' | 'connected' | 'waiting' | 'card_detected' | 'error';

export interface NfcMessage {
  type: 'CARD_DETECTED' | 'READER_CONNECTED' | 'READER_DISCONNECTED' | 'READER_ERROR';
  payload: any;
}

export interface NfcVerificationResult {
  verified: boolean;
  reason?: string;
  uid?: string;
  scanCount?: number;
  userData?: any;
}

export interface NfcVerificationParams {
  uid: string;
  ctr: string;
  cmac: string;
}
