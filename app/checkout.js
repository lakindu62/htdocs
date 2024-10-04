document.addEventListener('DOMContentLoaded', function() {

    function checkLoginStatus() {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (!isLoggedIn || isLoggedIn !== 'true') {
            // If not logged in, redirect to the sign-in page
            window.location.href = '/auth/sign-in.html';
        }
    }

    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData || !userData.user_id) {
        alert('User data not found. Please log in.');
        window.location.href = 'auth/sign-In.html';
        return;
    }

    fetchCartItems(userData.user_id)
        .then(populateOrderSummary)
        .catch(error => {
            console.error('Error:', error);
            window.location.href = 'mycart.html';
        });

    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckout);
    }

    const cardPayment = document.getElementById('card');
    const cashPayment = document.getElementById('cash');
    const securePayment = document.getElementById('securePayment');

    cardPayment.addEventListener('change', function() {
        securePayment.style.display = this.checked ? 'flex' : 'none';
    });

    cashPayment.addEventListener('change', function() {
        securePayment.style.display = this.checked ? 'none' : 'flex';
    });
});

async function fetchCartItems(userId) {
    return fetch(`../api/routes/cart.route.php?user_id=${userId}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                return data.data;
            } else {
                window.location.href = 'mycart.html';
            }
        });
}

function populateOrderSummary(cartItems) {
    const orderSummary = document.querySelector('.order-summary');
    const orderItemsContainer = orderSummary.querySelector('.order-item').parentElement;
    orderItemsContainer.innerHTML = ''; // Clear existing items

    let total = 0;
    const shippingCost = 600.00; // Assuming a fixed shipping cost

    cartItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'order-item';
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        itemElement.innerHTML = `
            <span>${item.title} (x${item.quantity})</span>
            <span>$${itemTotal.toFixed(2)}</span>
        `;
        orderItemsContainer.appendChild(itemElement);
    });

    // Add shipping cost
    const shippingElement = document.createElement('div');
    shippingElement.className = 'order-item';
    shippingElement.innerHTML = `
        <span>Shipping</span>
        <span>$${shippingCost.toFixed(2)}</span>
    `;
    orderItemsContainer.appendChild(shippingElement);

    // Update total
    total += shippingCost;
    const totalElement = document.createElement('div');
    totalElement.className = 'total';
    totalElement.textContent = `Total: $${total.toFixed(2)}`;
    orderItemsContainer.appendChild(totalElement);

    // Update the order amount at the top of the summary
    const orderAmountElement = orderSummary.querySelector('.order-amount');
    if (orderAmountElement) {
        orderAmountElement.textContent = `$${total.toFixed(2)}`;
    }
}

function handleCheckout(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const userData = JSON.parse(localStorage.getItem('userData'));
    
    if (!userData || !userData.user_id) {
        alert('User data not found. Please log in.');
        return;
    }

    fetchCartItems(userData.user_id)
        .then(cartItems => {
            if (cartItems.length === 0) {
                window.location.href = 'mycart.html';
                return;
            }

            // Calculate total amount
            const shippingCost = 600.00; // Assuming a fixed shipping cost
            let totalAmount = shippingCost;
            const formattedCartItems = cartItems.map(item => {
                const itemTotal = item.price * item.quantity;
                totalAmount += itemTotal;
                return {
                    book_id: item.book_id,
                    quantity: item.quantity,
                    price: item.price
                };
            });

            const orderData = {
                user_id: userData.user_id,
                country: formData.get('country'),
                city: formData.get('city'),
                postal_address: formData.get('postal_address'),
                postal_code: formData.get('postal_code'),
                payment_method: formData.get('payment'),
                total_amount: totalAmount.toFixed(2),
                cart_items: formattedCartItems
            };

            return placeOrder(orderData);
        })
        .then(orderResponse => {
            console.log(orderResponse);
            if (orderResponse.success) {
                 clearBackendCart(userData.user_id);
                window.location.href = `ordersummary.html?order_id=${orderResponse.order_id}`;
            } else {
                throw new Error('Failed to place order');
            }
        })
      
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        });
}

async function placeOrder(orderData) {
    return fetch('../api/routes/order.route.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
    })
    .then(response => response.json());
}

async function clearBackendCart(userId) {
    return fetch('../api/routes/cart.route.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `user_id=${userId}&action=clear_cart`
    })
    .then(response => response.json())
    .then(data => {
        if (data.status !== 'success') {
            throw new Error(data.message || 'Failed to clear cart');
        }
    });
}
