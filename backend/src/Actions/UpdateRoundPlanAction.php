<?php

declare(strict_types=1);

namespace App\Actions;

use App\Repositories\RoundRepository;
use App\Repositories\SubmissionRepository;
use App\Services\IntentInterpreterService;
use RuntimeException;

final class UpdateRoundPlanAction
{
    public function __construct(
        private readonly RoundRepository $roundRepository,
        private readonly SubmissionRepository $submissionRepository,
        private readonly IntentInterpreterService $intentInterpreterService
    ) {
    }

    public function execute(string $playerId, array $payload): array
    {
        $round = $this->roundRepository->getActiveRound();
        if ($round === null) {
            throw new RuntimeException('No open round available.');
        }

        $existing = $this->submissionRepository->findByRoundAndPlayer((int) $round['id'], $playerId);
        if ($existing === null) {
            throw new RuntimeException('No submission exists for this round.');
        }

        $validated = [
            'target_character_id' => (int) ($payload['target_character_id'] ?? $existing['target_character_id']),
            'stance' => (string) ($payload['stance'] ?? $existing['stance']),
            'image_priority' => (string) ($payload['image_priority'] ?? $existing['image_priority']),
            'risk_tolerance' => (string) ($payload['risk_tolerance'] ?? $existing['risk_tolerance']),
            'rival_target_player_id' => $payload['rival_target_player_id'] ?? $existing['rival_target_player_id'],
            'special_move_key' => $payload['special_move_key'] ?? $existing['special_move_key'],
            'intent_text' => isset($payload['intent_text']) ? trim((string) $payload['intent_text']) : $existing['intent_text'],
        ];

        $validated['interpreted_intent_json'] = $this->intentInterpreterService->interpret(
            (string) ($validated['intent_text'] ?? ''),
            [
                'round' => $round,
                'player_id' => $playerId,
            ]
        );

        return $this->submissionRepository->update((int) $round['id'], $playerId, $validated);
    }
}
