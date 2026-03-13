<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Actions\GetSubmissionAction;
use App\Actions\SubmitRoundPlanAction;
use App\Actions\UpdateRoundPlanAction;
use App\Core\Request;
use App\Core\Response;

final class SubmissionController
{
    public function __construct(
        private readonly GetSubmissionAction $getSubmissionAction,
        private readonly SubmitRoundPlanAction $submitAction,
        private readonly UpdateRoundPlanAction $updateAction
    ) {
    }

    public function current(Request $request, Response $response): void
    {
        $user = $request->getAttribute('auth_user');
        $response->success($this->getSubmissionAction->execute((string) $user['id']));
    }

    public function create(Request $request, Response $response): void
    {
        $user = $request->getAttribute('auth_user');
        $response->success(
            $this->submitAction->execute((string) $user['id'], $request->getBody()),
            'Round plan submitted.'
        );
    }

    public function update(Request $request, Response $response): void
    {
        $user = $request->getAttribute('auth_user');
        $response->success(
            $this->updateAction->execute((string) $user['id'], $request->getBody()),
            'Round plan updated.'
        );
    }
}
