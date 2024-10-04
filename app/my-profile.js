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

    const logoutBtn = document.getElementById('logoutBtn');
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    const updateProfileBtn = document.getElementById('updateProfileBtn');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    
    logoutBtn.addEventListener('click', function() {
        // Remove the logged-in state from local storage
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userData');
        
        // Redirect to the login page or home page after logout
        window.location.href = '/';
    });

    changePasswordBtn.addEventListener('click', function() {
        changePassword();
    });

    updateProfileBtn.addEventListener('click', function() {
        updateProfile();
    });

    // Show update button when username or email is edited
    usernameInput.addEventListener('input', showUpdateButton);
    emailInput.addEventListener('input', showUpdateButton);

    // Load user profile data
    loadUserProfile();
});

function showUpdateButton() {
    document.getElementById('updateProfileBtn').style.display = 'block';
}

// Function to load user profile
function loadUserProfile() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData && userData.user_id) {
        fetch(`/api/routes/user.route.php?user_id=${userData.user_id}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    document.getElementById('username').value = data.user.username;
                    document.getElementById('email').value = data.user.email;
                } else {
                    showToast('Failed to load user data: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showToast('An error occurred while loading user data');
            });
    } else {
        showToast('User data not found. Please log in again.');
        window.location.href = '/auth/sign-in.html';
    }
}

// Function to update profile
function updateProfile() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData || !userData.user_id) {
        showToast('User data not found. Please log in again.');
        return;
    }

    const data = {
        user_id: userData.user_id,
        username: document.getElementById('username').value,
        email: document.getElementById('email').value
    };

    fetch('/api/routes/user.route.php', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            showToast('Profile updated successfully');
            document.getElementById('updateProfileBtn').style.display = 'none';
        } else {
            showToast('Failed to update profile: ' + result.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('An error occurred while updating the profile');
    });
}

// Function to change password
function changePassword() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword !== confirmPassword) {
        showToast('New password and confirm password do not match');
        return;
    }

    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData || !userData.user_id) {
        showToast('User data not found. Please log in again.');
        return;
    }

    const data = {
        user_id: userData.user_id,
        current_password: currentPassword,
        new_password: newPassword
    };

    fetch('/api/routes/user.route.php?change_password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            showToast('Password changed successfully');
            // Clear the password fields
            document.getElementById('currentPassword').value = '';
            document.getElementById('newPassword').value = '';
            document.getElementById('confirmPassword').value = '';
        } else {
            showToast('Failed to change password: ' + result.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('An error occurred while changing the password');
    });
}

