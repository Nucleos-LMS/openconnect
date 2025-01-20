import type { Meta, StoryObj } from '@storybook/react'
import { UserTypeSelection } from './UserTypeSelection'

const meta: Meta<typeof UserTypeSelection> = {
  title: 'Features/Registration/UserTypeSelection',
  component: UserTypeSelection,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof UserTypeSelection>

export const Default: Story = {
  args: {
    onSelect: (userType) => {
      console.log('Selected user type:', userType)
    },
  },
} 