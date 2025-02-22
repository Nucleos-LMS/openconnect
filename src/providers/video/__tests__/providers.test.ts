import { VideoProviderFactory } from '../factory';
import { ProviderConfig, Room, RoomOptions, Participant } from '../types';

describe('Video Provider Integration Tests', () => {
  const providers = ['twilio', 'daily', 'google-meet'] as const;
  const config: ProviderConfig = {
    apiKey: 'test-api-key',
    apiSecret: 'test-api-secret',
    environment: 'development'
  };

  const roomOptions: RoomOptions = {
    name: 'test-room',
    maxParticipants: 2,
    duration: 60,
    layout: 'grid',
    security: {
      isProtectedCall: false,
      encryptionEnabled: true,
      allowRecording: true,
      allowAIMonitoring: false
    }
  };

  const participant: Participant = {
    id: 'test-participant',
    name: 'Test User',
    role: 'visitor',
    audioEnabled: true,
    videoEnabled: true
  };

  providers.forEach(providerName => {
    describe(`${providerName} Provider`, () => {
      let provider: any;
      let room: Room;

      beforeAll(async () => {
        provider = await VideoProviderFactory.create(providerName, config);
      });

      afterAll(async () => {
        await VideoProviderFactory.destroy(providerName);
      });

      test('should initialize provider', async () => {
        expect(provider).toBeDefined();
      });

      test('should create room', async () => {
        room = await provider.createRoom(roomOptions);
        expect(room).toBeDefined();
        expect(room.id).toBeDefined();
        expect(room.name).toBe(roomOptions.name);
        expect(room.settings.maxParticipants).toBe(roomOptions.maxParticipants);
      });

      test('should join room', async () => {
        await expect(provider.joinRoom(room.id, participant))
          .resolves.not.toThrow();
      });

      test('should list rooms', async () => {
        const rooms = await provider.listRooms();
        expect(Array.isArray(rooms)).toBe(true);
        expect(rooms.length).toBeGreaterThan(0);
        expect(rooms[0].id).toBeDefined();
      });

      test('should get room info', async () => {
        const roomInfo = await provider.getRoomInfo(room.id);
        expect(roomInfo).toBeDefined();
        expect(roomInfo.id).toBe(room.id);
        expect(roomInfo.name).toBe(room.name);
      });

      test('should update room settings', async () => {
        const newSettings = {
          maxParticipants: 4,
          layout: 'spotlight' as const
        };
        const updatedRoom = await provider.updateRoomSettings(room.id, newSettings);
        expect(updatedRoom.settings.maxParticipants).toBe(newSettings.maxParticipants);
        expect(updatedRoom.settings.layout).toBe(newSettings.layout);
      });

      test('should handle recording lifecycle', async () => {
        // Start recording
        const recording = await provider.startRecording(room.id, { aiMonitoring: false });
        expect(recording).toBeDefined();
        expect(recording.id).toBeDefined();
        expect(recording.status).toBe('active');

        // Pause recording
        await expect(provider.pauseRecording(room.id))
          .resolves.not.toThrow();

        // Resume recording
        await expect(provider.resumeRecording(room.id))
          .resolves.not.toThrow();

        // Stop recording
        await expect(provider.stopRecording(room.id))
          .resolves.not.toThrow();

        // List recordings
        const recordings = await provider.listRecordings(room.id);
        expect(Array.isArray(recordings)).toBe(true);
        expect(recordings.length).toBeGreaterThan(0);
      });

      test('should update security settings', async () => {
        const newSettings = {
          allowRecording: false,
          allowAIMonitoring: true
        };
        const updatedRoom = await provider.updateSecuritySettings(room.id, newSettings);
        expect(updatedRoom.security.allowRecording).toBe(newSettings.allowRecording);
        expect(updatedRoom.security.allowAIMonitoring).toBe(newSettings.allowAIMonitoring);
      });

      test('should leave room', async () => {
        await expect(provider.leaveRoom(room.id, participant.id))
          .resolves.not.toThrow();
      });
    });
  });
});
