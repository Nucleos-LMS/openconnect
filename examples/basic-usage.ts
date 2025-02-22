import { VideoProviderFactory } from '../src/providers/video/factory';
import { ProviderConfig, Participant } from '../src/providers/video/types';

async function basicUsageExample() {
  // Configure the provider
  const config: ProviderConfig = {
    apiKey: process.env.VIDEO_API_KEY,
    apiSecret: process.env.VIDEO_API_SECRET,
    environment: 'development'
  };

  try {
    // Initialize provider (Twilio, Daily.co, or Google Meet)
    const provider = await VideoProviderFactory.create('twilio', config);

    // Create a room
    const room = await provider.createRoom({
      name: 'example-room',
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

    console.log('Room created:', room);

    // Join the room as a participant
    const participant: Participant = {
      id: 'user-123',
      name: 'John Doe',
      role: 'visitor',
      audioEnabled: true,
      videoEnabled: true
    };

    await provider.joinRoom(room.id, participant);
    console.log('Joined room as:', participant.name);

    // Start recording (if allowed)
    if (room.security.allowRecording) {
      const recording = await provider.startRecording(room.id, {
        aiMonitoring: false
      });
      console.log('Recording started:', recording);
    }

    // Simulate call duration
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Leave the room
    await provider.leaveRoom(room.id, participant.id);
    console.log('Left room');

    // Cleanup
    await VideoProviderFactory.destroy('twilio');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the example
basicUsageExample();
