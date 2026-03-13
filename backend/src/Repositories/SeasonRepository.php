<?php

declare(strict_types=1);

namespace App\Repositories;

use PDO;

final class SeasonRepository
{
    public function __construct(private readonly PDO $db)
    {
    }

    public function getCurrentSeason(): array
    {
        $statement = $this->db->query('SELECT * FROM seasons ORDER BY id DESC LIMIT 1');
        $season = $statement->fetch();

        if ($season !== false) {
            return $season;
        }

        $now = gmdate('Y-m-d H:i:s');
        $insert = $this->db->prepare(
            'INSERT INTO seasons (name, theme, status, current_round_number, starts_at, ends_at, created_at, updated_at)
             VALUES (:name, :theme, :status, :current_round_number, :starts_at, :ends_at, :created_at, :updated_at)'
        );
        $insert->execute([
            'name' => 'Heart Season: Villa Opening',
            'theme' => 'Luxury romance reality TV',
            'status' => 'active',
            'current_round_number' => 1,
            'starts_at' => $now,
            'ends_at' => null,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        return $this->getCurrentSeason();
    }
}
