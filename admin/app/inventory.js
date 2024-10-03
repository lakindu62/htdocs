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

menuBtn.addEventListener('click', () => {
    sidebar.classList.toggle('show');
});

document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && e.target !== menuBtn) {
        sidebar.classList.remove('show');
    }
});

document.addEventListener('DOMContentLoaded', function() {
    loadBooks();
    
    const form = document.getElementById('addBookForm');
    form.addEventListener('submit', function (event) {
        if (!validateForm()) {
            event.preventDefault();
        }
    });
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
                            <button onclick="editBook(${book.book_id})">Edit</button>
                            <button onclick="deleteBook(${book.book_id})">Delete</button>
                        </td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            });
        })
        .catch(error => console.error('Error:', error));
}

function editBook(bookId) {
    // Redirect to the edit book page with the book ID as a query parameter
    window.location.href = `edit-book.html?id=${bookId}`;
}

function deleteBook(bookId) {
    // Implement delete functionality
    console.log('Delete book:', bookId);
}