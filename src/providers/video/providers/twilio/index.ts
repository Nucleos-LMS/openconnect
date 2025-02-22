import { BaseVideoProvider } from '../base';
import { Room, RoomOptions, Participant, RoomSettings, SecuritySettings, RecordingInfo, ProviderConfig } from '../../types';
import { connect, createLocalTracks, Room as TwilioRoom, LocalTrack, RemoteTrack, ConnectOptions } from 'twilio-video';
import { convertTwilioRoomToRoom } from './types';

export class TwilioProvider extends BaseVideoProvider {
  private activeRoom: TwilioRoom | null = null;
  private localTracks: LocalTrack[] = [];
  private remoteTracks: Map<string, RemoteTrack[]> = new Map();
  private roomSid: string | null = null;
  private activeRecording: RecordingInfo | null = null;

  constructor(config: ProviderConfig) {
    super(config);
  }

  async initialize(config: ProviderConfig): Promise<void> {
    this.validateConfig(config);
    if (!config.apiKey) {
      throw new Error('API key is required for Twilio');
    }
    
    // Store config for later use
    this.config = config;
    
    try {
      // Create local tracks for testing connection
      this.localTracks = await createLocalTracks({
        audio: false,
        video: false
      });
    } catch (error) {
      throw new Error(`Failed to initialize Twilio: ${error}`);
    }
  }

  async createRoom(options: RoomOptions): Promise<Room> {
    this.validateRoomOptions(options);
    if (!this.config) {
      throw new Error('Twilio provider not initialized');
    }

    try {
      const twilioOptions: ConnectOptions = {
        name: options.name || `room-${Date.now()}`,
        tracks: [],
        audio: true,
        video: true
      };

      this.activeRoom = await connect(this.config.apiKey!, twilioOptions);
      this.roomSid = this.activeRoom.sid;
      
      return {
        id: this.activeRoom.sid,
        name: options.name || `room-${Date.now()}`,
        participants: [],
        createdAt: new Date(),
        settings: {
          maxParticipants: options.maxParticipants || 10,
          duration: options.duration || 60,
          layout: options.layout || 'grid'
        },
        security: {
          isProtectedCall: options.security?.isProtectedCall || false,
          encryptionEnabled: options.security?.encryptionEnabled || true,
          allowRecording: options.security?.allowRecording || false,
          allowAIMonitoring: options.security?.allowAIMonitoring || false,
          requiredParticipantRoles: options.security?.requiredParticipantRoles || []
        }
      };
    } catch (error) {
      throw new Error(`Failed to create room: ${error}`);
    }
  }

  async joinRoom(roomId: string, participant: Participant): Promise<void> {
    if (!this.config) {
      throw new Error('Twilio provider not initialized');
    }

    if (this.activeRoom && this.activeRoom.sid === roomId) {
      return; // Already in the room
    }

    try {
      const connectOptions: ConnectOptions = {
        name: roomId,
        audio: participant.audioEnabled,
        video: participant.videoEnabled,
        tracks: this.localTracks
      };

      this.activeRoom = await connect(this.config.apiKey!, connectOptions);
      this.roomSid = this.activeRoom.sid;
    } catch (error) {
      throw new Error(`Failed to join room: ${error}`);
    }
  }

  async leaveRoom(roomId: string, participantId: string): Promise<void> {
    if (!this.activeRoom) {
      throw new Error('Not connected to a room');
    }

    try {
      await this.activeRoom.disconnect();
      this.activeRoom = null;
    } catch (error) {
      throw new Error(`Failed to leave room: ${error}`);
    }
  }

  async listRooms(): Promise<Room[]> {
    if (!this.activeRoom || !this.roomSid) {
      return [];
    }
    return [{
      id: this.roomSid,
      name: this.activeRoom.name || '',
      participants: [],
      createdAt: new Date(),
      settings: {
        maxParticipants: 10,
        duration: 60,
        layout: 'grid'
      },
      security: {
        isProtectedCall: false,
        encryptionEnabled: true,
        allowRecording: false,
        allowAIMonitoring: false,
        requiredParticipantRoles: []
      }
    }];
  }

  async getRoomInfo(roomId: string): Promise<Room> {
    if (!this.activeRoom) {
      throw new Error('Not connected to a room');
    }

    return convertTwilioRoomToRoom(this.activeRoom);
  }

  async updateRoomSettings(roomId: string, settings: Partial<RoomSettings>): Promise<Room> {
    if (!this.activeRoom || this.activeRoom.sid !== roomId) {
      throw new Error('Not connected to the specified room');
    }

    // For now, we'll just update our local room object since Twilio Video JS SDK
    // doesn't support dynamic room settings updates
    const room = convertTwilioRoomToRoom(this.activeRoom);
    return {
      ...room,
      settings: {
        ...room.settings,
        ...settings
      }
    };
  }

  async startRecording(roomId: string, options?: { aiMonitoring?: boolean }): Promise<RecordingInfo> {
    if (!this.activeRoom || this.activeRoom.sid !== roomId) {
      throw new Error('Not connected to the specified room');
    }

    // Mock recording for now since we need the REST API client for actual recording
    this.activeRecording = {
      id: `recording-${Date.now()}`,
      startTime: new Date(),
      status: 'active',
      duration: 0,
      aiMonitoringEnabled: options?.aiMonitoring || false,
      retentionPeriod: 30 // Default 30 days retention
    };
    return this.activeRecording;
  }

  async stopRecording(roomId: string): Promise<void> {
    if (!this.activeRoom || this.activeRoom.sid !== roomId) {
      throw new Error('Not connected to the specified room');
    }
    // Mock implementation since we need the REST API client for actual recording
  }

  async pauseRecording(roomId: string): Promise<void> {
    if (!this.activeRoom || this.activeRoom.sid !== roomId) {
      throw new Error('Not connected to the specified room');
    }
    // Mock implementation since we need the REST API client for actual recording
  }

  async resumeRecording(roomId: string): Promise<void> {
    if (!this.activeRoom || this.activeRoom.sid !== roomId) {
      throw new Error('Not connected to the specified room');
    }
    // Mock implementation since we need the REST API client for actual recording
  }

  async getRecording(recordingId: string): Promise<RecordingInfo> {
    if (!this.activeRoom) {
      throw new Error('Not connected to any room');
    }
    // Mock implementation since we need the REST API client for actual recording
    return {
      id: recordingId,
      startTime: new Date(),
      status: 'active',
      duration: 0,
      aiMonitoringEnabled: false,
      retentionPeriod: 30
    };
  }

  async listRecordings(roomId: string): Promise<RecordingInfo[]> {
    if (!this.activeRoom || this.activeRoom.sid !== roomId) {
      throw new Error('Not connected to the specified room');
    }
    // Return active recording if it exists
    return this.activeRecording ? [this.activeRecording] : [];
  }

  async updateSecuritySettings(roomId: string, settings: Partial<SecuritySettings>): Promise<Room> {
    if (!this.activeRoom || this.activeRoom.sid !== roomId) {
      throw new Error('Not connected to the specified room');
    }

    // For now, we'll just update our local room object since Twilio Video JS SDK
    // doesn't support dynamic security settings updates
    const room = convertTwilioRoomToRoom(this.activeRoom);
    return {
      ...room,
      security: {
        ...room.security,
        ...settings
      }
    };
  }

  async disconnect(): Promise<void> {
    try {
      if (this.activeRoom) {
        await this.activeRoom.disconnect();
        this.activeRoom = null;
      }
      this.localTracks.forEach(track => {
        if ('stop' in track) {
          (track as any).stop();
        }
      });
      this.localTracks = [];
      this.remoteTracks.clear();
    } catch (error) {
      throw new Error(`Failed to disconnect: ${error}`);
    }
  }
}
