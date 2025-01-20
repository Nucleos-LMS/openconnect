import type { Meta, StoryObj } from '@storybook/react';
import { VideoRoom } from './VideoRoom';

const meta: Meta<typeof VideoRoom> = {
  title: 'Communication/VideoRoom',
  component: VideoRoom,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof VideoRoom>;

export const StandardCall: Story = {
  args: {
    participantName: 'John Doe',
  },
};

export const LegalConsultation: Story = {
  args: {
    participantName: 'Jane Smith, Esq.',
    isLegalConsultation: true,
    isPrivateCall: true,
  },
};

export const PrivateCall: Story = {
  args: {
    participantName: 'Family Member',
    isPrivateCall: true,
  },
};

export const PoorConnection: Story = {
  args: {
    participantName: 'John Doe',
    connectionQuality: 'poor',
  },
}; 