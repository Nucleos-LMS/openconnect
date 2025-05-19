# LiveKit Migration Plan

This file captures the tactical steps for replacing the current Twilio-mock video layer with an open-source LiveKit stack that satisfies the requirements in docs/specs.
## Status Update (2025-05-19)
### Completed
- Redundant in-function LiveKit imports removed in `backend/app/routers/calls.py`; token generation now respects the dynamic `VIDEO_PROVIDER` at module load time.

### Pending – Milestone 1 (Backend & Local Setup)

1. Dependency Management
   - Add `livekit==0.0.2` to the Python dependencies:
     - Poetry: add to `pyproject.toml` under `[tool.poetry.dependencies]`:
       ```toml
       livekit = "0.0.2"
       ```
     - Or pip: include in `requirements.txt`:
       ```text
       livekit==0.0.2
       ```
   - Install with:
     ```bash
     yarn install   # frontend deps
     poetry install # backend deps (or pip install -r requirements.txt)
     ```

2. Backend Configuration
   - In `backend/app/config.py`, expose the LiveKit variables and default provider:
     ```python
     class Settings(BaseSettings):
         VIDEO_PROVIDER: str = "twilio"
         LIVEKIT_URL: HttpUrl
         LIVEKIT_API_KEY: str
         LIVEKIT_API_SECRET: str
     ```
   - Ensure these settings are loaded from environment variables.

3. Environment Example
   - Update `.env.example` at project root:
     ```env
     # LiveKit settings
     LIVEKIT_URL=https://your-livekit-server
     LIVEKIT_API_KEY=lk_api_key_here
     LIVEKIT_API_SECRET=lk_api_secret_here

     # Select video provider
     VIDEO_PROVIDER=livekit
     ```

4. Unit Tests
   - Create `backend/tests/test_livekit_provider.py`:
     - Mock `livekit.AccessToken` to return predictable tokens.
     - Toggle `VIDEO_PROVIDER` in test settings to `livekit`.
     - Assert generated token prefixes and payload claims.

5. Local LiveKit Server
   - Add `docker-compose.livekit.yml` to project root:
     ```yaml
     version: '3.7'
     services:
       livekit-server:
         image: livekit/livekit-server:latest
         ports:
           - "7880:7880"   # API & WebSocket port
           - "5349:5349"   # TURN port
         environment:
           LIVEKIT_KEYS: "${LIVEKIT_API_KEY}:${LIVEKIT_API_SECRET}"
     ```
   - Document startup steps in this plan and in `docs/providers/livekit-migration-plan.md`.

6. Front-end Integration Prep
   - Install the LiveKit client libraries:
     ```bash
     cd src
     yarn add livekit-client @livekit/react
     ```
   - Create a stub provider implementation at `src/providers/video/providers/livekit.ts` extending `BaseVideoProvider`.

7. Documentation Updates
   - Link to this plan from `docs/providers/README.md` under Supported Providers.
   - Add self-hosting instructions and cost considerations to `docs/providers/livekit-migration-plan.md`.



---
## 1. Why LiveKit?
| Requirement | LiveKit Fit |
|-------------|-------------|
| Open-source | AGPL-3 server / MIT client |
| SFU + TURN  | Built-in TURN, simulcast |
| End-to-end encryption | Insertable Streams supported |
| Recording   | Server-side egress API |
| React / TS SDK | @livekit/react |
| Moderation hooks | Webhooks + Server API |

---
## 2. Target Architecture
```
Browser (LiveKit JS SDK)
     │  wss
Next.js (VideoRoom) ──◄── FastAPI (/calls/join → JWT)
     │                      │
     └──►  LiveKit SFU  ◄───┘  /webhooks/livekit
```

---
## 3. Work Breakdown
### Backend
1. Add python package `livekit==0.0.2` (or latest).
2. `backend/app/providers/livekit.py` → `generate_room_token` using LiveKitAccessToken.
3. Import in `routers/calls.py` instead of Twilio stub.
4. Add `/webhooks/livekit` for participant & recording events.

### Infrastructure
* `docker-compose.livekit.yml` for local dev (ports 7880, 5349).
* Helm chart values in `deploy/`.
* Env vars: `LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`.

### Frontend
1. `yarn add livekit-client @livekit/react`.
2. `src/providers/video/providers/livekit.ts` implements `BaseVideoProvider`.
3. Factory picks `livekit` when env vars present.
4. `VideoRoom` uses `ParticipantView`, adds self-view & network indicator.

### Testing
* Jest unit tests for provider.
* Playwright E2E: two headless browsers join same room, assert track subscription.

---
## 4. Timeline (5-day sprint)
| Day | Deliverable |
|-----|-------------|
| 1 | LiveKit server up, token generation, provider skeleton |
| 2-3 | Join/leave working, UI renders remote track |
| 4 | Webhooks, recording trigger, CORS, env guards |
| 5 | E2E tests, docs, PR |

---
## 5. Risks & Mitigations
* Bandwidth spikes → enable simulcast & dynacast.
* AGPL obligations → internal/on-prem deployment is compliant.
* Firewall traversal → TURN enabled; fallback STUN list.
* Recording storage → S3/GCS bucket, rotation.

---
## 6. Definition of Done
✅ Resident & visitor complete a call via LiveKit.
✅ Recording stored and linked in DB.
✅ UI implements core components in specs.
✅ CI passes unit + E2E.
✅ Docs updated.
