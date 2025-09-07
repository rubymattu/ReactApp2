<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include required files
require_once('../config/database.php');
require_once('../config/config.php');
require_once 'auth.php';

// Read and decode incoming JSON
$data = json_decode(file_get_contents('php://input'), true);

// Validate input
if (!isset($data['id'])) {
    echo json_encode(['status' => 'error', 'message' => 'Reservation ID is required']);
    exit;
}

$resID = intval($data['id']); // Sanitize input

// Prepare and execute delete query
$stmt = $conn->prepare("DELETE FROM reservations WHERE resID = ?");
$stmt->bind_param("i", $resID);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Reservation deleted successfully']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to delete reservation']);
}

// Clean up
$stmt->close();
$conn->close();
?>