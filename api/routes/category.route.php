<?php
require_once '../controllers/category.controller.php';

$requestMethod = $_SERVER["REQUEST_METHOD"];

switch ($requestMethod) {
    case 'GET':
        echo getAllCategoriesController();
        break;

    case 'POST':
        $data = $_POST;
        if (isset($data['action']) && $data['action'] === 'create') {
            if (isset($data['category_name'])) {
                echo createCategoryController($data['category_name']);
            } else {
                echo json_encode(["success" => false, "message" => "Category name is required"]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "Invalid action"]);
        }
        break;

    default:
        echo "Unknown request method.";
        break;
}
?>
