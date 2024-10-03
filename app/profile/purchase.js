document.addEventListener('DOMContentLoaded', () => {
    loadUserOrders();
});

function loadUserOrders() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData || !userData.user_id) {
        alert('Please log in to view your orders.');
        window.location.href = '/auth/sign-In.html';
        return;
    }

    fetch(`../../api/routes/order.route.php?user_id=${userData.user_id}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.success) {
                displayOrders(data.orders);
                updateWelcomeMessage(userData.username);
            } else {
                alert('Failed to load orders. Please try again later.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while loading orders.');
        });
}

function displayOrders(orders) {
    const container = document.getElementById('orders-container');
    container.innerHTML = '';

    // Add table header
    const header = document.createElement('div');
    header.className = 'purchase-cards-header';
    header.innerHTML = `
        <div>Image</div>
        <div>Name</div>
        <div>Status</div>
        <div>Date</div>
        <div>Price</div>
        <div>Action</div>
    `;
    container.appendChild(header);

    orders.forEach(order => {
        const orderCard = createOrderCard(order);
        container.appendChild(orderCard);
    });
}

function createOrderCard(order) {
    const card = document.createElement('div');
    card.className = 'purchase-card';
    
    let firstBookHtml = '';
    if (order.items && order.items.length > 0) {
        const firstBook = order.items[0];
        firstBookHtml = `
            <img class="purchase-card__book-image" src="${firstBook.imageUrl}" alt="Book cover" />
        `;
    } else {
        firstBookHtml = `
            <img class="purchase-card__book-image" src="/images/placeholder.png" alt="No image available" />
        `;
    }
    
    card.innerHTML = `
        <div>${firstBookHtml}</div>
        <div>
            <h3 class="purchase-card__book-title">${order.items && order.items.length > 0 ? order.items[0].title : 'No books in this order'}</h3>
        </div>
        <div>
            <p class="purchase-card__status">${order.order_status}</p>
        </div>
        <div>
            <p class="purchase-card__date">${order.order_date}</p>
        </div>
        <div>
            <p class="purchase-card__price">Rs. ${order.total_amount}</p>
        </div>
        <div>
            <button class="purchase-card__button" onclick="viewOrderDetails(${order.order_id})">View Order</button>
        </div>
    `;

    return card;
}

function viewOrderDetails(orderId) {
    fetch(`/api/routes/order.route.php?order_id=${orderId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayOrderModal(data.order);
            } else {
                alert('Failed to load order details. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while loading order details.');
        });
}

function updateWelcomeMessage(username) {
    const welcomeMessage = document.getElementById('welcome-message');
    welcomeMessage.textContent = `Welcome, ${username}`;
}

function logout() {
    localStorage.removeItem('userData');
    window.location.href = '/auth/sign-In.html';
}