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

// ✅ Get values from form-data instead of JSON
$reservationName = isset($_POST['reservationName']) ? htmlspecialchars(strip_tags($_POST['reservationName'])) : '';
$reservationTime = isset($_POST['reservationTime']) ? htmlspecialchars(strip_tags($_POST['reservationTime'])) : '';

// Validate required fields
if (empty($reservationName) || empty($reservationTime)) {
    http_response_code(400);
    echo json_encode(['message' => 'Missing required parameters']);
    exit();
}

// Handle file upload
$imageName = 'placeholder.jpg';
$uploadDir = __DIR__ . '/uploads/';

if (!empty($_FILES['image']['name'])) {
    $originalName = basename($_FILES['image']['name']); // avoid overwrites
    $targetFilePath = $uploadDir . $originalName;

    if (!move_uploaded_file($_FILES['image']['tmp_name'], $targetFilePath)) {
        http_response_code(500);
        echo json_encode([
            'message' => 'Error uploading file',
            'php_error' => $_FILES['image']['error']
        ]);
        exit();
    }

    $imageName = $originalName;
}

// Default isBooked
$isBooked = 0;

// Check for duplicates
$checkStmt = $conn->prepare(
    "SELECT * FROM reservations WHERE reservationName = ? AND reservationTime = ?"
);
$checkStmt->bind_param("ss", $reservationName, $reservationTime);
$checkStmt->execute();
$result = $checkStmt->get_result();

if ($result->num_rows > 0) {
    http_response_code(409);
    echo json_encode([
      "message" => "This reservation area and time already exists",
    ]);
    exit();
}

// Insert into DB
$stmt = $conn->prepare('INSERT INTO reservations (imageName, reservationName, reservationTime, isBooked) VALUES (?, ?, ?, ?)');
if (!$stmt) {
    http_response_code(500);
    echo json_encode(['message' => 'Prepare failed: ' . $conn->error]);
    exit();
}

$stmt->bind_param('sssi', $imageName, $reservationName, $reservationTime, $isBooked);

if ($stmt->execute()) {
    $id = $stmt->insert_id;
    http_response_code(201);
    echo json_encode([
        'message' => 'Reservation created successfully',
        'resID' => $id,
        'imageName' => $imageName,
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
