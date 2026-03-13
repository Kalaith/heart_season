<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Actions\ResolveRoundAction;
use App\Core\Request;
use App\Core\Response;
use App\Repositories\RoundRepository;

final class SystemController
{
    public function __construct(
        private readonly ResolveRoundAction $resolveRoundAction,
        private readonly RoundRepository $roundRepository
    ) {
    }

    public function health(Request $request, Response $response): void
    {
        $response->success([
            'service' => 'heart-season-backend',
            'status' => 'ok',
        ]);
    }

    public function resolveDueRounds(Request $request, Response $response): void
    {
        $rounds = $this->roundRepository->findDueOpenRounds();
        foreach ($rounds as $round) {
            $this->resolveRoundAction->execute((int) $round['id']);
        }

        $response->success(['resolved_rounds' => count($rounds)]);
    }

    public function resolveCurrentRoundNow(Request $request, Response $response): void
    {
        $round = $this->roundRepository->getOpenRound();
        if ($round === null) {
            $response->success([
                'resolved_rounds' => 0,
                'message' => 'No open round available to resolve.',
            ]);
            return;
        }

        $this->resolveRoundAction->execute((int) $round['id']);

        $response->success([
            'resolved_rounds' => 1,
            'round_id' => (int) $round['id'],
            'round_number' => (int) $round['round_number'],
        ]);
    }
}
