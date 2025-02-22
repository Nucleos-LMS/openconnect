import { Room as TwilioRoom, Participant as TwilioParticipant, LocalTrack, ConnectOptions } from 'twilio-video';
import { Room } from '../../types';

export function convertTwilioRoomToRoom(twilioRoom: TwilioRoom): Room {
  return {
    id: twilioRoom.sid,
    name: twilioRoom.name || '',
    participants: Array.from(twilioRoom.participants.values()).map(p => ({
      id: p.identity,
      name: p.identity,
      role: 'visitor',
      audioEnabled: p.audioTracks.size > 0,
      videoEnabled: p.videoTracks.size > 0
    })),
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
  };
}

// Using ConnectOptions from twilio-video directly
