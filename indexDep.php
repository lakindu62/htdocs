<?php
// Database connection
$conn = new mysqli('localhost', 'username', 'password', 'comments_db');
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Handle form submission
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'];
    $comment = $_POST['comment'];
    $sql = "INSERT INTO comments (name, comment) VALUES (?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $name, $comment);
    $stmt->execute();
    $stmt->close();
}

// Fetch comments
$result = $conn->query("SELECT * FROM comments ORDER BY id DESC");
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mini Comment App</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        form { margin-bottom: 20px; }
        input, textarea { width: 100%; margin-bottom: 10px; padding: 5px; }
        button { background-color: #4CAF50; color: white; padding: 10px 15px; border: none; cursor: pointer; }
        .comment { border: 1px solid #ddd; padding: 10px; margin-bottom: 10px; }
    </style>
</head>
<body>
    <h1>Mini Comment App</h1>
    
    <form id="commentForm" method="post">
        <input type="text" name="name" placeholder="Your Name" required>
        <textarea name="comment" placeholder="Your Comment" required></textarea>
        <button type="submit">Submit Comment</button>
    </form>

    <div id="comments">
        <?php while($row = $result->fetch_assoc()): ?>
            <div class="comment">
                <h3><?= htmlspecialchars($row['name']) ?></h3>
                <p><?= htmlspecialchars($row['comment']) ?></p>
            </div>
        <?php endwhile; ?>
    </div>

    <script>
        function handleSubmit(e) {
            e.preventDefault();
            fetch('', {
                method: 'POST',
                body: new FormData(this)
            }).then(response => response.text())
              .then(() => {
                  location.reload();
              });
        }
        document.getElementById('commentForm').addEventListener('submit',handleSubmit );
    </script>
</body>
</html>