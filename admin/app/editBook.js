document.addEventListener("DOMContentLoaded", function () {
    const editBookForm = document.getElementById("editBookForm");
    const addCategoryBtn = document.getElementById("addCategoryBtn");
    const addCategoryModal = document.getElementById("addCategoryModal");
    const saveNewCategory = document.getElementById("saveNewCategory");
    const cancelNewCategory = document.getElementById("cancelNewCategory");

    // Load book data
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get("id");
    if (bookId) {
        loadBookData(bookId);
    }

    


    let currentBookCategories;

    async function loadBookData(bookId) {
        try {
            const response = await fetch(
                `/api/routes/book.route.php?book_id=${bookId}&isAdmin=true`
            );
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const bookData = await response.json();

            populateForm(bookData);
        } catch (error) {
            console.error("Error loading book data:", error);
        }
    }

    function populateForm(bookData) {
        document.getElementById("bookId").value = bookData.book_id;
        document.getElementById("title").value = bookData.title;
        document.getElementById("author").value = bookData.author;
        document.getElementById("description").value = bookData.description;
        document.getElementById("imageUrl").value = bookData.imageUrl;
        document.getElementById("price").value = bookData.price;
        document.getElementById("stock").value = bookData.stock;
        loadBookCategories(bookData.categories);
    }

    async function loadBookCategories(categories) {
        console.log(categories);

        currentBookCategories = categories;
        getAllCategories();

        populateBookCategories(categories);
        // try {
        //     const response = await fetch("/api/routes/category.route.php");
        //     if (!response.ok) {
        //         throw new Error(`HTTP error! Status: ${response.status}`);
        //     }
        //     const categories = await response.json();
        //     console.log(categories);

        // } catch (error) {
        //     console.error("Error loading categories:", error);
        // }
    }

    function populateBookCategories(categories) {
        const categoryContainer = document.getElementById("category-container");
        categories.forEach((category) => {
            const pill = document.createElement("div");
            pill.className = "category-pill";
            // pill.dataset.categoryId = category.category_id;
            pill.innerHTML = `
                        ${category}
                        <span class="delete-icon" onclick="deleteCategory(${category})">×</span>
                    `;
            categoryContainer.appendChild(pill);
        });
    }

    async function getAllCategories() {
        try {
            const response = await fetch("/api/routes/category.route.php");
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const categories = await response.json();

            populateAllCategories(categories);
        } catch (error) {
            console.error("Error loading categories:", error);
        }
    }

    function populateAllCategories(categories) {
        const difference = categories.filter(
            (item) => !currentBookCategories.includes(item.category_name)
        );

        const allCatSelectContainer = document.getElementById("category");
        difference.forEach((category) => {
            const catOption = document.createElement("option");
            catOption.value = category.category_name;
            catOption.innerHTML = category.category_name;

            allCatSelectContainer.appendChild(catOption);
        });
    }

    //editing a book when details are submitted
    editBookForm.addEventListener("submit", function (e) {
        e.preventDefault();
        saveBookChanges();
    });

    //creating a new category when details are submitted
    saveNewCategory.addEventListener("click", function () {
        const newCategoryName =
            document.getElementById("newCategoryName").value;
        if (newCategoryName) {
            createNewCategory(newCategoryName);
        }
    });

    //category model control
    addCategoryBtn.addEventListener("click", function () {
        addCategoryModal.style.display = "block";
    });
    cancelNewCategory.addEventListener("click", function () {
        addCategoryModal.style.display = "none";
    });
});

function deleteBookCategory(categoryId) {
    const pill = document.querySelector(
        `.category-pill[data-category-id="${categoryId}"]`
    );
    if (pill) {
        pill.remove();
        // Here you would typically also send a request to your backend to delete the category
    }
}

//save the edited changes
async function saveBookChanges() {
    const formData = new FormData(document.getElementById("editBookForm"));
    const requestData = {
        ...formData,
        action: "update",
    };

    const body = new URLSearchParams(requestData).toString();
    try {
        const response = await fetch("/api/routes/book.route.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body,
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        if (result.success) {
            alert("Book updated successfully!");
        } else {
            alert("Error updating book: " + result.message);
        }
    } catch (error) {
        console.error("Error saving book changes:", error);
        alert("Error saving book changes. Please try again.");
    }
}

async function createNewCategory(category_name) {
    const requestData = {
        category_name,
        action: "create",
    };

    const body = new URLSearchParams(requestData).toString();

    try {
        const response = await fetch("/api/routes/category.route.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();

        if (result.status === "success") {
            alert("New category created successfully!");
            document.getElementById("addCategoryModal").style.display = "none";
            loadCategories();
        } else {
            alert("Error creating category: " + result.message);
        }
    } catch (error) {
        console.error("Error creating new category:", error);
        alert("Error creating new category. Please try again.");
    }
}
