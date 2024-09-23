<?php
// Database connection
$db_host = 'localhost';
$db_user = 'root';
$db_password = 'root';
$db_db = 'Assigment_Prototype';

$conn = new mysqli(
    $db_host,
    $db_user,
    $db_password,
    $db_db
  );
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
