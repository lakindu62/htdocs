document.addEventListener('DOMContentLoaded', function() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const userId = userData ? userData.user_id : null;
    if (!userId) {
        console.error('User is not logged in');
        window.location.href = '/auth/sign-in.html';
    }
    loadWishlistItems(userId);
});

function loadWishlistItems(userId) {
    fetch(`../../api/routes/wishlist.route.php?user_id=${userId}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const wishlistTable = document.querySelector('.wishlist-table tbody');
            wishlistTable.innerHTML = '';

            data.forEach(item => {
                const row = `
                    <tr>
                        <td data-label="Image"><img src="${item.imageUrl}" alt="Book cover" /></td>
                        <td data-label="Title">${item.title}</td>
                        <td data-label="ISBN">${item.book_id}</td>
                        <td data-label="Date">N/A</td>
                        <td data-label="Price">Rs. ${item.price}</td>
                        <td data-label="Actions">
                            <div class="wishlist-actions">
                                <button class="btn" onclick="addToCart(${item.book_id})">Add to cart</button>
                                <button class="btn btn--delete" onclick="removeFromWishlist(${userId}, ${item.book_id})">
                                    <i class="fa fa-trash" aria-hidden="true"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
                wishlistTable.innerHTML += row;
            });
        })
        .catch(error => console.error('Error:', error));
}

function addToCart(bookId) {
    // Implement add to cart functionality
    console.log(`Add to cart: ${bookId}`);
}

function removeFromWishlist(userId, bookId) {
    fetch('../../api/routes/wishlist.route.php', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId, book_id: bookId }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            loadWishlistItems(userId);
        } else {
            console.error('Failed to remove item from wishlist');
        }
    })
    .catch(error => console.error('Error:', error));
}

// Function to add a book to the wishlist (can be called from other pages)
function addToWishlist(userId, bookId) {
    fetch('../../api/routes/wishlist.route.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId, book_id: bookId }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Book added to wishlist successfully');
        } else {
            console.error('Failed to add item to wishlist');
        }
    })
    .catch(error => console.error('Error:', error));
}
