<?php

declare(strict_types=1);

namespace App\Middleware;

use App\Core\Request;
use App\Core\Response;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

final class WebHatcheryJwtMiddleware
{
    public function __invoke(Request $request, Response $response): Request|Response
    {
        $authHeader = $request->getHeader('authorization');
        if (!is_string($authHeader) || preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches) !== 1) {
            $response->withStatus(401)->json([
                'success' => false,
                'error' => 'Authentication required',
                'login_url' => $_ENV['WEB_HATCHERY_LOGIN_URL'] ?? '',
            ]);
            return $response;
        }

        $secret = $_ENV['JWT_SECRET'] ?? '';
        if ($secret === '') {
            $response->withStatus(401)->json([
                'success' => false,
                'error' => 'Authentication required',
                'login_url' => $_ENV['WEB_HATCHERY_LOGIN_URL'] ?? '',
            ]);
            return $response;
        }

        try {
            $decoded = JWT::decode($matches[1], new Key($secret, 'HS256'));
            $userId = $decoded->sub ?? $decoded->user_id ?? null;
            if ($userId === null) {
                throw new \RuntimeException('Token missing user identifier');
            }

            $request->setAttribute('auth_user', [
                'id' => (string) $userId,
                'email' => $decoded->email ?? null,
                'username' => $decoded->username ?? null,
                'display_name' => $decoded->display_name ?? $decoded->username ?? null,
                'roles' => is_array($decoded->roles ?? null) ? $decoded->roles : [],
            ]);

            return $request;
        } catch (\Throwable) {
            $response->withStatus(401)->json([
                'success' => false,
                'error' => 'Authentication required',
                'login_url' => $_ENV['WEB_HATCHERY_LOGIN_URL'] ?? '',
            ]);
            return $response;
        }
    }
}
