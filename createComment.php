<?php
// Database connection
require "./config.php";

// Handle form submission

$name = $_POST['name'];
$comment = $_POST['comment'];


echo $name;
echo $comment;


$sql = "INSERT INTO comments (name, comment) VALUES ($name, $comment)";
if ($conn->query($sql)) {
    echo "Inserted successfully";
} else {
    echo "Error:" . $conn->error;
}
$conn->close();


