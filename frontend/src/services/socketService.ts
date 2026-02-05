import { io, Socket } from 'socket.io-client';


import type { TranslationResult, TranslationError } from '../types';


const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Function[]> = new Map();


  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.socket = io(SOCKET_URL, {
          transports: ['websocket', 'polling'],
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionAttempts: 5
        });

        this.socket.on('connect', () => {
          console.log('Connected to server:', this.socket?.id);
          resolve();
        });

        this.socket.on('connect_error', (error) => {
          console.error('Connection error:', error);
          reject(error);
        });

        this.socket.on('disconnect', () => {
          console.log('Disconnected from server');
        });

      } catch (error) {
        reject(error);
      }
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  sendTranslation(text: string, targetLanguage: string = 'es'): void {
    if (!this.socket || !this.socket.connected) {
      throw new Error('Socket not connected');
    }
    
    this.socket.emit('translate', { text, targetLanguage });
  }

  onTranslationResult(callback: (result: TranslationResult) => void): void {
    if (!this.socket) return;
    
    this.socket.on('translation-result', callback);
    
    // Store listener for cleanup
    if (!this.listeners.has('translation-result')) {
      this.listeners.set('translation-result', []);
    }
    this.listeners.get('translation-result')?.push(callback);
  }

  onTranslationError(callback: (error: TranslationError) => void): void {
    if (!this.socket) return;
    
    this.socket.on('translation-error', callback);
    
    // Store listener for cleanup
    if (!this.listeners.has('translation-error')) {
      this.listeners.set('translation-error', []);
    }
    this.listeners.get('translation-error')?.push(callback);
  }

  removeAllListeners(): void {
    if (!this.socket) return;
    
    this.listeners.forEach((_, event) => {
      this.socket?.off(event);
    });
    this.listeners.clear();
  }
}

export const socketService = new SocketService();