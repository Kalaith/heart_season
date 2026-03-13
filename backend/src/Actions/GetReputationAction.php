<?php

declare(strict_types=1);

namespace App\Actions;

use App\Repositories\ReputationRepository;

final class GetReputationAction
{
    public function __construct(private readonly ReputationRepository $reputationRepository)
    {
    }

    public function execute(int $seasonId, string $playerId): array
    {
        return $this->reputationRepository->getOrCreate($seasonId, $playerId);
    }
}
