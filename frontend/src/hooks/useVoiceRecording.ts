import { useState, useEffect, useCallback, useRef } from 'react';
import { RecordingStatus } from '../types';

interface UseVoiceRecordingReturn {
  isRecording: boolean;
  status: RecordingStatus;
  transcript: string;
  error: string | null;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  resetTranscript: () => void;
}

/**
 * Custom hook for managing voice recording using Web Speech API
 * 
 * Decision: Using Web Speech API instead of MediaRecorder because:
 * 1. It provides real-time transcription (no need to send audio to backend)
 * 2. Simpler implementation for this use case
 * 3. Better browser support for speech recognition
 * 
 * Trade-off: Limited to browsers that support Web Speech API (Chrome, Edge, Safari)
 */
export const useVoiceRecording = (): UseVoiceRecordingReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState<RecordingStatus>(RecordingStatus.IDLE);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const finalTranscriptRef = useRef('');

  useEffect(() => {
    // Check if browser supports Speech Recognition
    const SpeechRecognition = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    // Initialize speech recognition
    const recognition = new SpeechRecognition();
    recognition.continuous = true; // Keep listening until stopped
    recognition.interimResults = true; // Get results as user speaks
    recognition.lang = 'en-US'; // Language for recognition

    recognition.onstart = () => {
      console.log('Speech recognition started');
      setStatus(RecordingStatus.RECORDING);
      setError(null);
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      // Process all results
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPiece = event.results[i][0].transcript;
        
        if (event.results[i].isFinal) {
          finalTranscript += transcriptPiece + ' ';
        } else {
          interimTranscript += transcriptPiece;
        }
      }

      // Update the final transcript
      if (finalTranscript) {
        finalTranscriptRef.current += finalTranscript;
        setTranscript(finalTranscriptRef.current.trim());
      } else if (interimTranscript) {
        // Show interim results (what's being said right now)
        setTranscript((finalTranscriptRef.current + interimTranscript).trim());
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      
      let errorMessage = 'An error occurred during speech recognition';
      
      switch (event.error) {
        case 'no-speech':
          errorMessage = 'No speech detected. Please try again.';
          break;
        case 'audio-capture':
          errorMessage = 'No microphone found. Please ensure your microphone is connected.';
          break;
        case 'not-allowed':
          errorMessage = 'Microphone access denied. Please allow microphone access.';
          break;
        case 'network':
          errorMessage = 'Network error occurred. Please check your connection.';
          break;
      }
      
      setError(errorMessage);
      setStatus(RecordingStatus.IDLE);
      setIsRecording(false);
    };

    recognition.onend = () => {
      console.log('Speech recognition ended');
      if (isRecording) {
        // If we're still supposed to be recording, restart
        recognition.start();
      } else {
        setStatus(RecordingStatus.IDLE);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isRecording]);

  const startRecording = useCallback(async () => {
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      setError(null);
      setIsRecording(true);
      finalTranscriptRef.current = '';
      setTranscript('');
      
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
    } catch (err) {
      console.error('Error starting recording:', err);
      setError('Failed to access microphone. Please grant permission and try again.');
      setIsRecording(false);
    }
  }, []);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setStatus(RecordingStatus.IDLE);
  }, []);

  const resetTranscript = useCallback(() => {
    finalTranscriptRef.current = '';
    setTranscript('');
    setError(null);
  }, []);

  return {
    isRecording,
    status,
    transcript,
    error,
    startRecording,
    stopRecording,
    resetTranscript
  };
};