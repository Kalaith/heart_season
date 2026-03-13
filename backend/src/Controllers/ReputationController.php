<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Actions\GetReputationAction;
use App\Core\Request;
use App\Core\Response;
use App\Repositories\SeasonRepository;

final class ReputationController
{
    public function __construct(
        private readonly GetReputationAction $action,
        private readonly SeasonRepository $seasonRepository
    ) {
    }

    public function current(Request $request, Response $response): void
    {
        $user = $request->getAttribute('auth_user');
        $season = $this->seasonRepository->getCurrentSeason();
        $response->success($this->action->execute((int) $season['id'], (string) $user['id']));
    }
}
