const fontAwesomeLink = document.createElement("link");
fontAwesomeLink.rel = "stylesheet";
fontAwesomeLink.href =
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
document.head.appendChild(fontAwesomeLink);

const sidebarContainer = document.getElementById("sidebar");
console.log(sidebarContainer);
sidebarContainer.innerHTML = ` 
            <h1>Admin Panel</h1>
            <nav>
                <ul>
                    <li><a href="/admin/manage-inventory.html" class="active"><i class="fas fa-boxes"></i> Inventory Management</a></li>
                    <li><a href="/admin/sales.html"><i class="fas fa-chart-line"></i> Sales Management</a></li>
                    <li><a href="#"><i class="fas fa-cog"></i> Settings</a></li>
                </ul>
            </nav>
    `;
