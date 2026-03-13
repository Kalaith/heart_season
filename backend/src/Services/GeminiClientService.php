<?php

declare(strict_types=1);

namespace App\Services;

use App\Repositories\AiLogRepository;
use RuntimeException;

final class GeminiClientService
{
    private readonly string $apiKey;
    private readonly string $endpoint;

    public function __construct(private readonly AiLogRepository $aiLogRepository)
    {
        $this->apiKey = $_ENV['GEMINI_API_KEY'] ?? $_SERVER['GEMINI_API_KEY'] ?? getenv('GEMINI_API_KEY') ?: '';
        $this->endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
    }

    public function isEnabled(): bool
    {
        return $this->apiKey !== '';
    }

    public function generateJson(string $purpose, string $prompt, ?int $roundId = null, ?string $playerId = null): array
    {
        if (!$this->isEnabled()) {
            throw new RuntimeException('GEMINI_API_KEY is not configured');
        }

        $payload = [
            'contents' => [[
                'parts' => [[
                    'text' => $prompt,
                ]],
            ]],
            'generationConfig' => [
                'response_mime_type' => 'application/json',
            ],
        ];

        $ch = curl_init($this->endpoint . '?key=' . $this->apiKey);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

        if (($_ENV['APP_ENV'] ?? 'production') === 'development') {
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
        }

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);

        if ($response === false || $httpCode !== 200) {
            $this->aiLogRepository->create($roundId, $playerId, $purpose, 'gemini', $prompt, is_string($response) ? $response : null, 'failed', $error ?: 'HTTP ' . $httpCode);
            throw new RuntimeException('Gemini call failed: ' . ($error ?: 'HTTP ' . $httpCode));
        }

        $decoded = json_decode($response, true);
        $text = $decoded['candidates'][0]['content']['parts'][0]['text'] ?? '{}';
        $parsed = json_decode((string) $text, true);
        if (!is_array($parsed)) {
            $this->aiLogRepository->create($roundId, $playerId, $purpose, 'gemini', $prompt, (string) $text, 'failed', 'Malformed JSON response');
            throw new RuntimeException('Gemini returned malformed JSON.');
        }

        $this->aiLogRepository->create($roundId, $playerId, $purpose, 'gemini', $prompt, (string) $text, 'succeeded', null);
        return $parsed;
    }
}
