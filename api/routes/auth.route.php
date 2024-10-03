<?php
require_once '../controllers/auth.controller.php';

$requestMethod = $_SERVER["REQUEST_METHOD"];

switch ($requestMethod) {
    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (isset($data['action'])) {
            switch ($data['action']) {
                case 'register':
                    $response = registerController($data);
                    echo $response;
                    break;
                case 'login':
                    $response = loginController($data);
                    echo $response;
                    break;
                default:
                    echo json_encode(["status" => "error", "message" => "Invalid action."]);
                    break;
            }
        } else {
            echo json_encode(["status" => "error", "message" => "No action specified."]);
        }
        break;

    case 'GET':
        if (isset($_GET['user_id'])) {
            $response = getUserController($_GET['user_id']);
            echo $response;
        } else {
            echo json_encode(["status" => "error", "message" => "User ID not provided."]);
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);
        if (isset($data['user_id'])) {
            $response = updateUserController($data);
            echo $response;
        } else {
            echo json_encode(["status" => "error", "message" => "User ID not provided."]);
        }
        break;

    default:
        echo json_encode(["status" => "error", "message" => "Unknown request method."]);
        break;
}
