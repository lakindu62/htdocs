// Call the function when the DOM is loaded
document.addEventListener("DOMContentLoaded", renderProgressBar);

document.addEventListener("DOMContentLoaded", () => {
    // Add Font Awesome stylesheet
    const fontAwesomeLink = document.createElement("link");
    fontAwesomeLink.rel = "stylesheet";
    fontAwesomeLink.href =
        "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css";
    document.head.appendChild(fontAwesomeLink);

    // Render header
    document.getElementById("header-container").innerHTML = `
        <header>
            <div class="logo"><img src="/images/logo.png" alt="Logo"></div>
            <div class="account">
                <a href="/mycart.html" class="cart-icon"><i style="font-size:24px" class="fa">&#xf07a;</i></a>
                <a href="/my-profile/wishlist.html"><i style="font-size:24px" class="fa fa-heart-o" aria-hidden="true"></i></a>

                <a href="/my-profile.html"><img class="profile" src="/images/Group 2 (1).png" alt="Profile"></a>
            </div>
            <div class="hamburger">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </header>
        <nav>
            <ul>
                <li><a href="/">HOME</a></li>
                <li><a href="/books.html">BOOKS</a></li>
                <li><a href="/about-us.html">ABOUT US</a></li>
                <li><a href="/suggest.html">SUGGEST A BOOK</a></li>
                <li><a href="#">PROMOTIONS</a></li>
            </ul>
        </nav>
        <div class="sidebar">
            <ul>
                <li><a href="/">HOME</a></li>
                <li><a href="/books.html">BOOKS</a></li>
                <li><a href="/about-us.html">ABOUT US</a></li>
                <li><a href="/suggest.html">SUGGEST A BOOK</a></li>
                <li><a href="#">PROMOTIONS</a></li>
            </ul>
        </div>
    `;

    // Render footer
    document.getElementById("footer-container").innerHTML = `
        <div class="one">
            <img src="/images/logo.png" alt="Logo">
            <p>Your bookstore tagline or short description here.</p>
        </div>
        <div class="two">
            <ul>
                <li class="heading">NAVIGATION</li>
                <li><a href="/">Home</a></li>
                <li><a href="/ books.html">Books</a></li>
                <li><a href="/about-us.html">About Us</a></li>
                <li><a href="/suggest.html">Suggest a Book</a></li>
                <li><a href="#">Promotions</a></li>
            </ul>
        </div>
        <div class="two">
            <ul>
                <li class="heading">COMPANY</li>
                <li>Terms of service</li>
                <li>Privacy Policy</li>
            </ul>
        </div>
        <div class="three">
            <p>Stay up to Date</p>
            <input type="email" name="mail" placeholder="Enter email address..">
        </div>
    `;

    // Add event listeners for responsive behavior
    const hamburger = document.querySelector(".hamburger");
    const sidebar = document.querySelector(".sidebar");

    hamburger.addEventListener("click", () => {
        sidebar.classList.toggle("active");
    });

    // Close sidebar when clicking outside
    document.addEventListener("click", (e) => {
        if (!sidebar.contains(e.target) && !hamburger.contains(e.target)) {
            sidebar.classList.remove("active");
        }
    });

    // Call the function to update cart item count
    updateCartItemCount();
});

// common.js
// Define the CSS styles as a string
const progressBarStyles = `
    .progress-bar {
        display: flex;
        justify-content: space-between;
        margin: 76px 0px;
        max-width: 600px;
    }
    .progress-step {
        display: flex;
        align-items: center;
        flex: 1;
    }
    .progress-step:not(:last-child)::after {
        content: "";
        flex-grow: 1;
        height: 2px;
        background-color: #ddd;
        margin: 0 10px;
    }
    .step-number {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background-color: #4576af;
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 10px;
    }
`;

// Create a style element and append it to the head
const styleElement = document.createElement("style");
styleElement.textContent = progressBarStyles;
document.head.appendChild(styleElement);

// Function to render progress bar
function renderProgressBar() {
    const progressBarContainer = document.getElementById(
        "progress-bar-container"
    );
    if (progressBarContainer) {
        progressBarContainer.innerHTML = `
            <div class="progress-step">
                <div class="step-number">1</div>
                <span>My Cart</span>
            </div>
            <div class="progress-step">
                <div class="step-number">2</div>
                <span>Checkout Details</span>
            </div>
            <div class="progress-step">
                <div class="step-number">3</div>
                <span>Order Complete</span>
            </div>
        `;
    }
}

// Modify the updateCartItemCount function
function updateCartItemCount() {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const userId = userData ? userData.user_id : null;

    if (!userId) {
        console.error("User is not logged in");
        return;
    }

    fetch(
        `../api/routes/cart.route.php?action=get_item_count&user_id=${userId}`
    )
        .then((response) => response.json())
        .then((data) => {

            if (data.status === "success") {
                const cartIcon = document.querySelector(".cart-icon");
                let cartCount = cartIcon.querySelector(".cart-count");

                if (!cartCount) {
                    cartCount = document.createElement("span");
                    cartCount.className = "cart-count";
                    cartIcon.appendChild(cartCount);
                }

                cartCount.textContent = data.data;
            }
        })
        .catch((error) =>
            console.error("Error fetching cart item count:", error)
        );
}

// Make updateCartItemCount available globally
window.updateCartItemCount = updateCartItemCount;

// Add some CSS for the cart count
const cartCountStyles = `
    .cart-icon {
        position: relative;
    }
    .cart-count {
        position: absolute;
        top: -12px;
        right: -12px;
        background-color: rgba(128, 128, 128, 0.8);
        color: white;
        border-radius: 50%;
        padding: 2px 6px;
        font-size: 12px;
    }
`;

// Append the new styles to the existing style element
styleElement.textContent += cartCountStyles;


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
