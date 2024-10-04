<?php
require_once '../controllers/other.controller.php';

$requestMethod = $_SERVER["REQUEST_METHOD"];

switch ($requestMethod) {
    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (isset($data['user_email']) && isset($data['book_author']) && isset($data['book_category']) && isset($data['book_title'])) {
            echo addBookSuggestionController($data['user_email'], $data['book_author'], $data['book_category'], $data['book_title']);
        } else {
            echo json_encode(["status" => "error", "message" => "Missing required fields."]);
        }
        break;

    case 'GET':
        echo getBookSuggestionsController();
        break;

    default:
        echo json_encode(["status" => "error", "message" => "Invalid request method."]);
        break;
}