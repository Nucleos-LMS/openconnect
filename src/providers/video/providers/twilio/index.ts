import { BaseVideoProvider } from '../base';
import { Room, RoomOptions, Participant, RoomSettings, SecuritySettings, RecordingInfo, ProviderConfig } from '../../types';
import { connect, createLocalTracks, Room as TwilioRoom, LocalTrack, RemoteTrack, ConnectOptions } from 'twilio-video';
import { convertTwilioRoomToRoom } from './types';
export class TwilioProvider extends BaseVideoProvider {
  private activeRoom: TwilioRoom | null = null;
  private localTracks: LocalTrack[] = [];
  private remoteTracks: Map<string, RemoteTrack[]> = new Map();
  private roomSid: string | null = null;

  constructor(config: ProviderConfig) {
    super(config);
    this.config = config;
  }

  async initialize(config: ProviderConfig): Promise<void> {
    // Use environment variables if config values are not provided
    const apiKey = config.apiKey || process.env.TWILIO_API_KEY_SID;
    const apiSecret = config.apiSecret || process.env.TWILIO_API_KEY_SECRET;
    
    if (!apiKey || !apiSecret) {
      throw new Error('Twilio provider requires apiKey and apiSecret');
    }
    
    // Store config for later use
    this.config = {
      ...config,
      apiKey,
      apiSecret,
    };
    
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
    if (!this.config?.apiKey || !this.config?.apiSecret) {
      throw new Error('Twilio provider not initialized with required credentials');
    }

    try {
      const twilioOptions: ConnectOptions = {
        name: options.name || `room-${Date.now()}`,
        tracks: [],
        audio: true,
        video: true,
        region: this.config.region || 'us-east-1'
      };

      this.activeRoom = await connect(this.config.apiKey, twilioOptions);
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
    if (!this.config?.apiKey || !this.config?.apiSecret) {
      throw new Error('Twilio provider not initialized with required credentials');
    }

    if (this.activeRoom && this.activeRoom.sid === roomId) {
      return; // Already in the room
    }

    try {
      const connectOptions: ConnectOptions = {
        name: roomId,
        audio: participant.audioEnabled,
        video: participant.videoEnabled,
        tracks: this.localTracks,
        region: this.config.region || 'us-east-1'
      };

      this.activeRoom = await connect(this.config.apiKey, connectOptions);
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

    if (!this.config?.apiKey || !this.config?.apiSecret) {
      throw new Error('Twilio provider not initialized with required credentials');
    }

    try {
      // Use Twilio's REST API for recording (to be implemented)
      // For now return a mock recording since actual implementation will be in private repo
      const recordingId = `recording-${Date.now()}`;
      return {
        id: recordingId,
        startTime: new Date(),
        status: 'active',
        duration: 0,
        aiMonitoringEnabled: options?.aiMonitoring || false,
        retentionPeriod: 30 // Default 30 days
      };
    } catch (error) {
      throw new Error(`Failed to start recording: ${error}`);
    }
  }

  async stopRecording(roomId: string): Promise<void> {
    if (!this.activeRoom || this.activeRoom.sid !== roomId) {
      throw new Error('Not connected to the specified room');
    }
    
    if (!this.config?.apiKey || !this.config?.apiSecret) {
      throw new Error('Twilio provider not initialized with required credentials');
    }

    try {
      // Use Twilio's REST API for recording (to be implemented in private repo)
    } catch (error) {
      throw new Error(`Failed to stop recording: ${error}`);
    }
  }

  async pauseRecording(roomId: string): Promise<void> {
    if (!this.activeRoom || this.activeRoom.sid !== roomId) {
      throw new Error('Not connected to the specified room');
    }
    
    if (!this.config?.apiKey || !this.config?.apiSecret) {
      throw new Error('Twilio provider not initialized with required credentials');
    }

    try {
      // Use Twilio's REST API for recording (to be implemented in private repo)
    } catch (error) {
      throw new Error(`Failed to pause recording: ${error}`);
    }
  }

  async resumeRecording(roomId: string): Promise<void> {
    if (!this.activeRoom || this.activeRoom.sid !== roomId) {
      throw new Error('Not connected to the specified room');
    }
    
    if (!this.config?.apiKey || !this.config?.apiSecret) {
      throw new Error('Twilio provider not initialized with required credentials');
    }

    try {
      // Use Twilio's REST API for recording (to be implemented in private repo)
    } catch (error) {
      throw new Error(`Failed to resume recording: ${error}`);
    }
  }

  async getRecording(recordingId: string): Promise<RecordingInfo> {
    if (!this.config?.apiKey || !this.config?.apiSecret) {
      throw new Error('Twilio provider not initialized with required credentials');
    }

    try {
      // Basic implementation - actual recording info will be in private repo
      return {
        id: recordingId,
        startTime: new Date(),
        status: 'active',
        duration: 0,
        aiMonitoringEnabled: false,
        retentionPeriod: 30
      };
    } catch (error) {
      throw new Error(`Failed to get recording: ${error}`);
    }
  }

  async listRecordings(roomId: string): Promise<RecordingInfo[]> {
    if (!this.activeRoom || this.activeRoom.sid !== roomId) {
      throw new Error('Not connected to the specified room');
    }

    if (!this.config?.apiKey || !this.config?.apiSecret) {
      throw new Error('Twilio provider not initialized with required credentials');
    }

    try {
      // Basic implementation - actual recording list will be in private repo
      return [];
    } catch (error) {
      throw new Error(`Failed to list recordings: ${error}`);
    }
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

  // Media controls
  async muteAudioTrack(): Promise<void> {
    if (this.activeRoom) {
      this.activeRoom.localParticipant.audioTracks.forEach(track => {
        track.track.disable();
      });
    }
  }

  async unmuteAudioTrack(): Promise<void> {
    if (this.activeRoom) {
      this.activeRoom.localParticipant.audioTracks.forEach(track => {
        track.track.enable();
      });
    }
  }

  async muteVideoTrack(): Promise<void> {
    if (this.activeRoom) {
      this.activeRoom.localParticipant.videoTracks.forEach(track => {
        track.track.disable();
      });
    }
  }

  async unmuteVideoTrack(): Promise<void> {
    if (this.activeRoom) {
      this.activeRoom.localParticipant.videoTracks.forEach(track => {
        track.track.enable();
      });
    }
  }
}
