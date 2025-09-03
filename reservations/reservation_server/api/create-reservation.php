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

// Handle file upload (optional)
$imageName = null;
$uploadDir = __DIR__ . '/uploads/';

if (!empty($_FILES['image']['name'])) {
    $originalName = basename($_FILES['image']['name']);
    $targetFilePath = $uploadDir . $originalName;

    // Check if file already exists
    if (file_exists($targetFilePath)) {
        http_response_code(400);
        echo json_encode(['message' => 'File already exists: ' . $originalName]);
        exit();
    }

    if (!move_uploaded_file($_FILES['image']['tmp_name'], $targetFilePath)) {
        http_response_code(500);
        echo json_encode([
            'message' => 'Error uploading file',
            'php_error' => $_FILES['image']['error']
        ]);
        exit();
    }

    $imageName = $originalName;
} else {
    $imageName = 'placeholder.jpg';
}

// Default isBooked
$isBooked = 0;

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



// Prepare SQL
$stmt = $conn->prepare('INSERT INTO reservations (imageName, reservationName, reservationTime, isBooked) VALUES (?, ?, ?,?)');
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
        'res\ID' => $id,
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
