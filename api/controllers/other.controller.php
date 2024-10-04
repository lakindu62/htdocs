<?php
require_once '../models/other.model.php';

function addBookSuggestionController($user_email, $book_author, $book_category, $book_title) {
    $success = addBookSuggestion($user_email, $book_author, $book_category, $book_title);
    
    return json_encode([
        "status" => $success ? "success" : "error",
        "message" => $success ? "Book suggestion added successfully." : "Failed to add book suggestion."
    ]);
}


function getBookSuggestionsController() {
    $suggestions = getBookSuggestions();
    
    if ($suggestions) {
        return json_encode([
            "status" => "success",
            "data" => $suggestions
        ]);
    } else {
        return json_encode([
            "status" => "error",
            "message" => "No book suggestions found."
        ]);
    }
}