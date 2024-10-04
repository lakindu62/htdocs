const fontAwesomeLink = document.createElement("link");
fontAwesomeLink.rel = "stylesheet";
fontAwesomeLink.href =
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
document.head.appendChild(fontAwesomeLink);

const sidebarContainer = document.getElementById("sidebar");
console.log(sidebarContainer);
sidebarContainer.innerHTML = ` 
            <div class="logo-container">
                <img src="/images/logo.png" alt="Company Logo" class="company-logo">
            </div>
            <nav>
                <ul>
                    <li><a href="/admin/manage-inventory.html" class="active"><i class="fas fa-boxes"></i> Inventory </a></li>
                    <li><a href="/admin/manage-sales.html"><i class="fas fa-chart-line"></i> Sales </a></li>
                    <li><a href="#"><i class="fas fa-cog"></i> Settings</a></li>
                </ul>
            </nav>
    `;

// Add this at the end of the file
document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.getElementById('menuBtn');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');

    menuBtn.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent the click from propagating to the main content
        sidebar.classList.toggle('show');
        mainContent.classList.toggle('sidebar-open');
    });

    // Close sidebar when clicking outside of it
    document.addEventListener('click', function(event) {
        if (!sidebar.contains(event.target) && !menuBtn.contains(event.target)) {
            sidebar.classList.remove('show');
            mainContent.classList.remove('sidebar-open');
        }
    });
});
