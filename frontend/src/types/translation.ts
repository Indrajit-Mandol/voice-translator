export interface TranslationResult {
  original: string;
  translated: string;
  targetLanguage: string;
  timestamp: string;
}

export interface TranslationError {
  error: string;
}

export enum RecordingStatus {
  IDLE = 'idle',
  RECORDING = 'recording',
  PROCESSING = 'processing'
}

export interface AudioChunk {
  data: Blob;
  timestamp: number;
}