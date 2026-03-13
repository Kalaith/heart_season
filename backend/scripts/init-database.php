<?php

declare(strict_types=1);

$autoloader = null;
$searchPaths = [
    __DIR__ . '/../vendor/autoload.php',
    __DIR__ . '/../../vendor/autoload.php',
    __DIR__ . '/../../../vendor/autoload.php',
    __DIR__ . '/../../../../vendor/autoload.php',
];

foreach ($searchPaths as $path) {
    if (file_exists($path)) {
        $autoloader = $path;
        break;
    }
}

if ($autoloader === null) {
    throw new RuntimeException('Autoloader not found. Please run composer install.');
}

require $autoloader;

spl_autoload_register(static function (string $class): void {
    $prefix = 'App\\';
    $baseDir = __DIR__ . '/../src/';

    if (strncmp($class, $prefix, strlen($prefix)) !== 0) {
        return;
    }

    $relative = substr($class, strlen($prefix));
    $file = $baseDir . str_replace('\\', '/', $relative) . '.php';
    if (file_exists($file)) {
        require $file;
    }
}, true, true);

use App\Core\Database;
use Dotenv\Dotenv;

$envPath = __DIR__ . '/..';
if (!file_exists($envPath . '/.env')) {
    throw new RuntimeException('Missing .env at ' . $envPath . '/.env');
}

Dotenv::createImmutable($envPath)->load();

$schemaPath = __DIR__ . '/../database/schema.sql';
if (!file_exists($schemaPath)) {
    throw new RuntimeException('Missing schema.sql');
}

$db = Database::getConnection();
$sql = file_get_contents($schemaPath);
if (!is_string($sql)) {
    throw new RuntimeException('Unable to read schema.sql');
}

$db->exec($sql);
echo "Database initialized." . PHP_EOL;
