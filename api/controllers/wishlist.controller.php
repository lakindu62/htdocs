<?php
require_once '../models/wishlist.model.php';

function getWishlistItemsController($user_id) {
    $wishlistItems = getWishlistItems($user_id);

    return json_encode($wishlistItems);
}

function addToWishlistController($user_id, $book_id) {
    $result = addToWishlist($user_id, $book_id);
    if ($result) {
        return json_encode(['success' => true, 'message' => 'Book added to wishlist successfully']);
    } else {
        return json_encode(['success' => false, 'message' => 'Failed to add book to wishlist']);
    }
}

function removeFromWishlistController($user_id, $book_id) {
    $result = removeFromWishlist($user_id, $book_id);
    if ($result) {
        return json_encode(['success' => true, 'message' => 'Book removed from wishlist successfully']);
    } else {
        return json_encode(['success' => false, 'message' => 'Failed to remove book from wishlist']);
    }
}
