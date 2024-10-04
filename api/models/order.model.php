<?php
include_once "../config.php";

function createShippingDetails($user_id, $country, $city, $postal_address, $postal_code) {
    global $conn;
    $stmt = $conn->prepare("INSERT INTO Shipping_Details (user_id, country, city, postal_address, postal_code) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("issss", $user_id, $country, $city, $postal_address, $postal_code);
    $stmt->execute();
    $shipping_id = $stmt->insert_id;
    $stmt->close();
    return $shipping_id;
}

function getShippingDetails($user_id) {
    global $conn;
    $stmt = $conn->prepare("SELECT * FROM Shipping_Details WHERE user_id = ? ORDER BY shipping_id DESC LIMIT 1");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $shipping_details = $result->fetch_assoc();
    $stmt->close();
    return $shipping_details;
}

function createOrder($user_id, $shipping_id, $payment_method, $total_amount) {
    global $conn;
    $order_status = "Pending";
    $order_date = date("Y-m-d");
    $shipping_cost = 600.00; // You can adjust this or make it dynamic

    $stmt = $conn->prepare("INSERT INTO Orders (user_id, shipping_id, payment_method, order_status, order_date, shipping_cost, total_amount) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("iisssdd", $user_id, $shipping_id, $payment_method, $order_status, $order_date, $shipping_cost, $total_amount);
    $stmt->execute();
    $order_id = $stmt->insert_id;
    $stmt->close();
    return $order_id;
}

function addOrderItems($order_id, $cart_items) {
    global $conn;
    $stmt = $conn->prepare("INSERT INTO Order_Items (order_id, book_id, quantity) VALUES (?, ?, ?)");
    foreach ($cart_items as $item) {
        $stmt->bind_param("iii", $order_id, $item['book_id'], $item['quantity']);
        $stmt->execute();
    }
    $stmt->close();
}

function getOrder($order_id) {
    global $conn;
    $stmt = $conn->prepare("
        SELECT o.*, sd.country, sd.city, sd.postal_address, sd.postal_code
        FROM Orders o
        JOIN Shipping_Details sd ON o.shipping_id = sd.shipping_id
        WHERE o.order_id = ?
    ");
    $stmt->bind_param("i", $order_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $order = $result->fetch_assoc();
    $stmt->close();

    // Fetch order items
    $stmt = $conn->prepare("
        SELECT oi.*, b.title, b.author, b.imageUrl , b.price
        FROM Order_Items oi
        JOIN Books b ON oi.book_id = b.book_id
        WHERE oi.order_id = ?
    ");
    $stmt->bind_param("i", $order_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $order['items'] = $result->fetch_all(MYSQLI_ASSOC);
    $stmt->close();

    return $order;
}

function updateOrderStatus($order_id, $new_status) {
    global $conn;
    $stmt = $conn->prepare("UPDATE Orders SET order_status = ? WHERE order_id = ?");
    $stmt->bind_param("si", $new_status, $order_id);
    $stmt->execute();
    $affected_rows = $stmt->affected_rows;
    $stmt->close();
    return $affected_rows > 0;
}

function deleteOrder($order_id) {
    global $conn;
    $conn->begin_transaction();
    try {
        $stmt = $conn->prepare("DELETE FROM Order_Items WHERE order_id = ?");
        $stmt->bind_param("i", $order_id);
        $stmt->execute();
        $stmt->close();

        $stmt = $conn->prepare("DELETE FROM Orders WHERE order_id = ?");
        $stmt->bind_param("i", $order_id);
        $stmt->execute();
        $affected_rows = $stmt->affected_rows;
        $stmt->close();

        $conn->commit();
        return $affected_rows > 0;
    } catch (Exception $e) {
        $conn->rollback();
        return false;
    }
}

function getUserOrders($user_id) {
    global $conn;
    $stmt = $conn->prepare("
        SELECT o.*, sd.country, sd.city, sd.postal_address, sd.postal_code
        FROM Orders o
        JOIN Shipping_Details sd ON o.shipping_id = sd.shipping_id
        WHERE o.user_id = ?
        ORDER BY o.order_date DESC
    ");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $orders = $result->fetch_all(MYSQLI_ASSOC);
    $stmt->close();

    // Fetch order items for each order
    foreach ($orders as &$order) {
        $stmt = $conn->prepare("
            SELECT oi.*, b.title, b.author, b.imageUrl, b.price
            FROM Order_Items oi
            JOIN Books b ON oi.book_id = b.book_id
            WHERE oi.order_id = ?
        ");
        $stmt->bind_param("i", $order['order_id']);
        $stmt->execute();
        $result = $stmt->get_result();
        $order['items'] = $result->fetch_all(MYSQLI_ASSOC);
    }
    $stmt->close();

    return $orders;
}



function getAllOrders() {
    global $conn;
    $stmt = $conn->prepare("
        SELECT o.*, u.username, sd.country, sd.city, sd.postal_address, sd.postal_code
        FROM Orders o
        JOIN Users u ON o.user_id = u.user_id
        JOIN Shipping_Details sd ON o.shipping_id = sd.shipping_id
        ORDER BY o.order_date DESC
    ");
    $stmt->execute();
    $result = $stmt->get_result();
    $orders = $result->fetch_all(MYSQLI_ASSOC);
    $stmt->close();

    // Fetch order items for each order
    foreach ($orders as &$order) {
        $stmt = $conn->prepare("
            SELECT oi.*, b.title, b.author, b.price
            FROM Order_Items oi
            JOIN Books b ON oi.book_id = b.book_id
            WHERE oi.order_id = ?
        ");
        $stmt->bind_param("i", $order['order_id']);
        $stmt->execute();
        $result = $stmt->get_result();
        $order['items'] = $result->fetch_all(MYSQLI_ASSOC);
    }
    $stmt->close();

    return $orders;
}

function getRevenueData() {
    global $conn;
    
    $query = "WITH date_range AS (
        SELECT DATE(CURDATE() - INTERVAL n DAY) AS date
        FROM (
            SELECT 0 AS n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6
        ) numbers
    ),
    daily_sales AS (
        SELECT DATE(order_date) as sale_date, SUM(total_amount) as total_revenue
        FROM Orders 
        WHERE order_date BETWEEN CURDATE() - INTERVAL 6 DAY AND CURDATE()
        GROUP BY DATE(order_date)
    )
    SELECT 
        dr.date, 
        COALESCE(ds.total_revenue, 0) as revenue
    FROM 
        date_range dr
    LEFT JOIN 
        daily_sales ds ON dr.date = ds.sale_date
    ORDER BY 
        dr.date";
    
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $revenueData = [];
    while ($row = $result->fetch_assoc()) {
        $revenueData[] = [
            'date' => $row['date'],
            'revenue' => floatval($row['revenue'])
        ];
    }
    
    $stmt->close();
    return $revenueData;
}