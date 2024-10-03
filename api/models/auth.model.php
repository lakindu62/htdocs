<?php
include "../config.php";

function registerUser($username, $email, $password)
{
    global $conn;
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    
    $stmt = $conn->prepare("INSERT INTO Users (username, email, password) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $username, $email, $hashed_password);
    
    if ($stmt->execute()) {
        $user_id = $stmt->insert_id;
        $stmt->close();
        return $user_id;
    } else {
        $stmt->close();
        return false;
    }
}

function loginUser($email, $password)
{
    global $conn;
    $stmt = $conn->prepare("SELECT user_id, username, password FROM Users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();
        if (password_verify($password, $user['password'])) {
            unset($user['password']);
            $stmt->close();
            return $user;
        }
    }
    
    $stmt->close();
    return false;
}

function getUserById($user_id)
{
    global $conn;
    $stmt = $conn->prepare("SELECT user_id, username, email FROM Users WHERE user_id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();
        $stmt->close();
        return $user;
    }
    
    $stmt->close();
    return false;
}

function updateUser($user_id, $username, $email)
{
    global $conn;
    $stmt = $conn->prepare("UPDATE Users SET username = ?, email = ? WHERE user_id = ?");
    $stmt->bind_param("ssi", $username, $email, $user_id);
    
    if ($stmt->execute()) {
        $stmt->close();
        return true;
    } else {
        $stmt->close();
        return false;
    }
}
