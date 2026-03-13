<?php

declare(strict_types=1);

namespace App\Actions;

use App\Repositories\RoundRepository;

final class GetRoundHistoryAction
{
    public function __construct(private readonly RoundRepository $roundRepository)
    {
    }

    public function execute(): array
    {
        return $this->roundRepository->getHistory();
    }
}
