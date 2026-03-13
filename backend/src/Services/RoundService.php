<?php

declare(strict_types=1);

namespace App\Services;

final class RoundService
{
    public function contenderBonus(int $submissionCountForTarget): int
    {
        return $submissionCountForTarget > 1 ? 1 : 2;
    }
}
