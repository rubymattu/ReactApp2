<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
header("Access-Control-Allow-Credentials: true");

require_once('../config/config.php');
require_once('../config/database.php');
require_once 'auth.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if (!isset($_SESSION['user'])) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Unauthorized"]);
    exit;
}

// Extract resID from URL
$requestUri = $_SERVER['REQUEST_URI'];
$parts = explode('/', $requestUri);
$resID = intval(end($parts));

$stmt = $conn->prepare("SELECT resID, reservationName, reservationTime, isBooked, imageName FROM reservations WHERE resID = ?");
$stmt->bind_param("i", $resID);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    echo json_encode([
        "status" => "success",
        "data" => [
            "resID" => $row["resID"],
            "reservationName" => $row["reservationName"],
            "reservationTime" => $row["reservationTime"],
            "isBooked" => $row["isBooked"],
            "imageName" => $row["imageName"]
        ]
    ]);
} else {
    echo json_encode(["status" => "error", "message" => "Reservation not found"]);
}

$stmt->close();
$conn->close();
?>