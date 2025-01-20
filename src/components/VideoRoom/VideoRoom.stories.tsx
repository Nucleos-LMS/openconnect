import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { VideoRoom } from './VideoRoom';
import { AppLayout } from '../Layout/AppLayout';

const meta: Meta<typeof VideoRoom> = {
  title: 'Communication/VideoRoom',
  component: VideoRoom,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <AppLayout>
        <Story />
      </AppLayout>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof VideoRoom>;

export const StandardCall: Story = {
  args: {
    participantName: 'John Doe',
    userName: 'James Smith',
    userRole: 'Resident',
    signalStrength: 5,
  },
};

export const LegalConsultation: Story = {
  args: {
    participantName: 'Jane Smith, Esq.',
    userName: 'James Smith',
    userRole: 'Resident',
    isLegalConsultation: true,
    isPrivateCall: true,
    signalStrength: 4,
  },
};

export const PrivateCall: Story = {
  args: {
    participantName: 'Family Member',
    userName: 'James Smith',
    userRole: 'Resident',
    isPrivateCall: true,
    signalStrength: 5,
  },
};

export const RecordedCall: Story = {
  args: {
    participantName: 'John Doe',
    userName: 'James Smith',
    userRole: 'Resident',
    isRecording: true,
    signalStrength: 5,
  },
};

export const PoorConnection: Story = {
  args: {
    participantName: 'John Doe',
    userName: 'James Smith',
    userRole: 'Resident',
    connectionQuality: 'poor',
    signalStrength: 2,
  },
};

export const Mobile: Story = {
  args: {
    participantName: 'John Doe',
    userName: 'James Smith',
    userRole: 'Resident',
    signalStrength: 4,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}; 