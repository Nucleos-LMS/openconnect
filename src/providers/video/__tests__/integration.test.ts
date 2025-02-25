import { VideoProviderFactory } from '../factory';
import { ProviderConfig, Room } from '../types';

describe('Video Provider Integration', () => {
  let config: ProviderConfig;

  beforeAll(() => {
    // Use environment variables for configuration
    config = {
      apiKey: process.env.TWILIO_API_KEY || process.env.Twilio_API_Key___Openconnect_dev___SID,
      apiSecret: process.env.TWILIO_API_SECRET || process.env.Twilio_API_Key___Openconnect_dev___Secret,
      environment: 'development',
      region: 'us-east-1',
      userId: 'test-user-id',
      userRole: 'staff',
      facilityId: 'test-facility-id'
    };
  });

  afterEach(async () => {
    await VideoProviderFactory.destroyAll();
  });

  describe('Provider Factory', () => {
    test('creates and initializes Twilio provider', async () => {
      const provider = await VideoProviderFactory.create('twilio', config);
      expect(provider).toBeDefined();
    });

    test('reuses existing provider instance', async () => {
      const provider1 = await VideoProviderFactory.create('twilio', config);
      const provider2 = await VideoProviderFactory.create('twilio', config);
      expect(provider1).toBe(provider2);
    });

    test('destroys provider instance', async () => {
      await VideoProviderFactory.create('twilio', config);
      await VideoProviderFactory.destroy('twilio');
      const newProvider = await VideoProviderFactory.create('twilio', config);
      expect(newProvider).toBeDefined();
    });
  });

  describe('Room Management', () => {
    test('creates and manages room lifecycle', async () => {
      const provider = await VideoProviderFactory.create('twilio', config);
      
      // Create room
      const room = await provider.createRoom({
        name: 'integration-test-room',
        maxParticipants: 4,
        duration: 60,
        layout: 'grid'
      });
      expect(room.id).toBeDefined();
      expect(room.name).toBe('integration-test-room');

      // Join room
      await provider.joinRoom(room.id, {
        id: 'test-participant',
        name: 'Test User',
        role: 'visitor',
        audioEnabled: true,
        videoEnabled: true
      });

      // Get room info
      const roomInfo = await provider.getRoomInfo(room.id);
      expect(roomInfo.id).toBe(room.id);
      expect(roomInfo.participants).toBeDefined();

      // Update room settings
      const updatedRoom = await provider.updateRoomSettings(room.id, {
        maxParticipants: 6,
        layout: 'spotlight'
      });
      expect(updatedRoom.settings.maxParticipants).toBe(6);
      expect(updatedRoom.settings.layout).toBe('spotlight');

      // Leave room
      await provider.leaveRoom(room.id, 'test-participant');

      // List rooms
      const rooms = await provider.listRooms();
      expect(rooms.length).toBeGreaterThan(0);
      expect(rooms.find(r => r.id === room.id)).toBeDefined();
    });
  });

  describe('Recording Management', () => {
    let room: Room;

    beforeEach(async () => {
      const provider = await VideoProviderFactory.create('twilio', config);
      room = await provider.createRoom({
        name: 'recording-test-room',
        security: {
          allowRecording: true
        }
      });
    });

    test('manages recording lifecycle', async () => {
      const provider = await VideoProviderFactory.create('twilio', config);

      // Start recording
      const recording = await provider.startRecording(room.id);
      expect(recording.id).toBeDefined();
      expect(recording.status).toBe('active');
      expect(recording.aiMonitoringEnabled).toBe(true);

      // Get recording info
      const recordingInfo = await provider.getRecording(recording.id);
      expect(recordingInfo.id).toBe(recording.id);
      expect(recordingInfo.status).toBe('active');

      // List recordings
      const recordings = await provider.listRecordings(room.id);
      expect(recordings.length).toBeGreaterThan(0);
      expect(recordings.find(r => r.id === recording.id)).toBeDefined();

      // Pause recording
      await provider.pauseRecording(room.id);
      const pausedRecording = await provider.getRecording(recording.id);
      expect(pausedRecording.status).toBe('paused');

      // Resume recording
      await provider.resumeRecording(room.id);
      const resumedRecording = await provider.getRecording(recording.id);
      expect(resumedRecording.status).toBe('active');

      // Stop recording
      await provider.stopRecording(room.id);
      const stoppedRecording = await provider.getRecording(recording.id);
      expect(stoppedRecording.status).toBe('completed');
    });
  });

  describe('Security Settings', () => {
    test('manages security settings', async () => {
      const provider = await VideoProviderFactory.create('twilio', config);
      
      const room = await provider.createRoom({
        name: 'security-test-room',
        security: {
          isProtectedCall: false,
          encryptionEnabled: true
        }
      });

      const updatedRoom = await provider.updateSecuritySettings(room.id, {
        isProtectedCall: true,
        allowRecording: true,
        allowAIMonitoring: true
      });

      expect(updatedRoom.security.isProtectedCall).toBe(true);
      expect(updatedRoom.security.allowRecording).toBe(true);
      expect(updatedRoom.security.allowAIMonitoring).toBe(true);
    });
  });
});
