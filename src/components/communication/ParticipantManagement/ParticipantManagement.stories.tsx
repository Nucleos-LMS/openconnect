import type { Meta, StoryObj } from '@storybook/react';
import { ParticipantManagement } from './ParticipantManagement';

const meta: Meta<typeof ParticipantManagement> = {
  title: 'Communication/ParticipantManagement',
  component: ParticipantManagement,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof ParticipantManagement>;

const mockParticipants = [
  {
    id: '1',
    name: 'John Doe',
    role: 'resident',
    audioEnabled: true,
    videoEnabled: true,
  },
  {
    id: '2',
    name: 'Jane Smith',
    role: 'visitor',
    audioEnabled: false,
    videoEnabled: true,
  },
  {
    id: '3',
    name: 'Robert Law',
    role: 'attorney',
    audioEnabled: true,
    videoEnabled: true,
  },
  {
    id: '4',
    name: 'Admin User',
    role: 'staff',
    audioEnabled: true,
    videoEnabled: true,
  },
];

export const AsStaff: Story = {
  args: {
    participants: mockParticipants,
    currentUserRole: 'staff',
    onToggleAudio: (id) => console.log('Toggle audio for participant:', id),
    onToggleVideo: (id) => console.log('Toggle video for participant:', id),
    onRemoveParticipant: (id) => console.log('Remove participant:', id),
  },
};

export const AsAttorney: Story = {
  args: {
    participants: mockParticipants,
    currentUserRole: 'attorney',
    onToggleAudio: (id) => console.log('Toggle audio for participant:', id),
    onToggleVideo: (id) => console.log('Toggle video for participant:', id),
    onRemoveParticipant: (id) => console.log('Remove participant:', id),
  },
};

export const AsResident: Story = {
  args: {
    participants: mockParticipants,
    currentUserRole: 'resident',
    onToggleAudio: (id) => console.log('Toggle audio for participant:', id),
    onToggleVideo: (id) => console.log('Toggle video for participant:', id),
    onRemoveParticipant: (id) => console.log('Remove participant:', id),
  },
};

export const AsVisitor: Story = {
  args: {
    participants: mockParticipants,
    currentUserRole: 'visitor',
    onToggleAudio: (id) => console.log('Toggle audio for participant:', id),
    onToggleVideo: (id) => console.log('Toggle video for participant:', id),
    onRemoveParticipant: (id) => console.log('Remove participant:', id),
  },
};
