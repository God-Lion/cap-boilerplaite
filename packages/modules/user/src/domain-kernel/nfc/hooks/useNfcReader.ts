import { useState, useEffect } from 'react';
import { NfcCardEvent, ReaderStatus } from '@cap/platform-core/types/nfc';

/**
 * Hook to interface with the NFC reader via WebSocket.
 * @param wsUrl The WebSocket URL (e.g., 'ws://localhost:3333/nfc')
 */
export function useNfcReader(wsUrl: string) {
  const [status, setStatus] = useState<ReaderStatus>('disconnected');
  const [lastCard, setLastCard] = useState<NfcCardEvent | null>(null);
  const [readerName, setReaderName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ws: WebSocket;
    let reconnectTimer: any;

    const connect = () => {
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        setStatus('waiting');
        setError(null);
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);

          switch (message.type) {
            case 'READER_CONNECTED':
              setReaderName(message.payload.readerName);
              setStatus('connected');
              break;

            case 'CARD_DETECTED':
              setLastCard(message.payload);
              setStatus('card_detected');
              // Reset to connected status after 2 seconds to allow next tap
              setTimeout(() => setStatus('connected'), 2000);
              break;

            case 'READER_DISCONNECTED':
              setStatus('disconnected');
              setReaderName(null);
              break;
            
            case 'READER_ERROR':
              setError(message.payload.error);
              setStatus('error');
              break;
          }
        } catch (e) {
          console.error('[NFC] Failed to parse message:', e);
        }
      };

      ws.onerror = () => {
        setError('WebSocket connection failed');
        setStatus('error');
      };

      ws.onclose = () => {
        setStatus('disconnected');
        // Simple reconnect logic
        reconnectTimer = setTimeout(connect, 5000);
      };
    };

    connect();

    return () => {
      if (ws) ws.close();
      if (reconnectTimer) clearTimeout(reconnectTimer);
    };
  }, [wsUrl]);

  return { status, lastCard, readerName, error };
}
