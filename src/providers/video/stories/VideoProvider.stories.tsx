import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { VideoProviderFactory } from '../factory';
import { ProviderConfig } from '../types';

const meta: Meta<typeof VideoProvider> = {
  title: 'Providers/VideoProvider',
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof VideoProvider>;

// Mock provider config
const config: ProviderConfig = {
  apiKey: 'mock-api-key',
  apiSecret: 'mock-api-secret',
  environment: 'development'
};

export const BasicVideoCall: Story = {
  render: () => {
    const [roomId, setRoomId] = React.useState<string>('');
    const [status, setStatus] = React.useState<string>('');

    const initializeCall = async () => {
      try {
        const provider = await VideoProviderFactory.create('twilio', config);
        const room = await provider.createRoom({
          name: 'demo-room',
          maxParticipants: 2,
          duration: 60,
          layout: 'grid',
          security: {
            isProtectedCall: false,
            encryptionEnabled: true,
            allowRecording: true,
            allowAIMonitoring: false
          }
        });
        setRoomId(room.id);
        setStatus('Room created successfully');
      } catch (error) {
        setStatus(`Error: ${error.message}`);
      }
    };

    return (
      <div style={{ padding: '20px' }}>
        <h2>Basic Video Call Demo</h2>
        <button onClick={initializeCall}>Create Room</button>
        {roomId && <p>Room ID: {roomId}</p>}
        <p>Status: {status}</p>
      </div>
    );
  }
};

export const ProtectedLegalCall: Story = {
  render: () => {
    const [roomId, setRoomId] = React.useState<string>('');
    const [status, setStatus] = React.useState<string>('');

    const initializeProtectedCall = async () => {
      try {
        const provider = await VideoProviderFactory.create('twilio', config);
        const room = await provider.createRoom({
          name: 'legal-consultation',
          maxParticipants: 2,
          duration: 60,
          layout: 'grid',
          security: {
            isProtectedCall: true,
            encryptionEnabled: true,
            allowRecording: false,
            allowAIMonitoring: false,
            requiredParticipantRoles: ['resident', 'attorney']
          }
        });
        setRoomId(room.id);
        setStatus('Protected room created successfully');
      } catch (error) {
        setStatus(`Error: ${error.message}`);
      }
    };

    return (
      <div style={{ padding: '20px' }}>
        <h2>Protected Legal Call Demo</h2>
        <button onClick={initializeProtectedCall}>Create Protected Room</button>
        {roomId && <p>Room ID: {roomId}</p>}
        <p>Status: {status}</p>
      </div>
    );
  }
};

export const NetworkAndDeviceTest: Story = {
  render: () => {
    const [deviceStatus, setDeviceStatus] = React.useState<string>('');
    const [networkStatus, setNetworkStatus] = React.useState<string>('');

    const testDevices = async () => {
      try {
        const provider = await VideoProviderFactory.create('twilio', config);
        // Test device setup
        setDeviceStatus('Testing devices...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        setDeviceStatus('Devices ready');
        
        // Test network
        setNetworkStatus('Testing network...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        setNetworkStatus('Network connection good');
      } catch (error: any) {
        setDeviceStatus(`Error: ${error?.message || 'Unknown error occurred'}`);
      }
    };

    return (
      <div style={{ padding: '20px' }}>
        <h2>Network & Device Test Demo</h2>
        <button onClick={testDevices}>Test Setup</button>
        <p>Device Status: {deviceStatus}</p>
        <p>Network Status: {networkStatus}</p>
      </div>
    );
  }
};
