<?php

declare(strict_types=1);

namespace App\Actions;

use App\Repositories\RumorRepository;

final class GetRumorsAction
{
    public function __construct(private readonly RumorRepository $rumorRepository)
    {
    }

    public function execute(int $seasonId): array
    {
        return $this->rumorRepository->listRecent($seasonId);
    }
}
