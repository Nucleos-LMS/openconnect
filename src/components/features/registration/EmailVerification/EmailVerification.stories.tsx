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
    onSubmit: async (email) => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log('Verification email sent to:', email)
    },
  },
}

export const Loading: Story = {
  args: {
    onSubmit: async () => {
      await new Promise((resolve) => setTimeout(resolve, 5000))
    },
    isLoading: true,
  },
}

export const WithError: Story = {
  args: {
    onSubmit: async () => {
      await new Promise((resolve, reject) => setTimeout(reject, 1000))
    },
  },
} 