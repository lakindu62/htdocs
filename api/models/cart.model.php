<?php
include "../config.php"; // Database connection



function getCartItems($user_id)
{
    global $conn;

    // SQL query to get cart items for the user along with book details
    $sql = "SELECT Books.book_id, Books.title, Books.price, Books.imageUrl, Cart_Items.quantity
            FROM Cart_Items
            INNER JOIN Books ON Cart_Items.book_id = Books.book_id
            INNER JOIN Shopping_Carts ON Cart_Items.cart_id = Shopping_Carts.cart_id
            WHERE Shopping_Carts.user_id = ?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $cart_items = [];
    while ($row = $result->fetch_assoc()) {
        $cart_items[] = $row;
    }

    return $cart_items;
}













// Function to create a new shopping cart for a user
function createCart($user_id)
{
    global $conn;
    $sql = "INSERT INTO Shopping_Carts (user_id) VALUES (?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $user_id);
    return $stmt->execute();
}

// Function to check if a cart already exists for the user
function getCartByUserId($user_id)
{
    global $conn;
    $sql = "SELECT * FROM Shopping_Carts WHERE user_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    return $result->fetch_assoc();
}

// Function to add a book to the cart (Cart_Items)
function addToCart($cart_id, $book_id, $quantity)
{
    global $conn;
    // Check if the item already exists in the cart
    $sql = "SELECT * FROM Cart_Items WHERE cart_id = ? AND book_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ii", $cart_id, $book_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // Update the quantity if the item already exists
        $sql = "UPDATE Cart_Items SET quantity = quantity + ? WHERE cart_id = ? AND book_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("iii", $quantity, $cart_id, $book_id);
    } else {
        // Add the item to the cart if it doesn't exist
        $sql = "INSERT INTO Cart_Items (cart_id, book_id, quantity) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("iii", $cart_id, $book_id, $quantity);
    }
    return $stmt->execute();
}

// Function to update cart item quantity
function updateCartItem($cart_id, $book_id, $quantity)
{

    global $conn;
    $sql = "UPDATE Cart_Items SET quantity = ? WHERE cart_id = ? AND book_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("iii", $quantity, $cart_id, $book_id);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        $message = true;
    } else {
        $message = false;
    }

    return $message;
}

// Function to remove an item from the cart
function removeCartItem($cart_id, $book_id)
{
    global $conn;
    $sql = "DELETE FROM Cart_Items WHERE cart_id = ? AND book_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ii", $cart_id, $book_id);
    return $stmt->execute();
}

// Function to delete the entire cart (used when a user clears their cart)
function clearCart($cart_id)
{
    global $conn;
    $sql = "DELETE FROM Cart_Items WHERE cart_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $cart_id);
    return $stmt->execute();
}

// Add this new function at the end of the file
function getCartItemCount($user_id)
{
    global $conn;
    $sql = "SELECT SUM(quantity) as item_count FROM Cart_Items 
            INNER JOIN Shopping_Carts ON Cart_Items.cart_id = Shopping_Carts.cart_id 
            WHERE Shopping_Carts.user_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    return $row['item_count'] ?? 0;
}
