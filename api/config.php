<?php
$host = 'localhost'; 
$dbname = 'IWT_Assigment'; 
$user = 'root'; 
$pass = 'root'; 

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]);
    exit();
}
?>
