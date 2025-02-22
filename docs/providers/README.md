# Video Provider Documentation

## Overview
OpenConnect supports multiple video providers to give facilities flexibility in choosing their preferred platform. Each provider has its own strengths and configuration requirements.

## Supported Providers

### 1. Twilio Video
#### Features
- Robust infrastructure with global presence
- Comprehensive APIs and SDKs
- Strong security features
- Detailed analytics and monitoring
- Recording capabilities

#### Configuration
Environment Variables:
```
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_API_KEY_SID=your_api_key_sid
TWILIO_API_KEY_SECRET=your_api_key_secret
```

#### Limitations
- Higher costs compared to other providers
- Complex pricing structure
- Less deployment flexibility

### 2. Daily.co
#### Features
- WebRTC-focused platform
- Simple pricing model
- Good documentation
- Custom deployment options
- Easy integration

#### Configuration
Environment Variables:
```
DAILY_API_KEY=your_api_key
```

#### Limitations
- Smaller company
- Limited enterprise features
- Geographic presence limitations

### 3. Google Meet
#### Features
- Familiar user interface
- Reliable infrastructure
- Good browser support
- Regular updates
- Built-in recording

#### Configuration
Environment Variables:
```
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REFRESH_TOKEN=your_refresh_token
```

#### Limitations
- Limited customization options
- Requires Google Workspace
- Less control over data
- Limited API access

## Security Configuration
All providers require additional security configuration:
```
SECURITY_MODULE_ENABLED=true
SECURITY_MODULE_API_KEY=your_security_module_key
SECURITY_MODULE_URL=http://security-module:8001
```

## Implementation Details

### Provider Factory
The `VideoProviderFactory` class manages provider instances:
```typescript
const provider = await VideoProviderFactory.create('twilio', config);
```

### Base Provider Class
All providers extend `BaseVideoProvider` which implements common functionality:
```typescript
abstract class BaseVideoProvider implements VideoProvider {
  // Common implementation details
}
```

### Provider-Specific Classes
Each provider has its own implementation class:
- `TwilioProvider`
- `DailyProvider`
- `GoogleMeetProvider`

## Testing
### Local Testing
1. Set up environment variables in `.env`
2. Run provider tests:
```bash
npm run test:providers
```

### Integration Testing
1. Configure provider credentials
2. Run integration tests:
```bash
npm run test:integration
```

## Troubleshooting

### Common Issues
1. Authentication Failures
   - Verify API keys and secrets
   - Check environment variables
   - Validate token expiration

2. Connection Issues
   - Check network connectivity
   - Verify firewall settings
   - Test provider status

3. Recording Problems
   - Verify security module configuration
   - Check storage permissions
   - Validate retention settings

### Provider-Specific Issues
#### Twilio
- Rate limiting: Implement proper backoff
- Room creation failures: Check account limits
- Recording issues: Verify storage configuration

#### Daily.co
- API key issues: Regenerate API key
- Room limits: Check account tier
- Connection problems: Test network conditions

#### Google Meet
- Authentication: Refresh OAuth tokens
- Meeting creation: Verify workspace permissions
- API limits: Check quota usage

## Best Practices
1. Error Handling
   - Implement proper error handling
   - Use provider-specific error codes
   - Add detailed logging

2. Security
   - Use secure environment variables
   - Implement proper encryption
   - Follow provider security guidelines

3. Performance
   - Monitor resource usage
   - Implement proper cleanup
   - Follow provider best practices
