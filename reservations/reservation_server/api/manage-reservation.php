<?php
header("Content-Type: application/json");

require_once('../config/config.php');
require_once('../config/database.php');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $requestUri = $_SERVER['REQUEST_URI'];
    $parts = explode('/', $requestUri);
    $id = (int)end($parts);

    $query = "SELECT * FROM reservations WHERE resID = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $reservation = $result->fetch_assoc();

        $response = [
            'status' => 'success',
            'data' => [
                'id' => $reservation['resID'],
                'name' => $reservation['reservationName'],
                'time' => $reservation['reservationTime'],
                'isBooked' => $reservation['isBooked']
            ]
        ];

        echo json_encode($response);
    } else {
        $response = [
            'status' => 'error',
            'message' => 'Reservation not found'
        ];
        echo json_encode($response);
    }

    $stmt->close();
    $conn->close();
}
?>
