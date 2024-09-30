<?php
require_once '../controllers/category.controller.php';

$requestMethod = $_SERVER["REQUEST_METHOD"];

switch ($requestMethod) {
    case 'GET':
        // Get all categories
        echo getCategories();
        break;

    case 'POST':
        $data = $_POST;


        // Check for action parameter
        if (isset($data['action'])) {
            if ($data['action'] === 'create') {
                // Create a new category
                
                $response = createCategoryController($data);
                echo $response;
            } elseif ($data['action'] === 'update') {
                // Update an existing category
                $response = updateCategoryController($data);
                echo $response;
            } elseif ($data['action'] === 'delete') {
                // Delete a category
                $response = deleteCategoryController($data);
                echo $response;
            } else {
                echo json_encode(["status" => "error", "message" => "Invalid action."]);
            }
        } else {
            echo json_encode(["status" => "error", "message" => "No action specified."]);
        }
        break;

    default:
        echo json_encode(["status" => "error", "message" => "Unknown request method."]);
        break;
}
?>
