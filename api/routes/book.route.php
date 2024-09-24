<?php
require_once '../controllers/book.controller.php';

$requestMethod = $_SERVER["REQUEST_METHOD"];

switch ($requestMethod) {
    case 'GET':

        $isAdmin = isset($_GET['isAdmin']) ? $_GET['isAdmin'] : null;


        $html = getAdminDashboardBookData();

        echo $html;
        break;
    case 'POST':
        $response = createBookController();
        echo   $response;
        break;

    case 'PUT':
        echo "This is a PUT request.";
        break;

    case 'DELETE':
        echo "This is a DELETE request.";
        break;

    default:
        echo "Unknown request method.";
        break;
}
