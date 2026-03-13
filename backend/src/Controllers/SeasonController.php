<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Actions\GetCurrentSeasonStateAction;
use App\Core\Request;
use App\Core\Response;

final class SeasonController
{
    public function __construct(private readonly GetCurrentSeasonStateAction $action)
    {
    }

    public function current(Request $request, Response $response): void
    {
        $user = $request->getAttribute('auth_user');
        $response->success($this->action->execute((string) $user['id']));
    }
}
