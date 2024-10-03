// Check if the user is logged in
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn || isLoggedIn !== 'true') {
        // If not logged in, redirect to the sign-in page
        window.location.href = '/auth/sign-in.html';
    }
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();

   
});


document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('logoutBtn');
    
    logoutBtn.addEventListener('click', function() {
        // Remove the logged-in state from local storage
        localStorage.removeItem('isLoggedIn');
        console.log("removed");
        
        // You may also want to remove any user data stored in local storage
        localStorage.removeItem('userData');
        
        // Redirect to the login page or home page after logout
        window.location.href = '/';
    });
});

