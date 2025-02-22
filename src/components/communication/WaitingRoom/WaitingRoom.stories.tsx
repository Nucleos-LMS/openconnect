import type { Meta, StoryObj } from '@storybook/react';
import { WaitingRoom } from './WaitingRoom';

const meta: Meta<typeof WaitingRoom> = {
  title: 'Communication/WaitingRoom',
  component: WaitingRoom,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof WaitingRoom>;

const mockParticipants = [
  { name: 'John Doe', role: 'Resident', isReady: true },
  { name: 'Jane Smith', role: 'Visitor', isReady: false },
];

export const Standard: Story = {
  args: {
    callType: 'standard',
    scheduledTime: '2025-02-22T14:30:00Z',
    participants: mockParticipants,
    onJoinCall: () => console.log('Join call clicked'),
  },
};

export const Legal: Story = {
  args: {
    callType: 'legal',
    scheduledTime: '2025-02-22T15:00:00Z',
    participants: [
      ...mockParticipants,
      { name: 'Robert Law', role: 'Attorney', isReady: true },
    ],
    onJoinCall: () => console.log('Join call clicked'),
  },
};

export const Educational: Story = {
  args: {
    callType: 'educational',
    scheduledTime: '2025-02-22T16:00:00Z',
    participants: [
      ...mockParticipants,
      { name: 'Prof. Smith', role: 'Instructor', isReady: true },
      { name: 'Student 1', role: 'Student', isReady: false },
      { name: 'Student 2', role: 'Student', isReady: true },
    ],
    onJoinCall: () => console.log('Join call clicked'),
  },
};
