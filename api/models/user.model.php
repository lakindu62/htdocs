<?php
include_once "../config.php";

function getUser($user_id) {
    global $conn;
    $stmt = $conn->prepare("SELECT user_id, username, email FROM Users WHERE user_id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    $stmt->close();
    return $user;
}

function updateUser($data) {
    global $conn;
    $stmt = $conn->prepare("UPDATE Users SET username = ?, email = ? WHERE user_id = ?");
    $stmt->bind_param("ssi", $data['username'], $data['email'], $data['user_id']);
    $stmt->execute();
    $affected_rows = $stmt->affected_rows;
    $stmt->close();
    return $affected_rows > 0;
}

function changePassword($user_id, $current_password, $new_password) {
    global $conn;
    
    // Verify current password
    $stmt = $conn->prepare("SELECT password FROM Users WHERE user_id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    $stmt->close();

    if (!$user || !password_verify($current_password, $user['password'])) {
        return false;
    }

    // Update password
    $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);
    $stmt = $conn->prepare("UPDATE Users SET password = ? WHERE user_id = ?");
    $stmt->bind_param("si", $hashed_password, $user_id);
    $stmt->execute();
    $affected_rows = $stmt->affected_rows;
    $stmt->close();
    return $affected_rows > 0;
}
