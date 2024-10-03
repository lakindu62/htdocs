document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get("order_id");
    console.log(orderId);
    if (orderId) {
        fetch(`/api/routes/order.route.php?order_id=${orderId}`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);

                const order = data.order;
                populateOrderDetails(order);
            })
         
    } else {
        alert("No order ID provided. Please check your URL.");
    }
});

function populateOrderDetails(order) {
    // Update order details
    document.getElementById('orderDate').textContent = new Date(order.order_date).toLocaleDateString();
    document.getElementById('orderNumber').textContent = order.order_id;
    document.getElementById('paymentMethod').textContent = order.payment_method;
    
    // Update shipping address
    document.getElementById('shippingAddress').textContent = `${order.postal_address}, ${order.city}, ${order.country}, ${order.postal_code}`;

    // Update order items
    updateOrderItems(order.items);

    // Update order total
    const subtotal = (parseFloat(order.total_amount) - parseFloat(order.shipping_cost)).toFixed(2);
    document.getElementById('subtotal').textContent = `$${subtotal}`;
    document.getElementById('shippingCost').textContent = `$${parseFloat(order.shipping_cost).toFixed(2)}`;
    document.getElementById('totalAmount').innerHTML = `<strong>$${parseFloat(order.total_amount).toFixed(2)}</strong>`;
}

function updateOrderItems(items) {
    const orderItemsContainer = document.getElementById('orderItems');
    orderItemsContainer.innerHTML = ''; // Clear existing items

    if (items.length === 0) {
        orderItemsContainer.innerHTML = '<p>No items in this order.</p>';
        return;
    }

    items.forEach(item => {
        console.log(item);
        const itemElement = document.createElement('div');
        itemElement.className = 'order-item';
        itemElement.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.title}">
            <div class="order-item-details">
                <h3>${item.title}</h3>
                <p>${item.author}</p>
                <p>Qty ${item.quantity}</p>
            </div>
            <div>$${(parseFloat(item.price) * item.quantity).toFixed(2)}</div>
        `;
        orderItemsContainer.appendChild(itemElement);
    });
}
