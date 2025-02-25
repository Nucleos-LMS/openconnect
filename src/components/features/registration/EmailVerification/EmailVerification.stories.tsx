import type { Meta, StoryObj } from '@storybook/react'
import { EmailVerification } from './EmailVerification'
import type { UserType } from '../types'

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

export const Family: Story = {
  args: {
    userType: 'family' as UserType,
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
    userType: 'legal' as UserType,
    onNext: async (data) => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log('Verification email sent to:', data.email)
    },
    onError: (error) => {
      console.error('Error:', error)
    }
  },
}

export const Educator: Story = {
  args: {
    userType: 'educator' as UserType,
    onNext: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
    },
    onError: (error) => {
      console.error('Error:', error)
    }
  },
}       