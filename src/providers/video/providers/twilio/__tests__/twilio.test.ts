import { TwilioProvider } from '../index';
import { ProviderConfig, RoomOptions, Participant } from '../../../types';
import { connect, createLocalTracks } from 'twilio-video';

// Mock twilio-video
jest.mock('twilio-video', () => ({
  connect: jest.fn(),
  createLocalTracks: jest.fn().mockResolvedValue([])
}));

describe('TwilioProvider', () => {
  let provider: TwilioProvider;
  const config: ProviderConfig = {
    apiKey: 'test-key',
    apiSecret: 'test-secret',
    environment: 'development',
    region: 'us-east-1',
    userId: 'test-user',
    userRole: 'visitor',
    facilityId: 'test-facility'
  };

  beforeEach(() => {
    provider = new TwilioProvider(config);
    (connect as jest.Mock).mockClear();
    (createLocalTracks as jest.Mock).mockClear();
  });

  describe('initialize', () => {
    test('requires API credentials', async () => {
      await expect(provider.initialize({})).rejects.toThrow('Twilio provider requires apiKey and apiSecret');
    });

    test('initializes with valid credentials', async () => {
      await expect(provider.initialize(config)).resolves.not.toThrow();
      expect(createLocalTracks).toHaveBeenCalledWith({ audio: false, video: false });
    });
  });

  describe('createRoom', () => {
    const mockRoom = {
      sid: 'test-room-sid',
      name: 'test-room',
      participants: new Map()
    };

    beforeEach(() => {
      (connect as jest.Mock).mockResolvedValue(mockRoom);
    });

    test('creates room with correct settings', async () => {
      await provider.initialize(config);
      const options: RoomOptions = {
        name: 'test-room',
        maxParticipants: 10,
        duration: 60,
        layout: 'grid'
      };

      const room = await provider.createRoom(options);
      expect(room.name).toBe(options.name);
      expect(room.settings.maxParticipants).toBe(options.maxParticipants);
      expect(room.settings.duration).toBe(options.duration);
      expect(room.settings.layout).toBe(options.layout);
    });

    test('requires initialization before creating room', async () => {
      const options: RoomOptions = { name: 'test-room' };
      await expect(provider.createRoom(options)).rejects.toThrow('Twilio provider not initialized');
    });
  });

  describe('joinRoom', () => {
    const mockRoom = {
      sid: 'test-room-sid',
      name: 'test-room',
      participants: new Map()
    };

    const participant: Participant = {
      id: 'test-participant',
      name: 'Test User',
      role: 'visitor',
      audioEnabled: true,
      videoEnabled: true
    };

    beforeEach(() => {
      (connect as jest.Mock).mockResolvedValue(mockRoom);
    });

    test('joins room with correct participant settings', async () => {
      await provider.initialize(config);
      await provider.joinRoom('test-room', participant);

      expect(connect).toHaveBeenCalledWith(config.apiKey, {
        name: 'test-room',
        audio: participant.audioEnabled,
        video: participant.videoEnabled,
        tracks: [],
        region: config.region
      });
    });

    test('requires initialization before joining room', async () => {
      await expect(provider.joinRoom('test-room', participant))
        .rejects.toThrow('Twilio provider not initialized');
    });
  });

  describe('recording operations', () => {
    beforeEach(async () => {
      await provider.initialize(config);
      (connect as jest.Mock).mockResolvedValue({
        sid: 'test-room-sid',
        name: 'test-room',
        participants: new Map()
      });
      await provider.createRoom({ name: 'test-room' });
    });

    test('starts recording with correct options', async () => {
      const recording = await provider.startRecording('test-room-sid', { aiMonitoring: true });
      expect(recording.id).toBeDefined();
      expect(recording.status).toBe('active');
      expect(recording.aiMonitoringEnabled).toBe(true);
    });

    test('stops recording', async () => {
      await expect(provider.stopRecording('test-room-sid')).resolves.not.toThrow();
    });

    test('pauses recording', async () => {
      await expect(provider.pauseRecording('test-room-sid')).resolves.not.toThrow();
    });

    test('resumes recording', async () => {
      await expect(provider.resumeRecording('test-room-sid')).resolves.not.toThrow();
    });

    test('gets recording info', async () => {
      const recording = await provider.getRecording('test-recording-id');
      expect(recording.id).toBe('test-recording-id');
      expect(recording.status).toBe('active');
    });

    test('lists recordings', async () => {
      const recordings = await provider.listRecordings('test-room-sid');
      expect(Array.isArray(recordings)).toBe(true);
    });
  });

  describe('room management', () => {
    const mockRoom = {
      sid: 'test-room-sid',
      name: 'test-room',
      participants: new Map()
    };

    beforeEach(async () => {
      (connect as jest.Mock).mockResolvedValue(mockRoom);
      await provider.initialize(config);
      await provider.createRoom({ name: 'test-room' });
    });

    test('leaves room', async () => {
      await expect(provider.leaveRoom('test-room-sid', 'test-participant'))
        .resolves.not.toThrow();
    });

    test('lists rooms', async () => {
      const rooms = await provider.listRooms();
      expect(Array.isArray(rooms)).toBe(true);
      expect(rooms[0]?.id).toBe('test-room-sid');
    });

    test('gets room info', async () => {
      const room = await provider.getRoomInfo('test-room-sid');
      expect(room.id).toBe('test-room-sid');
      expect(room.name).toBe('test-room');
    });

    test('updates room settings', async () => {
      const newSettings = {
        maxParticipants: 20,
        layout: 'spotlight' as const
      };
      const room = await provider.updateRoomSettings('test-room-sid', newSettings);
      expect(room.settings.maxParticipants).toBe(newSettings.maxParticipants);
      expect(room.settings.layout).toBe(newSettings.layout);
    });

    test('updates security settings', async () => {
      const newSettings = {
        isProtectedCall: true,
        encryptionEnabled: true
      };
      const room = await provider.updateSecuritySettings('test-room-sid', newSettings);
      expect(room.security.isProtectedCall).toBe(newSettings.isProtectedCall);
      expect(room.security.encryptionEnabled).toBe(newSettings.encryptionEnabled);
    });
  });

  describe('disconnect', () => {
    test('disconnects and cleans up resources', async () => {
      await provider.initialize(config);
      await expect(provider.disconnect()).resolves.not.toThrow();
    });
  });
});
