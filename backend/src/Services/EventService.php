<?php

declare(strict_types=1);

namespace App\Services;

final class EventService
{
    public function getModifiers(string $eventType): array
    {
        return match ($eventType) {
            'intimate' => ['trust' => 2, 'sincerity' => 2, 'drama' => -1],
            'spectacle' => ['drama' => 3, 'public_image' => 1, 'scandal' => 1],
            default => ['public_image' => 1, 'trust' => 1, 'drama' => 1],
        };
    }
}
