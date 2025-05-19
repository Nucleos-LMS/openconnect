import { BaseVideoProvider } from '../base';
import {
  Room,
  RoomOptions,
  Participant,
  RoomSettings,
  SecuritySettings,
  RecordingInfo,
  ProviderConfig
} from '../../types';

let LiveKitRoom: any;
let connectLiveKit: any;

export class LiveKitProvider extends BaseVideoProvider {
  private activeRoom: any | null = null;
  private roomName: string | null = null;

  constructor(config: ProviderConfig) {
    super(config);
  }

  async initialize(config: ProviderConfig): Promise<void> {
    const url = process.env.NEXT_PUBLIC_LIVEKIT_URL;
    const mockEnabled = !url;

    this.config = {
      ...config,
      mockEnabled
    };

    if (mockEnabled) {
      console.log('[MOCK] LiveKit provider initialized in mock mode');
      return;
    }

    const livekit = await import('livekit-client');
    LiveKitRoom = livekit.Room;
    connectLiveKit = livekit.connect;
  }

  private createMockRoom(options: RoomOptions): Room {
    const roomId = `mock-room-${Date.now()}`;
    this.roomName = roomId;
    return {
      id: roomId,
      name: options.name || roomId,
      participants: [],
      createdAt: new Date(),
      settings: {
        maxParticipants: options.maxParticipants || 10,
        duration: options.duration || 60,
        layout: options.layout || 'grid'
      },
      security: {
        isProtectedCall: options.security?.isProtectedCall ?? false,
        encryptionEnabled: options.security?.encryptionEnabled ?? true,
        allowRecording: options.security?.allowRecording ?? true,
        allowAIMonitoring: options.security?.allowAIMonitoring ?? false,
        requiredParticipantRoles: options.security?.requiredParticipantRoles ?? []
      }
    };
  }

  async createRoom(options: RoomOptions): Promise<Room> {
    if (this.config.mockEnabled) return this.createMockRoom(options);
    const room = {
      id: options.name || `room-${Date.now()}`,
      name: options.name || `room-${Date.now()}`,
      participants: [],
      createdAt: new Date(),
      settings: {
        maxParticipants: options.maxParticipants || 10,
        duration: options.duration || 60,
        layout: options.layout || 'grid'
      },
      security: {
        isProtectedCall: options.security?.isProtectedCall ?? false,
        encryptionEnabled: options.security?.encryptionEnabled ?? true,
        allowRecording: options.security?.allowRecording ?? true,
        allowAIMonitoring: options.security?.allowAIMonitoring ?? false,
        requiredParticipantRoles: options.security?.requiredParticipantRoles ?? []
      }
    } as Room;
    this.roomName = room.id;
    return room;
  }

  async joinRoom(roomId: string, participant: Participant): Promise<void> {
    if (this.config.mockEnabled) {
      this.roomName = roomId;
      return;
    }
    if (!connectLiveKit) throw new Error('LiveKit client not initialized');
    const token = await this.fetchToken(roomId, participant.id);
    this.activeRoom = await connectLiveKit(process.env.NEXT_PUBLIC_LIVEKIT_URL as string, token, {
      autoSubscribe: true
    });
  }

  private async fetchToken(room: string, userId: string): Promise<string> {
    try {
      const res = await fetch(`/api/calls/token?room=${encodeURIComponent(room)}&user=${encodeURIComponent(userId)}`);
      if (res.ok) return (await res.json()).token;
    } catch (e) {
      console.warn('Failed to fetch token, using mock');
    }
    return `mock_livekit_token_${room}_${userId}`;
  }

  async leaveRoom(_roomId: string, _participantId: string): Promise<void> {
    if (this.config.mockEnabled) return;
    if (this.activeRoom) await this.activeRoom.disconnect();
  }

  async listRooms(): Promise<Room[]> {
    if (this.config.mockEnabled) {
      if (!this.roomName) return [];
      return [this.createMockRoom({ name: this.roomName })];
    }
    return [];
  }

  async getRoomInfo(roomId: string): Promise<Room> {
    if (this.config.mockEnabled) return this.createMockRoom({ name: roomId });
    return {
      id: roomId,
      name: roomId,
      participants: [],
      createdAt: new Date(),
      settings: { maxParticipants: 10, duration: 60, layout: 'grid' },
      security: { isProtectedCall: false, encryptionEnabled: true, allowRecording: true, allowAIMonitoring: false }
    } as Room;
  }

  async updateRoomSettings(roomId: string, settings: Partial<RoomSettings>): Promise<Room> {
    const room = await this.getRoomInfo(roomId);
    return { ...room, settings: { ...room.settings, ...settings } };
  }

  async startRecording(_roomId: string): Promise<RecordingInfo> {
    return { id: 'rec-' + Date.now(), startTime: new Date(), status: 'active', duration: 0, aiMonitoringEnabled: false, retentionPeriod: 30 };
  }
  async stopRecording(_roomId: string): Promise<void> {}
  async pauseRecording(_roomId: string): Promise<void> {}
  async resumeRecording(_roomId: string): Promise<void> {}
  async getRecording(recordingId: string): Promise<RecordingInfo> {
    return { id: recordingId, startTime: new Date(), status: 'stopped', duration: 0, aiMonitoringEnabled: false, retentionPeriod: 30 };
  }
  async listRecordings(_roomId: string): Promise<RecordingInfo[]> {
    return [];
  }

  async updateSecuritySettings(roomId: string, settings: Partial<SecuritySettings>): Promise<Room> {
    const room = await this.getRoomInfo(roomId);
    return { ...room, security: { ...room.security, ...settings } };
  }

  async disconnect(): Promise<void> {
    if (this.config.mockEnabled) return;
    if (this.activeRoom) await this.activeRoom.disconnect();
  }

  async muteAudioTrack(): Promise<void> {}
  async unmuteAudioTrack(): Promise<void> {}
  async muteVideoTrack(): Promise<void> {}
  async unmuteVideoTrack(): Promise<void> {}
}
