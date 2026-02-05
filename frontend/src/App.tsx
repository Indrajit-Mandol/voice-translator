import React, { useState } from 'react';
import { useVoiceRecording } from './hooks/useVoiceRecording';
import { useSocket } from './hooks/useSocket';
import { RecordingControls } from './components/RecordingControls';
import { TranslationCard } from './components/TranslationCard';
import { ConnectionStatus } from './components/ConnectionStatus';

/**
 * Main App Component
 * 
 * Architecture decisions:
 * 1. Using custom hooks (useVoiceRecording, useSocket) for separation of concerns
 * 2. Component composition for UI elements
 * 3. Inline styles for simplicity (in production, would use CSS modules or styled-components)
 * 4. Real-time updates via Socket.io
 * 
 * Flow:
 * 1. User clicks "Start Recording"
 * 2. Web Speech API captures audio and converts to text
 * 3. User clicks "Translate" 
 * 4. Text is sent to backend via WebSocket
 * 5. Backend processes and returns translation
 * 6. Translation appears in real-time in the UI
 */
function App() {
  const [targetLanguage, setTargetLanguage] = useState('es');
  
  // Voice recording hook
  const {
    isRecording,
    status,
    transcript,
    error: recordingError,
    startRecording,
    stopRecording,
    resetTranscript
  } = useVoiceRecording();

  // Socket connection hook
  const {
    isConnected,
    translations,
    connectionError,
    sendTranslation,
    clearTranslations
  } = useSocket();

  // Handle translation request
  const handleTranslate = () => {
    if (transcript.trim()) {
      sendTranslation(transcript, targetLanguage);
      resetTranscript(); // Clear transcript after sending
    }
  };

  // Handle clear action
  const handleClear = () => {
    resetTranscript();
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f0f2f5',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <header style={{
          backgroundColor: '#ffffff',
          padding: '24px',
          borderRadius: '12px',
          marginBottom: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{
            margin: '0 0 8px 0',
            fontSize: '32px',
            color: '#212529',
            fontWeight: '700'
          }}>
            🎤 Voice Translator
          </h1>
          <p style={{
            margin: 0,
            color: '#6c757d',
            fontSize: '16px'
          }}>
            Speak naturally and get instant translations
          </p>
        </header>

        {/* Connection Status */}
        <ConnectionStatus 
          isConnected={isConnected} 
          error={connectionError} 
        />

        {/* Main Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '24px',
          alignItems: 'start'
        }}>
          {/* Left Panel - Recording Controls */}
          <div style={{
            backgroundColor: '#ffffff',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{
              margin: '0 0 20px 0',
              fontSize: '20px',
              color: '#212529',
              fontWeight: '600'
            }}>
              Record & Translate
            </h2>

            {/* Language Selection */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#495057'
              }}>
                Target Language:
              </label>
              <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                disabled={isRecording}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: '16px',
                  border: '2px solid #dee2e6',
                  borderRadius: '8px',
                  backgroundColor: '#ffffff',
                  cursor: isRecording ? 'not-allowed' : 'pointer',
                  color: '#495057'
                }}
              >
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="it">Italian</option>
                <option value="pt">Portuguese</option>
                <option value="ja">Japanese</option>
                <option value="zh">Chinese</option>
              </select>
            </div>

            {/* Recording Controls */}
            <RecordingControls
              isRecording={isRecording}
              status={status}
              transcript={transcript}
              onStartRecording={startRecording}
              onStopRecording={stopRecording}
              onTranslate={handleTranslate}
              onClear={handleClear}
              disabled={!isConnected}
            />

            {/* Error Display */}
            {(recordingError || connectionError) && (
              <div style={{
                padding: '12px',
                backgroundColor: '#f8d7da',
                border: '1px solid #f5c2c7',
                borderRadius: '8px',
                color: '#842029',
                fontSize: '14px',
                marginTop: '16px'
              }}>
                <strong>⚠️ Error:</strong> {recordingError || connectionError}
              </div>
            )}

            {/* Instructions */}
            <div style={{
              marginTop: '24px',
              padding: '16px',
              backgroundColor: '#e7f1ff',
              border: '1px solid #b6d4fe',
              borderRadius: '8px',
              fontSize: '14px',
              color: '#084298',
              lineHeight: '1.6'
            }}>
              <strong>📝 How to use:</strong>
              <ol style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
                <li>Click "Start Recording" and speak clearly</li>
                <li>Your speech will appear as text</li>
                <li>Click "Stop Recording" when done</li>
                <li>Click "Translate" to get the translation</li>
              </ol>
            </div>
          </div>

          {/* Right Panel - Translations */}
          <div style={{
            backgroundColor: '#ffffff',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            minHeight: '400px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 style={{
                margin: 0,
                fontSize: '20px',
                color: '#212529',
                fontWeight: '600'
              }}>
                Translations ({translations.length})
              </h2>
              {translations.length > 0 && (
                <button
                  onClick={clearTranslations}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#5c636a';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#6c757d';
                  }}
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Translation List */}
            <div style={{
              maxHeight: '600px',
              overflowY: 'auto',
              paddingRight: '8px'
            }}>
              {translations.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '60px 20px',
                  color: '#adb5bd',
                  fontSize: '16px'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                    💬
                  </div>
                  <div>
                    No translations yet.<br />
                    Start recording to see your translations here.
                  </div>
                </div>
              ) : (
                <>
                  {translations.map((translation, index) => (
                    <TranslationCard 
                      key={`${translation.timestamp}-${index}`} 
                      translation={translation} 
                    />
                  ))}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer style={{
          textAlign: 'center',
          marginTop: '40px',
          padding: '20px',
          color: '#6c757d',
          fontSize: '14px'
        }}>
          <p style={{ margin: 0 }}>
            Built with React, TypeScript, Socket.io, and Web Speech API
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;