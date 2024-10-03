<?php
require_once '../models/review.model.php';

function createReviewController($data) {
    $user_id = $data['user_id'];
    $book_id = $data['book_id'];
    $description = $data['description'];
    $rating = $data['rating'];

    $result = createReview($user_id, $book_id, $description, $rating);
    
    if ($result) {
        return ["success" => true, "message" => "Review created successfully", "review_id" => $result];
    } else {
        return ["success" => false, "message" => "Failed to create review"];
    }
}

function getReviewsByOrderIdController($order_id) {
    $reviews = getReviewsByOrderId($order_id);
    return ["success" => true, "reviews" => $reviews];
}

function updateReviewController($data) {
    $review_id = $data['review_id'];
    $description = $data['description'];
    $rating = $data['rating'];

    $result = updateReview($review_id, $description, $rating);
    
    if ($result) {
        return ["success" => true, "message" => "Review updated successfully"];
    } else {
        return ["success" => false, "message" => "Failed to update review"];
    }
}

function deleteReviewController($review_id) {
    $result = deleteReview($review_id);
    
    if ($result) {
        return ["success" => true, "message" => "Review deleted successfully"];
    } else {
        return ["success" => false, "message" => "Failed to delete review"];
    }
}