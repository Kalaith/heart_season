<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\SeasonState;
use App\Repositories\CharacterRepository;
use App\Repositories\ReputationRepository;
use App\Repositories\RoundRepository;
use App\Repositories\RumorRepository;
use App\Repositories\SeasonRepository;

final class GetCurrentSeasonStateAction
{
    public function __construct(
        private readonly SeasonRepository $seasonRepository,
        private readonly RoundRepository $roundRepository,
        private readonly CharacterRepository $characterRepository,
        private readonly ReputationRepository $reputationRepository,
        private readonly RumorRepository $rumorRepository
    ) {
    }

    public function execute(string $playerId): array
    {
        $season = $this->seasonRepository->getCurrentSeason();
        $round = $this->roundRepository->getCurrentRound((int) $season['id']);

        return (new SeasonState(
            $season,
            $round,
            $this->characterRepository->listForSeason((int) $season['id']),
            $this->reputationRepository->getOrCreate((int) $season['id'], $playerId),
            $this->rumorRepository->listRecent((int) $season['id'])
        ))->toArray();
    }
}
