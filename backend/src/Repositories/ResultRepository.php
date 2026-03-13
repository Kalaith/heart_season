<?php

declare(strict_types=1);

namespace App\Repositories;

use PDO;

final class ResultRepository
{
    public function __construct(private readonly PDO $db)
    {
    }

    public function findForPlayerAndRound(string $playerId, int $roundId): ?array
    {
        $statement = $this->db->prepare('SELECT * FROM player_round_results WHERE round_id = :round_id AND player_id = :player_id');
        $statement->execute([
            'round_id' => $roundId,
            'player_id' => $playerId,
        ]);
        $row = $statement->fetch();
        return $row === false ? null : $row;
    }

    public function upsert(int $roundId, string $playerId, array $outcome, array $scene): void
    {
        $existing = $this->findForPlayerAndRound($playerId, $roundId);
        $payload = [
            'round_id' => $roundId,
            'player_id' => $playerId,
            'structured_outcome_json' => json_encode($outcome),
            'scene_text' => $scene['scene_text'],
            'private_notes_text' => $scene['private_notes_text'],
            'public_recap_text' => $scene['public_recap_text'],
            'created_at' => gmdate('Y-m-d H:i:s'),
        ];

        if ($existing === null) {
            $statement = $this->db->prepare(
                'INSERT INTO player_round_results
                (round_id, player_id, structured_outcome_json, scene_text, private_notes_text, public_recap_text, created_at)
                VALUES
                (:round_id, :player_id, :structured_outcome_json, :scene_text, :private_notes_text, :public_recap_text, :created_at)'
            );
            $statement->execute($payload);
            return;
        }

        $statement = $this->db->prepare(
            'UPDATE player_round_results SET
            structured_outcome_json = :structured_outcome_json,
            scene_text = :scene_text,
            private_notes_text = :private_notes_text,
            public_recap_text = :public_recap_text
            WHERE round_id = :round_id AND player_id = :player_id'
        );
        $statement->execute($payload);
    }
}
