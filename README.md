# Heart Season

Heart Season is a shared multiplayer romance drama set in a reality-TV-inspired villa where every player guides her own heroine through attraction, rivalry, gossip, and public perception.

The fantasy is not combat, empire building, or dungeon crawling. The goal is to survive an emotionally volatile season, build real chemistry with the right person, manage how the house sees you, and reach the finale with something stronger than a fling. Every round asks the same dangerous question: do you play sweet, strategic, chaotic, sincere, or some combination that only works until the next scandal hits?

## The Premise

Players live through a season of high-pressure romance in a shared social world. Everyone attends the same events, competes for the same attention, and leaves ripples in the same episode timeline. A private flirtation can become a public rumor. A careful image can crack after one reckless move. A promising connection can turn into jealousy the moment another player steps in.

Instead of selecting every line of dialogue, players choose high-level intent:

- who they want to pursue
- how they want to come across
- how much risk they are willing to take
- whether they want to protect their image or stir drama
- what kind of move they want to make this round

The game then resolves those intentions into scenes, social fallout, and stat changes.

## How a Round Feels

Heart Season plays in shared asynchronous episodes.

1. A new event opens, such as a party, challenge, ceremony, or private date opportunity.
2. Each player submits a plan for how her heroine wants to approach the round.
3. The season advances once the round closes.
4. The results come back as a dramatic scene plus the actual consequences underneath it.

One round might be a soft romantic breakthrough. The next might be sabotage, embarrassment, a rumor spiral, or a recoupling that changes the whole season.

## What You Are Managing

Under the prose, the game tracks a structured social simulation. Relationships and reputation matter. Chemistry can rise while trust falls. Public image can improve even while private bonds collapse. A player may become known as dependable, elegant, manipulative, sweet, reckless, or heartbreak-prone based on how she plays.

Core pressures include:

- attraction versus safety
- sincerity versus performance
- private connection versus public image
- loyalty versus temptation
- romance versus competition

The point is to make the story feel dramatic without becoming random. The scenes are expressive, but the consequences are earned.

## Why It Is Multiplayer

The shared season is the heart of the game. Other players are not background decoration. They create interruptions, steal momentum, trigger rumors, complicate pairings, and shift the emotional weather of the whole villa. The result is a romance sim where other people matter even when you are not online at the same moment.

## Current Experience

The current app is centered on the core season loop:

- a dashboard for the current round and season state
- a planning screen for submitting intent
- a results view for personal fallout
- cast, history, and profile pages for tracking the wider drama

## Development

This repository contains a React/TypeScript frontend and a PHP backend for the shared season simulation.

Frontend local workflow:

```bash
cd frontend
npm ci
npm run lint
npm run type-check
npm run test:run
npm run build
```

Backend structure and implementation notes live in [`implementation.md`](H:\WebHatchery\game_apps\heart_season\implementation.md), but the core design intent is simple: Heart Season is about steering a life through romance, pressure, and perception one episode at a time.
