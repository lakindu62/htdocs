<?php
require_once '../models/auth.model.php';

function registerController($data)
{
    $username = $data['username'];
    $email = $data['email'];
    $password = $data['password'];

    $user_id = registerUser($username, $email, $password);

    if ($user_id) {
        return json_encode(["status" => "success", "message" => "User registered successfully.", "user_id" => $user_id]);
    } else {
        return json_encode(["status" => "error", "message" => "Registration failed."]);
    }
}

function loginController($data)
{
    $email = $data['email'];
    $password = $data['password'];

    $user = loginUser($email, $password);

    if ($user) {
        // Start a session and store user data
        session_start();
        $_SESSION['user'] = $user;
        return json_encode(["status" => "success", "message" => "Login successful.", "user" => $user]);
    } else {
        return json_encode(["status" => "error", "message" => "Invalid email or password."]);
    }
}

function getUserController($user_id)
{
    $user = getUserById($user_id);

    if ($user) {
        return json_encode(["status" => "success", "user" => $user]);
    } else {
        return json_encode(["status" => "error", "message" => "User not found."]);
    }
}

function updateUserController($data)
{
    $user_id = $data['user_id'];
    $username = $data['username'];
    $email = $data['email'];

    $result = updateUser($user_id, $username, $email);

    if ($result) {
        return json_encode(["status" => "success", "message" => "User updated successfully."]);
    } else {
        return json_encode(["status" => "error", "message" => "Failed to update user."]);
    }
}
