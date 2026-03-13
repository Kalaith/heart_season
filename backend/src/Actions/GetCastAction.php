<?php

declare(strict_types=1);

namespace App\Actions;

use App\Repositories\CharacterRepository;

final class GetCastAction
{
    public function __construct(private readonly CharacterRepository $characterRepository)
    {
    }

    public function execute(int $seasonId): array
    {
        return $this->characterRepository->listForSeason($seasonId);
    }
}
