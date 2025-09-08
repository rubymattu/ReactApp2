<?php

// CORS headers
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS, GET");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Handle preflight first
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

session_start();

require_once('../config/config.php');
require_once('../config/database.php');
require_once 'auth.php';

// Session / auth check
if (!isset($_SESSION['user'])) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Unauthorized"]);
    exit;
}

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);

// Validate input
if (!isset($data['id'], $data['reservationName'], $data['reservationTime'], $data['isBooked'])) {
    echo json_encode(['status' => 'error', 'message' => 'Missing fields']);
    exit();
}

$id = intval($data['id']);
$reservationName = trim($data['reservationName']);
$reservationTime = trim($data['reservationTime']);
$isBooked = intval($data['isBooked']); // 0 or 1

if (!in_array($isBooked, [0,1])) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid booking status']);
    exit();
}

// Prevent duplicates
$check = $conn->prepare("SELECT resID FROM reservations WHERE reservationName = ? AND reservationTime = ? AND resID != ?");
$check->bind_param("ssi", $reservationName, $reservationTime, $id);
$check->execute();
$check->store_result();

if ($check->num_rows > 0) {
    echo json_encode(['status' => 'error', 'message' => 'A reservation with the same name and time already exists']);
    $check->close();
    $conn->close();
    exit();
}
$check->close();

// Update
$stmt = $conn->prepare("UPDATE reservations SET reservationName = ?, reservationTime = ?, isBooked = ? WHERE resID = ?");
$stmt->bind_param("ssii", $reservationName, $reservationTime, $isBooked, $id);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Reservation updated successfully']);
    exit;
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to update reservation']);
    exit;
}

$stmt->close();
$conn->close();
?>