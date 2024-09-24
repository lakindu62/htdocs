<?php


// Controller: bookController.php




require_once '../models/book.model.php'; // Include the model

function getAdminDashboardBookData()
{
    $books = getBooks();

    $html = '';
    foreach ($books as $book) {
        $html .= "<tr>
                    <td>{$book['title']}</td>
                    <td>{$book['author']}</td>
                    <td>{$book['description']}</td>
                    <td>{$book['stock']}</td>
                  </tr>";
    }
    return $html;
};



function getBookCategoryHtml()
{
    // Get the books organized by category from the model
    $booksByCategory = getAllBooksWithCategories();

    // Generate partial HTML for the books
    ob_start(); // Start output buffering

    foreach ($booksByCategory as $category => $books) {
        echo "<div class='category-section'>";
        echo "<h2 class='category-title'>" . htmlspecialchars($category) . "</h2>";
        echo "<ul class='book-list'>";
        foreach ($books as $book) {
            echo "<li class='book-item'>";
            echo "<img src='" . htmlspecialchars($book['imageUrl']) . "' alt='" . htmlspecialchars($book['title']) . "' style='width: 50px;'>";
            echo "<strong>" . htmlspecialchars($book['title']) . "</strong> by " . htmlspecialchars($book['author']) . " - $" . htmlspecialchars($book['price']);
            echo "</li>";
        }
        echo "</ul>";
        echo "</div>";
    }

    $htmlContent = ob_get_clean(); // Get the buffered output

    return  $htmlContent;
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
