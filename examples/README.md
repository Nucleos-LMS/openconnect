# OpenConnect Video Provider Examples

This directory contains example implementations demonstrating how to use the OpenConnect video providers.

## Basic Usage Example
`basic-usage.ts` demonstrates:
- Provider initialization
- Room creation
- Participant management
- Recording controls
- Basic error handling

## Protected Call Example
`protected-call.ts` demonstrates:
- Protected call setup (e.g., legal calls)
- Security settings
- Role-based access
- Recording restrictions

## Running Examples

1. Set up environment variables:
```bash
export VIDEO_API_KEY=your_api_key
export VIDEO_API_SECRET=your_api_secret
```

2. Run an example:
```bash
# Basic usage
npx ts-node examples/basic-usage.ts

# Protected call
npx ts-node examples/protected-call.ts
```

## Provider Configuration

### Twilio
```typescript
const config = {
  apiKey: process.env.TWILIO_API_KEY,
  apiSecret: process.env.TWILIO_API_SECRET
};
const provider = await VideoProviderFactory.create('twilio', config);
```

### Daily.co
```typescript
const config = {
  apiKey: process.env.DAILY_API_KEY
};
const provider = await VideoProviderFactory.create('daily', config);
```

### Google Meet
```typescript
const config = {
  apiKey: process.env.GOOGLE_CLIENT_ID,
  apiSecret: process.env.GOOGLE_CLIENT_SECRET
};
const provider = await VideoProviderFactory.create('google-meet', config);
```

## Security Considerations
- Protected calls cannot be recorded
- All calls use end-to-end encryption
- Role-based access control
- Proper API key management
