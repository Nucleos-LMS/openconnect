import { VideoProvider, ProviderConfig, Room, RoomOptions, Participant, RoomSettings, SecuritySettings, RecordingInfo } from '../types';

export abstract class BaseVideoProvider implements VideoProvider {
  protected config: ProviderConfig;

  constructor(config: ProviderConfig) {
    this.config = config;
  }

  abstract initialize(config: ProviderConfig): Promise<void>;
  abstract createRoom(options: RoomOptions): Promise<Room>;
  abstract joinRoom(roomId: string, participant: Participant): Promise<void>;
  abstract leaveRoom(roomId: string, participantId: string): Promise<void>;
  abstract listRooms(): Promise<Room[]>;
  abstract getRoomInfo(roomId: string): Promise<Room>;
  abstract updateRoomSettings(roomId: string, settings: Partial<RoomSettings>): Promise<Room>;
  abstract startRecording(roomId: string, options?: { aiMonitoring?: boolean }): Promise<RecordingInfo>;
  abstract stopRecording(roomId: string): Promise<void>;
  abstract pauseRecording(roomId: string): Promise<void>;
  abstract resumeRecording(roomId: string): Promise<void>;
  abstract getRecording(recordingId: string): Promise<RecordingInfo>;
  abstract listRecordings(roomId: string): Promise<RecordingInfo[]>;
  abstract updateSecuritySettings(roomId: string, settings: Partial<SecuritySettings>): Promise<Room>;
  abstract disconnect(): Promise<void>;

  protected validateConfig(config: ProviderConfig): void {
    if (!config.apiKey) {
      throw new Error('API key is required');
    }
  }

  protected validateRoomOptions(options: RoomOptions): void {
    if (options.maxParticipants && options.maxParticipants < 2) {
      throw new Error('Room must allow at least 2 participants');
    }
  }
}
