import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { UserProfile } from './UserProfile';

const meta: Meta<typeof UserProfile> = {
  title: 'Features/Profile/UserProfile',
  component: UserProfile,
  parameters: {
    layout: 'padded',
  },
  args: {
    isStorybook: true,
    onEditProfile: () => console.log('[Storybook] Edit profile clicked'),
  },
};

export default meta;
type Story = StoryObj<typeof UserProfile>;

export const Default: Story = {
  args: {
    userName: 'John Doe',
    userEmail: 'john.doe@example.com',
    userRole: 'Resident',
  },
};

export const FamilyMember: Story = {
  args: {
    userName: 'Jane Smith',
    userEmail: 'jane.smith@example.com',
    userRole: 'Family',
  },
};

export const LegalMember: Story = {
  args: {
    userName: 'Legal Representative',
    userEmail: 'legal@example.com',
    userRole: 'Legal',
  },
};

export const StaffMember: Story = {
  args: {
    userName: 'Admin User',
    userEmail: 'admin@facility.com',
    userRole: 'Staff',
  },
};
