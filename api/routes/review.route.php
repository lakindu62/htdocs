<?php
require_once '../controllers/review.controllers.php';

$requestMethod = $_SERVER["REQUEST_METHOD"];

switch ($requestMethod) {
    case 'GET':
        if (isset($_GET['order_id'])) {
            $order_id = $_GET['order_id'];
            $reviews = getReviewsByOrderIdController($order_id);
            echo json_encode($reviews);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        $result = createReviewController($data);
        echo json_encode($result);
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);
        $result = updateReviewController($data);
        echo json_encode($result);
        break;

    case 'DELETE':
        if (isset($_GET['review_id'])) {
            $review_id = $_GET['review_id'];
            $result = deleteReviewController($review_id);
            echo json_encode($result);
        }
        break;

    default:
        echo json_encode(["error" => "Invalid request method"]);
        break;
}
