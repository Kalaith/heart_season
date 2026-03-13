# Heart Season Implementation Plan

## Overview

Heart Season should be implemented as a Web Hatchery multiplayer web game with a React/TypeScript frontend and a PHP backend. The core product loop is asynchronous round submission: players set high-level romantic and social intent during an open planning window, the backend locks submissions at the round deadline, a shared resolution job simulates the episode, AI generates scene prose from structured outcomes, and players return to read the results and prepare for the next round.

The implementation must treat AI as a presentation and interpretation layer, not the source of truth. Game state, relationship math, reputation changes, eligibility checks, and round timing must be deterministic and stored in the backend. The AI should convert player intent into normalized action inputs and convert resolved outcomes into readable dramatic scenes.

## Product Goals

- Deliver a shared social romance simulation where all players influence the same episode timeline.
- Preserve fairness through fixed round deadlines and server-side resolution.
- Make AI output coherent by grounding it in structured simulation data.
- Follow Web Hatchery standards for auth, architecture, persistence, and frontend state.
- Support future expansion into new seasons, love interests, events, and special moves without rewriting the core round engine.

## Core Gameplay Loop

### Round Flow
1. A new round opens with a theme, event, and deadline.
2. Each player reviews her current relationships, rumors, reputation, and available special moves.
3. The player submits a high-level plan:
   - target love interest
   - social stance
   - image priority
   - risk tolerance
   - optional rival target
   - one special move
   - free-text intent for AI interpretation
4. The backend stores the submission and allows edits until the lock time.
5. At the round deadline, the backend closes the round and runs a single resolution pipeline.
6. The simulation computes interactions, conflicts, interruptions, rumor spread, chemistry gains, jealousy spikes, and public image changes for all players.
7. AI generates personalized scene summaries plus a shared episode recap from structured resolution data.
8. Players read outcomes, inspect stat changes, and prepare for the next round.

### Timing Model
- Default cadence: one round every 12 or 24 hours.
- All round timing is server-controlled and stored in UTC.
- Frontend only displays countdowns and lock states; it never decides whether a round is open.
- Missed rounds should default to a safe passive intent such as "maintain image and avoid conflict."

## Technical Architecture

### WebHatchery Design Decisions To Reuse

Heart Season should not invent a new app skeleton. It should follow existing patterns already proven in other WebHatchery projects:

- `dragons_den/backend/public/index.php`: use parent-directory autoloader discovery, explicit `.env` loading, base-path detection for subdirectory deployment, and centralized route bootstrap.
- `dragons_den/backend/src/Middleware/WebHatcheryJwtMiddleware.php`: return a consistent `401` payload with `login_url`, validate bearer tokens server-side, and attach normalized auth user data to the request.
- `blacksmith_forge/backend/src/utils/ContainerConfig.php`: use container-managed construction for repositories, services, and controllers so action wiring stays explicit and testable.
- `mytherra/backend/src/commands/GameLoopWorker.php`: use a worker or scheduled loop pattern for server-driven progression instead of tying round resolution to player page requests.
- `blacksmith_forge/frontend/src/api/apiClient.ts`: centralize Axios setup, attach bearer tokens in one place, and persist `login_url` into shared auth storage on `401`.
- `dragons_den/frontend/src/stores/authStore.ts`: treat `auth-storage` as the source of frontpage session state and avoid local login flows.

## Frontend

### Stack
- React 19
- Vite
- TypeScript strict mode
- Zustand with `persist`
- React Router
- Axios with centralized interceptors
- Tailwind CSS
- Framer Motion

### Frontend Structure
```text
src/
├── api/
├── components/
│   ├── dashboard/
│   ├── round/
│   ├── results/
│   ├── social/
│   └── ui/
├── hooks/
├── stores/
├── types/
├── data/
└── utils/
```

### Main Screens
- Season dashboard: current round, countdown, player standing, featured event.
- Planning screen: intent builder, free-text goal input, available special moves, submission status.
- Results screen: AI-written scene, structured stat deltas, rumor and reputation feed.
- Cast screen: love interests, rivals, friendships, hidden preference clues.
- Episode history: prior rounds, recaps, and major turning points.
- Auth prompt surface: visible login URL from API 401 responses, with no local auth page or redirects.

### Frontend Routing
- `/`: season dashboard and current round summary.
- `/plan`: round submission builder.
- `/results`: latest round result for the logged-in player.
- `/history`: previous rounds and episode archive.
- `/cast`: love interests, rival summaries, and discovered traits.
- `/profile`: player reputation, labels, milestones, and season standing.

The route layout should stay shallow like other WebHatchery games. Major game modes get top-level routes; deeply nested route trees are unnecessary for MVP.

### Frontend State
- `useAuthStore`: shared user/token/login URL handling with `persist`.
- `useGameStore`: season metadata, current round, player stats, relationship summaries, latest results.
- `useRoundStore`: local draft intent, submission status, lock countdown, validation errors.
- `useUiStore`: modal, toast, filters, selected cast member.

The frontend should poll or refresh round state on a reasonable cadence. Real-time sockets are optional for later phases, not required for MVP.

### Recommended Frontend File Plan
```text
frontend/
├── src/
│   ├── api/
│   │   ├── apiClient.ts
│   │   ├── types.ts
│   │   └── services/
│   │       ├── season.ts
│   │       ├── rounds.ts
│   │       ├── submissions.ts
│   │       ├── cast.ts
│   │       └── reputation.ts
│   ├── components/
│   │   ├── dashboard/
│   │   ├── round/
│   │   ├── results/
│   │   ├── cast/
│   │   ├── reputation/
│   │   ├── layout/
│   │   └── ui/
│   ├── hooks/
│   │   ├── useAuthBootstrap.ts
│   │   ├── useRoundCountdown.ts
│   │   ├── useCurrentRound.ts
│   │   └── useRoundSubmission.ts
│   ├── pages/
│   │   ├── DashboardPage.tsx
│   │   ├── PlanningPage.tsx
│   │   ├── ResultsPage.tsx
│   │   ├── HistoryPage.tsx
│   │   ├── CastPage.tsx
│   │   └── ProfilePage.tsx
│   ├── stores/
│   │   ├── authStore.ts
│   │   ├── gameStore.ts
│   │   ├── roundStore.ts
│   │   └── uiStore.ts
│   ├── styles/
│   ├── types/
│   └── utils/
└── package.json
```

### Frontend UX Decisions
- Mirror `dragons_den` and `blacksmith_forge` by keeping a single main dashboard shell with tab or nav-based movement between key modes.
- Use server-backed stores for canonical state. Local store state should mainly cache, draft, and coordinate UI.
- Keep the intent builder structured first and free-text second. This matches the WebHatchery preference for data-driven state over prompt-only interaction.
- Follow the same centralized auth bootstrap pattern used in `dragons_den`: detect stored auth, react to `401`, and surface the login URL without redirecting.

## Backend

### Stack
- PHP 8.1+
- Raw PDO repositories
- Thin controllers
- Action classes for all business workflows
- Shared Web Hatchery auth validation
- MySQL or MariaDB

### Backend Structure
```text
backend/
├── public/
├── src/
│   ├── Actions/
│   ├── Controllers/
│   ├── Models/
│   ├── Repositories/
│   ├── Services/
│   ├── Middleware/
│   └── Support/
└── tests/
```

### Recommended Backend File Plan
```text
backend/
├── composer.json
├── phpunit.xml
├── public/
│   ├── .htaccess
│   └── index.php
├── scripts/
│   ├── init-database.php
│   └── resolve-due-rounds.php
├── src/
│   ├── Actions/
│   │   ├── GetCurrentSeasonStateAction.php
│   │   ├── SubmitRoundPlanAction.php
│   │   ├── UpdateRoundPlanAction.php
│   │   ├── GetRoundResultsAction.php
│   │   ├── OpenNextRoundAction.php
│   │   └── ResolveRoundAction.php
│   ├── Controllers/
│   │   ├── SeasonController.php
│   │   ├── RoundController.php
│   │   ├── SubmissionController.php
│   │   ├── CastController.php
│   │   ├── ReputationController.php
│   │   └── SystemController.php
│   ├── Models/
│   ├── Repositories/
│   ├── Services/
│   ├── Middleware/
│   ├── Routes/
│   └── Support/
└── tests/
```

### Backend Bootstrap Decisions
- Copy the parent autoloader search pattern from `dragons_den/backend/public/index.php` so preview and nested deployment paths work without local vendor duplication.
- Keep routing file-driven with a single route registration file.
- Use a DI container or explicit bootstrap wiring similar to `blacksmith_forge` so controllers do not instantiate repositories or services directly.
- Put round resolution behind a CLI script or worker entry point instead of an interactive admin-only browser endpoint.

### Required Backend Services
- `RoundService`: open/close rounds, schedule windows, lock submissions.
- `GeminiClientService`: shared low-level Gemini HTTP client for structured AI calls.
- `IntentInterpreterService`: normalize player free-text intent into structured tags.
- `ResolutionService`: process all submissions for a round and compute authoritative outcomes.
- `SceneGenerationService`: generate player-facing prose from resolved data.
- `RelationshipService`: calculate attraction, trust, chemistry, comfort, respect, jealousy.
- `ReputationService`: resolve public image, gossip, labels, scandals, and visibility.
- `EventService`: define episode events, special move availability, and scripted beats.
- `AuthTokenService`: validate shared Web Hatchery bearer tokens.

### Required Repositories
- `SeasonRepository`
- `RoundRepository`
- `RoundEventRepository`
- `SubmissionRepository`
- `RoundResultRepository`
- `CharacterRepository`
- `RelationshipRepository`
- `ReputationRepository`
- `RumorRepository`
- `SpecialMoveRepository`
- `AiLogRepository`

Each repository should stay close to the `blacksmith_forge` and `mytherra` pattern: raw PDO, prepared statements, model mapping helpers, and no business rules beyond persistence.

## AI Design

### Gemini API Provider Pattern

Heart Season should use the same direct Gemini integration pattern already proven in `thread/backend/src/Services/GeminiService.php` and `thread/backend/src/Services/ThreadExtractionService.php`, but wrapped in Heart Season-specific services and validation.

- Provider: Google Gemini API over direct HTTPS via cURL from the PHP backend.
- Environment variable: `GEMINI_API_KEY`.
- Recommended endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`
- Invocation pattern: `POST` JSON to the endpoint with `?key={$apiKey}` appended.
- Default response format: request JSON output with `generationConfig.response_mime_type = application/json`.
- Development behavior: allow the same local SSL bypass pattern used in Thread only for explicit development environments if local certificates are a blocker.

The backend should fail fast on missing `GEMINI_API_KEY` when AI features are enabled. If the product must stay partially playable without Gemini, fail closed for AI generation but keep deterministic resolution intact and return fallback interpretation or prose.

### AI Responsibilities
- Interpret optional player free-text into normalized intent hints.
- Produce scene prose after simulation.
- Produce episode recap copy.
- Optionally generate flavor text for rumors, ceremonies, and confessionals.

### AI Non-Responsibilities
- No direct writes to canonical game state.
- No authority over stat values or rule exceptions.
- No unbounded prompt-only gameplay.
- No direct player-to-player messaging or unsupervised social simulation.

### AI Resolution Pattern
1. Player submits structured choices plus optional free-text request.
2. `IntentInterpreterService` sends only the free-text and relevant current context to AI.
3. AI returns a constrained JSON response:
   - inferred tone
   - inferred objective
   - inferred fallback action
   - risk posture
   - confidence
4. Backend validates the response against allowed enums.
5. `ResolutionService` combines player-selected controls with validated AI hints.
6. Deterministic simulation runs.
7. `SceneGenerationService` sends structured round outcomes to AI for prose generation.
8. Backend stores both structured outcome and generated text.

### Gemini Request Design

Heart Season should keep the Thread pattern of building one explicit prompt string and wrapping it in the Gemini `contents` payload:

```json
{
  "contents": [
    {
      "parts": [
        {
          "text": "Prompt text here"
        }
      ]
    }
  ],
  "generationConfig": {
    "response_mime_type": "application/json"
  }
}
```

Use one shared `GeminiClientService` to handle:

- API key lookup from `$_ENV`, `$_SERVER`, or `getenv()`
- cURL setup and JSON encoding
- HTTP status validation
- JSON decoding of both Gemini envelope and model-returned JSON text
- centralized error messages and logging

Then keep product-specific prompt construction in higher-level services:

- `IntentInterpreterService` for free-text intent normalization
- `SceneGenerationService` for per-player scene prose
- `EpisodeRecapService` or recap methods inside `SceneGenerationService` for shared episode recap generation

### Gemini Output Contracts

Heart Season should keep Gemini outputs narrow and validator-friendly.

For intent interpretation, require JSON only with keys such as:

- `tone`
- `objective`
- `fallback_action`
- `risk_posture`
- `confidence`
- `tags`

For scene generation, prefer structured JSON over raw prose-only responses, for example:

- `scene_text`
- `private_notes_text`
- `public_recap_text`
- `content_flags`

This keeps backend validation simple and allows deterministic fallback copy if a field is missing or malformed.

### Guardrails
- Require JSON schema validation on AI responses.
- Clamp all AI-derived values to allowed game ranges.
- Persist prompts and responses for debugging and moderation.
- Provide deterministic fallback text if AI generation fails.
- Rate-limit AI calls per round by batching shared recap generation.
- Never let Gemini write directly to round state, relationship stats, reputation stats, or rumor creation without backend validation.
- Log HTTP failures, malformed JSON, and validation rejects separately so simulation success is distinguishable from prose-generation failure.

### Gemini Failure Strategy

Use the Thread fallback philosophy, but adapt it for Heart Season's stricter game loop:

- If intent interpretation fails, continue with only the player's structured selections and a deterministic default interpretation.
- If scene generation fails, store structured results anyway and render templated fallback prose.
- If shared recap generation fails, keep the round marked `resolved` and attach a deterministic summary generated from structured outcome data.
- Record each failure in `ai_logs` with provider, purpose, prompt hash, round id, player id nullable, status, and raw error details.

## Data Model

### Core Tables
- `users`
- `seasons`
- `season_players`
- `rounds`
- `round_events`
- `player_round_submissions`
- `player_round_results`
- `characters`
- `player_character_states`
- `relationship_states`
- `reputation_states`
- `rumors`
- `special_moves`
- `ai_logs`

### Key Entities

#### Season
- id
- name
- status
- theme
- current_round_number
- starts_at
- ends_at

#### Round
- id
- season_id
- round_number
- event_name
- event_type
- opens_at
- locks_at
- resolved_at
- status

#### Player Round Submission
- id
- round_id
- player_id
- target_character_id
- stance
- image_priority
- risk_tolerance
- rival_target_player_id nullable
- special_move_id nullable
- intent_text nullable
- interpreted_intent_json nullable
- submitted_at

#### Relationship State
- id
- season_id
- player_id
- character_id
- attraction
- trust
- chemistry
- comfort
- respect
- jealousy
- last_interaction_round

#### Reputation State
- id
- season_id
- player_id
- public_image
- drama
- elegance
- sincerity
- reliability
- scandal
- dominant_label

#### Player Round Result
- id
- round_id
- player_id
- structured_outcome_json
- scene_text
- private_notes_text
- public_recap_text
- created_at

### Schema Decisions
- Store scalar stats in relational columns for querying and balancing.
- Store AI artifacts and detailed per-round outcomes in JSON columns to avoid excessive table fragmentation.
- Keep long-lived state tables separate from per-round event tables.
- Use composite unique constraints for season-scoped state, such as one relationship state per `season_id + player_id + character_id`.

### Suggested Initial SQL Shape
```sql
CREATE TABLE seasons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    theme VARCHAR(120) NOT NULL,
    status VARCHAR(32) NOT NULL,
    current_round_number INT NOT NULL DEFAULT 0,
    starts_at DATETIME NOT NULL,
    ends_at DATETIME NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
);

CREATE TABLE rounds (
    id INT AUTO_INCREMENT PRIMARY KEY,
    season_id INT NOT NULL,
    round_number INT NOT NULL,
    event_name VARCHAR(120) NOT NULL,
    event_type VARCHAR(64) NOT NULL,
    status VARCHAR(32) NOT NULL,
    resolution_seed VARCHAR(64) NOT NULL,
    opens_at DATETIME NOT NULL,
    locks_at DATETIME NOT NULL,
    resolved_at DATETIME NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    UNIQUE KEY uq_round_number (season_id, round_number),
    CONSTRAINT fk_rounds_season FOREIGN KEY (season_id) REFERENCES seasons(id)
);

CREATE TABLE player_round_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    round_id INT NOT NULL,
    player_id VARCHAR(64) NOT NULL,
    target_character_id INT NOT NULL,
    stance VARCHAR(32) NOT NULL,
    image_priority VARCHAR(32) NOT NULL,
    risk_tolerance VARCHAR(32) NOT NULL,
    rival_target_player_id VARCHAR(64) NULL,
    special_move_id INT NULL,
    intent_text TEXT NULL,
    interpreted_intent_json JSON NULL,
    submitted_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    UNIQUE KEY uq_round_player_submission (round_id, player_id),
    CONSTRAINT fk_submission_round FOREIGN KEY (round_id) REFERENCES rounds(id)
);

CREATE TABLE relationship_states (
    id INT AUTO_INCREMENT PRIMARY KEY,
    season_id INT NOT NULL,
    player_id VARCHAR(64) NOT NULL,
    character_id INT NOT NULL,
    attraction INT NOT NULL DEFAULT 0,
    trust INT NOT NULL DEFAULT 0,
    chemistry INT NOT NULL DEFAULT 0,
    comfort INT NOT NULL DEFAULT 0,
    respect INT NOT NULL DEFAULT 0,
    jealousy INT NOT NULL DEFAULT 0,
    last_interaction_round INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    UNIQUE KEY uq_relationship_state (season_id, player_id, character_id)
);

CREATE TABLE reputation_states (
    id INT AUTO_INCREMENT PRIMARY KEY,
    season_id INT NOT NULL,
    player_id VARCHAR(64) NOT NULL,
    public_image INT NOT NULL DEFAULT 0,
    drama INT NOT NULL DEFAULT 0,
    elegance INT NOT NULL DEFAULT 0,
    sincerity INT NOT NULL DEFAULT 0,
    reliability INT NOT NULL DEFAULT 0,
    scandal INT NOT NULL DEFAULT 0,
    dominant_label VARCHAR(64) NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    UNIQUE KEY uq_reputation_state (season_id, player_id)
);

CREATE TABLE player_round_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    round_id INT NOT NULL,
    player_id VARCHAR(64) NOT NULL,
    structured_outcome_json JSON NOT NULL,
    scene_text MEDIUMTEXT NOT NULL,
    private_notes_text TEXT NULL,
    public_recap_text TEXT NULL,
    created_at DATETIME NOT NULL,
    UNIQUE KEY uq_round_player_result (round_id, player_id),
    CONSTRAINT fk_result_round FOREIGN KEY (round_id) REFERENCES rounds(id)
);
```

## Resolution Rules

### Deterministic Simulation First
The round resolver should calculate outcomes in layers:

1. Validate all locked submissions.
2. Apply event modifiers for the current round.
3. Score private success chance for each player intent.
4. Detect contested targets where multiple players pursue the same character.
5. Resolve interruptions, rivalry effects, gossip opportunities, and social visibility.
6. Apply relationship changes.
7. Apply reputation and rumor changes.
8. Trigger milestone checks.
9. Store structured results.
10. Generate prose.

### Outcome Factors
- target compatibility and hidden preferences
- player reputation and recent rumors
- chosen stance versus current emotional context
- special move availability and event fit
- rivalry collisions
- prior round momentum
- jealousy propagation from overlapping pursuits
- round-specific scripted twists

### Fairness Rules
- All round submissions use the same lock timestamp.
- Resolution runs once per round, not per player request.
- Randomness should come from seeded server-side values stored with the round.
- Tie-breaking rules must be explicit and testable.

### Baseline Tie-Break Order
1. Higher chemistry with the target.
2. Better event fit for the chosen special move.
3. Lower active scandal if the event is public.
4. Higher sincerity for intimate events or higher drama for spectacle events.
5. Stored seeded random roll for the round.

## API Design

### Auth
All endpoints require shared Web Hatchery bearer auth unless explicitly public. Unauthenticated requests must return `401` with:

```json
{
  "success": false,
  "error": "Authentication required",
  "login_url": "https://<web-hatchery-login-url>"
}
```

### Suggested Endpoints

#### Season and Round
- `GET /api/season/current`
- `GET /api/round/current`
- `GET /api/round/history`
- `GET /api/round/{id}/results`

#### Submission
- `GET /api/round/current/submission`
- `POST /api/round/current/submission`
- `PUT /api/round/current/submission`

#### Social Data
- `GET /api/cast`
- `GET /api/relationships`
- `GET /api/reputation`
- `GET /api/rumors`

#### Admin or Cron
- `POST /api/admin/rounds/open-next`
- `POST /api/admin/rounds/{id}/resolve`

Controllers should remain thin and delegate to actions such as:
- `SubmitRoundPlanAction`
- `UpdateRoundPlanAction`
- `ResolveRoundAction`
- `GetCurrentSeasonStateAction`

### API Response Pattern
Follow the common WebHatchery response shape:

```json
{
  "success": true,
  "data": {},
  "message": "Optional message"
}
```

Runtime response DTOs and API error objects should be classes on the frontend if imported as values, matching the frontend export standard.

## Scheduling and Round Execution

### Execution Model
- A scheduled server job should check for rounds whose `locks_at` has passed and `status = open`.
- The resolver marks the round as `resolving`, processes all submissions, stores results, then marks it `resolved`.
- After successful resolution, the backend creates or opens the next round.

### Recommended Round Worker Pattern
- For MVP, implement `scripts/resolve-due-rounds.php` and run it on a fixed cron cadence.
- If throughput increases, move to a queue-backed worker model inspired by `mytherra/backend/src/commands/GameLoopWorker.php`.
- Keep the resolver stateless between runs; all progression state must live in the database.

### Operational Requirements
- Round resolution must be idempotent.
- Use DB transactions around state mutation.
- Use a resolution lock to prevent duplicate execution.
- Log failures and retain partial AI generation errors separately from simulation success.

### Example Resolution Pipeline
1. Select all open rounds with `locks_at <= NOW()`.
2. Acquire a DB-backed resolution lock.
3. Mark the round `resolving`.
4. Load submissions, relationships, reputation, rumors, and event config.
5. Run deterministic simulation.
6. Persist all state changes and round results in one transaction.
7. Commit transaction.
8. Generate AI recap and player scenes.
9. Persist AI text and logs.
10. Mark the round `resolved`.
11. Open the next round.

## Frontend Experience Details

### Planning UI
- Use structured selectors for the main intent choices.
- Keep free-text intent optional and clearly framed as a nuance input, not a raw prompt box.
- Show round deadline and submission lock state prominently.
- Surface likely consequences as directional hints, not guarantees.

### Results UI
- Show AI-written scene first for emotional payoff.
- Show structured deltas immediately below:
  - attraction up or down
  - trust up or down
  - chemistry up or down
  - jealousy triggered
  - rumor created
  - public image change
- Distinguish public episode recap from private internal outcome.

### Accessibility and Responsiveness
- Desktop-first dashboard with solid mobile support.
- Cards and panels should stack cleanly on smaller screens.
- Animations should support reduced-motion preferences.

## Security and Moderation

- Sanitize and length-limit free-text intent.
- Moderate AI prompts and outputs for harassment, explicit sexual content, and abuse.
- Store audit logs for AI interpretation and output generation.
- Never expose hidden preference formulas directly to the client.
- Enforce server-side ownership checks on all player data endpoints.

## MVP Scope

### Include
- One season format
- Shared round cadence
- 4 to 6 love interests
- Basic rival collision rules
- Core relationship stats
- Public image and rumors
- One optional free-text intent field interpreted by AI
- AI-generated round scene and recap
- Episode history
- Cron-driven round resolution
- Admin-only manual resolve endpoint for recovery

### Exclude For Initial Release
- Real-time chat
- Fully player-authored dialogue
- Voice generation
- Live PvP interaction
- Multiple concurrent seasons per player
- Advanced matchmaking
- Complex alliance contracts

## Delivery Phases

### Phase 1: Foundation
- Scaffold frontend and backend to Web Hatchery standards.
- Implement shared auth integration.
- Build season, round, submission, and relationship schema.
- Create current round dashboard and submission flow.
- Mirror `dragons_den` auth/bootstrap patterns and `blacksmith_forge` API client structure from the start.

### Phase 2: Deterministic Resolver
- Implement event definitions and resolution engine.
- Add contested target, jealousy, rumor, and reputation logic.
- Persist structured round results.
- Add tests for rule correctness and tie cases.
- Add cron or worker entry point for resolving due rounds.

### Phase 3: AI Integration
- Add constrained intent interpretation.
- Add scene generation from structured results.
- Add fallbacks, schema validation, and AI logging.

### Phase 4: Content and Polish
- Add more events, special moves, and milestone moments.
- Improve result presentation and episode history.
- Tune balance values using playtest data.

## Testing Strategy

### Backend
- Unit tests for actions and services.
- Repository tests against a test database.
- Resolution tests for multi-player contention cases.
- Idempotency tests for the round resolver.
- Auth tests for 401 payload compliance.
- Bootstrap tests for autoloader and base-path-safe route registration.

### Frontend
- Component tests for planning and results screens.
- Store tests for persistence and auth state handling.
- API integration tests for submission and result loading.
- Type-check, lint, and build in CI.
- Login URL handling tests for centralized `401` interception.

### Balance and Narrative QA
- Simulate large batches of rounds with seeded randomness.
- Review AI outputs against structured outcomes for consistency.
- Track frequency of dead-end romances, runaway leaders, and excessive scandal loops.

## Success Criteria

- Players can submit plans during an open round and receive outcomes after lock.
- A full round can resolve server-side without manual intervention.
- AI text consistently matches stored structured outcomes.
- Shared world competition creates visible rivalry without making late players irrelevant.
- The app follows Web Hatchery auth and architecture standards across both frontend and backend.

## Recommended First Build

The first implementation should prioritize a complete end-to-end loop over content breadth: one season, a small cast, one round every 24 hours, deterministic relationship logic, and AI-generated result scenes. If that loop is stable, additional events, cast members, and social complexity can be layered in safely without rewriting the core architecture.

## Build Checklist

### Backend Setup
- Create minimal `composer.json` with `start`, `test`, `cs-check`, and `cs-fix`.
- Add `public/index.php` with shared vendor discovery and `.env` fail-fast behavior.
- Add Web Hatchery JWT middleware with required `401` payload shape.
- Create route registration and thin controllers.
- Create repositories and actions for season, round, submission, and result flows.
- Add initial SQL schema and seed script for cast, events, and special moves.
- Add cron-safe resolver script.

### Frontend Setup
- Create Vite React TypeScript app with strict mode.
- Add centralized `apiClient.ts` with bearer token and `401` handling.
- Add Zustand stores for auth, game state, round draft, and UI state.
- Add dashboard, planning, results, cast, and history pages.
- Add route shell and auth bootstrap flow.
- Add typed API services for season, rounds, submissions, cast, and reputation.

### First End-To-End Vertical Slice
- Seed one season and one round event.
- Load current round in the dashboard.
- Submit and update a round plan.
- Resolve the round from the worker script.
- Load structured and AI-written results.
- Open the next round automatically.
