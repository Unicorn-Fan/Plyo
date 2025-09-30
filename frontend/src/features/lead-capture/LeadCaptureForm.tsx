import React, { useState, useCallback } from 'react';
import { useForm } from '@mantine/form';
import {
  Paper,
  TextInput,
  Textarea,
  Button,
  Stack,
  Text,
  Title,
  Group,
} from '@mantine/core';
import { IconUser, IconPhone, IconMail, IconMapPin, IconMessage } from '@tabler/icons-react';
import { CityAutocomplete } from '../city-search/CityAutocomplete';
import { useLeadCapture } from '../../hooks/useLeadCapture';
import { City } from '../../types';
import { ErrorAlert } from '../../components/ui/ErrorAlert';
import { SuccessAlert } from '../../components/ui/SuccessAlert';

interface LeadCaptureFormProps {
  onSuccess?: (leadId: string, city: City) => void;
}

export const LeadCaptureForm: React.FC<LeadCaptureFormProps> = ({ onSuccess }) => {
  const { submitLead, isSubmitting, error, success, reset } = useLeadCapture();
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  const form = useForm({
    initialValues: {
      fullName: '',
      phoneNumber: '',
      emailAddress: '',
      city: '',
      comment: '',
    },
    validate: {
      fullName: (value) => (value.length < 2 ? 'Name must be at least 2 characters' : null),
      phoneNumber: (value) => {
        if (!value) return 'Phone number is required';
        const phoneRegex = /^(\+47|0047|47)?[2-9]\d{7,8}$/;
        const cleanedPhone = value.replace(/\s/g, '');
        return phoneRegex.test(cleanedPhone) ? null : 'Please enter a valid Norwegian phone number';
      },
      emailAddress: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      city: (value) => (!selectedCity ? 'Please select a valid city' : null),
    },
  });

  const handleCitySelect = useCallback((city: City | null) => {
    setSelectedCity(city);
    if (city) {
      form.setFieldValue('city', `${city.name}, ${city.region}`);
    }
  }, [form]);

  const handleCityChange = useCallback((value: string) => {
    form.setFieldValue('city', value);
    if (selectedCity && value !== `${selectedCity.name}, ${selectedCity.region}`) {
      setSelectedCity(null);
    }
  }, [form, selectedCity]);

  const handleSubmit = async (values: typeof form.values) => {
    if (!selectedCity) {
      form.setFieldError('city', 'Please select a valid city');
      return;
    }

    try {
      const response = await submitLead({
        fullName: values.fullName,
        phoneNumber: values.phoneNumber,
        emailAddress: values.emailAddress,
        city: values.city,
        comment: values.comment || undefined,
      });

      onSuccess?.(response.leadId, selectedCity);
      form.reset();
      setSelectedCity(null);
    } catch (error) {
    }
  };

  const handleReset = () => {
    form.reset();
    setSelectedCity(null);
    reset();
  };

  if (success) {
    return (
      <Paper shadow="sm" p="xl" radius="md" withBorder>
        <SuccessAlert message={success.message} />
        <Button
          variant="light"
          color="blue"
          fullWidth
          mt="md"
          onClick={handleReset}
        >
          Submit Another Lead
        </Button>
      </Paper>
    );
  }

  return (
    <Paper shadow="sm" p="xl" radius="md" withBorder className="card-gradient animate-fade-in">
      <Title order={2} mb="md" align="center" className="text-gradient">
        Find Your Perfect Home
      </Title>
      <Text size="sm" color="dimmed" mb="xl" align="center" className="text-gray-600">
        Connect with local Norwegian property experts who can help you find your dream home.
      </Text>

      {error && <ErrorAlert error={error} mb="md" />}

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack spacing="md">
          <TextInput
            label="Full Name"
            placeholder="Enter your full name"
            icon={<IconUser size={16} />}
            required
            className="input-focus"
            {...form.getInputProps('fullName')}
          />

          <TextInput
            label="Phone Number"
            placeholder="e.g., +47 123 45 678"
            icon={<IconPhone size={16} />}
            required
            className="input-focus"
            {...form.getInputProps('phoneNumber')}
          />

          <TextInput
            label="Email Address"
            placeholder="your.email@example.com"
            icon={<IconMail size={16} />}
            required
            className="input-focus"
            {...form.getInputProps('emailAddress')}
          />

          <CityAutocomplete
            label="City"
            placeholder="Search for a Norwegian city..."
            icon={<IconMapPin size={16} />}
            value={form.values.city}
            onChange={handleCityChange}
            onCitySelect={handleCitySelect}
            required
            error={form.errors.city}
          />

          <Textarea
            label="Comments (Optional)"
            placeholder="Tell us about your home buying preferences..."
            icon={<IconMessage size={16} />}
            minRows={3}
            maxRows={6}
            className="input-focus"
            {...form.getInputProps('comment')}
          />

          <Group position="center" mt="xl">
            <Button
              type="submit"
              size="lg"
              loading={isSubmitting}
              disabled={!selectedCity}
              className="btn-primary"
            >
              Find My Broker
            </Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
};
