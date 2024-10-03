// Check if the user is logged in
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn || isLoggedIn !== "true") {
        // If not logged in, redirect to the sign-in page
        window.location.href = "/auth/sign-in.html";
    }
}

// Call the function when the page loads
document.addEventListener("DOMContentLoaded", function () {
    checkLoginStatus();
});

document.addEventListener("DOMContentLoaded", function () {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const userId = userData ? userData.user_id : null;
    if (!userId) {
        console.error("User is not logged in");
        window.location.href = "/auth/sign-in.html";
        return;
    }

    // Fetch cart items from the backend
    fetch(`../api/routes/cart.route.php?user_id=${userId}`)
        .then((response) => response.json())
        .then((data) => {


            if (data.status === "success") {
                const cartItems = data.data;
                populateCart(cartItems);
            } else {
                const container = document.getElementById("container");
                console.log(container);
                container.innerHTML = "<div class='empty-cart'><p>No items in cart</p> <a href='/'>Continue Shopping</a></div>";

                console.error(data.message);
            }
        })
        .catch((error) => console.error("Error fetching cart items:", error));
});

function populateCart(cartItems) {
    const cartTable = document.getElementById("cart-items");
    let total = 0;
 

    cartItems && cartItems.forEach((item) => {
        const row = document.createElement("tr");
        row.id = `cart-item-${item.book_id}`;
        // Product image
        const productImageCell = document.createElement("td");
        const img = document.createElement("img");
        img.src = item.imageUrl;
        productImageCell.appendChild(img);
        row.appendChild(productImageCell);

        // Price
        const priceCell = document.createElement("td");
        priceCell.textContent = item.price;
        row.appendChild(priceCell);

        // Quantity

        // Quantity with Increment/Decrement buttons
        const quantityCell = document.createElement("td");

        // Decrement Button
        const decrementButton = document.createElement("button");
        decrementButton.textContent = "-";
        decrementButton.onclick = () =>
            updateQuantity(
                item.book_id,
                parseInt(quantityText.textContent) - 1
            );

        // Quantity Text
        const quantityText = document.createElement("span");
        quantityText.textContent = item.quantity;
        quantityText.id = `quantity-${item.book_id}`;

        // Increment Button
        const incrementButton = document.createElement("button");
        incrementButton.textContent = "+";
        incrementButton.onclick = () =>
            updateQuantity(
                item.book_id,
                parseInt(quantityText.textContent) + 1
            );

        // Append buttons and quantity text to quantityCell
        quantityCell.appendChild(decrementButton);
        quantityCell.appendChild(quantityText);
        quantityCell.appendChild(incrementButton);

        row.appendChild(quantityCell);

        // Subtotal
        const subtotalCell = document.createElement("td");
        const subtotal = item.price * item.quantity;
        subtotalCell.textContent = subtotal;
        row.appendChild(subtotalCell);

        // Delete button
        const deleteCell = document.createElement("td");
        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = '🗑️';
        deleteButton.classList.add("delete-btn");
        deleteButton.onclick = () => deleteCartItem(item.book_id);
        deleteCell.appendChild(deleteButton);
        row.appendChild(deleteCell);

        // Append row to table
        cartTable.appendChild(row);

        total += subtotal;
    });

    // Update cart total
    const subTotalElement = document.getElementById("subtotal");
    const totalElement = document.getElementById("total");
    const shippingCost = 600;

    subTotalElement.textContent = total;
    totalElement.textContent = total + shippingCost;
}

// Function to update quantity and make a POST request
const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return; // Prevent quantity from going below 1

    const userData = JSON.parse(localStorage.getItem("userData"));
    const userId = userData ? userData.user_id : null;

    if (!userId) {
        console.error("User is not logged in");
        return;
    }

    // Make a POST request to update quantity
    fetch("../api/routes/cart.route.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            book_id: itemId,
            user_id: userId,
            quantity: newQuantity,
            action: "update_quantity",
        }).toString(),
    })
        .then((response) => response.json())

        .then((data) => {
            if (data.status == "success") {
                // Update the quantity in the DOM
                document.getElementById(`quantity-${itemId}`).textContent =
                    newQuantity;

                // Optionally, update subtotal and total values
                updateCart();
            } else {
                // alert(data.message);
            }
        })
        .catch((error) => {
            console.error("Error:", error);
        });
};

// Function to update the subtotal and total values after quantity change
const updateCart = () => {
    let subtotal = 0;
    document.querySelectorAll("#cart-items tr").forEach((row) => {
        const price = parseFloat(row.children[1].textContent);
        const quantity = parseInt(
            row.children[2].querySelector("span").textContent
        );
        const subTotal = price * quantity;
        row.children[3].textContent = subTotal.toFixed(2);
        subtotal += subTotal;
    });

    document.getElementById("subtotal").textContent = subtotal.toFixed(2);
    const total = subtotal + 600; // Flat shipping rate
    document.getElementById("total").textContent = total.toFixed(2);
};

// Function to delete a cart item
const deleteCartItem = (itemId) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const userId = userData ? userData.user_id : null;

    if (!userId) {
        console.error("User is not logged in");
        return;
    }

    // Make a POST request to delete the item
    fetch("../api/routes/cart.route.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            book_id: itemId,
            user_id: userId,
            action: "remove_item",
        }).toString(),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.status === "success") {
                console.log(data);
                
                // Remove the item from the DOM
                const row = document.getElementById(`cart-item-${itemId}`);
                if (row) {
                    row.remove();
                }
                // Update cart totals
                updateCart();
            } else {
                console.error(data.message);
            }
        })
        .catch((error) => {
            console.error("Error:", error);
        });
};
