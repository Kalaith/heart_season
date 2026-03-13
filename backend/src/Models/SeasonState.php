<?php

declare(strict_types=1);

namespace App\Models;

final class SeasonState
{
    public function __construct(
        private readonly array $season,
        private readonly array $round,
        private readonly array $topCast,
        private readonly array $playerReputation,
        private readonly array $recentRumors
    ) {
    }

    public function toArray(): array
    {
        return [
            'season' => $this->season,
            'current_round' => $this->round,
            'featured_cast' => $this->topCast,
            'player_reputation' => $this->playerReputation,
            'recent_rumors' => $this->recentRumors,
        ];
    }
}
