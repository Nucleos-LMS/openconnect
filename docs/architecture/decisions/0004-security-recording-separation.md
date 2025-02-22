# 4. Security Recording Module Separation

## Status
Proposed

## Context
The video platform needs to:
- Keep security recording features private/closed-source
- Maintain core platform as open-source
- Support pluggable security implementations
- Allow facilities to use custom recording solutions

## Decision
We will separate the security recording functionality into:

1. Open-Source Interface (Core Platform)
   - Define recording provider interface
   - Implement basic recording capabilities
   - Document integration points

2. Private Implementation (Separate Repo)
   - Implement advanced security features
   - AI monitoring capabilities
   - Custom recording storage
   - Facility-specific requirements

3. Integration Strategy
   - Use dependency injection for recording provider
   - Support multiple provider implementations
   - Clear separation of concerns

## Consequences
### Positive
- Clear separation of open/closed source
- Flexible security implementations
- Maintainable codebase
- Custom facility solutions

### Negative
- More complex deployment
- Additional repository management
- Integration testing challenges
- Documentation overhead

## Implementation
```typescript
// Core Platform (Open Source)
interface SecurityRecordingProvider {
  initialize(config: SecurityConfig): Promise<void>;
  startRecording(roomId: string): Promise<void>;
  stopRecording(roomId: string): Promise<void>;
  getRecordingStatus(roomId: string): Promise<RecordingStatus>;
}

// Private Implementation (Separate Repo)
class AdvancedSecurityProvider implements SecurityRecordingProvider {
  // Implementation details remain private
}
```
