<?php
include_once "../config.php";

function createReview($user_id, $book_id, $description, $rating) {


    global $conn;
    $stmt = $conn->prepare("INSERT INTO Reviews (user_id, book_id, description, rating, review_date) VALUES (?, ?, ?, ?, NOW())");
    $stmt->bind_param("iisi", $user_id, $book_id, $description, $rating);
    
    if ($stmt->execute()) {
        return $conn->insert_id;
    } else {
        return false;
    }
}

function getReviewsByOrderId($order_id) {
    global $conn;
    $stmt = $conn->prepare("
     SELECT r.*, b.title as book_title 
FROM Reviews r 
JOIN Order_Items oi ON r.book_id = oi.book_id 
JOIN Books b ON r.book_id = b.book_id
JOIN Orders o ON oi.order_id = o.order_id
WHERE oi.order_id = ?
AND r.user_id = o.user_id
    ");
    $stmt->bind_param("i", $order_id);
    $stmt->execute();
    $result = $stmt->get_result();
    return $result->fetch_all(MYSQLI_ASSOC);
}

function updateReview($review_id, $description, $rating) {
    global $conn;
    $stmt = $conn->prepare("UPDATE Reviews SET description = ?, rating = ? WHERE review_id = ?");
    $stmt->bind_param("sii", $description, $rating, $review_id);
    return $stmt->execute();
}

function deleteReview($review_id) {
    global $conn;
    $stmt = $conn->prepare("DELETE FROM Reviews WHERE review_id = ?");
    $stmt->bind_param("i", $review_id);
    return $stmt->execute();
}
