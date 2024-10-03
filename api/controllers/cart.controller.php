<?php
require_once '../models/cart.model.php';




function getCartItemsController($user_id) {
    // Fetch cart items from model
    $cart_items = getCartItems($user_id);
    
    if ($cart_items) {
        // Return JSON of cart items if found
        return json_encode([
            "status" => "success",
            "data" => $cart_items
        ]);
    } else {
        return json_encode([
            "status" => "error",
            "message" => "No items found in cart."
        ]);
    }
}







// Function to handle adding a book to the cart
function addBookToCartController($user_id, $book_id, $quantity) {
    // Check if the user already has a cart
    $cart = getCartByUserId($user_id);
    if (!$cart) {
        // If the cart doesn't exist, create a new one
        createCart($user_id);
        $cart = getCartByUserId($user_id); // Fetch the newly created cart
    }

    // Add the book to the cart
    $cart_id = $cart['cart_id'];
    $success = addToCart($cart_id, $book_id, $quantity);

    return json_encode([
        "status" => $success ? "success" : "error",
        "message" => $success ? "Item added to cart." : "Failed to add item to cart."
    ]);
}

// Function to update cart item quantity
function updateCartItemController($user_id, $book_id, $quantity) {

    $cart = getCartByUserId($user_id);

    if ($cart) {
        $cart_id = $cart['cart_id'];
        $success = updateCartItem($cart_id, $book_id, $quantity);

        return json_encode([
            "status" => $success ? "success" : "error",
            "message" => $success ? "sucessfully updated the cart" : "Error updating cart"
        ]);
    } else {
        return json_encode(["status" => "error", "message" => "Cart not found."]);
    }
}

// Function to remove an item from the cart
function removeCartItemController($user_id, $book_id) {
    $cart = getCartByUserId($user_id);
    if ($cart) {
        $cart_id = $cart['cart_id'];
        $success = removeCartItem($cart_id, $book_id);

        return json_encode([
            "status" => $success ? "success" : "error",
            "message" => $success ? "Item removed from cart." : "Failed to remove item."
        ]);
    } else {
        return json_encode(["status" => "error", "message" => "Cart not found."]);
    }
}

// Function to clear the cart
function clearCartController($user_id) {
    $cart = getCartByUserId($user_id);
    if ($cart) {
        $cart_id = $cart['cart_id'];
        $success = clearCart($cart_id);

        return json_encode([
            "status" => $success ? "success" : "error",
            "message" => $success ? "Cart cleared." : "Failed to clear cart."
        ]);
    } else {
        return json_encode(["status" => "error", "message" => "Cart not found."]);
    }
}

// Add this new function at the end of the file
function getCartItemCountController($user_id) {
    $item_count = getCartItemCount($user_id);
    return json_encode([
        "status" => "success",
        "data" => $item_count
    ]);
}
