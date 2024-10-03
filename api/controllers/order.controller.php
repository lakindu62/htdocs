<?php
require_once '../models/order.model.php';

function createOrderController($data) {
    $user_id = $data['user_id'];
    $payment_method = $data['payment_method'];
    $total_amount = $data['total_amount'];
    $cart_items = $data['cart_items'];

    // Check if shipping details exist, if not create new
    $shipping_details = getShippingDetails($user_id);
    if (!$shipping_details) {
        $country = $data['country'];
        $city = $data['city'];
        $postal_address = $data['postal_address'];
        $postal_code = $data['postal_code'];
        $shipping_id = createShippingDetails($user_id, $country, $city, $postal_address, $postal_code);
    } else {
        $shipping_id = $shipping_details['shipping_id'];
    }

    // Create order
    $order_id = createOrder($user_id, $shipping_id, $payment_method, $total_amount);

    // Add order items
    addOrderItems($order_id, $cart_items);

    return json_encode(['success' => true, 'order_id' => $order_id]);
}

function getOrderController($order_id) {
    $order = getOrder($order_id);
    if ($order) {
        return json_encode(['success' => true, 'order' => $order]);
    } else {
        return json_encode(['success' => false, 'message' => 'Order not found']);
    }
}

function updateOrderStatusController($order_id, $new_status) {
    $result = updateOrderStatus($order_id, $new_status);
    if ($result) {
        return json_encode(['success' => true, 'message' => 'Order status updated']);
    } else {
        return json_encode(['success' => false, 'message' => 'Failed to update order status']);
    }
}

function deleteOrderController($order_id) {
    $result = deleteOrder($order_id);
    if ($result) {
        return json_encode(['success' => true, 'message' => 'Order deleted']);
    } else {
        return json_encode(['success' => false, 'message' => 'Failed to delete order']);
    }
}

function getUserOrdersController($user_id) {
    $orders = getUserOrders($user_id);
    if ($orders) {
        return json_encode(['success' => true, 'orders' => $orders]);
    } else {
        return json_encode(['success' => false, 'message' => 'No orders found']);
    }
}
