<?php
include "../config.php";





function getBooks()
{
    global $conn;
    $sql = "select * from books";
    $result = mysqli_query($conn, $sql);

    $books = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $books[] = $row;
    }

    return $books;
}



function getAllBooksWithCategories()
{
    global $conn;
    $sql = "
        SELECT Books.book_id, Books.title, Books.author, Books.price, Books.imageUrl, Categories.category_name
        FROM Books
        INNER JOIN Book_Categories ON Books.book_id = Book_Categories.book_id
        INNER JOIN Categories ON Book_Categories.category_id = Categories.category_id
        ORDER BY Categories.category_name, Books.title
    ";

    $result = mysqli_query($conn, $sql);

    $booksByCategory = [];

    while ($row = mysqli_fetch_assoc($result)) {
        $category = $row['category_name'];
        if (!isset($booksByCategory[$category])) {
            $booksByCategory[$category] = [];
        }
        $booksByCategory[$category][] = $row;
    }

    return $booksByCategory;
}

function createBook(
    $title,
    $author,
    $stock,
    $description,
    $imageUrl,
    $price
) {
    global $conn;
    $stmt = $conn->prepare("INSERT INTO Books (title, author, description, imageUrl, price, stock) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssdi", $title, $author, $description, $imageUrl, $price, $stock);

    // Execute the statement
    if ($stmt->execute()) {
        echo "New book added successfully.";
    } else {
        echo "Error: " . $stmt->error;
    }


    // Close the statement and connection
    $stmt->close();
    $conn->close();
    header("Location: " . $_SERVER['HTTP_REFERER']);
    exit();
}
