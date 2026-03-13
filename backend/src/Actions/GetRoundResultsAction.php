<?php

declare(strict_types=1);

namespace App\Actions;

use App\Repositories\ResultRepository;
use App\Repositories\RoundRepository;

final class GetRoundResultsAction
{
    public function __construct(
        private readonly ResultRepository $resultRepository,
        private readonly RoundRepository $roundRepository
    ) {
    }

    public function execute(string $playerId, ?int $roundId = null): ?array
    {
        if ($roundId !== null) {
            return $this->resultRepository->findForPlayerAndRound($playerId, $roundId);
        }

        $round = $this->roundRepository->getLatestResolvedRound();
        if ($round === null) {
            return null;
        }

        return $this->resultRepository->findForPlayerAndRound($playerId, (int) $round['id']);
    }
}
