<?php
require_once __DIR__ . '/config.php';

$pdo = getDBConnection();
$method = $_SERVER['REQUEST_METHOD'];

// Si la base de datos no está configurada o conectada, retornar respuesta informativa
if (!$pdo) {
    if ($method === 'GET') {
        echo json_encode([
            "status" => "fallback",
            "message" => "Database not configured yet. Set DB credentials in public/api/config.php",
            "data" => []
        ]);
    } else {
        echo json_encode([
            "status" => "fallback",
            "message" => "Database not configured. Saved in local storage fallback."
        ]);
    }
    exit();
}

try {
    // ---------------------------------------------------------
    // 1. GET: Obtener todas las respuestas / briefs recibidos
    // ---------------------------------------------------------
    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT * FROM brief_submissions ORDER BY created_at DESC");
        $rows = $stmt->fetchAll();

        $submissions = array_map(function ($row) {
            return [
                'id' => $row['id'],
                'briefId' => $row['brief_id'],
                'briefTitle' => $row['brief_title'],
                'clientName' => $row['client_name'],
                'clientEmail' => $row['client_email'],
                'clientCompany' => $row['client_company'] ?? '',
                'clientPhone' => $row['client_phone'] ?? '',
                'status' => $row['status'],
                'createdAt' => $row['created_at'],
                'updatedAt' => $row['updated_at'],
                'estimatedBudget' => $row['estimated_budget'] ?? 'A definir',
                'notes' => $row['notes'] ?? '',
                'answers' => json_decode($row['answers_json'], true) ?? (object)[]
            ];
        }, $rows);

        echo json_encode([
            "status" => "success",
            "count" => count($submissions),
            "data" => $submissions
        ]);
        exit();
    }

    // ---------------------------------------------------------
    // 2. POST: Guardar un nuevo brief enviado por un cliente
    // ---------------------------------------------------------
    if ($method === 'POST') {
        $rawInput = file_get_contents('php://input');
        $data = json_decode($rawInput, true);

        if (!$data || !isset($data['id'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Datos de brief incompletos"]);
            exit();
        }

        $stmt = $pdo->prepare("
            INSERT INTO brief_submissions 
            (id, brief_id, brief_title, client_name, client_email, client_company, client_phone, estimated_budget, status, notes, answers_json, created_at, updated_at) 
            VALUES (:id, :brief_id, :brief_title, :client_name, :client_email, :client_company, :client_phone, :estimated_budget, :status, :notes, :answers_json, NOW(), NOW())
            ON DUPLICATE KEY UPDATE 
            status = :status_up,
            notes = :notes_up,
            answers_json = :answers_up,
            updated_at = NOW()
        ");

        $answersJson = json_encode($data['answers'] ?? []);

        $stmt->execute([
            ':id' => $data['id'],
            ':brief_id' => $data['briefId'] ?? 'general',
            ':brief_title' => $data['briefTitle'] ?? 'Brief de Proyecto',
            ':client_name' => $data['clientName'] ?? 'Cliente',
            ':client_email' => $data['clientEmail'] ?? '',
            ':client_company' => $data['clientCompany'] ?? '',
            ':client_phone' => $data['clientPhone'] ?? '',
            ':estimated_budget' => $data['estimatedBudget'] ?? 'A definir',
            ':status' => $data['status'] ?? 'new',
            ':notes' => $data['notes'] ?? '',
            ':answers_json' => $answersJson,
            ':status_up' => $data['status'] ?? 'new',
            ':notes_up' => $data['notes'] ?? '',
            ':answers_up' => $answersJson
        ]);

        // Opcional: Enviar correo de notificación
        if (!empty($NOTIFICATION_EMAIL) && $NOTIFICATION_EMAIL !== 'hola@miiles.com') {
            @mail(
                $NOTIFICATION_EMAIL,
                "✨ Nuevo Brief Recibido: " . ($data['briefTitle'] ?? 'Proyecto') . " - " . ($data['clientName'] ?? ''),
                "Has recibido un nuevo brief en Miiles Studio.\n\nCliente: " . ($data['clientName'] ?? '') . "\nEmail: " . ($data['clientEmail'] ?? '') . "\nID: " . $data['id'] . "\n\nConsulta el panel de administración.",
                "From: no-reply@" . $_SERVER['HTTP_HOST'] . "\r\nReply-To: " . ($data['clientEmail'] ?? 'no-reply@' . $_SERVER['HTTP_HOST'])
            );
        }

        echo json_encode([
            "status" => "success",
            "message" => "Brief guardado en MySQL con éxito",
            "id" => $data['id']
        ]);
        exit();
    }

    // ---------------------------------------------------------
    // 3. PUT / PATCH: Actualizar estado o notas de un brief (Admin)
    // ---------------------------------------------------------
    if ($method === 'PUT' || $method === 'PATCH') {
        $rawInput = file_get_contents('php://input');
        $data = json_decode($rawInput, true);

        if (!$data || !isset($data['id'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "ID requerido"]);
            exit();
        }

        $fieldsToUpdate = [];
        $params = [':id' => $data['id']];

        if (isset($data['status'])) {
            $fieldsToUpdate[] = "status = :status";
            $params[':status'] = $data['status'];
        }
        if (isset($data['notes'])) {
            $fieldsToUpdate[] = "notes = :notes";
            $params[':notes'] = $data['notes'];
        }

        if (empty($fieldsToUpdate)) {
            echo json_encode(["status" => "noop", "message" => "Nada que actualizar"]);
            exit();
        }

        $sql = "UPDATE brief_submissions SET " . implode(', ', $fieldsToUpdate) . ", updated_at = NOW() WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        echo json_encode(["status" => "success", "message" => "Brief actualizado"]);
        exit();
    }

    // ---------------------------------------------------------
    // 4. DELETE: Eliminar un brief
    // ---------------------------------------------------------
    if ($method === 'DELETE') {
        $id = $_GET['id'] ?? null;
        if (!$id) {
            $rawInput = file_get_contents('php://input');
            $data = json_decode($rawInput, true);
            $id = $data['id'] ?? null;
        }

        if (!$id) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "ID requerido para eliminar"]);
            exit();
        }

        $stmt = $pdo->prepare("DELETE FROM brief_submissions WHERE id = :id");
        $stmt->execute([':id' => $id]);

        echo json_encode(["status" => "success", "message" => "Brief eliminado"]);
        exit();
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Error de base de datos: " . $e->getMessage()
    ]);
}
