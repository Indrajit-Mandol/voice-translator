import React from 'react';

interface ConnectionStatusProps {
  isConnected: boolean;
  error?: string | null;
}

/**
 * Component to display connection status to the backend server
 */
export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ 
  isConnected, 
  error 
}) => {
  return (
    <div style={{
      padding: '12px 16px',
      borderRadius: '8px',
      marginBottom: '20px',
      backgroundColor: isConnected ? '#d1e7dd' : '#f8d7da',
      border: `1px solid ${isConnected ? '#badbcc' : '#f5c2c7'}`,
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }}>
      <div style={{
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        backgroundColor: isConnected ? '#198754' : '#dc3545',
        flexShrink: 0
      }} />
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: '14px',
          fontWeight: '600',
          color: isConnected ? '#0f5132' : '#842029',
          marginBottom: error ? '4px' : '0'
        }}>
          {isConnected ? 'Connected to server' : 'Disconnected from server'}
        </div>
        {error && (
          <div style={{
            fontSize: '13px',
            color: '#842029'
          }}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
};