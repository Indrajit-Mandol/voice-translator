import React from 'react';
import { RecordingStatus } from '../types';

interface RecordingControlsProps {
  isRecording: boolean;
  status: RecordingStatus;
  transcript: string;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onTranslate: () => void;
  onClear: () => void;
  disabled?: boolean;
}

/**
 * Component for recording controls
 * Provides buttons for starting/stopping recording and translating text
 */
export const RecordingControls: React.FC<RecordingControlsProps> = ({
  isRecording,
  status,
  transcript,
  onStartRecording,
  onStopRecording,
  onTranslate,
  onClear,
  disabled = false
}) => {
  return (
    <div style={{ marginBottom: '24px' }}>
      {/* Status indicator */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '16px',
        padding: '12px',
        backgroundColor: status === RecordingStatus.RECORDING ? '#d1e7dd' : '#f8f9fa',
        borderRadius: '8px',
        border: `2px solid ${status === RecordingStatus.RECORDING ? '#0f5132' : '#dee2e6'}`,
      }}>
        <div style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          backgroundColor: status === RecordingStatus.RECORDING ? '#198754' : '#6c757d',
          marginRight: '8px',
          animation: status === RecordingStatus.RECORDING ? 'pulse 1.5s infinite' : 'none'
        }} />
        <span style={{ 
          fontSize: '14px',
          fontWeight: '500',
          color: status === RecordingStatus.RECORDING ? '#0f5132' : '#495057'
        }}>
          {status === RecordingStatus.RECORDING ? 'Recording...' : 'Ready'}
        </span>
      </div>

      {/* Transcript display */}
      <div style={{
        minHeight: '100px',
        padding: '16px',
        backgroundColor: '#ffffff',
        border: '2px solid #dee2e6',
        borderRadius: '8px',
        marginBottom: '16px',
        fontSize: '16px',
        lineHeight: '1.6',
        color: transcript ? '#212529' : '#adb5bd',
        overflowY: 'auto',
        maxHeight: '200px'
      }}>
        {transcript || 'Your speech will appear here...'}
      </div>

      {/* Control buttons */}
      <div style={{ 
        display: 'flex', 
        gap: '12px',
        flexWrap: 'wrap'
      }}>
        {!isRecording ? (
          <button
            onClick={onStartRecording}
            disabled={disabled}
            style={{
              flex: 1,
              minWidth: '140px',
              padding: '12px 24px',
              backgroundColor: disabled ? '#6c757d' : '#198754',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: disabled ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
            onMouseOver={(e) => {
              if (!disabled) {
                e.currentTarget.style.backgroundColor = '#157347';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
              }
            }}
            onMouseOut={(e) => {
              if (!disabled) {
                e.currentTarget.style.backgroundColor = '#198754';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
              }
            }}
          >
            🎤 Start Recording
          </button>
        ) : (
          <button
            onClick={onStopRecording}
            style={{
              flex: 1,
              minWidth: '140px',
              padding: '12px 24px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#bb2d3b';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#dc3545';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            }}
          >
            ⏹️ Stop Recording
          </button>
        )}

        <button
          onClick={onTranslate}
          disabled={!transcript || disabled}
          style={{
            flex: 1,
            minWidth: '140px',
            padding: '12px 24px',
            backgroundColor: (!transcript || disabled) ? '#6c757d' : '#0d6efd',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: (!transcript || disabled) ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
          onMouseOver={(e) => {
            if (transcript && !disabled) {
              e.currentTarget.style.backgroundColor = '#0b5ed7';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
            }
          }}
          onMouseOut={(e) => {
            if (transcript && !disabled) {
              e.currentTarget.style.backgroundColor = '#0d6efd';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            }
          }}
        >
          🌐 Translate
        </button>

        <button
          onClick={onClear}
          disabled={!transcript}
          style={{
            padding: '12px 24px',
            backgroundColor: !transcript ? '#e9ecef' : '#6c757d',
            color: !transcript ? '#adb5bd' : 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: !transcript ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
          onMouseOver={(e) => {
            if (transcript) {
              e.currentTarget.style.backgroundColor = '#5c636a';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
            }
          }}
          onMouseOut={(e) => {
            if (transcript) {
              e.currentTarget.style.backgroundColor = '#6c757d';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            }
          }}
        >
          🗑️ Clear
        </button>
      </div>

      {/* Add pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
};