# OpenConnect API Documentation

## Authentication
All API endpoints require authentication using JWT tokens. Obtain a token by logging in through `/api/auth/login`.

### Authentication Headers
```
Authorization: Bearer <jwt_token>
```

## Video Call APIs

### Start Call
```http
POST /api/calls/start
Content-Type: application/json

{
  "participantIds": string[],
  "settings": {
    "maxDuration": number,
    "layout": "grid" | "spotlight" | "presentation"
  }
}
```

### Join Call
```http
POST /api/calls/{callId}/join
```

### End Call
```http
POST /api/calls/{callId}/end
```

### Get Video Token
```http
GET /api/video/token?room={roomName}&user={userId}
```

### Response
```json
{
  "success": true,
  "data": {
    "token": "jwt-token",
    "url": "wss://livekit.example.com"
  }
}
```

## Recording APIs

### List Recordings
```http
GET /api/recordings?roomId={roomId}
```

### Search Recordings
```http
GET /api/recordings/search
Query Parameters:
- query: string
- startDate: ISO date
- endDate: ISO date
- participantName: string
```

### Get Recording Analysis
```http
GET /api/recordings/{recordingId}/analysis
```

### Subscribe to Alerts
```http
POST /api/recordings/alerts/subscribe
Content-Type: application/json

{
  "alertTypes": string[],
  "webhookUrl": string
}
```

## Facility Management APIs

### Update Facility Settings
```http
PUT /api/facilities/{facilityId}/settings
Content-Type: application/json

{
  "recording": {
    "retentionPeriod": number,
    "aiMonitoringEnabled": boolean,
    "autoTranscriptionEnabled": boolean,
    "alertTypes": string[],
    "storageLocation": string
  }
}
```

## Contact Management APIs

### List Contacts
```http
GET /api/contacts
```

### Add Contact
```http
POST /api/contacts
Content-Type: application/json

{
  "name": string,
  "email": string,
  "relationship": string,
  "approved": boolean
}
```

### Approve Contact
```http
POST /api/contacts/{contactId}/approve
```

## Response Formats

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": string,
    "message": string
  }
}
```
