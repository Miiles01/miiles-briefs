<?php
require_once __DIR__ . '/config.php';

header("Content-Type: application/json; charset=UTF-8");

$pdo = getDBConnection();

if ($pdo) {
    try {
        $stmt = $pdo->query("SELECT COUNT(*) as total FROM brief_submissions");
        $count = $stmt->fetch()['total'];

        echo json_encode([
            "status" => "success",
            "message" => "✅ Conexión a MySQL en Hostinger exitosa",
            "database" => $DB_NAME,
            "submissions_in_db" => (int)$count,
            "php_version" => phpversion(),
            "timestamp" => date('Y-m-d H:i:s')
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    } catch (Exception $e) {
        echo json_encode([
            "status" => "warning",
            "message" => "Conectado a MySQL, pero ocurrió un error al consultar la tabla: " . $e->getMessage()
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }
} else {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => ($DB_NAME === "" ? "❌ Faltan las credenciales: no se encontró miiles-db.php" : "❌ No se pudo conectar a MySQL con las credenciales de miiles-db.php"),
        "debug_info" => [
            "host" => $DB_HOST,
            "database" => $DB_NAME,
            "user" => $DB_USER
        ],
        "instructions" => "Crea la base de datos en hPanel de Hostinger y el archivo miiles-db.php fuera de public_html con sus credenciales."
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
}
