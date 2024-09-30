<?php
require_once '../models/category.model.php'; // Include the model

function getCategories()
{
    $categories = fetchCategories();
    return json_encode($categories);
}

function createCategoryController($data)
{
    $categoryName = $data['category_name'];

    if (empty($categoryName)) {
        return json_encode(["status" => "error", "message" => "Category name is required."]);
    }

    return createCategory($categoryName);
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
?>
