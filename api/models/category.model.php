<?php
include "../config.php";

function fetchCategories()
{
    global $conn;
    $sql = "SELECT * FROM Categories";
    $result = mysqli_query($conn, $sql);

    $categories = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $categories[] = $row;
    }

    return $categories;
}

function createCategory($categoryName)
{
    global $conn;
    $stmt = $conn->prepare("INSERT INTO Categories (category_name) VALUES (?)");
    $stmt->bind_param("s", $categoryName);

    // Execute the statement
    if ($stmt->execute()) {
        return json_encode(["status" => "success", "message" => "Category created successfully."]);
    } else {
        return json_encode(["status" => "error", "message" => "Error: " . $stmt->error]);
    }

    $stmt->close();
}

function updateCategory($categoryId, $categoryName)
{
    global $conn;
    $stmt = $conn->prepare("UPDATE Categories SET category_name = ? WHERE category_id = ?");
    $stmt->bind_param("si", $categoryName, $categoryId);

    // Execute the statement
    if ($stmt->execute()) {
        return json_encode(["status" => "success", "message" => "Category updated successfully."]);
    } else {
        return json_encode(["status" => "error", "message" => "Error: " . $stmt->error]);
    }

    $stmt->close();
}

function deleteCategory($categoryId)
{
    global $conn;
    $stmt = $conn->prepare("DELETE FROM Categories WHERE category_id = ?");
    $stmt->bind_param("i", $categoryId);

    // Execute the statement
    if ($stmt->execute()) {
        return json_encode(["status" => "success", "message" => "Category deleted successfully."]);
    } else {
        return json_encode(["status" => "error", "message" => "Error: " . $stmt->error]);
    }

    $stmt->close();
}

function getAllCategories() {
    global $conn;
    $sql = "SELECT category_id, category_name FROM Categories ORDER BY category_name";
    $result = mysqli_query($conn, $sql);

    $categories = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $categories[] = $row;
    }

    return $categories;
}

