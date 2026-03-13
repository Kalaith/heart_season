<?php

declare(strict_types=1);

namespace App\Repositories;

use PDO;

final class RumorRepository
{
    public function __construct(private readonly PDO $db)
    {
    }

    public function listRecent(int $seasonId): array
    {
        $statement = $this->db->prepare('SELECT * FROM rumors WHERE season_id = :season_id ORDER BY id DESC LIMIT 12');
        $statement->execute(['season_id' => $seasonId]);
        return $statement->fetchAll();
    }

    public function create(int $seasonId, int $roundId, string $playerId, string $rumorText): void
    {
        $statement = $this->db->prepare(
            'INSERT INTO rumors (season_id, round_id, player_id, rumor_text, created_at)
             VALUES (:season_id, :round_id, :player_id, :rumor_text, :created_at)'
        );
        $statement->execute([
            'season_id' => $seasonId,
            'round_id' => $roundId,
            'player_id' => $playerId,
            'rumor_text' => $rumorText,
            'created_at' => gmdate('Y-m-d H:i:s'),
        ]);
    }
}
