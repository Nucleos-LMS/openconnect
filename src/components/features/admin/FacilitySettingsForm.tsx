import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Switch,
  Text,
  VStack,
  useToast
} from '@chakra-ui/react';

import { facilitySettingsSchema } from './validation';
import type { FacilitySettings } from './validation';
import { getFacilitySettings, updateFacilitySettings } from './api';

interface FacilitySettingsProps {
  facilityId: string;
  onSave: (settings: FacilitySettings) => Promise<void>;
  onError: (error: Error) => void;
}

export const FacilitySettingsForm = ({
  facilityId,
  onSave,
  onError
}: FacilitySettingsProps) => {
  const [settings, setSettings] = useState<FacilitySettings | null>(null);

  // Load initial settings
  React.useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getFacilitySettings(facilityId);
        setSettings(data);
      } catch (error: any) {
        onError(error);
        toast({
          title: 'Error loading settings',
          description: error.message,
          status: 'error',
          duration: 5000
        });
      }
    };
    loadSettings();
  }, [facilityId]);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleChange = (
    section: keyof FacilitySettings,
    field: string,
    value: any
  ) => {
    setSettings(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate settings
      facilitySettingsSchema.parse(settings);

      await updateFacilitySettings(facilityId, settings!);
      toast({
        title: 'Settings saved',
        status: 'success',
        duration: 3000
      });
    } catch (error: any) {
      onError(error);
      toast({
        title: 'Error saving settings',
        description: error.message,
        status: 'error',
        duration: 5000
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!settings) {
    return (
      <Box p={8} textAlign="center">
        <Text>Loading settings...</Text>
      </Box>
    );
  }

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack spacing={8} align="stretch">
        {/* Requirements Section */}
        <Box>
          <Text fontSize="xl" fontWeight="bold" mb={4}>
            Requirements
          </Text>
          <Stack spacing={4}>
            <FormControl display="flex" alignItems="center">
              <FormLabel mb={0}>Require ID Verification</FormLabel>
              <Switch
                isChecked={settings.requirements.idRequired}
                onChange={(e) =>
                  handleChange('requirements', 'idRequired', e.target.checked)
                }
              />
            </FormControl>

            <FormControl>
              <FormLabel>Visitation Hours</FormLabel>
              <Input
                value={settings.requirements.visitationHours}
                onChange={(e) =>
                  handleChange('requirements', 'visitationHours', e.target.value)
                }
                placeholder="e.g. 9:00-17:00"
              />
            </FormControl>
          </Stack>
        </Box>

        {/* WebRTC Section */}
        <Box>
          <Text fontSize="xl" fontWeight="bold" mb={4}>
            WebRTC Configuration
          </Text>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>Max Bitrate (kbps)</FormLabel>
              <Input
                type="number"
                value={settings.webrtc.maxBitrate}
                onChange={(e) =>
                  handleChange('webrtc', 'maxBitrate', parseInt(e.target.value))
                }
              />
            </FormControl>

            <FormControl display="flex" alignItems="center">
              <FormLabel mb={0}>Enable Relay Fallback</FormLabel>
              <Switch
                isChecked={settings.webrtc.fallbackToRelay}
                onChange={(e) =>
                  handleChange('webrtc', 'fallbackToRelay', e.target.checked)
                }
              />
            </FormControl>
          </Stack>
        </Box>

        {/* Monitoring Section */}
        <Box>
          <Text fontSize="xl" fontWeight="bold" mb={4}>
            {"Monitoring & Recording"}
          </Text>
          <Stack spacing={4}>
            <FormControl display="flex" alignItems="center">
              <FormLabel mb={0}>Enable AI Monitoring</FormLabel>
              <Switch
                isChecked={settings.monitoring.enableAiMonitoring}
                onChange={(e) =>
                  handleChange('monitoring', 'enableAiMonitoring', e.target.checked)
                }
              />
            </FormControl>

            <FormControl display="flex" alignItems="center">
              <FormLabel mb={0}>Record Calls</FormLabel>
              <Switch
                isChecked={settings.monitoring.recordCalls}
                onChange={(e) =>
                  handleChange('monitoring', 'recordCalls', e.target.checked)
                }
              />
            </FormControl>

            <FormControl>
              <FormLabel>Retention Period (days)</FormLabel>
              <Input
                type="number"
                value={settings.monitoring.retentionDays}
                onChange={(e) =>
                  handleChange('monitoring', 'retentionDays', parseInt(e.target.value))
                }
              />
            </FormControl>
          </Stack>
        </Box>

        <Button
          type="submit"
          colorScheme="blue"
          size="lg"
          isLoading={isLoading}
        >
          Save Settings
        </Button>
      </VStack>
    </Box>
  );
};
