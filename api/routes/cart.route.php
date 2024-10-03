<?php
require_once '../controllers/cart.controller.php';

$requestMethod = $_SERVER["REQUEST_METHOD"];

switch ($requestMethod) {
    case 'POST':
        $data = $_POST;
        $user_id = $data['user_id'];
        $book_id = isset($data['book_id']) ? $data['book_id'] : null;
        $quantity = isset($data['quantity']) ? $data['quantity'] : null;

        if (isset($data['action'])) {
            switch ($data['action']) {
                case 'clear_cart':
                    echo clearCartController($user_id);
                    break;
                case 'remove_item':
                    echo removeCartItemController($user_id, $book_id);
                    break;
                case 'update_quantity':
                    if ($quantity !== null) {
                        echo updateCartItemController($user_id, $book_id, $quantity);
                    } else {
                        echo json_encode(["status" => "error", "message" => "Quantity is missing."]);
                    }
                    break;
                case 'add_to_cart':
                    if ($quantity !== null) {
                        echo addBookToCartController($user_id, $book_id, $quantity);
                    } else {
                        echo json_encode(["status" => "error", "message" => "Quantity is missing."]);
                    }
                    break;
                default:
                    echo json_encode(["status" => "error", "message" => "Invalid action."]);
            }
        } else {
            echo json_encode(["status" => "error", "message" => "Action is missing."]);
        }
        break;

    case 'GET':
        if (isset($_GET['action']) && $_GET['action'] === 'get_item_count' && isset($_GET['user_id'])) {
            $user_id = $_GET['user_id'];
            echo getCartItemCountController($user_id);
        } elseif (isset($_GET['user_id'])) {
            $user_id = $_GET['user_id'];
            $response = getCartItemsController($user_id);
            echo $response;
        } else {
            echo json_encode(["status" => "error", "message" => "User ID is missing."]);
        }
        break;

    default:
        echo json_encode(["status" => "error", "message" => "Invalid request method."]);
        break;
}
