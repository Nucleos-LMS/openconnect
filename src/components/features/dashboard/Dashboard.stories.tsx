import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Dashboard } from './Dashboard';

const meta: Meta<typeof Dashboard> = {
  title: 'Features/Dashboard',
  component: Dashboard,
  parameters: {
    layout: 'fullscreen',
  },
  // Set isStorybook to true for all stories by default
  args: {
    isStorybook: true,
    onNewCall: () => console.log('[Storybook] New call initiated'),
    onViewCalls: () => console.log('[Storybook] View calls clicked'),
    onViewProfile: () => console.log('[Storybook] View profile clicked'),
    onViewSchedule: () => console.log('[Storybook] View schedule clicked'),
    onViewContacts: () => console.log('[Storybook] View contacts clicked'),
    onViewSettings: () => console.log('[Storybook] View settings clicked'),
  },
};

export default meta;
type Story = StoryObj<typeof Dashboard>;

export const Default: Story = {
  args: {
    userName: 'John Doe',
    userEmail: 'john.doe@example.com',
    userRole: 'Resident',
  },
};

export const InmateUser: Story = {
  args: {
    userName: 'Inmate User',
    userEmail: 'inmate@test.facility.com',
    userRole: 'Resident',
  },
};

export const FamilyUser: Story = {
  args: {
    userName: 'Family Member',
    userEmail: 'family@test.facility.com',
    userRole: 'Family',
  },
};

export const LegalUser: Story = {
  args: {
    userName: 'Legal Representative',
    userEmail: 'legal@test.facility.com',
    userRole: 'Legal',
  },
};

export const StaffUser: Story = {
  args: {
    userName: 'Staff Member',
    userEmail: 'staff@test.facility.com',
    userRole: 'Staff',
  },
};
