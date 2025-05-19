# LiveKit Migration Plan

## Overview
The goal of this plan is to integrate LiveKit as a first-class video provider within OpenConnect, leveraging its low-latency WebRTC capabilities, built-in recording, and flexible deployment options. We will retain our existing provider abstraction to minimize impact on higher-level components.

## Objectives
- Add LiveKitProvider implementation and register it in the `VideoProviderFactory`.
- Expose configuration options (`LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_SECRET`) via environment variables.
- Update UI components (`VideoRoom`, `WaitingRoom`) to support LiveKit flows behind a feature flag.
- Ensure parity with existing providers in room creation, join/leave, error handling, and recording.
- Provide comprehensive tests (unit, integration, e2e) for LiveKit workflows.

## Migration Phases

### Phase 1: Service and SDK Setup
1. Provision a LiveKit server (self-hosted or cloud) and retrieve credentials.
2. Install backend SDK:
   ```bash
   npm install @livekit/server-sdk
   ```
3. Install frontend client and UI components:
   ```bash
   npm install livekit-client @livekit/components-react
   ```
4. Add new environment variables to `.env.example` and `docs/providers/configuration.md`:
   ```bash
   LIVEKIT_URL=<your_livekit_server_url>
   LIVEKIT_API_KEY=<api_key>
   LIVEKIT_SECRET=<api_secret>
   FEATURE_LIVEKIT=true  # Toggles LiveKit integration
   ```

### Phase 2: Provider Abstraction Integration
1. Update `VideoProviderFactory` to recognize `providerType === 'livekit'`.
2. Create `LiveKitProvider` class extending `BaseVideoProvider`:
   - `initialize(config: ProviderConfig)`
   - `createRoom(options: RoomOptions)`
   - `joinRoom(roomId: string, participant: Participant)`
   - `leaveRoom(roomId: string, participantId: string)`
3. Implement token generation and room lifecycle using `@livekit/server-sdk`.
4. Add error mappings to align with our existing error codes.

### Phase 3: Frontend Integration
1. Wrap LiveKit client calls in a new utility or hook (e.g., `useLiveKitRoom`).
2. Update `VideoRoom` to:
   - Connect via LiveKit client when feature flag is on.
   - Manage tracks (audio/video) and rendering with LiveKit React components.
   - Support screen sharing, recording indicators, and quick reactions.
3. Update `WaitingRoom` to call a new endpoint for LiveKit token and room creation.
4. Add feature-flag checks throughout the video UI (default remains existing providers).

### Phase 4: Testing Strategy
1. **Unit Tests**: Mock `@livekit/server-sdk` for `LiveKitProvider` methods.
2. **Integration Tests**: Spin up a local LiveKit server in CI (or use a lightweight mock) to validate token flows.
3. **E2E Tests**: Use Cypress or Playwright to simulate a full call lifecycle (create→join→leave) against a LiveKit endpoint.
4. Add tests to pipeline under `npm run test:providers` and `npm run test:integration`.

### Phase 5: Rollout & Monitoring
1. Gate LiveKit behind `FEATURE_LIVEKIT` flag in configuration.
2. Deploy to a staging environment; validate performance, stability, and error metrics.
3. Gradually roll out to select facilities; monitor metrics (latency, error rate) and user feedback.
4. Once stable, switch default `PROVIDER_TYPE` to `livekit` and deprecate legacy providers.

## Rollback Strategy
- Toggle `FEATURE_LIVEKIT=false` to instantly revert to the previous provider.
- Monitor logs for any uncaught errors; ensure fallback logic is robust.

## Timeline & Ownership
| Milestone                       | Owner         | ETA         |
|---------------------------------|---------------|-------------|
| Service provisioning            | DevOps Team   | 2025-06-01  |
| SDK integration & tests         | Backend Team  | 2025-06-10  |
| Frontend client integration     | Frontend Team | 2025-06-20  |
| Staging deployment & QA         | QA Team       | 2025-06-25  |
| Beta rollout & monitoring       | Dev Team      | 2025-07-05  |
| Full migration & default switch | Team Lead     | 2025-07-15  |

## Next Steps
1. Review this plan with stakeholders and adjust timelines.
2. Break down tasks in the project tracker under `docs/project/tasks`.
3. Kick off Phase 1 by provisioning LiveKit and adding env vars.