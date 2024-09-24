const sidebarContainer = document.getElementById("sidebar");
console.log(sidebarContainer);
sidebarContainer.innerHTML = ` 
            <h1>Admin Panel</h1>
            <nav>
                <ul>
                    <li><a href="#" class="active">Inventory Management</a></li>
                    <li><a href="#">Users</a></li>
                    <li><a href="#">Settings</a></li>
                </ul>
            </nav>
    `;
