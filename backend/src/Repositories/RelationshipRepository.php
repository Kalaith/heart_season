<?php

declare(strict_types=1);

namespace App\Repositories;

use PDO;

final class RelationshipRepository
{
    public function __construct(private readonly PDO $db)
    {
    }

    public function getOrCreate(int $seasonId, string $playerId, int $characterId): array
    {
        $statement = $this->db->prepare(
            'SELECT * FROM relationship_states WHERE season_id = :season_id AND player_id = :player_id AND character_id = :character_id'
        );
        $statement->execute([
            'season_id' => $seasonId,
            'player_id' => $playerId,
            'character_id' => $characterId,
        ]);
        $relationship = $statement->fetch();

        if ($relationship !== false) {
            return $relationship;
        }

        $now = gmdate('Y-m-d H:i:s');
        $insert = $this->db->prepare(
            'INSERT INTO relationship_states
            (season_id, player_id, character_id, attraction, trust, chemistry, comfort, respect, jealousy, last_interaction_round, created_at, updated_at)
            VALUES
            (:season_id, :player_id, :character_id, 0, 0, 0, 0, 0, 0, 0, :created_at, :updated_at)'
        );
        $insert->execute([
            'season_id' => $seasonId,
            'player_id' => $playerId,
            'character_id' => $characterId,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        return $this->getOrCreate($seasonId, $playerId, $characterId);
    }

    public function applyOutcome(int $relationshipId, array $deltas, int $roundNumber): void
    {
        $statement = $this->db->prepare(
            'UPDATE relationship_states SET
            attraction = attraction + :attraction,
            trust = trust + :trust,
            chemistry = chemistry + :chemistry,
            comfort = comfort + :comfort,
            respect = respect + :respect,
            jealousy = jealousy + :jealousy,
            last_interaction_round = :last_interaction_round,
            updated_at = :updated_at
            WHERE id = :id'
        );
        $statement->execute([
            'id' => $relationshipId,
            'attraction' => $deltas['attraction'],
            'trust' => $deltas['trust'],
            'chemistry' => $deltas['chemistry'],
            'comfort' => $deltas['comfort'],
            'respect' => $deltas['respect'],
            'jealousy' => $deltas['jealousy'],
            'last_interaction_round' => $roundNumber,
            'updated_at' => gmdate('Y-m-d H:i:s'),
        ]);
    }
}
