<?php
require_once '../models/category.model.php'; // Include the model

function getCategories()
{
    $categories = fetchCategories();
    return json_encode($categories);
}



function updateCategoryController($data)
{
    $categoryId = $data['category_id'];
    $categoryName = $data['category_name'];

    if (empty($categoryId) || empty($categoryName)) {
        return json_encode(["status" => "error", "message" => "Category ID and name are required."]);
    }

    return updateCategory($categoryId, $categoryName);
}

function deleteCategoryController($data)
{
    $categoryId = $data['category_id'];

    if (empty($categoryId)) {
        return json_encode(["status" => "error", "message" => "Category ID is required."]);
    }

    return deleteCategory($categoryId);
}

function getAllCategoriesController() {
    $categories = getAllCategories();
    return json_encode($categories);
}

function createCategoryController($category_name) {
    $category_id = createCategory($category_name);
    if ($category_id) {
        return json_encode(["success" => true, "message" => "Category created successfully", "category_id" => $category_id]);
    } else {
        return json_encode(["success" => false, "message" => "Error creating category"]);
    }
}
?>
