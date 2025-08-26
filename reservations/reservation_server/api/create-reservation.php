<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once('../config/config.php');
require_once('../config/database.php');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get raw JSON input
$request_body = file_get_contents('php://input');
$data = json_decode($request_body, true);

// Validate JSON
if ($data === null) {
    http_response_code(400);
    echo json_encode(['message' => 'Invalid JSON or empty request body']);
    exit();
}

// Validate required fields
if (empty($data['reservationName']) || empty($data['reservationTime'])) {
    http_response_code(400);
    echo json_encode(['message' => 'Missing required parameters']);
    exit();
}

// Sanitize
$reservationName = htmlspecialchars(strip_tags($data['reservationName']));
$reservationTime = htmlspecialchars(strip_tags($data['reservationTime']));

// Default isBooked
$isBooked = 0;

// Prepare SQL
$stmt = $conn->prepare('INSERT INTO reservations (reservationName, reservationTime, isBooked) VALUES (?, ?, ?)');
if (!$stmt) {
    http_response_code(500);
    echo json_encode(['message' => 'Prepare failed: ' . $conn->error]);
    exit();
}

$stmt->bind_param('ssi', $reservationName, $reservationTime, $isBooked);

if ($stmt->execute()) {
    $id = $stmt->insert_id;
    http_response_code(201);
    echo json_encode([
        'message' => 'Reservation created successfully',
        'res\ID' => $id,
        'reservationName' => $reservationName,
        'reservationTime' => $reservationTime,
        'isBooked' => $isBooked
    ]);
} else {
    http_response_code(500);
    echo json_encode(['message' => 'Error creating reservation: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
