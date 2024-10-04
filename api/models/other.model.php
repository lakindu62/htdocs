<?php
include "../config.php"; // Database connection

function addBookSuggestion($user_email, $book_author, $book_category, $book_title) {
    global $conn;
    $sql = "INSERT INTO Book_Suggestions (user_email, book_author, book_category, book_title) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssss", $user_email, $book_author, $book_category, $book_title);
    return $stmt->execute();
}

function getBookSuggestions() {
    global $conn;
    $sql = "SELECT * FROM Book_Suggestions ORDER BY suggestion_id DESC";
    $result = $conn->query($sql);
    $suggestions = [];
    while ($row = $result->fetch_assoc()) {
        $suggestions[] = $row;
    }
    return $suggestions;
}