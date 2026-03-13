<?php

declare(strict_types=1);

namespace App\Repositories;

use PDO;

final class CharacterRepository
{
    public function __construct(private readonly PDO $db)
    {
    }

    public function listForSeason(int $seasonId): array
    {
        $statement = $this->db->prepare('SELECT * FROM characters WHERE season_id = :season_id ORDER BY id ASC');
        $statement->execute(['season_id' => $seasonId]);
        $characters = $statement->fetchAll();

        if ($characters !== []) {
            return $characters;
        }

        $this->seed($seasonId);
        return $this->listForSeason($seasonId);
    }

    public function indexedById(int $seasonId): array
    {
        $characters = $this->listForSeason($seasonId);
        $indexed = [];
        foreach ($characters as $character) {
            $indexed[(int) $character['id']] = $character;
        }
        return $indexed;
    }

    private function seed(int $seasonId): void
    {
        $now = gmdate('Y-m-d H:i:s');
        $characters = [
            ['Adrian Vale', 'charmer', 'A smooth strategist who loves bold confidence.', 'bold', 'glamour'],
            ['Noah Hart', 'soft-spoken', 'A sincere listener who values honesty over spectacle.', 'gentle', 'authenticity'],
            ['Luca Reyes', 'wildcard', 'A thrill-seeker who responds to daring moves and drama.', 'flirty', 'chaos'],
            ['Elias Moon', 'mysterious', 'A composed romantic who prefers elegant restraint.', 'poised', 'mystery'],
        ];

        $statement = $this->db->prepare(
            'INSERT INTO characters (season_id, name, archetype, bio, preferred_stance, preferred_image_priority, created_at, updated_at)
             VALUES (:season_id, :name, :archetype, :bio, :preferred_stance, :preferred_image_priority, :created_at, :updated_at)'
        );

        foreach ($characters as $character) {
            $statement->execute([
                'season_id' => $seasonId,
                'name' => $character[0],
                'archetype' => $character[1],
                'bio' => $character[2],
                'preferred_stance' => $character[3],
                'preferred_image_priority' => $character[4],
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }
    }
}
