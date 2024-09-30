// Fetch the book data from the PHP route
async function fetchBooks() {
    try {
        const response = await fetch('./api/routes/book.route.php');
        const books = await response.json();
        console.log(books);
        
        renderBooks(books);
    } catch (error) {
        console.error("Error fetching books:", error);
    }
}

// Render books based on category (Bestsellers, New Arrivals, etc.)
function renderBooks(books) {
    const bestsellersSection = document.getElementById('bestsellers');
    const newArrivalsSection = document.getElementById('new-arrivals');


    

    books.forEach(book => {
        const bookElement = createBookElement(book);

        if (book.category_name === 'Bestseller') {
            bestsellersSection.appendChild(bookElement);
        } else if (book.category_name === 'New Arrival') {
            newArrivalsSection.appendChild(bookElement);
        }
    });
}

// Create individual book elements
function createBookElement(book) {
    const article = document.createElement('article');
    article.classList.add('displays');
    article.onclick =()=> navigateToBook(book.book_id)

    const viewDiv = document.createElement('div');
    viewDiv.classList.add('view');
    const img = document.createElement('img');
    img.src = book.imageUrl;
    viewDiv.appendChild(img);

    const titleDiv = document.createElement('div');
    titleDiv.classList.add('title');
    titleDiv.innerHTML = `<p>${book.title}</p>`;

    const priceDiv = document.createElement('div');
    priceDiv.classList.add('price');
    priceDiv.textContent = `Rs. ${book.price}`;

    const detailsDiv = document.createElement('div');
    detailsDiv.classList.add('details');

    const stockImg = document.createElement('img');
    stockImg.style.height = "40px";
    stockImg.src = './images/Vector.png';

    const stockStatusDiv = document.createElement('div');
    stockStatusDiv.style.cssText = "font-family: 'Roboto';font-size: 18px;font-weight: bold;background-color: chartreuse; width: 100px;border-radius: 20px;";
    stockStatusDiv.innerHTML = '<p style="color: white;margin-left: 15px;">In Stock</p>';

    const cartImg = document.createElement('img');
    cartImg.style.height = "40px";
    cartImg.src = './images/Cart.png';

    detailsDiv.appendChild(stockImg);
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
