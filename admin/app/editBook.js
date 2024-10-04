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

    const saveChangesBtn = document.querySelector('.save-changes-btn');
    saveChangesBtn.addEventListener('click', handleFormSubmit);

    const createCategoryBtn = document.getElementById('createCategoryBtn');
    createCategoryBtn.addEventListener('click', createNewCategory);

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
                displayExistingCategories(categories);
            })
            .catch(error => console.error('Error fetching categories:', error));
    }

    function displayExistingCategories(categories) {
        const existingCategoriesList = document.getElementById('existingCategoriesList');
        existingCategoriesList.innerHTML = '';
        categories.forEach(category => {
            const li = document.createElement('li');
            li.textContent = category.category_name;
            existingCategoriesList.appendChild(li);
        });
    }

    function populateForm(data) {
        document.getElementById('bookId').value = data.book_id;
        document.getElementById('title').value = data.title;
        document.getElementById('author').value = data.author;
        document.getElementById('description').value = data.description;
        document.getElementById('imageUrl').value = data.imageUrl;
        document.getElementById('price').value = data.price;
        document.getElementById('stock').value = data.stock;
        
        // Set the book image
        const bookImage = document.getElementById('bookImage');
        bookImage.src = data.imageUrl;
        bookImage.alt = data.title;
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
            removeBtn.textContent = 'x';
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
        
        // Add price and stock to formData
        formData.append('price', document.getElementById('price').value);
        formData.append('stock', document.getElementById('stock').value);

        fetch('../api/routes/book.route.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.success) {
                showToast('Book updated successfully');
                
                // Re-fetch the book data to update the form
                const bookId = document.getElementById('bookId').value;
                fetchBookData(bookId);
            } else {
                showToast('Error updating book: ' + data.message, 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showToast('An error occurred while updating the book', 'error');
        });
    }

    function createNewCategory(e) {
        e.preventDefault();
        const newCategoryName = document.getElementById('newCategory').value.trim();
        
        if (newCategoryName) {
            fetch('../api/routes/category.route.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `action=create&category_name=${encodeURIComponent(newCategoryName)}`
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showToast('Category created successfully');
                    document.getElementById('newCategory').value = ''; // Clear the input
                    fetchCategories(); // Refresh the category list
                } else {
                    showToast('Error creating category: ' + data.message, 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showToast('An error occurred while creating the category', 'error');
            });
        } else {
            showToast('Please enter a category name', 'error');
        }
    }
});
