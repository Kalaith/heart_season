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

use App\Core\ServiceFactory;
use Dotenv\Dotenv;

$envPath = __DIR__ . '/..';
if (!file_exists($envPath . '/.env')) {
    throw new RuntimeException('Missing .env at ' . $envPath . '/.env');
}

Dotenv::createImmutable($envPath)->load();

$factory = new ServiceFactory();
$resolver = $factory->createResolveRoundAction();
$dueRounds = $factory->createRoundRepository()->findDueOpenRounds();

foreach ($dueRounds as $round) {
    $resolver->execute((int) $round['id']);
    echo 'Resolved round #' . $round['round_number'] . PHP_EOL;
}
