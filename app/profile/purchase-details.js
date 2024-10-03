function displayOrderModal(order) {
    const modal = document.getElementById('order-modal');
    const modalContent = document.getElementById('modal-order-details');
    modalContent.innerHTML = `
        <h3>Order ID: ${order.order_id}</h3>
        <p>Date: ${order.order_date}</p>
        <p>Status: ${order.order_status}</p>
        <p>Total Amount: Rs. ${order.total_amount}</p>
        <h4>Items:</h4>
    `;

    if (order.items && order.items.length > 0) {
        const itemsList = document.createElement('ul');
        order.items.forEach(item => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <img src="${item.imageUrl}" alt="${item.title}" style="width: 50px; height: 75px;">
                ${item.title} by ${item.author} - Quantity: ${item.quantity} - Price: Rs. ${item.price}
            `;
            itemsList.appendChild(listItem);
        });
        modalContent.appendChild(itemsList);
    } else {
        modalContent.innerHTML += '<p>No items found in this order.</p>';
    }

    // Add reviews section
    const reviewsSection = document.createElement('div');
    reviewsSection.id = 'reviews-section';
    modalContent.appendChild(reviewsSection);

    // Load reviews
    loadReviews(order.order_id);

    // Add review form for delivered orders
    if (order.order_status.toLowerCase() === 'delivered') {
        const reviewForm = document.createElement('form');
        reviewForm.id = 'review-form';
        reviewForm.innerHTML = `
            <h4>Add a Review</h4>
            <select id="book-select" required>
                <option value="">Select a book to review</option>
                ${order.items.map(item => `<option value="${item.book_id}">${item.title}</option>`).join('')}
            </select>
            <textarea id="review-text" placeholder="Write your review here" required></textarea>
            <select id="rating" required>
                <option value="">Select a rating</option>
                <option value="1">1 Star</option>
                <option value="2">2 Stars</option>
                <option value="3">3 Stars</option>
                <option value="4">4 Stars</option>
                <option value="5">5 Stars</option>
            </select>
            <button type="submit">Submit Review</button>
        `;
        reviewForm.addEventListener('submit', (e) => submitReview(e, order.order_id));
        modalContent.appendChild(reviewForm);
    }

    modal.style.display = 'block';

    const closeBtn = modal.querySelector('.close');
    closeBtn.onclick = () => {
        modal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
}

function loadReviews(orderId) {
    fetch(`/api/routes/review.route.php?order_id=${orderId}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.success) {
                displayReviews(data.reviews);
            } else {
                console.error('Failed to load reviews');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function displayReviews(reviews) {
    const reviewsSection = document.getElementById('reviews-section');
    reviewsSection.innerHTML = '<h4>Reviews:</h4>';

    if (reviews.length === 0) {
        reviewsSection.innerHTML += '<p>No reviews yet.</p>';
        return;
    }

    reviews.forEach(review => {
        const reviewElement = document.createElement('div');
        reviewElement.className = 'review';
        reviewElement.innerHTML = `
            <h5>${review.book_title}</h5>
            <p>Rating: ${review.rating}/5</p>
            <p>${review.description}</p>
            <button onclick="editReview(${review.review_id}, '${review.description}', ${review.rating})">Edit</button>
            <button onclick="deleteReview(${review.review_id})">Delete</button>
        `;
        reviewsSection.appendChild(reviewElement);
    });
}

function submitReview(e, orderId) {
    e.preventDefault();
    const bookId = document.getElementById('book-select').value;
    const reviewText = document.getElementById('review-text').value;
    const rating = document.getElementById('rating').value;
    const userData = JSON.parse(localStorage.getItem('userData'));

    if (!userData || !userData.user_id) {
        alert('Please log in to submit a review.');
        return;
    }

    const reviewData = {
        user_id: userData.user_id,
        book_id: bookId,
        order_id: orderId,
        description: reviewText,
        rating: rating
    };

    fetch('/api/routes/review.route.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (data.success) {
            showToast('Review submitted successfully');
            loadReviews(orderId);
            document.getElementById('review-form').reset();
        } else {
            alert('Failed to submit review. Please try again.');
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('An error occurred while submitting the review.');
    });
}

function editReview(reviewId, description, rating) {
    const newDescription = prompt('Edit your review:', description);
    const newRating = prompt('Edit your rating (1-5):', rating);

    if (newDescription !== null && newRating !== null) {
        const reviewData = {
            review_id: reviewId,
            description: newDescription,
            rating: parseInt(newRating)
        };

        fetch('/api/routes/review.route.php', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reviewData),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Review updated successfully!');
                loadReviews(document.querySelector('#modal-order-details h3').textContent.split(': ')[1]);
            } else {
                alert('Failed to update review. Please try again.');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('An error occurred while updating the review.');
        });
    }
}

function deleteReview(reviewId) {
    if (confirm('Are you sure you want to delete this review?')) {
        fetch(`/api/routes/review.route.php?review_id=${reviewId}`, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showToast('Review deleted successfully');
                loadReviews(document.querySelector('#modal-order-details h3').textContent.split(': ')[1]);
            } else {
                alert('Failed to delete review. Please try again.');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('An error occurred while deleting the review.');
        });
    }
}
