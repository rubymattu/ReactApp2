<?php
session_start();

if (!isset($_SESSION['user'])) {
    http_response_code(401); // Unauthorized
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit;
}
?>
