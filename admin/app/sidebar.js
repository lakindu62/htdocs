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

// Add this function at the end of the file
window.showToast = function(message, type = 'success') {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 10px 20px;
        border-radius: 4px;
        color: white;
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
        z-index: 1000;
        background-color: ${type === 'success' ? '#4CAF50' : '#F44336'};
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '1';
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }, 100);
};
