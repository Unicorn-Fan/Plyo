import React from 'react';
import { Loader, Box } from '@mantine/core';

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  message = 'Loading...' 
}) => {
  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      <Loader size={size} />
      {message && (
        <Box
          style={{
            marginTop: '1rem',
            fontSize: '0.875rem',
            color: '#666',
          }}
        >
          {message}
        </Box>
      )}
    </Box>
  );
};

