<?php


// Controller: bookController.php
require_once '../models/book.model.php'; // Include the model




function getAdminDashboardBooksData()
{
    $books = getBooks();
    return json_encode($books);
};


function getAdminSingleBookDataController($book_id)
{
    $bookData = getAdminSingleBookData($book_id);

    if ($bookData) {
        // Fetch book categories
        $bookCategories = getBookCategories($book_id);
        
        // Add categories to the book data
        $bookData['categories'] = $bookCategories;
        return json_encode($bookData);
    } else {
        return json_encode(['Error' => "No book found"]);
    }


    $json_data = json_encode($bookData);
    return $json_data;
}


function getBookDetailsController($book_id)
{
    $reviews = getReviews($book_id);
    $ratingCounts = getRatingCounts($book_id);
    $bookDetails = getBookDetails($book_id);

    // Prepare the response data
    $response = [
        'book' => $bookDetails,
        'reviews' => $reviews,
        'ratingCounts' => $ratingCounts
    ];

    return json_encode($response);
}



function getBooksByCategory($user_id)
{
    $booksByCategory = getAllBooksWithCategories($user_id);
    header('Content-Type: application/json');
    return json_encode($booksByCategory); //  JSON encoded data
}





function createBookController()
{
    $title = $_POST['title'];
    $author = $_POST['author'];
    $description = $_POST['description'];
    $imageUrl = $_POST['imageUrl'];
    $price = $_POST['price'];
    $stock = $_POST['stock'];
    $categories = json_decode($_POST['categories'], true);

    $book_id = createBook($title, $author, $stock, $description, $imageUrl, $price);
 

    if ($book_id) {
        if (!empty($categories)) {
            
            updateBookCategories($book_id, $categories);
        }
        return json_encode(["success" => true, "message" => "Book added successfully."]);
    } else {
        return json_encode(["success" => false, "message" => "Error adding book."]);
    }
}



function updateBookController($data)
{
    $book_id = $data['bookId'];
    $title = $data['title'];
    $author = $data['author'];
    $description = $data['description'];
    $imageUrl = $data['imageUrl'];
    $price = $data['price'];
    $stock = $data['stock'];

    // var_dump($book_id, $title, $author, $description, $imageUrl, $price, $stock);

    // var_dump($data['category']);
    // var_dump($data);
    $categories = json_decode($data['category'], true);
    // Update the book details
    $updateBookResponse = updateBook($book_id, $title, $author, $description, $imageUrl, $price, $stock);

    if ($updateBookResponse) {
        // Only update categories if they're provided
        if (isset( $categories) && is_array( $categories)) {
            updateBookCategories($book_id,  $categories);
        }
        return json_encode(["success" => true, "message" => "Book updated successfully."]);
    } else {
        return json_encode(["success" => false, "message" => "Error updating book."]);
    }
}

function getAnalyticsController()
{
    $bestPerformingBook = getBestPerformingBook();
    $lowStockCount = getLowStockCount();
    $lowPerformingBooks = getLowPerformingBooks();

    $response = [
        'bestPerformingBook' => $bestPerformingBook,
        'lowStockCount' => $lowStockCount,
        'lowPerformingBooks' => $lowPerformingBooks
    ];

    return json_encode($response);
}

function deleteBookController($book_id) {
    if (deleteBook($book_id)) {
        return json_encode(["success" => true, "message" => "Book deleted successfully."]);
    } else {
        return json_encode(["success" => false, "message" => "Error deleting book."]);
    }
}
