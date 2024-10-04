document.addEventListener('DOMContentLoaded', function() {
    loadSalesOverview();
    loadOrders();
    loadRevenueChart();

    // Add event listeners for search
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            performSearch();
        }
    });

    // Add event listener for clear search
    document.getElementById('clearSearchBtn').addEventListener('click', clearSearch);
});

// Add these variables at the top of your file
let allOrders = [];
const searchInput = document.getElementById('orderSearch');
const searchBtn = document.getElementById('searchBtn');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const salesOverview = document.querySelector('.sales-overview');
const revenueGraphContainer = document.querySelector('.revenue-graph-container');
const orderManagement = document.querySelector('.table-container').parentElement;

function performSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm) {
        // Hide overview and revenue sections
        salesOverview.style.display = 'none';
        revenueGraphContainer.style.display = 'none';
        
        // Show clear search button
        clearSearchBtn.style.display = 'inline-block';
        
        // Perform search
        searchOrders(searchTerm);
        
        // Update layout
        orderManagement.style.marginTop = '0';
    }
}

function clearSearch() {
    // Show overview and revenue sections
    salesOverview.style.display = 'flex';
    revenueGraphContainer.style.display = 'block';
    
    // Hide clear search button
    clearSearchBtn.style.display = 'none';
    
    // Clear search input
    searchInput.value = '';
    
    // Display all orders
    displayOrders(allOrders);
    
    // Reset layout
    orderManagement.style.marginTop = '';
}

function searchOrders(searchTerm) {
    const filteredOrders = allOrders.filter(order => 
        order.order_id.toString().includes(searchTerm) ||
        order.username.toLowerCase().includes(searchTerm) ||
        order.order_date.toLowerCase().includes(searchTerm) ||
        order.total_amount.toString().includes(searchTerm) ||
        order.payment_method.toLowerCase().includes(searchTerm) ||
        order.country.toLowerCase().includes(searchTerm) ||
        order.city.toLowerCase().includes(searchTerm) ||
        order.order_status.toLowerCase().includes(searchTerm)
    );
    displayOrders(filteredOrders);
}

// Add this function to fetch the sales overview
async function loadSalesOverview() {
    try {
        const response = await fetch('../api/routes/order.route.php?sales_overview=true');
        const data = await response.json();

        if (data.success) {
            const overview = data.overview;
            document.getElementById('total-sales').textContent = `$${parseFloat(overview.total_sales).toFixed(2)}`;
            document.getElementById('total-orders').textContent = overview.total_orders;
            document.getElementById('avg-order-value').textContent = `$${parseFloat(overview.avg_order_value).toFixed(2)}`;
        } else {
            console.error('Failed to load sales overview:', data.message);
        }
    } catch (error) {
        console.error('Error loading sales overview:', error);
    }
}

// Modify the loadOrders function
async function loadOrders() {
    try {
        const response = await fetch('/api/routes/order.route.php?all_orders=true');
        const data = await response.json();

        if (data.success) {
            allOrders = data.orders; // Store all orders
            displayOrders(allOrders); // Display all orders initially
        } else {
            console.error('Failed to load orders:', data.message);
        }
    } catch (error) {
        console.error('Error loading orders:', error);
    }
}

// Add this new function to display orders
function displayOrders(orders) {
    const tableBody = document.querySelector('#orders-table tbody');
    tableBody.innerHTML = '';

    orders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.order_id}</td>
            <td>${order.username}</td>
            <td>${order.order_date}</td>
            <td>$${parseFloat(order.total_amount).toFixed(2)}</td>
            <td>${order.payment_method}</td>
            <td>${order.country}, ${order.city}</td>
            <td>
                <select class="status-select status-${order.order_status.toLowerCase()}" data-order-id="${order.order_id}">
                    <option value="Pending" ${order.order_status === 'Pending' ? 'selected' : ''}>Pending</option>
                    <option value="Processing" ${order.order_status === 'Processing' ? 'selected' : ''}>Processing</option>
                    <option value="Shipped" ${order.order_status === 'Shipped' ? 'selected' : ''}>Shipped</option>
                    <option value="Delivered" ${order.order_status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                    <option value="Cancelled" ${order.order_status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
            </td>
            
        `;
        tableBody.appendChild(row);
    });

    // Add event listeners to all status select dropdowns
    document.querySelectorAll('.status-select').forEach(select => {
        select.addEventListener('change', function() {
            updateOrderStatus(this.dataset.orderId, this.value);
            // Update the class of the select element
            this.className = `status-select status-${this.value.toLowerCase()}`;
        });
    });
}

function viewOrderDetails(orderId) {
    // Implement a modal or a new page to show detailed order information
    console.log(`View details for order ${orderId}`);
}

async function updateOrderStatus(orderId, newStatus) {
    try {
        const response = await fetch('/api/routes/order.route.php', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                order_id: orderId,
                new_status: newStatus
            }),
        });

        const data = await response.json();

        if (data.success) {
            alert(`Order ${orderId} status updated to ${newStatus}`);
        } else {
            console.error('Failed to update order status:', data.message);
            alert('Failed to update order status. Please try again.');
            // Revert the select to its previous value
            const select = document.querySelector(`.status-select[data-order-id="${orderId}"]`);
            select.value = select.dataset.previousValue;
        }
    } catch (error) {
        console.error('Error updating order status:', error);
        alert('An error occurred while updating the order status. Please try again.');
        // Revert the select to its previous value
        const select = document.querySelector(`.status-select[data-order-id="${orderId}"]`);
        select.value = select.dataset.previousValue;
    }
}

async function loadRevenueChart(days = 30) {
    try {
        const response = await fetch(`/api/routes/order.route.php?revenue_data=true&days=${days}`);
        const data = await response.json();
        console.log(data);

        if (data.success) {
            const revenueData = data.revenueData;
            createRevenueChart(revenueData);
        } else {
            console.error('Failed to load revenue data:', data.message);
        }
    } catch (error) {
        console.error('Error loading revenue data:', error);
    }
}

function createRevenueChart(revenueData) {
    const ctx = document.getElementById('revenueChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: revenueData.map(item => item.date),
            datasets: [{
                label: 'Revenue',
                data: revenueData.map(item => item.revenue),
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Revenue ($)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                }
            }
        }
    });
}

// Add this new function to handle the search
function searchOrders(searchTerm) {
    const filteredOrders = allOrders.filter(order => 
        order.order_id.toString().includes(searchTerm) ||
        order.username.toLowerCase().includes(searchTerm) ||
        order.order_date.toLowerCase().includes(searchTerm) ||
        order.total_amount.toString().includes(searchTerm) ||
        order.payment_method.toLowerCase().includes(searchTerm) ||
        order.country.toLowerCase().includes(searchTerm) ||
        order.city.toLowerCase().includes(searchTerm) ||
        order.order_status.toLowerCase().includes(searchTerm)
    );
    displayOrders(filteredOrders);
}
