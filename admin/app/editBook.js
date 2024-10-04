document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('id');
    const editBookForm = document.getElementById('editBookForm');
    const categoryContainer = document.getElementById('category-container');
    const categorySelect = document.getElementById('category');
    const addCategoryBtn = document.querySelector('.btn');

    let currentCategories = [];

    // Fetch book data and populate form
    if (bookId) {
        fetchBookData(bookId);
    }

    // Fetch all categories
    fetchCategories();

    // Event listeners
    editBookForm.addEventListener('submit', handleFormSubmit);
    addCategoryBtn.addEventListener('click', addCategory);

    function fetchBookData(bookId) {
        fetch(`../api/routes/book.route.php?book_id=${bookId}&isAdmin=true`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                populateForm(data);
                console.log(data);
                currentCategories = data.categories.map(cat => ({
                    category_id: cat.category_id,
                    category_name: cat.category_name // Assuming the backend returns category names
                }));
                updateCategoryDisplay();
            })
            .catch(error => console.error('Error fetching book data:', error));
    }

    function fetchCategories() {
        fetch('../api/routes/category.route.php')
            .then(response => response.json())
            .then(categories => {
                populateCategorySelect(categories);
            })
            .catch(error => console.error('Error fetching categories:', error));
    }

    function populateForm(data) {
        document.getElementById('bookId').value = data.book_id;
        document.getElementById('title').value = data.title;
        document.getElementById('author').value = data.author;
        document.getElementById('description').value = data.description;
        document.getElementById('imageUrl').value = data.imageUrl;
        document.getElementById('price').value = data.price;
        document.getElementById('stock').value = data.stock;
    }

    function populateCategorySelect(categories) {
        categorySelect.innerHTML = '<option value="">Select a category</option>';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.category_id;
            option.textContent = category.category_name;
            categorySelect.appendChild(option);
        });
    }

    function updateCategoryDisplay() {
        categoryContainer.innerHTML = '';
        currentCategories.forEach(category => {
            const categoryElement = document.createElement('div');
            categoryElement.className = 'category-item';
            categoryElement.textContent = category.category_name;
            
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remove';
            removeBtn.onclick = () => removeCategory(category.category_id);
            
            categoryElement.appendChild(removeBtn);
            categoryContainer.appendChild(categoryElement);
        });
    }

    function addCategory(e) {
        e.preventDefault();
        const selectedCategoryId = categorySelect.value;
        const selectedCategoryName = categorySelect.options[categorySelect.selectedIndex].text;
        
        if (selectedCategoryId && !currentCategories.some(cat => cat.category_id === selectedCategoryId)) {
            currentCategories.push({ category_id: selectedCategoryId, category_name: selectedCategoryName });
            updateCategoryDisplay();
        }
    }

    function removeCategory(categoryId) {
        currentCategories = currentCategories.filter(cat => cat.category_id !== categoryId);
        updateCategoryDisplay();
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        const formData = new FormData(editBookForm);
        formData.append('action', 'update');
        formData.append('category', JSON.stringify(currentCategories.map(cat => cat.category_id)));
        console.log(currentCategories);
        fetch('../api/routes/book.route.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            console.log(data);
            if (data.success) {
                alert('Book updated successfully');
                // Optionally redirect or refresh the page
            } else {
                alert('Error updating book: ' + data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    }
});
