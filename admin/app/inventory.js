// // Mock data for books
// let books = [
//     { title: "To Kill a Mockingbird", author: "Harper Lee", isbn: "9780446310789", quantity: 5 },
//     { title: "1984", author: "George Orwell", isbn: "9780451524935", quantity: 3 },
//     { title: "The Great Gatsby", author: "F. Scott Fitzgerald", isbn: "9780743273565", quantity: 4 },
// ];

// // DOM elements

// const addBookBtn = document.getElementById('addBookBtn');
// const addBookModal = document.getElementById('addBookModal');
// const addBookForm = document.getElementById('addBookForm');
// const closeModal = document.getElementById('closeModal');
// const menuBtn = document.getElementById('menuBtn');
// const sidebar = document.getElementById('sidebar');

// // Function to render books
// function renderBooks() {
//     bookList.innerHTML = '';
//     books.forEach(book => {
//         const row = document.createElement('tr');
//         row.innerHTML = `
//             <td>${book.title}</td>
//             <td>${book.author}</td>
//             <td>${book.isbn}</td>
//             <td>${book.quantity}</td>
//         `;
//         bookList.appendChild(row);
//     });
// }


const bookList = document.getElementById('bookList');

async function getAdminBookData(){
    try {
        const response = await fetch("/api/routes/book.route.php?isadmin=true");

        // Check if the response is ok (status in the range 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const html = await response.text();
        console.log(html);

        bookList.innerHTML = html;
    } catch (error) {
        console.error('Error fetching book data:', error);
    }
}
getAdminBookData()




// Event listener for Add Book button
addBookBtn.addEventListener('click', () => {
    addBookModal.style.display = 'block';
});

// Event listener for Close Modal button
closeModal.addEventListener('click', () => {
    addBookModal.style.display = 'none';
});

// // Event listener for Add Book form submission
// addBookForm.addEventListener('submit', (e) => {
//     // e.preventDefault();
//     const newBook = {
//         title: document.getElementById('title').value,
//         author: document.getElementById('author').value,
//         isbn: document.getElementById('isbn').value,
//         quantity: parseInt(document.getElementById('quantity').value)
//     };
//     books.push(newBook);
//     renderBooks();
//     addBookModal.style.display = 'none';
//     addBookForm.reset();
// });


// Event listener for menu button
menuBtn.addEventListener('click', () => {
    sidebar.classList.toggle('show');
});

// Close sidebar when clicking outside of it
document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && e.target !== menuBtn) {
        sidebar.classList.remove('show');
    }
});

// // Initial render of books
// renderBooks();

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById('addBookForm');

    form.addEventListener('submit', function (event) {
        if (!validateForm()) {
            event.preventDefault(); // Prevent form submission if validation fails
        }
    });
});

function validateForm() {
    const priceInput = document.getElementById('price');
    const stockInput = document.getElementById('stock');

    // Check price
    if (parseFloat(priceInput.value) <= 0) {
        alert('Price must be a positive number.');
        return false; // Prevent form submission
    }

    // Check stock
    if (parseInt(stockInput.value) < 0) {
        alert('Stock cannot be negative.');
        return false; // Prevent form submission
    }

    return true; // Allow form submission
}
