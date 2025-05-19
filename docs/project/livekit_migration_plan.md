# LiveKit Migration Plan

This file captures the tactical steps for replacing the current Twilio-mock video layer with an open-source LiveKit stack that satisfies the requirements in docs/specs.

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
