import { BaseVideoProvider } from '../base';
import { Room, RoomOptions, Participant, RoomSettings, SecuritySettings, RecordingInfo, ProviderConfig } from '../../types';
import { Video } from 'twilio-video';

export class TwilioProvider extends BaseVideoProvider {
  private client: typeof Video | null = null;

  async initialize(config: ProviderConfig): Promise<void> {
    this.validateConfig(config);
    if (!config.apiSecret) {
      throw new Error('API secret is required for Twilio');
    }
    
    try {
      // Initialize Twilio Video client
      this.client = Video;
      await this.client.connect(config.apiKey!, {
        name: 'test-connection',
        audio: false,
        video: false
      });
    } catch (error) {
      throw new Error(`Failed to initialize Twilio: ${error}`);
    }
  }

  async createRoom(options: RoomOptions): Promise<Room> {
    this.validateRoomOptions(options);
    if (!this.client) {
      throw new Error('Twilio client not initialized');
    }

    try {
      const twilioRoom = await this.client.createRoom({
        type: 'group',
        uniqueName: options.name,
        maxParticipants: options.maxParticipants,
        recordParticipantsOnConnect: options.security?.allowRecording
      });

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
    if (!this.client) {
      throw new Error('Twilio client not initialized');
    }

    try {
      await this.client.connect({
        name: roomId,
        audio: true,
        video: true,
        participantIdentity: participant.id
      });
    } catch (error) {
      throw new Error(`Failed to join room: ${error}`);
    }
  }

  async leaveRoom(roomId: string, participantId: string): Promise<void> {
    if (!this.client) {
      throw new Error('Twilio client not initialized');
    }

    try {
      const room = await this.client.connect({ name: roomId });
      room.disconnect();
    } catch (error) {
      throw new Error(`Failed to leave room: ${error}`);
    }
  }

  async listRooms(): Promise<Room[]> {
    if (!this.client) {
      throw new Error('Twilio client not initialized');
    }

    try {
      const rooms = await this.client.rooms.list();
      return rooms.map(room => ({
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
    if (!this.client) {
      throw new Error('Twilio client not initialized');
    }

    try {
      const room = await this.client.rooms(roomId).fetch();
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
    if (!this.client) {
      throw new Error('Twilio client not initialized');
    }

    try {
      const recording = await this.client.rooms(roomId).recordings.create();
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
    if (!this.client) {
      throw new Error('Twilio client not initialized');
    }

    try {
      const recordings = await this.client.rooms(roomId).recordings.list();
      for (const recording of recordings) {
        if (recording.status === 'in-progress') {
          await recording.update({ status: 'stopped' });
        }
      }
    } catch (error) {
      throw new Error(`Failed to stop recording: ${error}`);
    }
  }

  async pauseRecording(roomId: string): Promise<void> {
    if (!this.client) {
      throw new Error('Twilio client not initialized');
    }

    try {
      const recordings = await this.client.rooms(roomId).recordings.list();
      for (const recording of recordings) {
        if (recording.status === 'in-progress') {
          await recording.update({ status: 'paused' });
        }
      }
    } catch (error) {
      throw new Error(`Failed to pause recording: ${error}`);
    }
  }

  async resumeRecording(roomId: string): Promise<void> {
    if (!this.client) {
      throw new Error('Twilio client not initialized');
    }

    try {
      const recordings = await this.client.rooms(roomId).recordings.list();
      for (const recording of recordings) {
        if (recording.status === 'paused') {
          await recording.update({ status: 'in-progress' });
        }
      }
    } catch (error) {
      throw new Error(`Failed to resume recording: ${error}`);
    }
  }

  async getRecording(recordingId: string): Promise<RecordingInfo> {
    if (!this.client) {
      throw new Error('Twilio client not initialized');
    }

    try {
      const recording = await this.client.recordings(recordingId).fetch();
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
    if (!this.client) {
      throw new Error('Twilio client not initialized');
    }

    try {
      const recordings = await this.client.rooms(roomId).recordings.list();
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
    if (!this.client) {
      throw new Error('Twilio client not initialized');
    }

    try {
      const room = await this.client.rooms(roomId).update({
        recordParticipantsOnConnect: settings.allowRecording
      });
      
      return this.getRoomInfo(roomId);
    } catch (error) {
      throw new Error(`Failed to update security settings: ${error}`);
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      try {
        // Disconnect from all rooms
        const rooms = await this.client.rooms.list({ status: 'in-progress' });
        await Promise.all(rooms.map(room => room.update({ status: 'completed' })));
        this.client = null;
      } catch (error) {
        throw new Error(`Failed to disconnect: ${error}`);
      }
    }
  }
}
