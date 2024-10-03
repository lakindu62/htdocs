<?php
require_once '../controllers/wishlist.controller.php';

$requestMethod = $_SERVER["REQUEST_METHOD"];

switch ($requestMethod) {
    case 'GET':
        if (isset($_GET['user_id'])) {
            $user_id = $_GET['user_id'];
            echo getWishlistItemsController($user_id);
        } else {
            echo json_encode(['error' => 'User ID is required']);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        if (isset($data['user_id']) && isset($data['book_id'])) {
            echo addToWishlistController($data['user_id'], $data['book_id']);
        } else {
            echo json_encode(['error' => 'User ID and Book ID are required']);
        }
        break;

    case 'DELETE':
        $data = json_decode(file_get_contents("php://input"), true);
        if (isset($data['user_id']) && isset($data['book_id'])) {
            echo removeFromWishlistController($data['user_id'], $data['book_id']);
        } else {
            echo json_encode(['error' => 'User ID and Book ID are required']);
        }
        break;

    default:
        echo json_encode(['error' => 'Invalid request method']);
        break;
}
