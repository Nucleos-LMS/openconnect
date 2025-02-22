import { BaseVideoProvider } from '../base';
import { Room, RoomOptions, Participant, RoomSettings, SecuritySettings, RecordingInfo, ProviderConfig } from '../../types';
import { connect, createLocalTracks, Room as TwilioRoom, LocalTrack, RemoteTrack, LocalVideoTrack, LocalAudioTrack, RemoteVideoTrack, RemoteAudioTrack } from 'twilio-video';
import { TwilioRoomOptions, TwilioConnectOptions, TwilioRecording, TwilioRoomInfo, TwilioParticipant } from './types';

export class TwilioProvider extends BaseVideoProvider {
  private activeRoom: TwilioRoom | null = null;
  private localTracks: (LocalAudioTrack | LocalVideoTrack)[] = [];
  private remoteTracks: Map<string, (RemoteAudioTrack | RemoteVideoTrack)[]> = new Map();
  private config: ProviderConfig | null = null;

  async initialize(config: ProviderConfig): Promise<void> {
    this.validateConfig(config);
    if (!config.apiSecret) {
      throw new Error('API secret is required for Twilio');
    }
    
    this.config = config;
    
    try {
      // Create local tracks for testing connection
      this.localTracks = await createLocalTracks({
        audio: false,
        video: false
      });
      
      // Test connection
      const room = await connect(config.apiKey!, {
        name: 'test-connection',
        tracks: this.localTracks
      });
      
      await room.disconnect();
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
      const twilioOptions: TwilioRoomOptions = {
        type: 'group',
        uniqueName: options.name,
        maxParticipants: options.maxParticipants,
        recordParticipantsOnConnect: options.security?.allowRecording,
        tracks: this.localTracks
      };

      const twilioRoom = await connect(this.config.apiKey!, twilioOptions);

      return {
        id: twilioRoom.sid,
        name: twilioRoom.uniqueName || '',
        participants: [],
        createdAt: new Date(),
        settings: {
          maxParticipants: options.maxParticipants || 10,
          duration: options.duration || 60,
          layout: options.layout || 'grid'
        },
        security: {
          isProtectedCall: options.security?.isProtectedCall || false,
          encryptionEnabled: true,
          allowRecording: options.security?.allowRecording || false,
          allowAIMonitoring: options.security?.allowAIMonitoring || false,
          requiredParticipantRoles: options.security?.requiredParticipantRoles
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

    try {
      const connectOptions: TwilioConnectOptions = {
        name: roomId,
        audio: true,
        video: true,
        participantIdentity: participant.id,
        tracks: this.localTracks
      };

      this.activeRoom = await connect(this.config.apiKey!, connectOptions);
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
    if (!this.activeRoom || !this.config) {
      throw new Error('Twilio provider not initialized');
    }

    try {
      const rooms = await this.activeRoom.rooms.list();
      return rooms.map((room: TwilioRoom): Room => ({
        id: room.sid,
        name: room.uniqueName || '',
        participants: [],
        createdAt: new Date(room.dateCreated),
        settings: {
          maxParticipants: room.maxParticipants || 10,
          duration: 60,
          layout: 'grid'
        },
        security: {
          isProtectedCall: false,
          encryptionEnabled: true,
          allowRecording: room.recordParticipantsOnConnect || false,
          allowAIMonitoring: false
        }
      }));
    } catch (error) {
      throw new Error(`Failed to list rooms: ${error}`);
    }
  }

  async getRoomInfo(roomId: string): Promise<Room> {
    if (!this.activeRoom || !this.config) {
      throw new Error('Twilio provider not initialized');
    }

    try {
      const room = await this.activeRoom.rooms(roomId).fetch() as TwilioRoom;
      return {
        id: room.sid,
        name: room.uniqueName || '',
        participants: [],
        createdAt: new Date(room.dateCreated),
        settings: {
          maxParticipants: room.maxParticipants || 10,
          duration: 60,
          layout: 'grid'
        },
        security: {
          isProtectedCall: false,
          encryptionEnabled: true,
          allowRecording: room.recordParticipantsOnConnect || false,
          allowAIMonitoring: false
        }
      };
    } catch (error) {
      throw new Error(`Failed to get room info: ${error}`);
    }
  }

  async updateRoomSettings(roomId: string, settings: Partial<RoomSettings>): Promise<Room> {
    if (!this.client) {
      throw new Error('Twilio client not initialized');
    }

    try {
      const room = await this.client.rooms(roomId).update({
        maxParticipants: settings.maxParticipants
      });
      
      return this.getRoomInfo(roomId);
    } catch (error) {
      throw new Error(`Failed to update room settings: ${error}`);
    }
  }

  async startRecording(roomId: string, options?: { aiMonitoring?: boolean }): Promise<RecordingInfo> {
    if (!this.activeRoom || !this.config) {
      throw new Error('Twilio provider not initialized');
    }

    try {
      const recording = await this.activeRoom.rooms(roomId).recordings.create({
        type: 'audio-video',
        statusCallback: options?.aiMonitoring ? '/api/recording/monitor' : undefined
      }) as TwilioRecording;
      return {
        id: recording.sid,
        startTime: new Date(recording.dateCreated),
        status: 'active',
        duration: 0,
        aiMonitoringEnabled: options?.aiMonitoring || false,
        retentionPeriod: 30
      };
    } catch (error) {
      throw new Error(`Failed to start recording: ${error}`);
    }
  }

  async stopRecording(roomId: string): Promise<void> {
    if (!this.activeRoom || !this.config) {
      throw new Error('Twilio provider not initialized');
    }

    try {
      const recordings = await this.activeRoom.rooms(roomId).recordings.list() as TwilioRecording[];
      for (const recording of recordings) {
        if (recording.status === 'in-progress') {
          await this.activeRoom.rooms(roomId).recordings(recording.sid).update({ status: 'stopped' });
        }
      }
    } catch (error) {
      throw new Error(`Failed to stop recording: ${error}`);
    }
  }

  async pauseRecording(roomId: string): Promise<void> {
    if (!this.activeRoom || !this.config) {
      throw new Error('Twilio provider not initialized');
    }

    try {
      const recordings = await this.activeRoom.rooms(roomId).recordings.list() as TwilioRecording[];
      for (const recording of recordings) {
        if (recording.status === 'in-progress') {
          await this.activeRoom.rooms(roomId).recordings(recording.sid).update({ status: 'paused' });
        }
      }
    } catch (error) {
      throw new Error(`Failed to pause recording: ${error}`);
    }
  }

  async resumeRecording(roomId: string): Promise<void> {
    if (!this.activeRoom || !this.config) {
      throw new Error('Twilio provider not initialized');
    }

    try {
      const recordings = await this.activeRoom.rooms(roomId).recordings.list() as TwilioRecording[];
      for (const recording of recordings) {
        if (recording.status === 'paused') {
          await this.activeRoom.rooms(roomId).recordings(recording.sid).update({ status: 'in-progress' });
        }
      }
    } catch (error) {
      throw new Error(`Failed to resume recording: ${error}`);
    }
  }

  async getRecording(recordingId: string): Promise<RecordingInfo> {
    if (!this.activeRoom || !this.config) {
      throw new Error('Twilio provider not initialized');
    }

    try {
      const recording = await this.activeRoom.recordings(recordingId).fetch() as TwilioRecording;
      return {
        id: recording.sid,
        startTime: new Date(recording.dateCreated),
        status: recording.status as 'active' | 'paused' | 'stopped',
        duration: recording.duration || 0,
        aiMonitoringEnabled: false,
        retentionPeriod: 30
      };
    } catch (error) {
      throw new Error(`Failed to get recording: ${error}`);
    }
  }

  async listRecordings(roomId: string): Promise<RecordingInfo[]> {
    if (!this.activeRoom || !this.config) {
      throw new Error('Twilio provider not initialized');
    }

    try {
      const recordings = await this.activeRoom.rooms(roomId).recordings.list() as TwilioRecording[];
      return recordings.map(recording => ({
        id: recording.sid,
        startTime: new Date(recording.dateCreated),
        status: recording.status as 'active' | 'paused' | 'stopped',
        duration: recording.duration || 0,
        aiMonitoringEnabled: false,
        retentionPeriod: 30
      }));
    } catch (error) {
      throw new Error(`Failed to list recordings: ${error}`);
    }
  }

  async updateSecuritySettings(roomId: string, settings: Partial<SecuritySettings>): Promise<Room> {
    if (!this.activeRoom || !this.config) {
      throw new Error('Twilio provider not initialized');
    }

    try {
      const room = await this.activeRoom.rooms(roomId).update({
        recordParticipantsOnConnect: settings.allowRecording
      });
      
      return this.getRoomInfo(roomId);
    } catch (error) {
      throw new Error(`Failed to update security settings: ${error}`);
    }
  }

  async disconnect(): Promise<void> {
    if (this.activeRoom) {
      try {
        await this.activeRoom.disconnect();
        this.activeRoom = null;
        this.localTracks.forEach(track => track.stop());
        this.localTracks = [];
        this.remoteTracks.clear();
      } catch (error) {
        throw new Error(`Failed to disconnect: ${error}`);
      }
    }
  }
}
