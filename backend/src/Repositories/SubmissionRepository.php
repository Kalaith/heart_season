<?php

declare(strict_types=1);

namespace App\Repositories;

use PDO;

final class SubmissionRepository
{
    public function __construct(private readonly PDO $db)
    {
    }

    public function findByRoundAndPlayer(int $roundId, string $playerId): ?array
    {
        $statement = $this->db->prepare('SELECT * FROM player_round_submissions WHERE round_id = :round_id AND player_id = :player_id');
        $statement->execute([
            'round_id' => $roundId,
            'player_id' => $playerId,
        ]);
        $row = $statement->fetch();
        return $row === false ? null : $row;
    }

    public function listByRound(int $roundId): array
    {
        $statement = $this->db->prepare('SELECT * FROM player_round_submissions WHERE round_id = :round_id ORDER BY id ASC');
        $statement->execute(['round_id' => $roundId]);
        return $statement->fetchAll();
    }

    public function create(int $roundId, string $playerId, array $payload): array
    {
        $now = gmdate('Y-m-d H:i:s');
        $statement = $this->db->prepare(
            'INSERT INTO player_round_submissions
            (round_id, player_id, target_character_id, stance, image_priority, risk_tolerance, rival_target_player_id, special_move_key, intent_text, interpreted_intent_json, submitted_at, updated_at)
            VALUES
            (:round_id, :player_id, :target_character_id, :stance, :image_priority, :risk_tolerance, :rival_target_player_id, :special_move_key, :intent_text, :interpreted_intent_json, :submitted_at, :updated_at)'
        );
        $statement->execute([
            'round_id' => $roundId,
            'player_id' => $playerId,
            'target_character_id' => $payload['target_character_id'],
            'stance' => $payload['stance'],
            'image_priority' => $payload['image_priority'],
            'risk_tolerance' => $payload['risk_tolerance'],
            'rival_target_player_id' => $payload['rival_target_player_id'],
            'special_move_key' => $payload['special_move_key'],
            'intent_text' => $payload['intent_text'],
            'interpreted_intent_json' => json_encode($payload['interpreted_intent_json']),
            'submitted_at' => $now,
            'updated_at' => $now,
        ]);

        return $this->findByRoundAndPlayer($roundId, $playerId) ?? [];
    }

    public function update(int $roundId, string $playerId, array $payload): array
    {
        $statement = $this->db->prepare(
            'UPDATE player_round_submissions SET
            target_character_id = :target_character_id,
            stance = :stance,
            image_priority = :image_priority,
            risk_tolerance = :risk_tolerance,
            rival_target_player_id = :rival_target_player_id,
            special_move_key = :special_move_key,
            intent_text = :intent_text,
            interpreted_intent_json = :interpreted_intent_json,
            updated_at = :updated_at
            WHERE round_id = :round_id AND player_id = :player_id'
        );
        $statement->execute([
            'round_id' => $roundId,
            'player_id' => $playerId,
            'target_character_id' => $payload['target_character_id'],
            'stance' => $payload['stance'],
            'image_priority' => $payload['image_priority'],
            'risk_tolerance' => $payload['risk_tolerance'],
            'rival_target_player_id' => $payload['rival_target_player_id'],
            'special_move_key' => $payload['special_move_key'],
            'intent_text' => $payload['intent_text'],
            'interpreted_intent_json' => json_encode($payload['interpreted_intent_json']),
            'updated_at' => gmdate('Y-m-d H:i:s'),
        ]);

        return $this->findByRoundAndPlayer($roundId, $playerId) ?? [];
    }
}
