import React, { useState } from 'react';
import { Card, Text, Group, Button, Badge, Box, Stack } from '@mantine/core';
import { IconMapPin, IconPhone, IconMail, IconRoute, IconCheck } from '@tabler/icons-react';
import { BrokerOffice } from '../../types';

interface BrokerCardProps {
  broker: BrokerOffice;
  onSelect?: (broker: BrokerOffice) => void;
  showDistance?: boolean;
}

export const BrokerCard: React.FC<BrokerCardProps> = ({
  broker,
  onSelect,
  showDistance = false,
}) => {
  const [isSelected, setIsSelected] = useState(false);

  const handleSelect = () => {
    setIsSelected(true);
    onSelect?.(broker);
    
    setTimeout(() => setIsSelected(false), 1000);
  };

  return (
    <Card 
      shadow="sm" 
      padding="lg" 
      radius="md" 
      withBorder
      className="h-full flex flex-col transition-all duration-200 hover:shadow-medium hover:-translate-y-1"
    >
      <Stack spacing="md" className="flex-1">
        {/* Header with name and distance */}
        <Group position="apart" align="flex-start" className="mb-3">
          <Text 
            weight={600} 
            size="lg" 
            className="flex-1 leading-tight min-h-[2.4em] overflow-hidden text-ellipsis line-clamp-2 text-gray-900"
          >
            {broker.name}
          </Text>
          {broker.distance !== undefined && (
            <Badge 
              color="blue" 
              variant="light" 
              size="sm"
              className="bg-primary-100 text-primary-700 border-primary-200 flex-shrink-0"
            >
              {broker.distance.toFixed(1)} km
            </Badge>
          )}
        </Group>

        {/* Contact information */}
        <Box className="flex-1">
          <Stack spacing="sm">
            <div className="flex items-start gap-2">
              <IconMapPin size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
              <Text 
                size="sm" 
                color="dimmed" 
                className="leading-relaxed break-words hyphens-auto text-gray-600"
              >
                {broker.address}
              </Text>
            </div>

            <div className="flex items-start gap-2">
              <IconPhone size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
              <Text 
                size="sm" 
                color="dimmed" 
                className="leading-relaxed break-words text-gray-600"
              >
                {broker.phoneNumber}
              </Text>
            </div>

            <div className="flex items-start gap-2">
              <IconMail size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
              <Text 
                size="sm" 
                color="dimmed" 
                className="leading-relaxed break-all text-gray-600"
              >
                {broker.emailAddress}
              </Text>
            </div>

            <div className="flex items-start gap-2">
              <IconMapPin size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
              <Text 
                size="sm" 
                color="dimmed" 
                className="leading-relaxed break-words text-gray-600"
              >
                {broker.city}
              </Text>
            </div>
          </Stack>
        </Box>

        {/* Action button */}
        {onSelect && (
          <Button
            variant={isSelected ? "filled" : "light"}
            color={isSelected ? "green" : "blue"}
            fullWidth
            radius="md"
            leftIcon={isSelected ? <IconCheck size={16} /> : <IconRoute size={16} />}
            onClick={handleSelect}
            loading={isSelected}
            className={`mt-auto transition-all duration-200 text-sm font-medium ${
              isSelected 
                ? 'bg-success-500 hover:bg-success-600 text-white shadow-sm' 
                : 'bg-primary-50 hover:bg-primary-100 text-primary-700 border-primary-200 hover:shadow-sm'
            }`}
          >
            {isSelected ? 'Selected!' : 'Select This Broker'}
          </Button>
        )}
      </Stack>
    </Card>
  );
};
