import type { Meta, StoryObj } from '@storybook/react'
import { FormField } from './FormField'

const meta: Meta<typeof FormField> = {
  title: 'Common/FormField',
  component: FormField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FormField>

export const Default: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter username',
  },
}

export const Required: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter email',
    type: 'email',
    isRequired: true,
  },
}

export const WithError: Story = {
  args: {
    label: 'Password',
    type: 'password',
    value: '123',
    error: 'Password must be at least 8 characters',
  },
}

export const WithHelperText: Story = {
  args: {
    label: 'Bio',
    placeholder: 'Tell us about yourself',
    helperText: 'Maximum 500 characters',
  },
}

export const Disabled: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter username',
    isDisabled: true,
  },
} 