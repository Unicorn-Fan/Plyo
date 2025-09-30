import React, { useState, useCallback } from 'react';
import { MantineProvider, AppShell, Header, Title, Container, Group, Text, Modal, Button, Stack, Card, Badge } from '@mantine/core';
import { Notifications, showNotification } from '@mantine/notifications';
import { IconHome, IconBuildingEstate, IconCheck, IconUser, IconMapPin, IconPhone, IconMail } from '@tabler/icons-react';
import { LeadCaptureForm } from './features/lead-capture/LeadCaptureForm';
import { BrokerList } from './features/broker-listing/BrokerList';
import { useBrokerSearch } from './hooks/useBrokerSearch';
import { City } from './types';
import { leadApi } from './services/api';

function App() {
  const [leadId, setLeadId] = useState<string | null>(null);
  const [leadCity, setLeadCity] = useState<City | null>(null);
  const [selectedBroker, setSelectedBroker] = useState<any>(null);
  const [assignedBroker, setAssignedBroker] = useState<any>(null);
  const [showBrokerModal, setShowBrokerModal] = useState(false);
  const [showBrokerSelection, setShowBrokerSelection] = useState(false);
  const [showSuccessPage, setShowSuccessPage] = useState(false);
  const { results: brokers, isLoading, error, searchBrokers, showProximity } = useBrokerSearch();

  const handleLeadSuccess = useCallback(async (newLeadId: string, city: City) => {
    setLeadId(newLeadId);
    setLeadCity(city);
    setShowBrokerSelection(true);
    
    await searchBrokers(city, false);
    
    if (brokers.length === 0 && city.latitude && city.longitude) {
      await searchBrokers(city, true);
    }
  }, [searchBrokers, brokers.length]);

  const handleStartNewLead = useCallback(() => {
    setLeadId(null);
    setLeadCity(null);
    setShowBrokerSelection(false);
    setShowSuccessPage(false);
    setSelectedBroker(null);
    setAssignedBroker(null);
    setShowBrokerModal(false);
  }, []);

  const handleBrokerSelect = useCallback((broker: any) => {
    setSelectedBroker(broker);
    setShowBrokerModal(true);
  }, []);

  const handleConfirmBrokerSelection = useCallback(async () => {
    if (!selectedBroker) return;

    try {
      if (leadId) {
        await leadApi.assignToBroker(leadId, selectedBroker.id);
        
        showNotification({
          title: 'Broker Connected Successfully!',
          message: `You've been connected with ${selectedBroker.name}`,
          color: 'green',
          icon: <IconCheck size={16} />,
        });
      } else {
        showNotification({
          title: 'Broker Selected!',
          message: `You've selected ${selectedBroker.name}. Contact them directly using the information provided.`,
          color: 'blue',
          icon: <IconUser size={16} />,
        });
      }
      
      setShowBrokerModal(false);
      setAssignedBroker(selectedBroker);
      setSelectedBroker(null);
      setShowBrokerSelection(false);
      setShowSuccessPage(true);
    } catch (error) {
        showNotification({
          title: 'Error',
          message: 'Failed to connect you with the broker. Please try again.',
          color: 'red',
        });
    }
  }, [selectedBroker, leadId]);

  const handleCancelBrokerSelection = useCallback(() => {
    setShowBrokerModal(false);
    setSelectedBroker(null);
  }, []);

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Notifications />
        <AppShell
          header={
            <Header height={70} p="md" className="bg-gradient-to-r from-primary-600 to-primary-700 shadow-lg">
              <Group position="apart" h="100%">
                <Group className="items-center">
                  <IconBuildingEstate size={28} className="text-white" />
                  <Title order={2} className="text-white font-bold">
                    Plyo Lead Capture
                  </Title>
                </Group>
                <Text size="sm" className="text-primary-100 font-medium">
                  Norwegian Market
                </Text>
              </Group>
            </Header>
          }
        >
          <Container size="lg" py="xl">
            {showSuccessPage ? (
              <div className="flex justify-center pt-24 px-4">
                <Card 
                  shadow="lg" 
                  padding="xl" 
                  radius="md" 
                  withBorder 
                  className="max-w-2xl w-full animate-fade-in hover:transform-none hover:shadow-lg"
                >
                  <Stack align="center" spacing="lg">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-success-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                        <IconCheck size={32} className="text-white" />
                      </div>
                      <Title order={1} mb="md" className="text-success-600">
                        Congratulations!
                      </Title>
                      <Text size="xl" color="dimmed" mb="lg" className="text-gray-600">
                        We've connected you with {assignedBroker?.name}
                      </Text>
                    </div>
                    
                    <Card withBorder padding="md" className="w-full bg-gradient-to-r from-primary-50 to-secondary-50">
                      <Title order={4} mb="md" className="text-primary-800">
                        Your Broker Connection
                      </Title>
                      <Stack spacing="sm">
                        <Group className="justify-between">
                          <Text weight={500} className="text-gray-700">Request ID:</Text>
                          <Badge color="blue" variant="light" className="bg-primary-100 text-primary-700">{leadId}</Badge>
                        </Group>
                        <Group className="justify-between">
                          <Text weight={500} className="text-gray-700">Your Broker:</Text>
                          <Text className="text-gray-900 font-medium">{assignedBroker?.name || 'N/A'}</Text>
                        </Group>
                        <Group className="justify-between">
                          <Text weight={500} className="text-gray-700">Office Address:</Text>
                          <Text className="text-gray-900">{assignedBroker?.address || 'N/A'}</Text>
                        </Group>
                        <Group className="justify-between">
                          <Text weight={500} className="text-gray-700">City:</Text>
                          <Text className="text-gray-900">{assignedBroker?.city || 'N/A'}</Text>
                        </Group>
                        <Group className="justify-between">
                          <Text weight={500} className="text-gray-700">Phone:</Text>
                          <Text className="text-gray-900">{assignedBroker?.phoneNumber || 'N/A'}</Text>
                        </Group>
                        <Group className="justify-between">
                          <Text weight={500} className="text-gray-700">Email:</Text>
                          <Text className="text-gray-900">{assignedBroker?.emailAddress || 'N/A'}</Text>
                        </Group>
                        <Group className="justify-between">
                          <Text weight={500} className="text-gray-700">Status:</Text>
                          <Badge color="green" variant="light" className="bg-success-100 text-success-700">Connected</Badge>
                        </Group>
                      </Stack>
                    </Card>

                    <Card withBorder padding="md" className="w-full bg-gradient-to-r from-success-50 to-primary-50">
                      <Title order={4} mb="md" className="text-success-800">
                        Next Steps
                      </Title>
                      <Stack spacing="sm">
                        <Text className="text-gray-700 flex items-center gap-2">
                          <span className="w-2 h-2 bg-success-500 rounded-full"></span>
                          The broker will contact you within 24 hours
                        </Text>
                        <Text className="text-gray-700 flex items-center gap-2">
                          <span className="w-2 h-2 bg-success-500 rounded-full"></span>
                          Keep your phone and email accessible
                        </Text>
                        <Text className="text-gray-700 flex items-center gap-2">
                          <span className="w-2 h-2 bg-success-500 rounded-full"></span>
                          Prepare any questions about property buying
                        </Text>
                        <Text className="text-gray-700 flex items-center gap-2">
                          <span className="w-2 h-2 bg-success-500 rounded-full"></span>
                          The broker will help you find your perfect home
                        </Text>
                      </Stack>
                    </Card>

                    <Button
                      size="lg"
                      variant="filled"
                      color="blue"
                      onClick={handleStartNewLead}
                      leftIcon={<IconCheck size={20} />}
                      className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg hover:scale-105"
                    >
                      Submit New Request
                    </Button>
                  </Stack>
                </Card>
              </div>
            ) : !showBrokerSelection ? (
              <div className="flex justify-center pt-24 px-4">
                <div className="max-w-lg w-full">
                  <LeadCaptureForm onSuccess={handleLeadSuccess} />
                </div>
              </div>
            ) : (
              <div className="animate-fade-in pt-24">
                <Group position="center" mb="xl">
                  <div className="text-center">
                    <Title order={2} mb="sm" className="text-success-600">
                      Request Submitted Successfully!
                    </Title>
                    <Text size="lg" color="dimmed" mb="md" className="text-gray-600">
                      Now let's find you the perfect broker in {leadCity?.name}
                    </Text>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleStartNewLead}
                      className="border-primary-300 text-primary-700 hover:bg-primary-50"
                    >
                      Submit New Request
                    </Button>
                  </div>
                </Group>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <div className="lg:col-span-1">
                    <Card shadow="sm" padding="lg" radius="md" withBorder className="bg-gradient-to-br from-primary-50 to-secondary-50">
                      <Title order={3} mb="md" className="text-primary-800">
                        Your Request Details
                      </Title>
                      <Stack spacing="sm">
                        <Text size="sm" className="text-gray-700">
                          <strong className="text-gray-900">Location:</strong> {leadCity?.name}, {leadCity?.region}
                        </Text>
                        <Text size="sm" className="text-gray-700">
                          <strong className="text-gray-900">Request ID:</strong> {leadId}
                        </Text>
                        <Text size="sm" className="text-gray-700">
                          <strong className="text-gray-900">Status:</strong> <Badge color="blue" variant="light" className="bg-primary-100 text-primary-700">Finding Broker</Badge>
                        </Text>
                      </Stack>
                    </Card>
                  </div>

                  <div className="lg:col-span-3">
                    <Group mb="md" className="items-center">
                      <IconHome size={20} className="text-primary-600" />
                      <Title order={3} className="text-gray-800">
                        Available Broker Offices
                      </Title>
                    </Group>

                    {brokers.length === 0 && !isLoading && !error && !showProximity ? (
                      <Card withBorder padding="lg" className="text-center bg-gradient-to-br from-warning-50 to-primary-50">
                        <Text size="lg" mb="md" className="text-gray-800">
                          No broker offices found in {leadCity?.name}
                        </Text>
                        <Text color="dimmed" mb="lg" className="text-gray-600">
                          Don't worry! We can find the nearest broker offices for you.
                        </Text>
                        <Button
                          variant="outline"
                          onClick={() => searchBrokers(leadCity!, true)}
                          leftIcon={<IconMapPin size={16} />}
                          className="border-primary-300 text-primary-700 hover:bg-primary-50"
                        >
                          Find Nearest Brokers
                        </Button>
                      </Card>
                    ) : (
                      <BrokerList
                        brokers={brokers}
                        isLoading={isLoading}
                        error={error}
                        onBrokerSelect={handleBrokerSelect}
                        showDistance={true}
                        message={
                          showProximity && brokers.length > 0 && brokers[0].city !== leadCity?.name
                            ? `No local offices found. Showing nearest offices:`
                            : undefined
                        }
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
          </Container>
        </AppShell>

        {/* Broker Selection Confirmation Modal */}
        <Modal
          opened={showBrokerModal}
          onClose={handleCancelBrokerSelection}
          title="Confirm Broker Selection"
          size="md"
          centered
        >
          {selectedBroker && (
            <Stack spacing="md">
              <Text size="lg" weight={600}>
                {selectedBroker.name}
              </Text>
              
              <Group spacing="xs">
                <IconMapPin size={16} color="#666" />
                <Text size="sm" color="dimmed">
                  {selectedBroker.address}
                </Text>
              </Group>
              
              <Group spacing="xs">
                <IconPhone size={16} color="#666" />
                <Text size="sm" color="dimmed">
                  {selectedBroker.phoneNumber}
                </Text>
              </Group>
              
              <Group spacing="xs">
                <IconMail size={16} color="#666" />
                <Text size="sm" color="dimmed">
                  {selectedBroker.emailAddress}
                </Text>
              </Group>

              <Text size="sm" mt="md">
                {leadId 
                  ? "This will connect you with this broker office. They will contact you soon!"
                  : "You can contact this broker directly using the information above."
                }
              </Text>

              <Group position="right" mt="xl">
                <Button
                  variant="outline"
                  onClick={handleCancelBrokerSelection}
                >
                  Cancel
                </Button>
                <Button
                  color="blue"
                  onClick={handleConfirmBrokerSelection}
                  leftIcon={<IconCheck size={16} />}
                >
                  {leadId ? 'Connect with Broker' : 'Confirm Selection'}
                </Button>
              </Group>
            </Stack>
          )}
        </Modal>
    </MantineProvider>
  );
}

export default App;
