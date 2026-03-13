<?php

declare(strict_types=1);

namespace App\Actions;

use App\Repositories\CharacterRepository;
use App\Repositories\RelationshipRepository;
use App\Repositories\ReputationRepository;
use App\Repositories\ResultRepository;
use App\Repositories\RoundRepository;
use App\Repositories\RumorRepository;
use App\Repositories\SubmissionRepository;
use App\Services\ResolutionService;
use App\Services\SceneGenerationService;
use RuntimeException;

final class ResolveRoundAction
{
    public function __construct(
        private readonly RoundRepository $roundRepository,
        private readonly SubmissionRepository $submissionRepository,
        private readonly RelationshipRepository $relationshipRepository,
        private readonly ReputationRepository $reputationRepository,
        private readonly RumorRepository $rumorRepository,
        private readonly ResultRepository $resultRepository,
        private readonly CharacterRepository $characterRepository,
        private readonly ResolutionService $resolutionService,
        private readonly SceneGenerationService $sceneGenerationService
    ) {
    }

    public function execute(int $roundId): void
    {
        $round = $this->roundRepository->findById($roundId);
        if ($round === null) {
            throw new RuntimeException('Round not found.');
        }

        if ($round['status'] === 'resolved') {
            return;
        }

        $submissions = $this->submissionRepository->listByRound($roundId);
        $characters = $this->characterRepository->indexedById((int) $round['season_id']);
        $resolved = $this->resolutionService->resolveRound($round, $submissions, $characters);

        $this->roundRepository->beginTransaction();

        try {
            $this->roundRepository->markResolving($roundId);

            foreach ($resolved as $playerId => $outcome) {
                $relationship = $this->relationshipRepository->getOrCreate(
                    (int) $round['season_id'],
                    $playerId,
                    (int) $outcome['target_character_id']
                );
                $reputation = $this->reputationRepository->getOrCreate((int) $round['season_id'], $playerId);

                $this->relationshipRepository->applyOutcome(
                    (int) $relationship['id'],
                    $outcome['relationship_deltas'],
                    (int) $round['round_number']
                );

                $this->reputationRepository->applyOutcome((int) $reputation['id'], $outcome['reputation_deltas']);

                if ($outcome['rumor_text'] !== null) {
                    $this->rumorRepository->create((int) $round['season_id'], $roundId, $playerId, $outcome['rumor_text']);
                }

                $scene = $this->sceneGenerationService->generate($round, $outcome, $characters[(int) $outcome['target_character_id']] ?? null);
                $this->resultRepository->upsert($roundId, $playerId, $outcome, $scene);
            }

            $this->roundRepository->markResolved($roundId);
            $this->roundRepository->openNextRoundIfNeeded((int) $round['season_id'], (int) $round['round_number'] + 1);
            $this->roundRepository->commit();
        } catch (\Throwable $exception) {
            $this->roundRepository->rollBack();
            throw $exception;
        }
    }
}
