<?php

declare(strict_types=1);

namespace App\Core;

use App\Actions\GetCastAction;
use App\Actions\GetCurrentSeasonStateAction;
use App\Actions\GetRoundHistoryAction;
use App\Actions\GetRoundResultsAction;
use App\Actions\GetRumorsAction;
use App\Actions\GetSubmissionAction;
use App\Actions\GetReputationAction;
use App\Actions\ResolveRoundAction;
use App\Actions\SubmitRoundPlanAction;
use App\Actions\UpdateRoundPlanAction;
use App\Controllers\CastController;
use App\Controllers\ReputationController;
use App\Controllers\RoundController;
use App\Controllers\SeasonController;
use App\Controllers\SubmissionController;
use App\Controllers\SystemController;
use App\Repositories\AiLogRepository;
use App\Repositories\CharacterRepository;
use App\Repositories\RelationshipRepository;
use App\Repositories\ReputationRepository;
use App\Repositories\ResultRepository;
use App\Repositories\RoundRepository;
use App\Repositories\RumorRepository;
use App\Repositories\SeasonRepository;
use App\Repositories\SubmissionRepository;
use App\Services\EventService;
use App\Services\GeminiClientService;
use App\Services\IntentInterpreterService;
use App\Services\ResolutionService;
use App\Services\RoundService;
use App\Services\SceneGenerationService;
use PDO;
use RuntimeException;

final class ServiceFactory
{
    private ?PDO $db = null;

    public function create(string $class): object
    {
        return match ($class) {
            SeasonController::class => new SeasonController(
                new GetCurrentSeasonStateAction(
                    $this->createSeasonRepository(),
                    $this->createRoundRepository(),
                    $this->createCharacterRepository(),
                    $this->createReputationRepository(),
                    $this->createRumorRepository()
                )
            ),
            RoundController::class => new RoundController(
                new GetRoundHistoryAction($this->createRoundRepository()),
                new GetRoundResultsAction($this->createResultRepository(), $this->createRoundRepository())
            ),
            SubmissionController::class => new SubmissionController(
                new GetSubmissionAction($this->createSubmissionRepository(), $this->createRoundRepository()),
                new SubmitRoundPlanAction(
                    $this->createRoundRepository(),
                    $this->createSubmissionRepository(),
                    $this->createIntentInterpreterService()
                ),
                new UpdateRoundPlanAction(
                    $this->createRoundRepository(),
                    $this->createSubmissionRepository(),
                    $this->createIntentInterpreterService()
                )
            ),
            CastController::class => new CastController(
                new GetCastAction($this->createCharacterRepository()),
                new GetRumorsAction($this->createRumorRepository()),
                $this->createSeasonRepository()
            ),
            ReputationController::class => new ReputationController(
                new GetReputationAction($this->createReputationRepository()),
                $this->createSeasonRepository()
            ),
            SystemController::class => new SystemController(
                $this->createResolveRoundAction(),
                $this->createRoundRepository()
            ),
            default => throw new RuntimeException('Unknown class ' . $class),
        };
    }

    public function createResolveRoundAction(): ResolveRoundAction
    {
        return new ResolveRoundAction(
            $this->createRoundRepository(),
            $this->createSubmissionRepository(),
            $this->createRelationshipRepository(),
            $this->createReputationRepository(),
            $this->createRumorRepository(),
            $this->createResultRepository(),
            $this->createCharacterRepository(),
            $this->createResolutionService(),
            $this->createSceneGenerationService()
        );
    }

    public function createRoundRepository(): RoundRepository
    {
        return new RoundRepository($this->getDb());
    }

    private function createSeasonRepository(): SeasonRepository
    {
        return new SeasonRepository($this->getDb());
    }

    private function createSubmissionRepository(): SubmissionRepository
    {
        return new SubmissionRepository($this->getDb());
    }

    private function createResultRepository(): ResultRepository
    {
        return new ResultRepository($this->getDb());
    }

    private function createCharacterRepository(): CharacterRepository
    {
        return new CharacterRepository($this->getDb());
    }

    private function createRelationshipRepository(): RelationshipRepository
    {
        return new RelationshipRepository($this->getDb());
    }

    private function createReputationRepository(): ReputationRepository
    {
        return new ReputationRepository($this->getDb());
    }

    private function createRumorRepository(): RumorRepository
    {
        return new RumorRepository($this->getDb());
    }

    private function createAiLogRepository(): AiLogRepository
    {
        return new AiLogRepository($this->getDb());
    }

    private function createGeminiClientService(): GeminiClientService
    {
        return new GeminiClientService($this->createAiLogRepository());
    }

    private function createIntentInterpreterService(): IntentInterpreterService
    {
        return new IntentInterpreterService($this->createGeminiClientService());
    }

    private function createSceneGenerationService(): SceneGenerationService
    {
        return new SceneGenerationService($this->createGeminiClientService());
    }

    private function createResolutionService(): ResolutionService
    {
        return new ResolutionService(new EventService(), new RoundService());
    }

    private function getDb(): PDO
    {
        if ($this->db instanceof PDO) {
            return $this->db;
        }

        $this->db = Database::getConnection();
        return $this->db;
    }
}
