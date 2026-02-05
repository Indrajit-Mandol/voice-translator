import React from 'react';
import type { TranslationResult } from '../types';

interface TranslationCardProps {
  translation: TranslationResult;
}

/**
 * Component to display a single translation result
 * Shows the original text, translated text, and timestamp
 */
export const TranslationCard: React.FC<TranslationCardProps> = ({ translation }) => {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div style={{
      backgroundColor: '#f8f9fa',
      border: '1px solid #dee2e6',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '12px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s',
    }}>
      <div style={{ marginBottom: '12px' }}>
        <div style={{ 
          fontSize: '12px', 
          color: '#6c757d',
          marginBottom: '4px',
          fontWeight: '500'
        }}>
          Original:
        </div>
        <div style={{ 
          fontSize: '16px', 
          color: '#212529',
          lineHeight: '1.5'
        }}>
          {translation.original}
        </div>
      </div>
      
      <div style={{ 
        borderTop: '1px solid #dee2e6',
        paddingTop: '12px',
        marginBottom: '8px'
      }}>
        <div style={{ 
          fontSize: '12px', 
          color: '#6c757d',
          marginBottom: '4px',
          fontWeight: '500'
        }}>
          Translation ({translation.targetLanguage}):
        </div>
        <div style={{ 
          fontSize: '16px', 
          color: '#0d6efd',
          fontWeight: '500',
          lineHeight: '1.5'
        }}>
          {translation.translated}
        </div>
      </div>
      
      <div style={{ 
        fontSize: '11px', 
        color: '#adb5bd',
        textAlign: 'right'
      }}>
        {formatTime(translation.timestamp)}
      </div>
    </div>
  );
};