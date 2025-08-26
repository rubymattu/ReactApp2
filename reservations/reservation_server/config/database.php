<?php

  // Database configuration
  $dbHost = 'localhost';
  $dbUsername = 'root';
  $dbName = 'react_reservations';
  $dbPassword = '';

  // Create a connection
  $conn = new mysqli($dbHost, $dbUsername, $dbPassword, $dbName);

  // Check connection
  if ($conn->connect_error) {
    die("Connection failed: ". $conn->connect_error);
  }
?>