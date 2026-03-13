<?php

declare(strict_types=1);

namespace App\Repositories;

use PDO;

final class RoundRepository
{
    public function __construct(private readonly PDO $db)
    {
    }

    public function beginTransaction(): void
    {
        if (!$this->db->inTransaction()) {
            $this->db->beginTransaction();
        }
    }

    public function commit(): void
    {
        if ($this->db->inTransaction()) {
            $this->db->commit();
        }
    }

    public function rollBack(): void
    {
        if ($this->db->inTransaction()) {
            $this->db->rollBack();
        }
    }

    public function getCurrentRound(int $seasonId): array
    {
        $round = $this->getActiveRound();
        if ($round !== null) {
            return $round;
        }

        $this->openNextRoundIfNeeded($seasonId, 1);
        return $this->getActiveRound() ?? $this->findByRoundNumber($seasonId, 1);
    }

    public function getActiveRound(): ?array
    {
        $statement = $this->db->query("SELECT * FROM rounds WHERE status IN ('open', 'resolving') ORDER BY id DESC LIMIT 1");
        $round = $statement->fetch();
        return $round === false ? null : $round;
    }

    public function getLatestResolvedRound(): ?array
    {
        $statement = $this->db->query("SELECT * FROM rounds WHERE status = 'resolved' ORDER BY id DESC LIMIT 1");
        $round = $statement->fetch();
        return $round === false ? null : $round;
    }

    public function getHistory(): array
    {
        $statement = $this->db->query('SELECT * FROM rounds ORDER BY round_number DESC LIMIT 10');
        return $statement->fetchAll();
    }

    public function findById(int $id): ?array
    {
        $statement = $this->db->prepare('SELECT * FROM rounds WHERE id = :id');
        $statement->execute(['id' => $id]);
        $round = $statement->fetch();
        return $round === false ? null : $round;
    }

    public function findDueOpenRounds(): array
    {
        $statement = $this->db->query("SELECT * FROM rounds WHERE status = 'open' AND locks_at <= UTC_TIMESTAMP()");
        return $statement->fetchAll();
    }

    public function markResolving(int $roundId): void
    {
        $statement = $this->db->prepare('UPDATE rounds SET status = :status, updated_at = :updated_at WHERE id = :id');
        $statement->execute([
            'status' => 'resolving',
            'updated_at' => gmdate('Y-m-d H:i:s'),
            'id' => $roundId,
        ]);
    }

    public function markResolved(int $roundId): void
    {
        $statement = $this->db->prepare(
            'UPDATE rounds SET status = :status, resolved_at = :resolved_at, updated_at = :updated_at WHERE id = :id'
        );
        $statement->execute([
            'status' => 'resolved',
            'resolved_at' => gmdate('Y-m-d H:i:s'),
            'updated_at' => gmdate('Y-m-d H:i:s'),
            'id' => $roundId,
        ]);
    }

    public function openNextRoundIfNeeded(int $seasonId, int $roundNumber): void
    {
        if ($this->findByRoundNumber($seasonId, $roundNumber) !== null) {
            return;
        }

        $now = new \DateTimeImmutable('now', new \DateTimeZone('UTC'));
        $lock = $now->modify('+24 hours');

        $events = [
            1 => ['Sunset Mixer', 'public'],
            2 => ['Firepit Confessionals', 'intimate'],
            3 => ['Masquerade Party', 'spectacle'],
        ];
        $event = $events[$roundNumber] ?? ['Poolside Twist', 'public'];

        $statement = $this->db->prepare(
            'INSERT INTO rounds
            (season_id, round_number, event_name, event_type, status, resolution_seed, opens_at, locks_at, resolved_at, created_at, updated_at)
            VALUES
            (:season_id, :round_number, :event_name, :event_type, :status, :resolution_seed, :opens_at, :locks_at, :resolved_at, :created_at, :updated_at)'
        );
        $statement->execute([
            'season_id' => $seasonId,
            'round_number' => $roundNumber,
            'event_name' => $event[0],
            'event_type' => $event[1],
            'status' => 'open',
            'resolution_seed' => hash('sha256', 'heart-season-' . $seasonId . '-' . $roundNumber),
            'opens_at' => $now->format('Y-m-d H:i:s'),
            'locks_at' => $lock->format('Y-m-d H:i:s'),
            'resolved_at' => null,
            'created_at' => $now->format('Y-m-d H:i:s'),
            'updated_at' => $now->format('Y-m-d H:i:s'),
        ]);
    }

    private function findByRoundNumber(int $seasonId, int $roundNumber): ?array
    {
        $statement = $this->db->prepare('SELECT * FROM rounds WHERE season_id = :season_id AND round_number = :round_number');
        $statement->execute([
            'season_id' => $seasonId,
            'round_number' => $roundNumber,
        ]);
        $round = $statement->fetch();
        return $round === false ? null : $round;
    }
}
