import { useState, useEffect, useCallback } from 'react';
import { socketService } from '../services/socketService';
import type { TranslationResult } from '../types';

interface UseSocketReturn {
  isConnected: boolean;
  translations: TranslationResult[];
  connectionError: string | null;
  sendTranslation: (text: string, targetLanguage?: string) => void;
  clearTranslations: () => void;
}

/**
 * Custom hook for managing Socket.io connection and translation state
 * 
 * This hook handles:
 * 1. Socket connection lifecycle
 * 2. Sending translation requests
 * 3. Receiving and storing translation results
 * 4. Error handling
 */
export const useSocket = (): UseSocketReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [translations, setTranslations] = useState<TranslationResult[]>([]);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    // Connect to socket on mount
    socketService.connect()
      .then(() => {
        setIsConnected(true);
        setConnectionError(null);
      })
      .catch((error) => {
        setIsConnected(false);
        setConnectionError('Failed to connect to server. Please ensure the backend is running.');
        console.error('Socket connection error:', error);
      });

    // Set up listeners for translation results
    socketService.onTranslationResult((result: TranslationResult) => {
      setTranslations(prev => [...prev, result]);
    });

    socketService.onTranslationError((error) => {
      console.error('Translation error:', error);
      setConnectionError(error.error);
    });

    // Cleanup on unmount
    return () => {
      socketService.removeAllListeners();
      socketService.disconnect();
    };
  }, []);

  const sendTranslation = useCallback((text: string, targetLanguage: string = 'es') => {
    if (!isConnected) {
      setConnectionError('Not connected to server');
      return;
    }

    try {
      socketService.sendTranslation(text, targetLanguage);
      setConnectionError(null);
    } catch (error) {
      console.error('Error sending translation:', error);
      setConnectionError('Failed to send translation request');
    }
  }, [isConnected]);

  const clearTranslations = useCallback(() => {
    setTranslations([]);
  }, []);

  return {
    isConnected,
    translations,
    connectionError,
    sendTranslation,
    clearTranslations
  };
};