<?php

declare(strict_types=1);

namespace App\Services;

final class IntentInterpreterService
{
    public function __construct(private readonly GeminiClientService $geminiClientService)
    {
    }

    public function interpret(string $intentText, array $context): array
    {
        $intentText = trim($intentText);
        if ($intentText === '') {
            return [
                'tone' => 'steady',
                'objective' => 'build chemistry',
                'fallback_action' => 'stay composed',
                'risk_posture' => 'moderate',
                'confidence' => 0.55,
                'tags' => [],
            ];
        }

        if ($this->geminiClientService->isEnabled()) {
            try {
                $prompt = <<<PROMPT
You are the Heart Season intent interpreter.
Return JSON only with keys:
- tone
- objective
- fallback_action
- risk_posture
- confidence
- tags

Allowed tone values: gentle, bold, flirty, poised, chaotic, steady.
Allowed risk_posture values: low, moderate, high.
Keep tags to at most 4 short lowercase strings.

Round context:
{$context['round']['event_name']} ({$context['round']['event_type']})

Player intent:
{$intentText}
PROMPT;

                $result = $this->geminiClientService->generateJson('intent_interpretation', $prompt, (int) ($context['round']['id'] ?? 0), (string) ($context['player_id'] ?? ''));
                return [
                    'tone' => $this->enum((string) ($result['tone'] ?? 'steady'), ['gentle', 'bold', 'flirty', 'poised', 'chaotic', 'steady'], 'steady'),
                    'objective' => trim((string) ($result['objective'] ?? 'build chemistry')) ?: 'build chemistry',
                    'fallback_action' => trim((string) ($result['fallback_action'] ?? 'stay composed')) ?: 'stay composed',
                    'risk_posture' => $this->enum((string) ($result['risk_posture'] ?? 'moderate'), ['low', 'moderate', 'high'], 'moderate'),
                    'confidence' => max(0.1, min(0.99, (float) ($result['confidence'] ?? 0.7))),
                    'tags' => array_slice(array_values(array_unique(array_filter(array_map('strval', is_array($result['tags'] ?? null) ? $result['tags'] : [])))), 0, 4),
                ];
            } catch (\Throwable) {
            }
        }

        $lower = strtolower($intentText);
        return [
            'tone' => str_contains($lower, 'kiss') || str_contains($lower, 'bold') ? 'bold' : 'steady',
            'objective' => str_contains($lower, 'trust') ? 'build trust' : 'build chemistry',
            'fallback_action' => 'protect your image',
            'risk_posture' => str_contains($lower, 'risk') || str_contains($lower, 'all in') ? 'high' : 'moderate',
            'confidence' => 0.62,
            'tags' => array_values(array_slice(array_unique(array_filter([
                str_contains($lower, 'trust') ? 'trust' : null,
                str_contains($lower, 'kiss') ? 'physical' : null,
                str_contains($lower, 'safe') ? 'safe' : null,
                str_contains($lower, 'rival') ? 'rivalry' : null,
            ])), 0, 4)),
        ];
    }

    private function enum(string $value, array $allowed, string $default): string
    {
        return in_array($value, $allowed, true) ? $value : $default;
    }
}
