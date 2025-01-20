import type { Meta, StoryObj } from '@storybook/react'
import { Text } from '@chakra-ui/react'
import { Card } from './Card'

const meta: Meta<typeof Card> = {
  title: 'Common/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Card>

export const Elevated: Story = {
  args: {
    variant: 'elevated',
    children: <Text>Elevated Card Content</Text>,
    maxW: 'sm',
  },
}

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: <Text>Outline Card Content</Text>,
    maxW: 'sm',
  },
}

export const WithHeader: Story = {
  args: {
    variant: 'elevated',
    maxW: 'sm',
    children: (
      <>
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          Card Header
        </Text>
        <Text>Card content goes here with a header section.</Text>
      </>
    ),
  },
}

export const Interactive: Story = {
  args: {
    variant: 'elevated',
    maxW: 'sm',
    as: 'button',
    textAlign: 'left',
    width: '100%',
    children: (
      <>
        <Text fontSize="lg" fontWeight="semibold" mb={2}>
          Interactive Card
        </Text>
        <Text color="gray.600">
          This card acts as a button. Click me!
        </Text>
      </>
    ),
  },
} 