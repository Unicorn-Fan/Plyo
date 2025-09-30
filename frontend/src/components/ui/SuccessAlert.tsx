import React from 'react';
import { Alert, AlertProps, Text } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';

interface SuccessAlertProps extends Omit<AlertProps, 'color' | 'icon' | 'children'> {
  message: string;
}

export const SuccessAlert: React.FC<SuccessAlertProps> = ({ message, ...props }) => {
  return (
    <Alert
      icon={<IconCheck size={16} />}
      title="Success"
      color="green"
      variant="light"
      {...props}
    >
      <Text>{message}</Text>
    </Alert>
  );
};
