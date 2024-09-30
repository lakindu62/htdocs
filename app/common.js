// common.js

document.addEventListener("DOMContentLoaded", () => {
    // Render header
    document.getElementById("header-container").innerHTML = `
        <header>
            <div class="logo"><img src="./images/logo.png" alt="Logo"></div>
            <div class="account">
                <img class="imotes" src="./images/Cart.png" alt="Cart">
                <img class="imotes" src="./images/Vector.png" alt="Vector">
                <img class="imotes" src="./images/notifications.png" alt="Notifications">
                <img class="profile" src="./images/Group 2 (1).png" alt="Profile">
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
                <li><a href="books.html">BOOKS</a></li>
                <li><a href="about-us.html">ABOUT US</a></li>
                <li><a href="suggest.html">SUGGEST A BOOK</a></li>
                <li><a href="#">PROMOTIONS</a></li>
            </ul>
        </nav>
        <div class="sidebar">
            <ul>
                <li><a href="/">HOME</a></li>
                <li><a href="books.html">BOOKS</a></li>
                <li><a href="about-us.html">ABOUT US</a></li>
                <li><a href="suggest.html">SUGGEST A BOOK</a></li>
                <li><a href="#">PROMOTIONS</a></li>
            </ul>
        </div>
    `;

    // Render footer
    document.getElementById("footer-container").innerHTML = `
        <div class="one">
            <img src="./images/logo.png" alt="Logo"><br><br><br><br><br><br><br><br><br>
         
        </div>
        <div class="two">
            <ul>
                <li class="heading">NAVIGATION</li>
                <li><a href="/">Home</a></li>
                <li><a href="books.html">Books</a></li>
                <li><a href="about-us.html">About Us</a></li>
                <li><a href="suggest.html">Suggest a Book</a></li>
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
    const hamburger = document.querySelector('.hamburger');
    const sidebar = document.querySelector('.sidebar');

    hamburger.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) && !hamburger.contains(e.target)) {
            sidebar.classList.remove('active');
        }
    });
});
