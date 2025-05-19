# LiveKit Integration PRD

## 1. Objective
Integrate LiveKit as a new video provider in OpenConnect to allow institutions to self-host low-latency real-time audio/video via WebRTC.

## 2. Background
Currently, OpenConnect supports Twilio, Daily.co, and Google Meet. LiveKit offers an open-source SFU with flexible deployment options and strong performance characteristics.

## 3. Scope
### In Scope (Milestone 1)
- Backend configuration via environment variables and Settings class.
- Local LiveKit server setup via Docker Compose.
- Documentation updates across `docs/` (configuration, migration plan, provider README, API specs).
- Backend unit tests for token generation.
- Frontend LiveKit provider stub with unit tests.
- API endpoint for token retrieval: `/api/video/token`.

### Out of Scope (Milestone 2+)
- Production deployment scripts and infrastructure as code.
- Server-side recording and storage.
- Transcription and live captions.
- Advanced moderation and analytics features.

## 4. User Personas
- **Admin**: Configures OpenConnect with provider environment variables and manages server.
- **Instructor**: Starts or joins live video sessions within the LMS interface.
- **Developer**: Integrates LiveKit in custom workflows via API and SDK.

## 5. User Stories
1. As an Admin, I want to set `VIDEO_PROVIDER=livekit` and related env vars so that I can spin up a local LiveKit server and run sessions.
2. As an Instructor, I want to click “Start Live Session” and have a LiveKit room created with a secure token so that attendees can join seamlessly.
3. As a Developer, I want to fetch a LiveKit token via a REST endpoint so that I can connect the front end programmatically.
4. As an Admin, I want to see clear documentation in the provider README and API specs so that I can configure production environments.

## 6. Functional Requirements
- FR1: Add `VIDEO_PROVIDER=livekit` option to `app/config.py` and factory.
- FR2: New env vars: `LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`.
- FR3: Implement `backend/app/providers/livekit.py` to generate JWT access tokens using the LiveKit SDK.
- FR4: Expose endpoint `GET /api/video/token?room={room}&user={user_id}` returning JSON `{ "token": "...", "url": "..." }`.
- FR5: Frontend stub implementing `VideoProvider` interface: `connect()`, `createRoom()`, `joinRoom()`, `leaveRoom()`.
- FR6: Tests for provider code in `backend/tests/test_livekit_provider.py` and `src/providers/video/providers/livekit/index.test.ts`.

## 7. Non-Functional Requirements
- NFR1: Token endpoint latency ≤ 200ms under typical load.
- NFR2: Tokens expire by default after TTL (configurable, e.g. `LIVEKIT_TOKEN_TTL_HOURS`).
- NFR3: Secure handling of API secrets; not logged or exposed.
- NFR4: Documentation coverage ≥ 95% for new code paths.

## 8. Dependencies
- Docker Compose for LiveKit server (ports 7880, 5349).
- Python LiveKit SDK `^0.2.5`.
- Frontend packages `livekit-client`, `@livekit/react`.

## 9. Timeline & Milestones
| Milestone | Description                                     | ETA    |
|-----------|-------------------------------------------------|--------|
| M1        | Backend config, local server, docs, tests, stub | Week 1 |
| M2        | Full token flow, frontend integration, E2E      | Week 2 |
| M3        | Production deployment, monitoring, recording    | Week 3 |

## 10. Acceptance Criteria
- [ ] Admin can configure LiveKit locally and start server via Docker Compose.
- [ ] `/api/video/token` returns a valid JWT and correct URL.
- [ ] Frontend stub can call the token endpoint and pass token to LiveKit client.
- [ ] Documentation updated in `docs/` and passes markdown lint checks.
- [ ] Unit tests for backend and frontend pass.

## 11. Success Metrics
- 100% test coverage for LiveKit provider modules.
- Token endpoint error rate < 1% in staging.
- Adoption by at least 25% of pilot institutions within first quarter.

## 12. Risks & Mitigations
- **Risk:** JWT secret leakage → **Mitigation:** Leverage env vars and secure vaults, do not log secrets.
- **Risk:** Version mismatch between server and SDK → **Mitigation:** Pin SDK version in lock files; document compatibility.
- **Risk:** Operational complexity for self-hosting → **Mitigation:** Provide managed LiveKit guidance and hosted options.

## 13. Next Steps
1. Implement backend token endpoint and integrate with provider factory.
2. Develop frontend LiveKit provider and integrate into UI.
3. Write end-to-end integration tests and update CI pipelines.
4. Provide Helm charts or Terraform modules for production deployment.
