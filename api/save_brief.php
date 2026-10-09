<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Configuración de MySQL en Hostinger / HostGator / cPanel
$db_host = "localhost";
$db_user = "uablinco_briefuser"; // Reemplazar con usuario MySQL de cPanel
$db_pass = "YOUR_DB_PASSWORD";    // Reemplazar con contraseña MySQL
$db_name = "uablinco_briefs";     // Reemplazar con nombre de base de datos

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["status" => "error", "message" => "No JSON payload"]);
    exit();
}

try {
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);

    $stmt = $pdo->prepare("
        INSERT INTO client_briefs 
        (id, brief_id, brief_title, client_name, client_email, client_phone, status, estimated_budget, answers_json, notes) 
        VALUES (:id, :brief_id, :brief_title, :client_name, :client_email, :client_phone, :status, :estimated_budget, :answers_json, :notes)
        ON DUPLICATE KEY UPDATE 
        status = :status_update,
        notes = :notes_update,
        updated_at = NOW()
    ");

    $stmt->execute([
        ':id' => $data['id'],
        ':brief_id' => $data['briefId'] ?? '',
        ':brief_title' => $data['briefTitle'] ?? '',
        ':client_name' => $data['clientName'] ?? 'Cliente Miiles',
        ':client_email' => $data['clientEmail'] ?? '',
        ':client_phone' => $data['clientPhone'] ?? '',
        ':status' => $data['status'] ?? 'new',
        ':estimated_budget' => $data['estimatedBudget'] ?? '',
        ':answers_json' => json_encode($data['answers'] ?? []),
        ':notes' => $data['notes'] ?? '',
        ':status_update' => $data['status'] ?? 'new',
        ':notes_update' => $data['notes'] ?? ''
    ]);

    echo json_encode(["status" => "success", "id" => $data['id']]);

} catch (PDOException $e) {
    // Si falla la conexión a MySQL (ej. en local o antes de configurar credenciales), responder amigablemente
    echo json_encode(["status" => "local_mode", "message" => "Database not configured yet, stored in localStorage"]);
}
?>
