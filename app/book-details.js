async function fetchBooks() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const bookId = urlParams.get("book_id");
        const response = await fetch(`./api/routes/book.route.php?book_id=${bookId}`);
        const data = await response.json();
        console.log(data);
        
        renderBookDetails(data.book);
        renderReviews(data.reviews, data.ratingCounts);
    } catch (error) {
        console.error("Error fetching books:", error);
    }
}

function renderBookDetails(book) {
    const bookDetailsHtml = `
        <h1>${book.title}</h1>
        <div class="rating">
            <span>${book.avg_rating}</span>
            ${renderStars(book.avg_rating)}
            <span>(${book.total_reviews} reviews)</span>
        </div>
        <div class="book-content">
            <img src="${book.imageUrl}" alt="${book.title}">
            <div class="book-details-container">
                <span class="author-name">Written by ${book.author}</span>
                <p class="book-description">${book.book_description}</p>
                <div class="stock-info">
                    <span>${book.stock_status}</span>
                    <span>${book.stock} items left</span>
                </div>
                <div class="purchase-options">
                    <span>Purchase</span>
                    <div>
                        <button>Hard copy ($${(parseFloat(book.hardcopy_price) / 100).toFixed(2)})</button>
                        <button>E book ($${(parseFloat(book.ebook_price) / 100).toFixed(2)})</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.getElementById('book-details').innerHTML = bookDetailsHtml;
}

function renderStars(rating) {
    console.log(rating);
    
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    
    return '★'.repeat(fullStars) + (halfStar ? '½' : '') + '☆'.repeat(emptyStars);
}

function renderReviews(reviews, ratingCounts) {
    const totalRatings = Object.values(ratingCounts).reduce((sum, count) => sum + parseInt(count), 0);
    
    const ratingStatsHtml = `
        <h2>Customer Reviews</h2>
        <div class="rating-stats">
            ${Object.entries(ratingCounts).reverse().map(([rating, count]) => `
                <div class="rating-bar">
                    <span>${renderStars(count)}</span>
                    <div class="bar">
                        <div style="width: ${(count / totalRatings) * 100}%"></div>
                    </div>
                    <span>${count}</span>
                </div>
            `).join('')}
        </div>
    `;

    const reviewsHtml = reviews.map(review => `
        <div class="review  ">
            <div class="review-header">
                <span class="review-username">${review.username}</span>
                <div class="flex gap-6">
                    <span>${renderStars(review.review_rating)}</span>
                    <span>${review.review_date}</span>
                </div>
            </div>
            <p class="opacity-70">${review.review_description}</p>
        </div>
    `).join('');

    document.getElementById('reviews').innerHTML = `<div class="rating-review-container"><div class="rating-container">${ratingStatsHtml}</div>  <div class="reviews-container">${reviewsHtml}</div></div>`;
}

// Call fetchBooks when the page loads
window.addEventListener('load', fetchBooks);