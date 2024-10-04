<?php
require_once '../controllers/book.controller.php';

$requestMethod = $_SERVER["REQUEST_METHOD"];

switch ($requestMethod) {
    case 'GET':

        if (isset($_GET['action']) && $_GET['action'] === 'analytics') {
            $json = getAnalyticsController();
            echo $json;
            break;
        }

        //get books for the admin dashboard
        $isAdmin = isset($_GET['isAdmin']) ? $_GET['isAdmin'] : null;

        $book_id = isset($_GET["book_id"]) ? $_GET["book_id"] : null;
        $user_id = isset($_GET["user_id"]) ? $_GET["user_id"] : null;
        if ($book_id && $isAdmin) {
            $json = getAdminSingleBookDataController($book_id);
            echo $json;
            break;
        }

        if ($isAdmin) {
            $json = getAdminDashboardBooksData();
            header('Content-Type: application/json');
            echo $json;
            break;
        }
        //get details of a single book for the admin


        if ($book_id) {
            $json = getBookDetailsController($book_id);
            echo $json;
            break;
        }


        $json = getBooksByCategory($user_id);
        echo $json;
        break;


       

    case 'POST':

        $data = $_POST;



        // Check for action parameter
        if (isset($data['action'])) {
            if ($data['action'] === 'create') {
                // Create a new book
                $response = createBookController($data);
                echo $response;
            } elseif ($data['action'] === 'update') {
                // Update an existing book
                $response = updateBookController($data);
                echo $response;
            } elseif ($data['action'] === 'delete') {
                // Delete a book
                // $response = deleteBookController($data);
                // echo $response;
            } else {
                echo json_encode(["status" => "error", "message" => "Invalid action."]);
            }
        } else {
            echo json_encode(["status" => "error", "message" => "No action specified."]);
        }
        break;

    default:
        echo "Unknown request method.";
        break;
}
