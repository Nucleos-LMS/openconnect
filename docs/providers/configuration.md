# Provider Configuration Guide

## Environment Variables

### Required Variables
```bash
# Twilio Provider Configuration
# Get these values from your Twilio Console: https://www.twilio.com/console
# IMPORTANT: Never commit actual credentials to version control!
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx    # Required for Twilio
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx      # Required for Twilio
TWILIO_API_KEY=SKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx       # Required for Twilio
TWILIO_API_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx      # Required for Twilio


# LiveKit Configuration
LIVEKIT_URL=<your-livekit-server-url>    # Required for LiveKit
LIVEKIT_API_KEY=<your-livekit-api-key>    # Required for LiveKit
LIVEKIT_API_SECRET=<your-livekit-api-secret>  # Required for LiveKit

# Provider Settings
VIDEO_PROVIDER=livekit                    # livekit | twilio | daily | google-meet
PROVIDER_ENVIRONMENT=development        # development | production
PROVIDER_REGION=us-east-1              # Provider-specific region
PROVIDER_LOG_LEVEL=info                # debug | info | warn | error

# Security Configuration
PROVIDER_ENCRYPTION_KEY=                # Required for encrypted calls
PROVIDER_AI_PROVIDER=openai            # AI provider for monitoring
PROVIDER_AI_API_KEY=                   # Required for AI monitoring
```

### Configuration Guidelines

1. Provider Selection
   - Set `PROVIDER_TYPE` to choose video provider
   - Each provider requires specific credentials
   - Region settings may vary by provider

2. Security Settings
   - `PROVIDER_ENCRYPTION_KEY` required for encrypted calls
   - AI monitoring requires valid API key
   - Store all sensitive values in environment variables
   - Never commit actual credentials

3. Environment Settings
   - Use `development` for testing
   - Set appropriate log level for environment
   - Configure region based on facility location

### Provider-Specific Configuration

#### Twilio
- Requires Account SID and Auth Token
- API Key and Secret for video services
- Supports regional configuration

#### Daily.co
- Requires API Key
- Room configuration via environment

#### Google Meet
- Requires OAuth credentials
- Additional workspace settings

### Security Best Practices
1. Credential Management
   - Rotate keys regularly
   - Use secure key storage
   - Monitor API usage

2. Environment Security
   - Use different keys per environment
   - Restrict access to production keys
   - Implement proper encryption

3. Monitoring
   - Configure appropriate log levels
   - Enable security alerts
   - Track API usage
