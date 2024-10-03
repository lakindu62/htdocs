<?php
include_once "../config.php";

function getWishlistItems($user_id) {
    global $conn;
    $query = "SELECT b.book_id, b.title, b.imageUrl, b.price, b.author, b.stock, w.wishlist_id
              FROM Books b
              JOIN Wishlist_Items wi ON b.book_id = wi.book_id
              JOIN Wishlist w ON wi.wishlist_id = w.wishlist_id
              WHERE w.user_id = ?";
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $wishlistItems = [];
    while ($row = $result->fetch_assoc()) {
        $wishlistItems[] = $row;
    }
    
    return $wishlistItems;
}

function addToWishlist($user_id, $book_id) {
    global $conn;
    
    // Check if the user already has a wishlist
    $query = "SELECT wishlist_id FROM Wishlist WHERE user_id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows == 0) {
        // Create a new wishlist for the user
        $query = "INSERT INTO Wishlist (user_id) VALUES (?)";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $wishlist_id = $conn->insert_id;
    } else {
        $row = $result->fetch_assoc();
        $wishlist_id = $row['wishlist_id'];
    }
    
    // Add the book to the wishlist
    $query = "INSERT INTO Wishlist_Items (book_id, wishlist_id) VALUES (?, ?)";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("ii", $book_id, $wishlist_id);
    
    if ($stmt->execute()) {
        return true;
    } else {
        return false;
    }
}

function removeFromWishlist($user_id, $book_id) {
    global $conn;
    
    $query = "DELETE wi FROM Wishlist_Items wi
              JOIN Wishlist w ON wi.wishlist_id = w.wishlist_id
              WHERE w.user_id = ? AND wi.book_id = ?";
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param("ii", $user_id, $book_id);
    
    if ($stmt->execute()) {
        return true;
    } else {
        return false;
    }
}