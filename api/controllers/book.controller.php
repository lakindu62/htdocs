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
        if (!empty($bookData["categories"])) {

            $bookData["categories"] = explode(',',    $bookData["categories"]);
        } else {
            $bookData["categories"] = [];
        }
        return json_encode($bookData);
    } else {
        return json_encode(['Error' => "No book found"]);
    }


    $json_data = json_encode($bookData);
    return $json_data;
}


function getBookDetailsController($book_id)
{
    $reviews = getReviews( $book_id);
    $ratingCounts = getRatingCounts( $book_id);
    $bookDetails = getBookDetails( $book_id);
    
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

    var_dump(
        $title,
        $author,
        $stock,
        $description,
        $imageUrl,
        $price
    );





    createBook(
        $title,
        $author,
        $stock,
        $description,
        $imageUrl,
        $price
    );
}



function updateBookController($data)
{
    $book_id = $data['book_id'];
    $title = $data['title'];
    $author = $data['author'];
    $description = $data['description'];
    $imageUrl = $data['imageUrl'];
    $price = $data['price'];
    $stock = $data['stock'];
    $categories = $data['categories']; // This should be an array of category IDs

    // Update the book details
    $updateBookResponse = updateBook($book_id, $title, $author, $description, $imageUrl, $price, $stock);

    if ($updateBookResponse) {
        // Update the book categories
        updateBookCategories($book_id, $categories);
        return json_encode(["success" => true, "message" => "Book updated successfully."]);
    } else {
        return json_encode(["success" => false, "message" => "Error updating book."]);
    }
}
