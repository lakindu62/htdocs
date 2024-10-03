<?php
require_once '../controllers/cart.controller.php';

$requestMethod = $_SERVER["REQUEST_METHOD"];


switch ($requestMethod) {
    case 'POST':
        $data = $_POST;
        $user_id = $data['user_id'];
        $book_id = $data['book_id'];
        $quantity = $data['quantity'];

     

        // Action to add a book to the cart
        // if (isset($data['action']) && $data['action'] === 'add_to_cart') {
        //     echo addBookToCartController($user_id, $book_id, $quantity);
        // }

        // Action to update the quantity of a cart item
        if (isset($data['action']) && $data['action'] === 'update_quantity') {
          

            echo updateCartItemController($user_id, $book_id, $quantity);
        }

        // Action to remove an item from the cart
        elseif (isset($data['action']) && $data['action'] === 'remove_item') {
            echo removeCartItemController($user_id, $book_id);
        }

        // Action to clear the cart
        elseif (isset($data['action']) && $data['action'] === 'clear_cart') {
            echo clearCartController($user_id);
        }
        break;



    case 'GET':

         // New endpoint to get cart item count
         if (isset($_GET['action']) && $_GET['action'] === 'get_item_count' && isset($_GET['user_id'])) {
            $user_id = $_GET['user_id'];
            echo getCartItemCountController($user_id);

        }
        // Fetch cart items for a user
        elseif (isset($_GET['user_id'])) {
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
