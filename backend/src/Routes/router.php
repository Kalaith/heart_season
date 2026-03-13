<?php

declare(strict_types=1);

use App\Controllers\CastController;
use App\Controllers\ReputationController;
use App\Controllers\RoundController;
use App\Controllers\SeasonController;
use App\Controllers\SubmissionController;
use App\Controllers\SystemController;
use App\Middleware\WebHatcheryJwtMiddleware;

return static function (\App\Core\Router $router): void {
    $router->get('/api/health', [SystemController::class, 'health']);
    $router->get('/api/season/current', [SeasonController::class, 'current'], [WebHatcheryJwtMiddleware::class]);
    $router->get('/api/round/history', [RoundController::class, 'history'], [WebHatcheryJwtMiddleware::class]);
    $router->get('/api/round/results', [RoundController::class, 'results'], [WebHatcheryJwtMiddleware::class]);
    $router->get('/api/round/{id}/results', [RoundController::class, 'results'], [WebHatcheryJwtMiddleware::class]);
    $router->get('/api/round/current/submission', [SubmissionController::class, 'current'], [WebHatcheryJwtMiddleware::class]);
    $router->post('/api/round/current/submission', [SubmissionController::class, 'create'], [WebHatcheryJwtMiddleware::class]);
    $router->put('/api/round/current/submission', [SubmissionController::class, 'update'], [WebHatcheryJwtMiddleware::class]);
    $router->get('/api/cast', [CastController::class, 'index'], [WebHatcheryJwtMiddleware::class]);
    $router->get('/api/rumors', [CastController::class, 'rumors'], [WebHatcheryJwtMiddleware::class]);
    $router->get('/api/reputation', [ReputationController::class, 'current'], [WebHatcheryJwtMiddleware::class]);
    $router->post('/api/admin/rounds/resolve-due', [SystemController::class, 'resolveDueRounds']);
    $router->post('/api/admin/rounds/resolve-now', [SystemController::class, 'resolveCurrentRoundNow']);
};
