<?php

  ini_set('display_errors', 1);
  ini_set('display_startup_errors', 1);
  error_reporting(E_ALL);

  header("Access-Control-Allow-Origin: *");  // Or specify your frontend domain
  header("Access-Control-Allow-Methods: POST, OPTIONS");
  header("Access-Control-Allow-Headers: Content-Type");
  header("Content-Type: application/json");
  header("Access-Control-Allow-Credentials: true");

  require_once('../config/config.php');
  require_once('../config/database.php');
  require_once 'auth.php';

  // define configuration options
  $allowedMethods = ['GET'];
  $maxReservationsPerPage = 4;

  // implement basic pagination
  $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
  $offset = ($page - 1) * $maxReservationsPerPage;

  // query to count total reservations
  $countQuery = "SELECT COUNT(*) as total FROM reservations";
  $countResult = mysqli_query($conn, $countQuery);
  $countRow = mysqli_fetch_assoc($countResult);
  $totalReservations = $countRow['total'];

   // check if reservation query is successful
  if (!$countResult) {
    http_response_code(500);
    echo json_encode(['message' => 'Error fetching reservations count: ' . mysqli_error($conn)]);
    mysqli_close($conn);
    exit();
  }

  // query to get reservations with pagination and ordering
  $query = "SELECT * FROM reservations ORDER BY resID DESC LIMIT $offset, $maxReservationsPerPage";
  $result = mysqli_query($conn, $query);

  // check if reservation query is successful
  if (!$result) {
    http_response_code(500);
    echo json_encode(['message' => 'Error fetching reservations: ' . mysqli_error($conn)]);
    mysqli_close($conn);
    exit();
  }

  // convert query result to associative array
  $reservations = mysqli_fetch_all($result, MYSQLI_ASSOC);
  // check if reservations are found
  if (empty($reservations)) {
    http_response_code(404); // Not Found Error
    echo json_encode(['message' => 'No reservations found', 'totalReservations' => $totalReservations]);
  } else {
    // return reservations as JSON
    http_response_code(200); // OK
    echo json_encode(['reservations' => $reservations, 'totalReservations' => $totalReservations]);
  }
  // close database connection
  mysqli_close($conn);
?>