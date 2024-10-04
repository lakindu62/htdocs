<?php
require_once '../controllers/order.controller.php';

$requestMethod = $_SERVER["REQUEST_METHOD"];

switch ($requestMethod) {
    case 'GET':
        if (isset($_GET['order_id'])) {
            $order_id = $_GET['order_id'];
            echo getOrderController($order_id);
        } elseif (isset($_GET['user_id'])) {
            $user_id = $_GET['user_id'];
            echo getUserOrdersController($user_id);
        } elseif (isset($_GET['all_orders'])) {
            echo getAllOrdersController();
        } elseif (isset($_GET['revenue_data'])) {
            $days = isset($_GET['days']) ? intval($_GET['days']) : 30;
            echo getRevenueDataController($days);
        } else {
            echo json_encode(['error' => 'Invalid GET request']);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        echo createOrderController($data);
        break;

    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        if (isset($data['order_id']) && isset($data['new_status'])) {
            echo updateOrderStatusController($data['order_id'], $data['new_status']);
        } else {
            echo json_encode(['error' => 'Order ID and new status are required']);
        }
        break;

    case 'DELETE':
        if (isset($_GET['order_id'])) {
            $order_id = $_GET['order_id'];
            echo deleteOrderController($order_id);
        } else {
            echo json_encode(['error' => 'Order ID is required']);
        }
        break;

    default:
        echo json_encode(['error' => 'Invalid request method']);
        break;
}
