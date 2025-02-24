import type { Meta, StoryObj } from '@storybook/react';
import { ProviderConfig } from './ProviderConfig';

const meta: Meta<typeof ProviderConfig> = {
  title: 'Communication/ProviderConfig',
  component: ProviderConfig,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof ProviderConfig>;

export const Twilio: Story = {
  args: {
    currentProvider: 'twilio',
    config: {
      userId: 'test-user',
      userRole: 'staff',
      facilityId: 'test-facility',
      environment: 'development',
      logLevel: 'info',
      region: 'us-east-1',
    },
    onSave: (provider, config) => console.log('Save configuration:', { provider, config }),
  },
};

export const Daily: Story = {
  args: {
    currentProvider: 'daily',
    config: {
      userId: 'test-user',
      userRole: 'staff',
      facilityId: 'test-facility',
      environment: 'development',
      logLevel: 'info',
    },
    onSave: (provider, config) => console.log('Save configuration:', { provider, config }),
  },
};

export const GoogleMeet: Story = {
  args: {
    currentProvider: 'google-meet',
    config: {
      userId: 'test-user',
      userRole: 'staff',
      facilityId: 'test-facility',
      environment: 'development',
      logLevel: 'info',
    },
    onSave: (provider, config) => console.log('Save configuration:', { provider, config }),
  },
};
