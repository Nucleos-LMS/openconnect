import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Select,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
} from '@chakra-ui/react';
import { ProviderConfig as VideoProviderConfig } from '../../../providers/video/types';

type SupportedProvider = 'twilio' | 'daily' | 'google-meet';

export interface ProviderConfigProps {
  currentProvider?: SupportedProvider;
  config?: VideoProviderConfig;
  onSave: (provider: SupportedProvider, config: VideoProviderConfig) => void;
}

export const ProviderConfig: React.FC<ProviderConfigProps> = ({
  currentProvider = 'twilio',
  config = {},
  onSave,
}) => {
  const toast = useToast();
  const [provider, setProvider] = useState<SupportedProvider>(currentProvider);
  const [providerConfig, setProviderConfig] = useState<VideoProviderConfig>(config);

  const handleSave = () => {
    try {
      onSave(provider, providerConfig);
      toast({
        title: "Configuration Saved",
        description: `Successfully updated ${provider} configuration`,
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error Saving Configuration",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        status: "error",
        duration: 5000,
      });
    }
  };

  return (
    <Box borderWidth={1} borderRadius="lg" p={6}>
      <VStack spacing={6} align="stretch">
        <Text fontSize="xl" fontWeight="bold">Video Provider Configuration</Text>

        <FormControl>
          <FormLabel>Provider</FormLabel>
          <Select
            value={provider}
            onChange={(e) => setProvider(e.target.value as SupportedProvider)}
          >
            <option value="twilio">Twilio Video</option>
            <option value="daily">Daily.co</option>
            <option value="google-meet">Google Meet</option>
          </Select>
        </FormControl>

        {provider === 'twilio' && (
          <>
            <FormControl>
              <FormLabel>API Key</FormLabel>
              <Input
                type="password"
                value={providerConfig.apiKey || ''}
                onChange={(e) => setProviderConfig({
                  ...providerConfig,
                  apiKey: e.target.value
                })}
              />
            </FormControl>
            <FormControl>
              <FormLabel>API Secret</FormLabel>
              <Input
                type="password"
                value={providerConfig.apiSecret || ''}
                onChange={(e) => setProviderConfig({
                  ...providerConfig,
                  apiSecret: e.target.value
                })}
              />
            </FormControl>
          </>
        )}

        {provider === 'daily' && (
          <FormControl>
            <FormLabel>API Key</FormLabel>
            <Input
              type="password"
              value={providerConfig.apiKey || ''}
              onChange={(e) => setProviderConfig({
                ...providerConfig,
                apiKey: e.target.value
              })}
            />
          </FormControl>
        )}

        {provider === 'google-meet' && (
          <>
            <FormControl>
              <FormLabel>Client ID</FormLabel>
              <Input
                type="password"
                value={providerConfig.apiKey || ''}
                onChange={(e) => setProviderConfig({
                  ...providerConfig,
                  apiKey: e.target.value
                })}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Client Secret</FormLabel>
              <Input
                type="password"
                value={providerConfig.apiSecret || ''}
                onChange={(e) => setProviderConfig({
                  ...providerConfig,
                  apiSecret: e.target.value
                })}
              />
            </FormControl>
          </>
        )}

        <FormControl>
          <FormLabel>Region</FormLabel>
          <Input
            value={providerConfig.region || ''}
            onChange={(e) => setProviderConfig({
              ...providerConfig,
              region: e.target.value
            })}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Environment</FormLabel>
          <Select
            value={providerConfig.environment || 'development'}
            onChange={(e) => setProviderConfig({
              ...providerConfig,
              environment: e.target.value as 'development' | 'production'
            })}
          >
            <option value="development">Development</option>
            <option value="production">Production</option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>Log Level</FormLabel>
          <Select
            value={providerConfig.logLevel || 'info'}
            onChange={(e) => setProviderConfig({
              ...providerConfig,
              logLevel: e.target.value as 'debug' | 'info' | 'warn' | 'error'
            })}
          >
            <option value="debug">Debug</option>
            <option value="info">Info</option>
            <option value="warn">Warning</option>
            <option value="error">Error</option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>Security Encryption Key</FormLabel>
          <Input
            type="password"
            value={providerConfig.security?.encryptionKey || ''}
            onChange={(e) => setProviderConfig({
              ...providerConfig,
              security: {
                ...providerConfig.security,
                encryptionKey: e.target.value
              }
            })}
          />
        </FormControl>

        <Button colorScheme="blue" onClick={handleSave}>
          Save Configuration
        </Button>
      </VStack>
    </Box>
  );
};
