// Fetch the book data from the PHP route
async function fetchBooks() {
    const user = JSON.parse(localStorage.getItem('userData'));
    const user_id = user.user_id;
    try {
        const response = await fetch('./api/routes/book.route.php?user_id=' + user_id);
        const books = await response.json();

        
        renderBooks(books);
    } catch (error) {
        console.error("Error fetching books:", error);
    }
}

// Render books based on category
function renderBooks(books) {
    const categories = [
        { id: 'bestsellers', name: 'Bestseller' },
        { id: 'new-arrivals', name: 'New Arrival' },
        { id: 'fiction', name: 'Fiction' },
        { id: 'non-fiction', name: 'Non-fiction' },
        { id: 'science-fiction', name: 'Science Fiction' },
        { id: 'classic-literature', name: 'Classic Literature' },
        { id: 'fantasy', name: 'Fantasy' },
        { id: 'thriller', name: 'Thriller' },
        { id: 'romance', name: 'Romance' },
        { id: 'young-adult', name: 'Young Adult' },
        { id: 'philosophy', name: 'Philosophy' }
    ];

    categories.forEach(category => {
        const sectionElement = document.getElementById(category.id);
        if (sectionElement) {
            const categoryBooks = books.filter(book => book.category_name === category.name);
            categoryBooks.forEach(book => {
                const bookElement = createBookElement(book);
                sectionElement.appendChild(bookElement);
            });
        }
    });
}

// Create individual book elements
function createBookElement(book) {
    console.log(book);
    const article = document.createElement('article');
    article.classList.add('displays');


    const viewDiv = document.createElement('div');
    viewDiv.classList.add('view');
    const img = document.createElement('img');
    img.src = book.imageUrl;
    viewDiv.appendChild(img);
    viewDiv.onclick =()=> navigateToBook(book.book_id)

    const titleDiv = document.createElement('div');
    titleDiv.classList.add('title');
    titleDiv.innerHTML = `<p>${book.title}</p>`;
    titleDiv.onclick =()=> navigateToBook(book.book_id)

    const priceDiv = document.createElement('div');
    priceDiv.classList.add('price');
    priceDiv.textContent = `Rs. ${book.price}`;

    const detailsDiv = document.createElement('div');
    detailsDiv.classList.add('details');

    const addToWishlistBtn = document.createElement('i');
    addToWishlistBtn.classList.add('wishlist-icon');
    console.log(book.in_wishlist);
    addToWishlistBtn.classList.add(book.in_wishlist ? 'fa-solid' : 'fa-regular', 'fa-heart');
    addToWishlistBtn.dataset.bookId = book.book_id;
    addToWishlistBtn.style.fontSize = '24px'; // Increase size of wishlist icon
    addToWishlistBtn.addEventListener('click', addToWishlist);

    const stockStatusDiv = document.createElement('div');
    stockStatusDiv.style.cssText = "font-family: 'Roboto';font-size: 18px;font-weight: bold;background-color: chartreuse; width: 100px;border-radius: 20px;";
    stockStatusDiv.innerHTML = '<p style="color: white;margin-left: 15px;">In Stock</p>';

    const cartImg = document.createElement('img');
    cartImg.style.height = "28px";
    cartImg.src = './images/Cart.png';

    detailsDiv.appendChild(addToWishlistBtn);
    detailsDiv.appendChild(stockStatusDiv);
    detailsDiv.appendChild(cartImg);

    article.appendChild(viewDiv);
    article.appendChild(titleDiv);
    article.appendChild(priceDiv);
    article.appendChild(detailsDiv);

    return article;
}

function navigateToBook(book_id){
    console.log(book_id);

    window.location.href = `book-details.html?book_id=${book_id}`;
    
}


// Fetch and render books when the page loads
window.onload = fetchBooks;

// Move the addToWishlist function here, before it's used
async function addToWishlist(event) {
    const user = JSON.parse(localStorage.getItem('userData'));
    if (!user) {
        alert('Please log in to manage your wishlist.');
        return;
    }

    const userId = user.user_id;
    const bookId = event.target.dataset.bookId;
    const wishlistIcon = event.target;

    const isInWishlist = wishlistIcon.classList.contains('fa-solid');
    const method = isInWishlist ? 'DELETE' : 'POST';

    fetch('../../api/routes/wishlist.route.php', {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId, book_id: bookId }),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (data.success) {
            if (isInWishlist) {
                showToast('Book removed from wishlist successfully');
                wishlistIcon.classList.remove('fa-solid', 'text-danger');
                wishlistIcon.classList.add('fa-regular');
            } else {
                showToast('Book added to wishlist successfully');
                wishlistIcon.classList.remove('fa-regular');
                wishlistIcon.classList.add('fa-solid', 'text-danger');
            }
        } else {
            showToast('Failed to update wishlist', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('An error occurred', 'error');
    });
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 10px 20px;
        border-radius: 4px;
        color: white;
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
        z-index: 1000;
        background-color: ${type === 'success' ? '#4CAF50' : '#F44336'};
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '1';
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }, 100);
}


