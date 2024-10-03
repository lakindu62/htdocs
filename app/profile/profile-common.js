function createSidebar() {
    // Add Font Awesome stylesheet
    const fontAwesomeLink = document.createElement("link");
    fontAwesomeLink.rel = "stylesheet";
    fontAwesomeLink.href =
        "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css";
    document.head.appendChild(fontAwesomeLink);

    const sidebarHTML = `
        <div class="profile-sidebar" style="
            background-color: #fff;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            color: white;
            padding: 15px;
            height: 100%;
            transition: all 0.3s ease;
            border-radius: 10px;
        ">

            <ul style="
                list-style-type: none;
                padding: 0;
                width: 100%;
                display: flex;
                flex-direction: column;
            ">

                <li style="margin: 5px 0;"><a href="/my-profile.html" style="color: #1a2130; text-decoration: none; display: block; padding: 8px; transition: background-color 0.3s;"><i class="fa fa-user" style="margin-right: 10px;"></i>Profile Page</a></li>
                <li style="margin: 5px 0;"><a href="#" style="color: #1a2130; text-decoration: none; display: block; padding: 8px; transition: background-color 0.3s;"><i class="fa fa-dashboard" style="margin-right: 10px;"></i>Overview</a></li>
                <li style="margin: 5px 0;"><a href="/my-profile/wishlist.html" style="color: #1a2130; text-decoration: none; display: block; padding: 8px; transition: background-color 0.3s;"><i class="fa fa-heart" style="margin-right: 10px;"></i>Wishlist</a></li>
                <li style="margin: 5px 0;"><a href="/my-profile/purchases.html" style="color: #1a2130; text-decoration: none; display: block; padding: 8px; transition: background-color 0.3s;"><i class="fa fa-shopping-cart" style="margin-right: 10px;"></i>Orderlist</a></li>
            </ul>
        </div>
    `;

    const sidebarContainer = document.querySelector('.profile-container');
    sidebarContainer.insertAdjacentHTML('afterbegin', sidebarHTML);

    // Add hover effect
    const sidebarLinks = document.querySelectorAll('.profile-sidebar ul li a');
    sidebarLinks.forEach(link => {
        link.addEventListener('mouseover', () => {
            link.style.backgroundColor = '#ABBED1';
            link.style.borderRadius = '6px';
        });
        link.addEventListener('mouseout', () => {
            link.style.backgroundColor = 'transparent';
        });
    });

    // Add media query for responsive design
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        @media (max-width: 48rem) {
            .profile-container {
                padding: 0 !important;
            }
            .profile-sidebar {
                width: 100% !important;
                margin: 8px 0 !important;
                padding: 8px !important;
                box-sizing: border-box;
                border-radius: 8px !important;
            }
            .profile-sidebar ul {
                flex-direction: row !important;
                margin: 0 !important;
                justify-content: space-around;
            }
            .profile-sidebar ul li {
                margin: 0 1px !important;
            }
            .profile-sidebar ul li a {
                font-size: 0.8rem !important;
                padding: 4px !important;
            }
            .profile-sidebar ul li a i {
                font-size: 1rem !important;
                margin-right: 3px !important;
            }
        }
    `;
    document.head.appendChild(styleElement);
}

// Call the function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', createSidebar);

