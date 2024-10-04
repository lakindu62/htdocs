<?php
require_once '../models/user.model.php';

function getUserController($user_id) {
    $user = getUser($user_id);
    if ($user) {
        return json_encode(['success' => true, 'user' => $user]);
    } else {
        return json_encode(['success' => false, 'message' => 'User not found']);
    }
}

function updateUserController($data) {
    $result = updateUser($data);
    if ($result) {
        return json_encode(['success' => true, 'message' => 'User updated successfully']);
    } else {
        return json_encode(['success' => false, 'message' => 'Failed to update user']);
    }
}

function changePasswordController($data) {
    if (!isset($data['user_id']) || !isset($data['current_password']) || !isset($data['new_password'])) {
        return json_encode(['success' => false, 'message' => 'Missing required fields']);
    }

    $result = changePassword($data['user_id'], $data['current_password'], $data['new_password']);
    if ($result) {
        return json_encode(['success' => true, 'message' => 'Password changed successfully']);
    } else {
        return json_encode(['success' => false, 'message' => 'Failed to change password']);
    }
}
