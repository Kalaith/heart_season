<?php

declare(strict_types=1);

namespace App\Actions;

use App\Repositories\RoundRepository;
use App\Repositories\SubmissionRepository;

final class GetSubmissionAction
{
    public function __construct(
        private readonly SubmissionRepository $submissionRepository,
        private readonly RoundRepository $roundRepository
    ) {
    }

    public function execute(string $playerId): ?array
    {
        $round = $this->roundRepository->getActiveRound();
        if ($round === null) {
            return null;
        }

        return $this->submissionRepository->findByRoundAndPlayer((int) $round['id'], $playerId);
    }
}
