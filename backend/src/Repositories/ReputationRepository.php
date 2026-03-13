<?php

declare(strict_types=1);

namespace App\Repositories;

use PDO;

final class ReputationRepository
{
    public function __construct(private readonly PDO $db)
    {
    }

    public function getOrCreate(int $seasonId, string $playerId): array
    {
        $statement = $this->db->prepare('SELECT * FROM reputation_states WHERE season_id = :season_id AND player_id = :player_id');
        $statement->execute([
            'season_id' => $seasonId,
            'player_id' => $playerId,
        ]);
        $reputation = $statement->fetch();

        if ($reputation !== false) {
            return $reputation;
        }

        $now = gmdate('Y-m-d H:i:s');
        $insert = $this->db->prepare(
            'INSERT INTO reputation_states
            (season_id, player_id, public_image, drama, elegance, sincerity, reliability, scandal, dominant_label, created_at, updated_at)
            VALUES
            (:season_id, :player_id, 0, 0, 0, 0, 0, 0, :dominant_label, :created_at, :updated_at)'
        );
        $insert->execute([
            'season_id' => $seasonId,
            'player_id' => $playerId,
            'dominant_label' => 'Unreadable',
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        return $this->getOrCreate($seasonId, $playerId);
    }

    public function applyOutcome(int $reputationId, array $deltas): void
    {
        $statement = $this->db->prepare(
            'UPDATE reputation_states SET
            public_image = public_image + :public_image,
            drama = drama + :drama,
            elegance = elegance + :elegance,
            sincerity = sincerity + :sincerity,
            reliability = reliability + :reliability,
            scandal = scandal + :scandal,
            dominant_label = :dominant_label,
            updated_at = :updated_at
            WHERE id = :id'
        );
        $statement->execute([
            'id' => $reputationId,
            'public_image' => $deltas['public_image'],
            'drama' => $deltas['drama'],
            'elegance' => $deltas['elegance'],
            'sincerity' => $deltas['sincerity'],
            'reliability' => $deltas['reliability'],
            'scandal' => $deltas['scandal'],
            'dominant_label' => $deltas['dominant_label'],
            'updated_at' => gmdate('Y-m-d H:i:s'),
        ]);
    }
}
