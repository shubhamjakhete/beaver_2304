<?php
/**
 * Include this file at the top of every PHP API endpoint.
 *
 * In production the static site and PHP live on the same cPanel domain,
 * so CORS headers are not strictly required — but they allow the Next.js
 * dev server (localhost:3000) to call the live API during development.
 */

$allowed_origins = [
    'http://localhost:3000',
    'http://localhost:3001',
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowed_origins, true)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    // Permit same-origin and direct browser requests in production
    header('Access-Control-Allow-Origin: ' . ($_SERVER['HTTP_HOST'] ?? '*'));
}

header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json; charset=utf-8');

// Handle pre-flight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
