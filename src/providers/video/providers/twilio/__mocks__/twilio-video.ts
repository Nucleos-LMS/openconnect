// Mock Twilio Video SDK
export const connect = jest.fn().mockImplementation((token, options) => {
  return Promise.resolve({
    sid: 'mock-room-sid',
    name: options.name || 'mock-room',
    participants: new Map(),
    disconnect: jest.fn(),
    on: jest.fn()
  });
});

export const createLocalTracks = jest.fn().mockImplementation(() => {
  return Promise.resolve([
    { kind: 'audio', stop: jest.fn() },
    { kind: 'video', stop: jest.fn() }
  ]);
});

export class Room {
  sid: string;
  name: string;
  participants: Map<string, any>;
  
  constructor(sid: string, name: string) {
    this.sid = sid;
    this.name = name;
    this.participants = new Map();
  }
  
  disconnect() {}
  on() {}
}
