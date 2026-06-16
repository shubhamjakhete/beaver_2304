<?php
/**
 * Database credentials — DO NOT commit real values.
 * Fill these in via cPanel file manager, or inject at deploy time.
 * GitHub Secrets handles FTPS upload; credentials live only on the server.
 */

define('DB_HOST', '');   // e.g. localhost
define('DB_NAME', '');   // your cPanel DB name
define('DB_USER', '');   // your cPanel DB user
define('DB_PASS', '');   // your cPanel DB password
define('DB_TABLE', 'table20');

function pdo(): PDO {
    static $pdo;
    if (!$pdo) {
        $pdo = new PDO(
            'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
            DB_USER,
            DB_PASS,
            [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]
        );
    }
    return $pdo;
}
