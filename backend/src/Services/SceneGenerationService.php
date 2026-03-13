<?php

declare(strict_types=1);

namespace App\Services;

final class SceneGenerationService
{
    public function __construct(private readonly GeminiClientService $geminiClientService)
    {
    }

    public function generate(array $round, array $outcome, ?array $character): array
    {
        if ($this->geminiClientService->isEnabled()) {
            try {
                $prompt = <<<PROMPT
You are the Heart Season scene writer.
Return JSON only with keys:
- scene_text
- private_notes_text
- public_recap_text

Round:
{$round['event_name']} ({$round['event_type']})

Outcome JSON:
{$this->toJson($outcome)}

Character:
{$this->toJson($character ?? [])}
PROMPT;

                $result = $this->geminiClientService->generateJson(
                    'scene_generation',
                    $prompt,
                    (int) $round['id'],
                    (string) $outcome['player_id']
                );

                return [
                    'scene_text' => trim((string) ($result['scene_text'] ?? '')) ?: $this->fallbackScene($round, $outcome, $character),
                    'private_notes_text' => trim((string) ($result['private_notes_text'] ?? '')) ?: $this->fallbackPrivateNotes($outcome),
                    'public_recap_text' => trim((string) ($result['public_recap_text'] ?? '')) ?: $this->fallbackRecap($round, $outcome, $character),
                ];
            } catch (\Throwable) {
            }
        }

        return [
            'scene_text' => $this->fallbackScene($round, $outcome, $character),
            'private_notes_text' => $this->fallbackPrivateNotes($outcome),
            'public_recap_text' => $this->fallbackRecap($round, $outcome, $character),
        ];
    }

    private function fallbackScene(array $round, array $outcome, ?array $character): string
    {
        $name = $character['name'] ?? 'your match';
        return sprintf(
            'At %s, you leaned %s toward %s. The moment ended with chemistry %+d and trust %+d.',
            $round['event_name'],
            $outcome['stance'],
            $name,
            $outcome['relationship_deltas']['chemistry'],
            $outcome['relationship_deltas']['trust']
        );
    }

    private function fallbackPrivateNotes(array $outcome): string
    {
        return sprintf(
            'Internal read: attraction %+d, respect %+d, public image %+d.',
            $outcome['relationship_deltas']['attraction'],
            $outcome['relationship_deltas']['respect'],
            $outcome['reputation_deltas']['public_image']
        );
    }

    private function fallbackRecap(array $round, array $outcome, ?array $character): string
    {
        $name = $character['name'] ?? 'a castmate';
        return sprintf(
            'During %s, %s drew attention after a %s move toward %s.',
            $round['event_name'],
            $outcome['player_id'],
            $outcome['stance'],
            $name
        );
    }

    private function toJson(array $payload): string
    {
        return json_encode($payload, JSON_PRETTY_PRINT) ?: '{}';
    }
}
