import { VideoProviderFactory } from '../src/providers/video/factory';
import { ProviderConfig, Participant } from '../src/providers/video/types';

async function protectedCallExample() {
  // Configure the provider
  const config: ProviderConfig = {
    apiKey: process.env.VIDEO_API_KEY,
    apiSecret: process.env.VIDEO_API_SECRET,
    environment: 'development'
  };

  try {
    // Initialize provider
    const provider = await VideoProviderFactory.create('twilio', config);

    // Create a protected room (e.g., for legal calls)
    const room = await provider.createRoom({
      name: 'protected-legal-call',
      maxParticipants: 2,
      duration: 60,
      layout: 'grid',
      security: {
        isProtectedCall: true, // Legal calls are protected
        encryptionEnabled: true,
        allowRecording: false, // Protected calls cannot be recorded
        allowAIMonitoring: false,
        requiredParticipantRoles: ['resident', 'attorney']
      }
    });

    console.log('Protected room created:', room);

    // Join as attorney
    const attorney: Participant = {
      id: 'attorney-123',
      name: 'Jane Smith',
      role: 'attorney',
      audioEnabled: true,
      videoEnabled: true
    };

    await provider.joinRoom(room.id, attorney);
    console.log('Attorney joined:', attorney.name);

    // Join as resident
    const resident: Participant = {
      id: 'resident-456',
      name: 'Robert Johnson',
      role: 'resident',
      audioEnabled: true,
      videoEnabled: true
    };

    await provider.joinRoom(room.id, resident);
    console.log('Resident joined:', resident.name);

    // Attempt to start recording (should fail for protected calls)
    try {
      await provider.startRecording(room.id);
    } catch (error) {
      console.log('Recording prevented for protected call:', error.message);
    }

    // Simulate call duration
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Leave room
    await provider.leaveRoom(room.id, attorney.id);
    await provider.leaveRoom(room.id, resident.id);
    console.log('All participants left room');

    // Cleanup
    await VideoProviderFactory.destroy('twilio');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the example
protectedCallExample();
