# Facility Settings Component

The FacilitySettings component allows facility administrators to configure various aspects of the OpenConnect platform for their facility.

## Features

### Requirements Configuration
- ID verification requirements
- Additional document requirements
- Visitation hours configuration

### WebRTC Configuration
- ICE server configuration
- Bandwidth settings
- Relay fallback options

### Monitoring & Recording
- AI monitoring toggle
- Call recording settings
- Retention period configuration

## Usage

```tsx
import { FacilitySettings } from '@/components/features/admin/FacilitySettings';

export default function FacilitySettingsPage() {
  return (
    <FacilitySettings
      facilityId="facility_123"
      onSave={async (settings) => {
        // Handle settings save
      }}
      onError={(error) => {
        // Handle errors
      }}
    />
  );
}
```

## Props

| Name | Type | Description |
|------|------|-------------|
| facilityId | string | The ID of the facility to configure |
| onSave | (settings: FacilitySettings) => Promise<void> | Callback when settings are saved |
| onError | (error: Error) => void | Callback when an error occurs |

## Validation

Settings are validated using Zod schemas:

```typescript
const facilitySettingsSchema = z.object({
  requirements: z.object({
    idRequired: z.boolean(),
    additionalDocuments: z.array(z.string()),
    visitationHours: z.string().regex(/^\d{1,2}:\d{2}-\d{1,2}:\d{2}$/),
  }),
  webrtc: z.object({
    iceServers: z.array(z.string().url()),
    maxBitrate: z.number().min(100).max(5000),
    fallbackToRelay: z.boolean(),
  }),
  monitoring: z.object({
    enableAiMonitoring: z.boolean(),
    recordCalls: z.boolean(),
    retentionDays: z.number().min(1).max(365),
  }),
});
```

## Security Considerations

- All sensitive configuration values are stored securely
- Monitoring settings respect privacy requirements
- Recording retention follows legal guidelines
