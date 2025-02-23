import { z } from 'zod';

export const facilitySettingsSchema = z.object({
  requirements: z.object({
    idRequired: z.boolean(),
    additionalDocuments: z.array(z.string()),
    visitationHours: z.string().regex(/^\d{1,2}:\d{2}-\d{1,2}:\d{2}$/, 'Invalid time format. Use HH:MM-HH:MM'),
  }),
  webrtc: z.object({
    iceServers: z.array(z.string().url('Invalid ICE server URL')),
    maxBitrate: z.number().min(100).max(5000),
    fallbackToRelay: z.boolean(),
  }),
  monitoring: z.object({
    enableAiMonitoring: z.boolean(),
    recordCalls: z.boolean(),
    retentionDays: z.number().min(1).max(365),
  }),
});

export type FacilitySettings = z.infer<typeof facilitySettingsSchema>;
