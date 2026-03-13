<?php

declare(strict_types=1);

namespace App\Repositories;

use PDO;

final class AiLogRepository
{
    public function __construct(private readonly PDO $db)
    {
    }

    public function create(
        ?int $roundId,
        ?string $playerId,
        string $purpose,
        string $provider,
        string $promptText,
        ?string $responseText,
        string $status,
        ?string $errorText
    ): void {
        $statement = $this->db->prepare(
            'INSERT INTO ai_logs
            (round_id, player_id, purpose, provider, prompt_text, response_text, status, error_text, created_at)
            VALUES
            (:round_id, :player_id, :purpose, :provider, :prompt_text, :response_text, :status, :error_text, :created_at)'
        );
        $statement->execute([
            'round_id' => $roundId,
            'player_id' => $playerId,
            'purpose' => $purpose,
            'provider' => $provider,
            'prompt_text' => $promptText,
            'response_text' => $responseText,
            'status' => $status,
            'error_text' => $errorText,
            'created_at' => gmdate('Y-m-d H:i:s'),
        ]);
    }
}
