<?php
include "../config.php";





function getBooks()
{
    global $conn;
    $sql = "select title, price, imageUrl , book_id , author , stock  from books";
    $result = mysqli_query($conn, $sql);

    $books = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $books[] = $row;
    }

    return $books;
}


// for the Book Description Page ========================================================================


// Model: book_model.php

function getReviews($book_id)
{
    global $conn;
    $query = "SELECT 
                  r.review_id,
                  u.username,
                  r.rating AS review_rating,
                  r.description AS review_description,
                  r.review_date
              FROM 
                  Reviews r
              LEFT JOIN 
                  Users u ON r.user_id = u.user_id
              WHERE 
                  r.book_id = ? 
              ORDER BY 
                  r.review_date DESC";

    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $book_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $reviews = [];

    while ($row = mysqli_fetch_assoc($result)) {
        $reviews[] = $row;
    }

    return $reviews;
}

function getRatingCounts($book_id)
{
    global $conn;
    $query = "SELECT 
                  SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) AS rating_1_count,
                  SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) AS rating_2_count,
                  SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) AS rating_3_count,
                  SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) AS rating_4_count,
                  SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) AS rating_5_count
              FROM 
                  Reviews
              WHERE 
                  book_id = ?";

    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $book_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        return $result->fetch_assoc();
    } else {
        return null;
    }
}



function getBookDetails($book_id)
{
    global $conn;
    $query = "SELECT 
                  b.book_id,
                  b.title,
                  b.imageUrl,
                  b.description AS book_description,
                  b.stock,
                  b.price AS hardcopy_price,
                  b.author,
                  (b.price - 800) AS ebook_price,  -- Assuming e-book is 800 less than hard copy price
                  IF(b.stock > 0, 'In Stock', 'Out of Stock') AS stock_status,
                  COALESCE(review_data.avg_rating, 0) AS avg_rating,
                  COALESCE(review_data.total_reviews, 0) AS total_reviews
              FROM 
                  Books b
              LEFT JOIN (
                  SELECT 
                      book_id,
                      AVG(rating) AS avg_rating,
                      COUNT(review_id) AS total_reviews
                  FROM 
                      Reviews
                  GROUP BY 
                      book_id
              ) AS review_data ON b.book_id = review_data.book_id
              WHERE 
                  b.book_id = ?";

    $stmt = $conn->prepare($query);
    $stmt->bind_param('i', $book_id);
    $stmt->execute();
    $result =  $stmt->get_result();
    if ($result->num_rows > 0) {
        return $result->fetch_assoc();
    } else {
        return null;
    }

    //     $sql = " select * from books where book_id = ?";
    //     $stmt = $conn->prepare($sql);
    //     $stmt->bind_param('i', $book_id);
    //     $stmt->execute();
    //     $result = $stmt->get_result();
    //     if ($result->num_rows > 0) {
    //         return $result->fetch_assoc();
    //     } else {
    //         return null;
    //     }

    //     $stmt->close();
}



















//================================================================================


// function getBookData($book_id)
// {
//     global $conn;
//     $sql = " select * from books where book_id = ?";
//     $stmt = $conn->prepare($sql);
//     $stmt->bind_param('i', $book_id);
//     $stmt->execute();
//     $result = $stmt->get_result();
//     if ($result->num_rows > 0) {
//         return $result->fetch_assoc();
//     } else {
//         return null;
//     }

//     $stmt->close();
// }







function getBookCategories($book_id) {
    global $conn;
    
    $sql = "SELECT c.category_id, c.category_name
            FROM Categories c
            JOIN Book_Categories bc ON c.category_id = bc.category_id
            WHERE bc.book_id = ?";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $book_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $categories = [];
    while ($row = $result->fetch_assoc()) {
        $categories[] = $row;
    }
    
    $stmt->close();
    return $categories;
}





function getAdminSingleBookData($book_id)
{
    global $conn;


    $sql = "

    SELECT 
    b.book_id,
    b.title,
    b.description,
    b.imageUrl,
    b.price,
    b.stock,
    b.author,
    AVG(r.rating) AS average_rating,
    COUNT(r.review_id) AS review_count,
    SUM(oi.quantity) AS total_sold,
    COUNT(DISTINCT o.order_id) AS total_orders,
    SUM(oi.quantity * b.price) AS total_revenue
FROM 
    Books b
LEFT JOIN 
    Book_Categories bc ON b.book_id = bc.book_id
LEFT JOIN 
    Categories c ON bc.category_id = c.category_id
LEFT JOIN 
    Reviews r ON b.book_id = r.book_id
LEFT JOIN 
    Order_Items oi ON b.book_id = oi.book_id
LEFT JOIN 
    Orders o ON oi.order_id = o.order_id
WHERE 
    b.book_id = ?
GROUP BY 
    b.book_id
ORDER BY 
    b.title;

    ";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $book_id);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        return $result->fetch_assoc();
    } else {
        return null;
    }

    $stmt->close();
}


function getAllBooksWithCategories($user_id = null)
{
    global $conn;
    $sql = "
       SELECT 
    Books.book_id, 
    Books.title, 
    Books.author, 
    Books.price, 
    Books.imageUrl, 
    Categories.category_name,
    CASE WHEN user_wishlist.book_id IS NOT NULL THEN 1 ELSE 0 END AS in_wishlist
FROM Books
INNER JOIN Book_Categories ON Books.book_id = Book_Categories.book_id
INNER JOIN Categories ON Book_Categories.category_id = Categories.category_id
LEFT JOIN (
    SELECT Wishlist_Items.book_id
    FROM Wishlist
    INNER JOIN Wishlist_Items ON Wishlist.wishlist_id = Wishlist_Items.wishlist_id
    WHERE Wishlist.user_id = ?
) AS user_wishlist ON Books.book_id = user_wishlist.book_id
ORDER BY Categories.category_name, Books.title
    ";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $booksByCategory = [];

    while ($row = mysqli_fetch_assoc($result)) {
        $booksByCategory[] = $row;
    }

    $stmt->close();
    return $booksByCategory;
}

function createBook($title, $author, $stock, $description, $imageUrl, $price)
{
    global $conn;
    $stmt = $conn->prepare("INSERT INTO Books (title, author, description, imageUrl, price, stock) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssdi", $title, $author, $description, $imageUrl, $price, $stock);

    if ($stmt->execute()) {
        $book_id = $stmt->insert_id;
        $stmt->close();
        return $book_id;
    } else {
        $stmt->close();
        return false;
    }
}


function updateBook($book_id, $title, $author, $description, $imageUrl, $price, $stock)
{
    global $conn;
    $stmt = $conn->prepare("UPDATE Books SET title = ?, author = ?, description = ?, imageUrl = ?, price = ?, stock = ? WHERE book_id = ?");
    $stmt->bind_param("ssssdii", $title, $author, $description, $imageUrl, $price, $stock, $book_id);

    // Execute the statement
    if ($stmt->execute()) {
        $stmt->close();
        return true;
    } else {
        $stmt->close();
        return false;
    }
}

function updateBookCategories($book_id, $categories)
{
    header("X-Debug-Info: " . json_encode($categories));



    global $conn;

    // First, delete existing categories for this book
    $deleteStmt = $conn->prepare("DELETE FROM Book_Categories WHERE book_id = ?");
    $deleteStmt->bind_param("i", $book_id);
    $deleteStmt->execute();
    $deleteStmt->close();

    // Insert new categories
    $insertStmt = $conn->prepare("INSERT INTO Book_Categories (category_id, book_id) VALUES (?, ?)");
    foreach ($categories as $category_id) {
        $insertStmt->bind_param("ii", $category_id, $book_id);
        $insertStmt->execute();
    }
    $insertStmt->close();
}

function getBestPerformingBook()
{
    global $conn;
    $sql = "SELECT 
                b.book_id, 
                b.title, 
                b.author, 
                b.imageUrl,
                SUM(oi.quantity) AS total_sold,
                SUM(oi.quantity * b.price) AS total_revenue
            FROM 
                Books b
            JOIN 
                Order_Items oi ON b.book_id = oi.book_id
            GROUP BY 
                b.book_id
            ORDER BY 
                total_revenue DESC
            LIMIT 1";

    $result = mysqli_query($conn, $sql);
    return mysqli_fetch_assoc($result);
}

function getLowStockCount()
{
    global $conn;
    $sql = "SELECT COUNT(*) AS low_stock_count FROM Books WHERE stock < 10";
    $result = mysqli_query($conn, $sql);
    return mysqli_fetch_assoc($result)['low_stock_count'];
}

function getLowPerformingBooks()
{
    global $conn;
    $sql = "SELECT 
                b.book_id, 
                b.title, 
                b.stock,
                COALESCE(SUM(oi.quantity), 0) AS total_sold
            FROM 
                Books b
            LEFT JOIN 
                Order_Items oi ON b.book_id = oi.book_id
            GROUP BY 
                b.book_id
            ORDER BY 
                total_sold ASC
            LIMIT 5";

    $result = mysqli_query($conn, $sql);
    $books = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $books[] = $row;
    }
    return $books;
}

function deleteBook($book_id) {
    global $conn;
    
    // Start transaction
    $conn->begin_transaction();

    try {
        // Delete from Book_Categories
        $stmt = $conn->prepare("DELETE FROM Book_Categories WHERE book_id = ?");
        $stmt->bind_param("i", $book_id);
        $stmt->execute();
        $stmt->close();

        // Delete from Books
        $stmt = $conn->prepare("DELETE FROM Books WHERE book_id = ?");
        $stmt->bind_param("i", $book_id);
        $stmt->execute();
        $stmt->close();

        // Commit transaction
        $conn->commit();
        return true;
    } catch (Exception $e) {
        // Rollback transaction on error
        $conn->rollback();
        return false;
    }
}
