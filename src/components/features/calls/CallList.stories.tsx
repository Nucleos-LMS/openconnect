import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { CallList, CallData } from './CallList';

const meta: Meta<typeof CallList> = {
  title: 'Features/Calls/CallList',
  component: CallList,
  parameters: {
    layout: 'padded',
  },
  args: {
    isStorybook: true,
    onSelectCall: (callId) => console.log(`[Storybook] Call selected: ${callId}`),
  },
};

export default meta;
type Story = StoryObj<typeof CallList>;

const sampleCalls: CallData[] = [
  {
    id: '1234567890abcdef',
    participants: ['user1', 'user2'],
    startTime: '2025-02-28T14:00:00Z',
    status: 'scheduled',
  },
  {
    id: 'abcdef1234567890',
    participants: ['user1', 'user3'],
    startTime: '2025-02-27T10:00:00Z',
    endTime: '2025-02-27T10:30:00Z',
    status: 'completed',
  },
  {
    id: '0987654321fedcba',
    participants: ['user1', 'user4'],
    startTime: '2025-02-28T09:00:00Z',
    status: 'active',
  },
  {
    id: '5678901234abcdef',
    participants: ['user1', 'user5'],
    startTime: '2025-02-26T15:00:00Z',
    endTime: '2025-02-26T15:15:00Z',
    status: 'cancelled',
  },
];

export const Default: Story = {
  args: {
    calls: sampleCalls,
  },
};

export const Empty: Story = {
  args: {
    calls: [],
  },
};

export const SingleCall: Story = {
  args: {
    calls: [sampleCalls[0]],
  },
};

export const ActiveCalls: Story = {
  args: {
    calls: sampleCalls.filter(call => call.status === 'active'),
  },
};

export const CompletedCalls: Story = {
  args: {
    calls: sampleCalls.filter(call => call.status === 'completed'),
  },
};
