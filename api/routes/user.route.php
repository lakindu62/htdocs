<?php
require_once '../controllers/user.controller.php';

$requestMethod = $_SERVER["REQUEST_METHOD"];

switch ($requestMethod) {
    case 'GET':
        if (isset($_GET['user_id'])) {
            $user_id = $_GET['user_id'];
            echo getUserController($user_id);
        } else {
            echo json_encode(['error' => 'User ID is required']);
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        if (isset($data['user_id'])) {
            echo updateUserController($data);
        } else {
            echo json_encode(['error' => 'User ID is required']);
        }
        break;

    case 'POST':
        if (isset($_GET['change_password'])) {
            $data = json_decode(file_get_contents('php://input'), true);
            echo changePasswordController($data);
        } else {
            echo json_encode(['error' => 'Invalid POST request']);
        }
        break;

    default:
        echo json_encode(['error' => 'Invalid request method']);
        break;
}
