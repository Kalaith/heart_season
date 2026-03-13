<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Actions\GetRoundHistoryAction;
use App\Actions\GetRoundResultsAction;
use App\Core\Request;
use App\Core\Response;

final class RoundController
{
    public function __construct(
        private readonly GetRoundHistoryAction $historyAction,
        private readonly GetRoundResultsAction $resultsAction
    ) {
    }

    public function history(Request $request, Response $response): void
    {
        $response->success($this->historyAction->execute());
    }

    public function results(Request $request, Response $response): void
    {
        $user = $request->getAttribute('auth_user');
        $roundId = $request->getParam('id');
        $response->success($this->resultsAction->execute((string) $user['id'], $roundId !== null ? (int) $roundId : null));
    }
}
