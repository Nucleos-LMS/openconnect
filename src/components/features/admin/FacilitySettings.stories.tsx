import type { Meta, StoryObj } from '@storybook/react';
import { FacilitySettingsForm } from './FacilitySettingsForm';
import type { FacilitySettings } from './validation';

const meta: Meta<typeof FacilitySettingsForm> = {
  title: 'Admin/FacilitySettings',
  component: FacilitySettingsForm,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof FacilitySettingsForm>;

export const Default: Story = {
  args: {
    facilityId: '123',
    onSave: async (settings: FacilitySettings) => {
      console.log('Saving settings:', settings);
      await new Promise(resolve => setTimeout(resolve, 1000));
    },
    onError: (error: Error) => {
      console.error('Error:', error);
    },
  },
};
