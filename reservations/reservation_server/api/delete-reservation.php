<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
require_once('../config/database.php');

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['id'])) {
    echo json_encode(['status' => 'error', 'message' => 'Reservation ID is required']);
    exit;
}

$resID = intval($data['id']); // sanitize input

// Delete reservation
$stmt = $conn->prepare("DELETE FROM reservations WHERE resID = ?");
$stmt->bind_param("i", $resID);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Reservation deleted successfully']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to delete reservation']);
}

$stmt->close();
$conn->close();
