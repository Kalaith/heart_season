<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Actions\GetCastAction;
use App\Actions\GetRumorsAction;
use App\Core\Request;
use App\Core\Response;
use App\Repositories\SeasonRepository;

final class CastController
{
    public function __construct(
        private readonly GetCastAction $castAction,
        private readonly GetRumorsAction $rumorsAction,
        private readonly SeasonRepository $seasonRepository
    ) {
    }

    public function index(Request $request, Response $response): void
    {
        $season = $this->seasonRepository->getCurrentSeason();
        $response->success($this->castAction->execute((int) $season['id']));
    }

    public function rumors(Request $request, Response $response): void
    {
        $season = $this->seasonRepository->getCurrentSeason();
        $response->success($this->rumorsAction->execute((int) $season['id']));
    }
}
