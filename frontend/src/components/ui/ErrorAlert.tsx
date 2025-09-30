import React from 'react';
import { Alert, AlertProps, Text } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

interface ErrorAlertProps extends Omit<AlertProps, 'color' | 'icon' | 'children'> {
  error: string;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ error, ...props }) => {
  return (
    <Alert
      icon={<IconAlertCircle size={16} />}
      title="Error"
      color="red"
      variant="light"
      {...props}
    >
      <Text>{error}</Text>
    </Alert>
  );
};
