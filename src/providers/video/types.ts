export interface Participant {
  id: string;
  name: string;
  role: string;
  audioEnabled?: boolean;
  videoEnabled?: boolean;
}

export interface Room {
  id: string;
  name: string;
  participants: Participant[];
  createdAt: Date;
  settings: RoomSettings;
}

export interface RoomSettings {
  maxParticipants: number;
  duration: number;
  recording: boolean;
  layout?: 'grid' | 'spotlight' | 'presentation';
}

export interface ProviderConfig {
  apiKey?: string;
  apiSecret?: string;
  region?: string;
  environment?: 'development' | 'production';
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
}

export interface RoomOptions {
  name?: string;
  maxParticipants?: number;
  duration?: number;
  recording?: boolean;
  layout?: 'grid' | 'spotlight' | 'presentation';
}

export interface VideoProvider {
  initialize(config: ProviderConfig): Promise<void>;
  createRoom(options: RoomOptions): Promise<Room>;
  joinRoom(roomId: string, participant: Participant): Promise<void>;
  leaveRoom(roomId: string, participantId: string): Promise<void>;
  listRooms(): Promise<Room[]>;
  getRoomInfo(roomId: string): Promise<Room>;
  updateRoomSettings(roomId: string, settings: Partial<RoomSettings>): Promise<Room>;
  disconnect(): Promise<void>;
}
