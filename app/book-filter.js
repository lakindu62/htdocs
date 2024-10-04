let allBooks = [];
let categories = [];

// Fetch all books from the backend
async function fetchBooks() {
    try {
        const response = await fetch('/api/routes/book.route.php');
        const books = await response.json();
        allBooks = books;
        categories = [...new Set(books.map(book => book.category_name))];
        renderCategoryFilters();
        renderBooks(allBooks);
    } catch (error) {
        console.error('Error fetching books:', error);
    }
}

// Render category filters
function renderCategoryFilters() {
    const categoryFiltersContainer = document.getElementById('category-filters');
    categoryFiltersContainer.innerHTML = categories.map(category => `
        <label>
            <input type="checkbox" class="category-filter" value="${category}"> ${category}
        </label>
    `).join('');

    document.querySelectorAll('.category-filter').forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });
}

// Render books
function renderBooks(books) {
    const booksContainer = document.getElementById('books-container');
    booksContainer.innerHTML = books.map(book => `
        <article class="displays" onclick="goToBookDetails(${book.book_id})">
            <div class="view"><img src="${book.imageUrl}" alt="${book.title}"></div>
            <div class="title"><p>${book.title}</p></div>
            <div class="price">Rs. ${book.price}</div>
            <div class="details">
                <span class="stock-status">In Stock</span>
                <img src="./images/Cart.png" alt="Add to cart" onclick="event.stopPropagation(); addToCart(${book.book_id})">
            </div>
        </article>
    `).join('');
}

// Add this function after the renderBooks function
function goToBookDetails(bookId) {
    window.location.href = `book-details.html?book_id=${bookId}`;
}

// Optional: Add to cart function (if needed)
function addToCart(bookId) {
    // Implement add to cart functionality here
    console.log(`Adding book ${bookId} to cart`);
}

// Apply filters and search
function applyFilters() {
    const selectedCategories = Array.from(document.querySelectorAll('.category-filter:checked')).map(checkbox => checkbox.value);
    const minPrice = parseFloat(document.getElementById('min-price').value) || 0;
    const maxPrice = parseFloat(document.getElementById('max-price').value) || Infinity;
    const searchTerm = document.getElementById('search-input').value.toLowerCase();

    const filteredBooks = allBooks.filter(book => {
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(book.category_name);
        const matchesPrice = book.price >= minPrice && book.price <= maxPrice;
        const matchesSearch = book.title.toLowerCase().includes(searchTerm) || book.author.toLowerCase().includes(searchTerm);
        return matchesCategory && matchesPrice && matchesSearch;
    });

    renderBooks(filteredBooks);
}

// Event listeners
document.getElementById('min-price').addEventListener('input', applyFilters);
document.getElementById('max-price').addEventListener('input', applyFilters);
document.getElementById('search-input').addEventListener('input', applyFilters);

// Initialize
fetchBooks();
