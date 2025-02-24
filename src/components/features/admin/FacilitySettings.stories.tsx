import type { Meta, StoryObj } from '@storybook/react';
import { FacilitySettings } from './FacilitySettings';

const meta: Meta<typeof FacilitySettings> = {
  title: 'Admin/FacilitySettings',
  component: FacilitySettings,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof FacilitySettings>;

export const Default: Story = {
  args: {
    facilityId: '123',
    onSave: async (settings) => {
      console.log('Saving settings:', settings);
      await new Promise(resolve => setTimeout(resolve, 1000));
    },
    onError: (error) => {
      console.error('Error:', error);
    },
  },
};
