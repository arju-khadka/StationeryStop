// StationeryStop Login Authentication System

// Predefined credentials (in a real application, this would be handled server-side)
const validCredentials = {
    users: [
        { username: "admin", email: "admin@stationerystop.com", password: "admin123" },
        { username: "user1", email: "user1@stationerystop.com", password: "password123" },
        { username: "demo", email: "demo@stationerystop.com", password: "demo123" }
    ]
};

// Get DOM elements
let signupBtn = document.getElementById("signupBtn");
let signinBtn = document.getElementById("signinBtn");
let nameField = document.getElementById("nameField");
let title = document.getElementById("title");

// Get input fields
const nameInput = document.querySelector('#nameField input[type="text"]');
const emailInput = document.querySelector('input[type="email"]');
const passwordInput = document.querySelector('input[type="password"]');

// Toggle between Sign In and Sign Up
signinBtn.onclick = function(){
    nameField.style.maxHeight = "0";
    title.innerHTML = "Sign In";
    signupBtn.classList.add("disable");
    signinBtn.classList.remove("disable");
    clearMessages();
}

signupBtn.onclick = function(){
    nameField.style.maxHeight = "60px";
    title.innerHTML = "Sign Up";
    signupBtn.classList.remove("disable");
    signinBtn.classList.add("disable");
    clearMessages();
}

// Create message display function
function showMessage(message, type = 'error') {
    // Remove existing messages
    clearMessages();
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        padding: 10px;
        margin: 10px 0;
        border-radius: 5px;
        text-align: center;
        font-size: 14px;
        ${type === 'error' ? 'background-color: #ffe6e6; color: #d00; border: 1px solid #ffcccc;' : ''}
        ${type === 'success' ? 'background-color: #e6ffe6; color: #060; border: 1px solid #ccffcc;' : ''}
    `;
    
    const form = document.querySelector('form');
    form.insertBefore(messageDiv, form.querySelector('.btn-field'));
}

function clearMessages() {
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Handle Sign In
function handleSignIn() {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    
    // Validation
    if (!email || !password) {
        showMessage('Please fill in all fields!');
        return;
    }
    
    if (!isValidEmail(email)) {
        showMessage('Please enter a valid email address!');
        return;
    }
    
    // Check credentials
    const user = validCredentials.users.find(u => 
        u.email === email && u.password === password
    );
    
    if (user) {
        showMessage('Login successful! Redirecting to StationeryStop...', 'success');
        
        // Store user session (in a real app, use secure tokens)
        sessionStorage.setItem('stationeryStopUser', JSON.stringify({
            username: user.username,
            email: user.email,
            loginTime: new Date().toISOString()
        }));
        
        // Redirect to home page after 1.5 seconds
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
        
    } else {
        showMessage('Invalid email or password! Please try again.');
    }
}

// Handle Sign Up
function handleSignUp() {
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    
    // Validation
    if (!name || !email || !password) {
        showMessage('Please fill in all fields!');
        return;
    }
    
    if (!isValidEmail(email)) {
        showMessage('Please enter a valid email address!');
        return;
    }
    
    if (password.length < 6) {
        showMessage('Password must be at least 6 characters long!');
        return;
    }
    
    // Check if email already exists
    const existingUser = validCredentials.users.find(u => u.email === email);
    if (existingUser) {
        showMessage('Email already registered! Please sign in instead.');
        return;
    }
    
    // In a real application, this would send data to server
    // For demo purposes, we'll add to our local array and proceed
    validCredentials.users.push({
        username: name.toLowerCase().replace(/\s+/g, ''),
        email: email,
        password: password
    });
    
    showMessage('Account created successfully! Redirecting to StationeryStop...', 'success');
    
    // Store user session
    sessionStorage.setItem('stationeryStopUser', JSON.stringify({
        username: name,
        email: email,
        loginTime: new Date().toISOString()
    }));
    
    // Redirect to home page after 1.5 seconds
    setTimeout(() => {       
        window.location.href = 'index.html';
    }, 1500);
}

// Add event listeners for form submission
document.addEventListener('DOMContentLoaded', function() {
    // Handle Enter key press
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            if (title.innerHTML === 'Sign In') {
                handleSignIn();
            } else {
                handleSignUp();
            }
        }
    });
    
    // Update button click handlers
    const originalSignInClick = signinBtn.onclick;
    const originalSignUpClick = signupBtn.onclick;
    
    signinBtn.onclick = function(e) {
        if (signinBtn.classList.contains('disable')) {
            originalSignInClick();
        } else {
            handleSignIn();
        }
    }
    
    signupBtn.onclick = function(e) {
        if (signupBtn.classList.contains('disable')) {
            originalSignUpClick();
        } else {
            handleSignUp();
        }
    }
});

// Utility function to check if user is logged in (for other pages)
function isUserLoggedIn() {
    return sessionStorage.getItem('stationeryStopUser') !== null;
}

// Utility function to get current user data
function getCurrentUser() {
    const userData = sessionStorage.getItem('stationeryStopUser');
    return userData ? JSON.parse(userData) : null;
}

// Utility function to logout
function logout() {
    sessionStorage.removeItem('stationeryStopUser');
    window.location.href = 'index.html'; 
}

// Display demo credentials for testing
console.log('Demo Credentials for Testing:');
console.log('Email: admin@stationerystop.com, Password: admin123');
console.log('Email: demo@stationerystop.com, Password: demo123');