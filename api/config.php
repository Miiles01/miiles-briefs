<?php
/**
 * Configuración de Base de Datos MySQL - HostGator / cPanel / Apache
 * Miiles Briefs
 */

// Permite peticiones desde el frontend (CORS)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// =========================================================================
// Credenciales de MySQL (Hostinger → hPanel → Bases de datos → MySQL)
// Se leen del archivo miiles-db.php FUERA de public_html (no se sube al repo ni
// queda visible en la web). Ese archivo solo define las 4 variables:
//   <?php
//   $DB_HOST = 'localhost';
//   $DB_NAME = 'u123456789_briefs';
//   $DB_USER = 'u123456789_admin';
//   $DB_PASS = '...';
// =========================================================================
$DB_HOST = 'localhost';
$DB_NAME = '';
$DB_USER = '';
$DB_PASS = '';
foreach ([dirname(__DIR__, 2) . '/miiles-db.php', __DIR__ . '/miiles-db.php'] as $credFile) {
    if (is_readable($credFile)) { require $credFile; break; }
}

// Opcional: Correo donde recibir notificación cuando un cliente envíe un brief
$NOTIFICATION_EMAIL = 'hola@miiles.com'; // Cambiar a tu correo de Miiles Studio

/**
 * Obtiene la conexión PDO e inicializa la tabla automáticamente si no existe
 */
function getDBConnection() {
    global $DB_HOST, $DB_NAME, $DB_USER, $DB_PASS;
    if ($DB_NAME === '' || $DB_USER === '') return null;

    try {
        $dsn = "mysql:host={$DB_HOST};dbname={$DB_NAME};charset=utf8mb4";
        $pdo = new PDO($dsn, $DB_USER, $DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);

        // Auto-crear tabla si no existe
        $createTableSQL = "
        CREATE TABLE IF NOT EXISTS `brief_submissions` (
            `id` VARCHAR(32) NOT NULL PRIMARY KEY,
            `brief_id` VARCHAR(64) NOT NULL,
            `brief_title` VARCHAR(255) NOT NULL,
            `client_name` VARCHAR(255) NOT NULL,
            `client_email` VARCHAR(255) NOT NULL,
            `client_company` VARCHAR(255) DEFAULT '',
            `client_phone` VARCHAR(64) DEFAULT '',
            `estimated_budget` VARCHAR(128) DEFAULT 'A definir',
            `status` ENUM('new', 'reviewing', 'approved', 'declined', 'archived') DEFAULT 'new',
            `notes` TEXT DEFAULT NULL,
            `answers_json` LONGTEXT NOT NULL,
            `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX `idx_brief_id` (`brief_id`),
            INDEX `idx_status` (`status`),
            INDEX `idx_created_at` (`created_at`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ";
        
        $pdo->exec($createTableSQL);
        return $pdo;

    } catch (PDOException $e) {
        return null;
    }
}
