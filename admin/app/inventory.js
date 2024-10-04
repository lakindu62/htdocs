const bookList = document.getElementById('bookList');
const addBookBtn = document.getElementById('addBookBtn');
const addBookModal = document.getElementById('addBookModal');
const closeModal = document.getElementById('closeModal');
const menuBtn = document.getElementById('menuBtn');
const sidebar = document.getElementById('sidebar');


//getting html of books for the books table of admin
async function getAdminBookData() {
    try {
        const response = await fetch("/api/routes/book.route.php?isAdmin=1");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const html = await response.text();
        bookList.innerHTML = html;
        addEditBookListeners();
    } catch (error) {
        console.error('Error fetching book data:', error);
    }
}

//going to edit book page
function addEditBookListeners() {
    const bookRows = document.querySelectorAll('#bookList tr');

    
    bookRows.forEach(row => {
        row.addEventListener('click', () => {
            console.log(row);
            
            const bookId = row.dataset.book_id;
            window.location.href = `edit-book.html?id=${bookId}`;
        });
    });
}


addBookBtn.addEventListener('click', () => {
    addBookModal.style.display = 'block';
});

closeModal.addEventListener('click', () => {
    addBookModal.style.display = 'none';
});


document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && e.target !== menuBtn) {
        sidebar.classList.remove('show');
    }
});

document.addEventListener('DOMContentLoaded', function() {
    loadBooks();
    loadAnalytics();
    loadCategories(); // Add this line to load categories when the page loads
    
    const form = document.getElementById('addBookForm');
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        if (validateForm()) {
            submitForm();
        }
    });

    // Add event listeners for search
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('bookSearch');
    const clearSearchBtn = document.getElementById('clearSearchBtn');

    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            performSearch();
        }
    });

    clearSearchBtn.addEventListener('click', clearSearch);
});

function validateForm() {
    const priceInput = document.getElementById('price');
    const stockInput = document.getElementById('stock');

    if (parseFloat(priceInput.value) <= 0) {
        alert('Price must be a positive number.');
        return false;
    }

    if (parseInt(stockInput.value) < 0) {
        alert('Stock cannot be negative.');
        return false;
    }

    return true;
}

function loadBooks() {
    fetch('../api/routes/book.route.php?isAdmin=true')
        .then(response => response.json())
        .then(books => {
            allBooks = books;
            displayBooks(books);
        })
        .catch(error => console.error('Error:', error));
}

function displayBooks(books) {
    const tableBody = document.getElementById('bookList');
    tableBody.innerHTML = '';
    books.forEach(book => {
        const row = `
            <tr data-book_id="${book.book_id}">
                <td>${book.book_id}</td>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>$${parseFloat(book.price).toFixed(2)}</td>
                <td>${book.stock}</td>
                <td>
                    <button class="edit-btn" onclick="editBook(${book.book_id})">Edit</button>
                    <button class="delete-btn" onclick="deleteBook(${book.book_id})">Delete</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

function performSearch() {
    const searchTerm = document.getElementById('bookSearch').value.toLowerCase();
    if (searchTerm) {
        const filteredBooks = allBooks.filter(book => 
            book.book_id.toString().includes(searchTerm) ||
            book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm) ||
            book.price.toString().includes(searchTerm) ||
            book.stock.toString().includes(searchTerm)
        );
        displayBooks(filteredBooks);
        document.getElementById('clearSearchBtn').style.display = 'inline-block';
    }
}

function clearSearch() {
    document.getElementById('bookSearch').value = '';
    displayBooks(allBooks);
    document.getElementById('clearSearchBtn').style.display = 'none';
}

function editBook(bookId) {
    // Redirect to the edit book page with the book ID as a query parameter
    window.location.href = `edit-book.html?id=${bookId}`;
}

function deleteBook(bookId) {
    if (confirm('Are you sure you want to delete this book?')) {
        fetch('../api/routes/book.route.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `action=delete&bookId=${bookId}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showToast('Book deleted successfully');
                loadBooks(); // Refresh the book list
            } else {
                showToast('Error deleting book: ' + data.message, 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showToast('An error occurred while deleting the book', 'error');
        });
    }
}

function loadCategories() {
    fetch('../api/routes/category.route.php')
        .then(response => response.json())
        .then(categories => {
            const categorySelect = document.getElementById('categorySelect');
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.category_id;
                option.textContent = category.category_name;
                categorySelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error:', error));
}

function updateSelectedCategories() {
    const categorySelect = document.getElementById('categorySelect');
    const selectedCategories = document.getElementById('selectedCategories');
    selectedCategories.innerHTML = '';

    Array.from(categorySelect.selectedOptions).forEach(option => {
        const categorySpan = document.createElement('span');
        categorySpan.className = 'selected-category';
        categorySpan.textContent = option.textContent;
        categorySpan.dataset.id = option.value;

        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'x';
        removeBtn.onclick = function() {
            option.selected = false;
            updateSelectedCategories();
        };

        categorySpan.appendChild(removeBtn);
        selectedCategories.appendChild(categorySpan);
    });
}

document.getElementById('categorySelect').addEventListener('change', updateSelectedCategories);

//adding a book
function submitForm() {
    const form = document.getElementById('addBookForm');
    const formData = new FormData(form);
    
    // Add selected categories to formData
    const selectedCategories = Array.from(document.getElementById('categorySelect').selectedOptions).map(option => option.value);
    formData.append('categories', JSON.stringify(selectedCategories));

    fetch('../api/routes/book.route.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Book added successfully');
            document.getElementById('addBookModal').style.display = 'none';
            loadBooks(); // Refresh the book list
        } else {
            alert('Error adding book: ' + data.message);
        }
    })
    .catch(error => console.error('Error:', error));
}

function loadAnalytics() {
    fetch('../api/routes/book.route.php?action=analytics')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            displayAnalytics(data);
        })
        .catch(error => console.error('Error:', error));
}

function displayAnalytics(data) {
    const analyticsContainer = document.getElementById('analyticsContainer');
    
    // Best performing book
    const bestBook = data.bestPerformingBook;
    const bestBookHtml = `
        <div class="analytics-card best-book">
            <h3><i class="fas fa-trophy"></i> Best Performing Book</h3>
            <div class="best-book-content">
                <img src="${bestBook.imageUrl}" alt="${bestBook.title}" class="best-book-image">
                <div class="best-book-info">
                    <p><strong>${bestBook.title}</strong></p>
                    <p>by ${bestBook.author}</p>
                    <p><span class="best-book-stat">Total Revenue: $${parseFloat(bestBook.total_revenue).toFixed(2)}</span></p>
                    <p><span class="best-book-stat">Copies Sold: ${bestBook.total_sold}</span></p>
                </div>
            </div>
        </div>
    `;

    // Low stock count
    const lowStockHtml = `
        <div class="analytics-card">
            <h3><i class="fas fa-exclamation-triangle"></i> Low Stock Alert</h3>
            <p>${data.lowStockCount} books have low stock (less than 10)</p>
        </div>
    `;

    // Low performing books table
    let lowPerformingBooksHtml = `
        <div class="analytics-card">
            <h3><i class="fas fa-chart-line"></i> Low Performing Books</h3>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Stock</th>
                        <th>Copies Sold</th>
                    </tr>
                </thead>
                <tbody>
    `;

    data.lowPerformingBooks.forEach(book => {
        lowPerformingBooksHtml += `
            <tr>
                <td>${book.book_id}</td>
                <td>${book.title}</td>
                <td>${book.stock}</td>
                <td>${book.total_sold}</td>
            </tr>
        `;
    });

    lowPerformingBooksHtml += `
                </tbody>
            </table>
        </div>
    `;

    analyticsContainer.innerHTML = bestBookHtml + lowStockHtml + lowPerformingBooksHtml;
}