import React from 'react';
import { Grid, Text, Alert, Box } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { BrokerCard } from './BrokerCard';
import { BrokerOffice } from '../../types';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorAlert } from '../../components/ui/ErrorAlert';

interface BrokerListProps {
  brokers: BrokerOffice[];
  isLoading?: boolean;
  error?: string;
  onBrokerSelect?: (broker: BrokerOffice) => void;
  showDistance?: boolean;
  message?: string;
}

export const BrokerList: React.FC<BrokerListProps> = ({
  brokers,
  isLoading = false,
  error,
  onBrokerSelect,
  showDistance = false,
  message,
}) => {
  if (isLoading) {
    return <LoadingSpinner message="Searching for broker offices..." />;
  }

  if (error) {
    return <ErrorAlert error={error} />;
  }

  if (brokers.length === 0) {
    return (
      <Alert
        icon={<IconInfoCircle size={16} />}
        title="No broker offices found"
        color="blue"
        variant="light"
      >
        <Text>No broker offices were found for the specified location. Please try a different city.</Text>
      </Alert>
    );
  }

  return (
    <Box>
      {message && (
        <Alert
          icon={<IconInfoCircle size={16} />}
          title="Search Results"
          color="green"
          variant="light"
          mb="md"
        >
          <Text>{message}</Text>
        </Alert>
      )}

      <Grid gutter="md">
        {brokers.map((broker) => (
          <Grid.Col key={broker.id} span={12} md={6}>
            <BrokerCard
              broker={broker}
              onSelect={onBrokerSelect}
              showDistance={showDistance}
            />
          </Grid.Col>
        ))}
      </Grid>
    </Box>
  );
};
