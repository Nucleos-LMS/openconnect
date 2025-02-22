export interface Participant {
  id: string;
  name: string;
  role: 'resident' | 'visitor' | 'attorney' | 'staff';
  audioEnabled?: boolean;
  videoEnabled?: boolean;
}

export interface Room {
  id: string;
  name: string;
  participants: Participant[];
  createdAt: Date;
  settings: RoomSettings;
  security: SecuritySettings;
  recording?: RecordingInfo;
}

export interface SecuritySettings {
  isProtectedCall: boolean;  // Legal calls are protected
  encryptionEnabled: boolean;
  allowRecording: boolean;
  allowAIMonitoring: boolean;
  requiredParticipantRoles?: string[];
}

export interface RecordingInfo {
  id: string;
  startTime: Date;
  status: 'active' | 'paused' | 'stopped';
  duration: number;
  aiMonitoringEnabled: boolean;
  retentionPeriod: number; // Days to keep recording
}

export interface RoomSettings {
  maxParticipants: number;
  duration: number;
  layout?: 'grid' | 'spotlight' | 'presentation';
}

export interface ProviderConfig {
  apiKey?: string;
  apiSecret?: string;
  region?: string;
  environment?: 'development' | 'production';
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
  security?: {
    encryptionKey?: string;
    monitoringConfig?: {
      aiProvider?: string;
      aiApiKey?: string;
    };
  };
}

export interface RoomOptions {
  name?: string;
  maxParticipants?: number;
  duration?: number;
  layout?: 'grid' | 'spotlight' | 'presentation';
  security?: Partial<SecuritySettings>;
}

export interface VideoProvider {
  initialize(config: ProviderConfig): Promise<void>;
  createRoom(options: RoomOptions): Promise<Room>;
  joinRoom(roomId: string, participant: Participant): Promise<void>;
  leaveRoom(roomId: string, participantId: string): Promise<void>;
  listRooms(): Promise<Room[]>;
  getRoomInfo(roomId: string): Promise<Room>;
  updateRoomSettings(roomId: string, settings: Partial<RoomSettings>): Promise<Room>;
  
  // Recording controls
  startRecording(roomId: string, options?: { aiMonitoring?: boolean }): Promise<RecordingInfo>;
  stopRecording(roomId: string): Promise<void>;
  pauseRecording(roomId: string): Promise<void>;
  resumeRecording(roomId: string): Promise<void>;
  getRecording(recordingId: string): Promise<RecordingInfo>;
  listRecordings(roomId: string): Promise<RecordingInfo[]>;
  
  // Security controls
  updateSecuritySettings(roomId: string, settings: Partial<SecuritySettings>): Promise<Room>;
  
  disconnect(): Promise<void>;
}
