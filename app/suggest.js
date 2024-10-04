document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('suggestionForm');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        const email = document.getElementById('email').value;
        const category = document.getElementById('category').value;

        const data = {
            user_email: email,
            book_author: author,
            book_category: category,
            book_title: title
        };

        fetch('/api/routes/other.route.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(result => {
            console.log(result);
            if (result.status === 'success') {
                alert('Book suggestion added successfully!');
                form.reset();
            } else {
                alert('Error: ' + result.message);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('An error occurred while submitting the suggestion.');
        });
    });
});
