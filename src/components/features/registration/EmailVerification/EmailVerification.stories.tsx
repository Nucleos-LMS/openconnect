import type { Meta, StoryObj } from '@storybook/react'
import { EmailVerification } from './EmailVerification'

const meta: Meta<typeof EmailVerification> = {
  title: 'Features/Registration/EmailVerification',
  component: EmailVerification,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof EmailVerification>

export const Default: Story = {
  args: {
    userType: 'resident',
    onNext: async (data) => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log('Verification email sent to:', data.email)
    },
    onError: (error) => {
      console.error('Error:', error)
    }
  },
}

export const Legal: Story = {
  args: {
    userType: 'legal',
    onNext: async (data) => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log('Verification email sent to:', data.email)
    },
    onError: (error) => {
      console.error('Error:', error)
    }
  },
}

export const WithError: Story = {
  args: {
    userType: 'resident',
    onNext: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
    },
    onError: (error) => {
      console.error('Error:', error)
    }
  },
}   