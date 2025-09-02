<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once('../config/database.php'); // Adjust path if needed

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['id']) || !isset($data['status'])) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid input']);
    exit();
}

$id = $data['id'];
$status = $data['status'];

$valid_statuses = ['available', 'booked'];
if (!in_array($status, $valid_statuses)) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid status']);
    exit();
}

$isBooked = $status === 'booked' ? 1 : 0;

$stmt = $conn->prepare("UPDATE reservations SET isBooked = ? WHERE resID = ?");
$stmt->bind_param("ii", $isBooked, $id);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Status updated successfully']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to update status']);
}

$stmt->close();
$conn->close();
?>
