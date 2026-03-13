<?php

declare(strict_types=1);

namespace App\Services;

final class ResolutionService
{
    public function __construct(
        private readonly EventService $eventService,
        private readonly RoundService $roundService
    ) {
    }

    public function resolveRound(array $round, array $submissions, array $characters): array
    {
        $targetCounts = [];
        foreach ($submissions as $submission) {
            $targetId = (int) $submission['target_character_id'];
            $targetCounts[$targetId] = ($targetCounts[$targetId] ?? 0) + 1;
        }

        $results = [];
        foreach ($submissions as $submission) {
            $targetId = (int) $submission['target_character_id'];
            $character = $characters[$targetId] ?? null;
            $interpretation = json_decode((string) ($submission['interpreted_intent_json'] ?? '{}'), true) ?? [];
            $eventModifiers = $this->eventService->getModifiers((string) $round['event_type']);
            $contested = ($targetCounts[$targetId] ?? 0) > 1;

            $chemistry = (($character['preferred_stance'] ?? '') === $submission['stance']) ? 3 : 1;
            $respect = (($character['preferred_image_priority'] ?? '') === $submission['image_priority']) ? 2 : 0;
            $trust = ((string) $submission['stance'] === 'gentle' || (string) ($interpretation['tone'] ?? '') === 'gentle') ? 2 : 0;
            $attraction = $this->roundService->contenderBonus((int) ($targetCounts[$targetId] ?? 1));
            $jealousy = $contested ? 2 : 0;
            $comfort = (string) $submission['risk_tolerance'] === 'low' ? 1 : 0;

            $publicImage = (int) ($eventModifiers['public_image'] ?? 0) + ((string) $submission['image_priority'] === 'glamour' ? 1 : 0);
            $drama = (int) ($eventModifiers['drama'] ?? 0) + ((string) $submission['risk_tolerance'] === 'high' ? 2 : 0);
            $elegance = ((string) $submission['stance'] === 'poised') ? 2 : 0;
            $sincerity = (int) ($eventModifiers['sincerity'] ?? 0) + ((string) $submission['image_priority'] === 'authenticity' ? 2 : 0);
            $reliability = ((string) $submission['risk_tolerance'] === 'low') ? 1 : 0;
            $scandal = (int) ($eventModifiers['scandal'] ?? 0) + ($contested ? 1 : 0);

            $dominantLabel = $drama >= 4 ? 'Headline Magnet' : ($sincerity >= 3 ? 'Heart-Forward' : 'Unreadable');
            $rumor = $contested ? 'Whispers spread that your target was not yours alone tonight.' : null;

            $results[$submission['player_id']] = [
                'player_id' => $submission['player_id'],
                'target_character_id' => $targetId,
                'stance' => $submission['stance'],
                'image_priority' => $submission['image_priority'],
                'risk_tolerance' => $submission['risk_tolerance'],
                'relationship_deltas' => [
                    'attraction' => $attraction,
                    'trust' => $trust,
                    'chemistry' => $chemistry,
                    'comfort' => $comfort,
                    'respect' => $respect,
                    'jealousy' => $jealousy,
                ],
                'reputation_deltas' => [
                    'public_image' => $publicImage,
                    'drama' => $drama,
                    'elegance' => $elegance,
                    'sincerity' => $sincerity,
                    'reliability' => $reliability,
                    'scandal' => $scandal,
                    'dominant_label' => $dominantLabel,
                ],
                'rumor_text' => $rumor,
                'interpretation' => $interpretation,
            ];
        }

        return $results;
    }
}
