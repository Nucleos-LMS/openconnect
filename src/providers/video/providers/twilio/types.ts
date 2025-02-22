import { Room as TwilioRoom, LocalTrack, RemoteTrack, ConnectOptions, LocalAudioTrack, LocalVideoTrack, RemoteAudioTrack, RemoteVideoTrack } from 'twilio-video';
import { Room, RoomOptions, Participant, RoomSettings, SecuritySettings, RecordingInfo } from '../../types';

export interface TwilioRoomOptions extends ConnectOptions {
  type?: 'group' | 'peer-to-peer';
  uniqueName?: string;
  maxParticipants?: number;
  recordParticipantsOnConnect?: boolean;
  tracks?: (LocalAudioTrack | LocalVideoTrack)[];
}

export interface TwilioRecordingOptions {
  type?: 'audio-video' | 'audio' | 'video';
  statusCallback?: string;
  statusCallbackMethod?: string;
  maxDuration?: number;
}

export interface TwilioRecording {
  sid: string;
  status: 'in-progress' | 'paused' | 'stopped';
  duration: number;
  dateCreated: Date;
  type: 'audio-video' | 'audio' | 'video';
  size: number;
  url: string;
}

export interface TwilioParticipant extends Participant {
  identity: string;
  audioTracks: Map<string, LocalAudioTrack | RemoteAudioTrack>;
  videoTracks: Map<string, LocalVideoTrack | RemoteVideoTrack>;
}

export interface TwilioRoomInfo extends Room {
  sid: string;
  uniqueName: string;
  maxParticipants: number;
  recordParticipantsOnConnect: boolean;
  duration: number;
  type: 'group' | 'peer-to-peer';
}

export interface TwilioConnectOptions extends ConnectOptions {
  name: string;
  audio: boolean;
  video: boolean;
  participantIdentity?: string;
  tracks?: (LocalAudioTrack | LocalVideoTrack)[];
}
