<?php

declare(strict_types=1);

namespace App\Actions;

use App\Repositories\RoundRepository;
use App\Repositories\SubmissionRepository;
use App\Services\IntentInterpreterService;
use RuntimeException;

final class SubmitRoundPlanAction
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

        if ($this->submissionRepository->findByRoundAndPlayer((int) $round['id'], $playerId) !== null) {
            throw new RuntimeException('Submission already exists for this round.');
        }

        $validated = $this->validate($payload);
        $validated['interpreted_intent_json'] = $this->intentInterpreterService->interpret(
            (string) ($validated['intent_text'] ?? ''),
            [
                'round' => $round,
                'player_id' => $playerId,
            ]
        );

        return $this->submissionRepository->create((int) $round['id'], $playerId, $validated);
    }

    private function validate(array $payload): array
    {
        foreach (['target_character_id', 'stance', 'image_priority', 'risk_tolerance'] as $field) {
            if (!isset($payload[$field]) || $payload[$field] === '') {
                throw new RuntimeException('Missing required field: ' . $field);
            }
        }

        return [
            'target_character_id' => (int) $payload['target_character_id'],
            'stance' => (string) $payload['stance'],
            'image_priority' => (string) $payload['image_priority'],
            'risk_tolerance' => (string) $payload['risk_tolerance'],
            'rival_target_player_id' => $payload['rival_target_player_id'] ?? null,
            'special_move_key' => $payload['special_move_key'] ?? null,
            'intent_text' => isset($payload['intent_text']) ? trim((string) $payload['intent_text']) : null,
        ];
    }
}
