import type { Meta, StoryObj } from '@storybook/react'
import { WaitingRoom } from './WaitingRoom'

const meta: Meta<typeof WaitingRoom> = {
  title: 'Features/WaitingRoom',
  component: WaitingRoom,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof WaitingRoom>

export const Default: Story = {
  args: {
    onDeviceSetupComplete: () => console.log('Device setup complete'),
    onNetworkTestComplete: () => console.log('Network test complete'),
    onJoinCall: () => console.log('Join call clicked'),
  },
}
