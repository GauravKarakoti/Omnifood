// Selecting buttons for switching between sign-in and sign-up forms
const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");  // Main container for form transition

// Password validation configuration
const passwordConfig = {
  minLength: 8,           // Minimum password length of 8 characters
  requireUppercase: true,  // At least one uppercase letter
  requireNumber: true,     // At least one number
  requireSpecialChar: true // At least one special character
};

// Event listener to switch to sign-up mode
sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");  // Add the sign-up mode class
});

// Event listener to switch back to sign-in mode
sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");  // Remove the sign-up mode class
});

// Selecting the back button and adding navigation functionality
const back_btn = document.querySelector(".back-btn");

back_btn.addEventListener("click", () => {
  window.location.href = "./index.html";  // Redirect to the homepage
});

// Selecting sign-in form and its input fields
const signInForm = document.getElementById('signInForm');
const signInUsername = document.getElementById('signInUsername');
const signInPassword = document.getElementById('signInPassword');

// Selecting sign-up form and its input fields
const signUpForm = document.getElementById('signUpForm');
const signUpUsername = document.getElementById('signUpUsername');
const signUpEmail = document.getElementById('signUpEmail');
const signUpPassword = document.getElementById('signUpPassword');

// Replace localStorage with HttpOnly cookies for authentication
function setAuthCookie(username, email) {
  document.cookie = `omni_username=${username}; Secure; HttpOnly; SameSite=none`;
  document.cookie = `omni_email=${email}; Secure; HttpOnly; SameSite=none`;
}

// Function to display error message and style invalid inputs
function showError(input, message) {
  const error = input.nextElementSibling;   // Get the next sibling element (error message)
  error.textContent = message;              // Display the error message
  error.style.display = 'block';            // Make the error message visible
  error.setAttribute("aria-live", "assertive"); // Add ARIA live region
  input.classList.add('invalid');           // Add invalid styling
  input.classList.remove('valid');          // Remove valid styling
}

// Function to display success styling
function showSuccess(input) {
  const error = input.nextElementSibling;   // Get the next sibling element (error message)
  error.style.display = 'none';             // Hide the error message
  input.classList.add('valid');             // Add valid styling
  input.classList.remove('invalid');        // Remove invalid styling
}

// Function to validate username
function checkUsername(input) {
  if (input.value.trim() === '') {                   // Check if the input is empty
    showError(input, 'Username is required');        // Show error if empty
  } else if (input.value.length < 3) {               // Check minimum length
    showError(input, 'Username must be at least 3 characters');
  } else {
    showSuccess(input);                              // Mark as valid if all checks pass
  }
}

// Function to validate email format
function checkEmail(input) {
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;  // Regex for email validation
  if (input.value.trim() === '') {                        // Check if email is empty
    showError(input, 'Email is required');
  } else if (!emailRegex.test(input.value.trim())) {      // Validate format
    showError(input, 'Email is not valid');
  } else {
    showSuccess(input);                                   // Mark as valid if all checks pass
  }
}

// Selecting password strength indicators
const passwordStrength = document.getElementById('password-strength');
const lengthReq = document.getElementById('length');
const uppercaseReq = document.getElementById('uppercase');
const numberReq = document.getElementById('number');
const specialReq = document.getElementById('special');

// Ensure zxcvbn is loaded properly and validate password requirements
signUpPassword.addEventListener('input', function () {
  const password = signUpPassword.value;

  // Validate password requirements visually
  validatePassword(password);

  // Check password strength using zxcvbn and custom logic
  let isCustomValid = 
    password.length >= passwordConfig.minLength &&
    /[A-Z]/.test(password) &&
    /\d/.test(password) &&
    /[@$!%*?&]/.test(password);

  if (typeof zxcvbn !== 'undefined') {
    const result = zxcvbn(password); // Use zxcvbn to evaluate password strength
    const strengthLevel = getStrengthLevel(result.score, isCustomValid);
    passwordStrength.textContent = `Password Strength: ${strengthLevel}`;
    passwordStrength.style.color = getStrengthColor(strengthLevel);
  } else {
    console.error('zxcvbn is not loaded. Ensure the library is included in your HTML.');
    const strengthLevel = isCustomValid ? 'Medium' : 'Weak';
    passwordStrength.textContent = `Password Strength: ${strengthLevel}`;
    passwordStrength.style.color = getStrengthColor(strengthLevel);
  }
});

// Function to determine strength level
function getStrengthLevel(score, isCustomValid) {
  if (score >= 4 && isCustomValid) return 'Very Strong';
  if (score === 3 && isCustomValid) return 'Strong';
  if (score === 2) return 'Medium';
  return 'Weak';
}

// Function to determine strength color
function getStrengthColor(level) {
  switch (level) {
    case 'Very Strong': return 'darkgreen';
    case 'Strong': return 'green';
    case 'Medium': return 'orange';
    case 'Weak': return 'red';
    default: return 'black';
  }
}

// Function to validate password requirements visually
function validatePassword(password) {
  lengthReq.style.color = password.length >= passwordConfig.minLength ? 'green' : 'red';
  uppercaseReq.style.color = /[A-Z]/.test(password) ? 'green' : 'red';
  numberReq.style.color = /\d/.test(password) ? 'green' : 'red';
  specialReq.style.color = /[@$!%*?&]/.test(password) ? 'green' : 'red';
}

// Server URL for authentication API
const server_url = 'https://omnifood-login.onrender.com';
//const server_url = "http://localhost:5000"

// Function to check password validation
function checkPassword(input) {
  if (input.value.trim() === '') {
    showError(input, 'Password is required');
  } else if (input.value.length < 8) {
    showError(input, 'Password must contain at least 8 characters');
  } else {
    showSuccess(input);
  }
}

// SIGN IN FORM HANDLING
signInForm.addEventListener('submit', async function (e) {
  e.preventDefault(); // Prevent form submission reload

  checkUsername(signInUsername);
  checkPassword(signInPassword);

  if (
    signInUsername.classList.contains('valid') &&
    signInPassword.classList.contains('valid')
  ) {
    try {
      const csrfResponse = await fetch(`${server_url}/api/csrf-token`, {
        method: 'GET',
        credentials: 'include',
      });

      const csrfData = await csrfResponse.json();

      const response = await fetch(`${server_url}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfData.csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({
          username: signInUsername.value,
          password: signInPassword.value,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setAuthCookie(signInUsername.value, data.user.email);
        window.location.replace(`${window.location.origin}/index.html`);
      } else {
        showError(signInUsername, data.message); // Display error message
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("An error occurred. Please try again.");
    }
  }
});

// SIGN UP FORM HANDLING
signUpForm.addEventListener('submit', async function (e) {
  e.preventDefault(); // Prevent form reload

  checkUsername(signUpUsername);
  checkEmail(signUpEmail);
  const password = signUpPassword.value.trim();

  if (
    !(password.length >= passwordConfig.minLength)
  )
    showError(signUpPassword, 'Password must contain at least 8 characters');
  else if (!(/[A-Z]/.test(password)))
    showError(signUpPassword, 'Password must contain an uppercase letter');
  else if (!(/\d/.test(password)))
    showError(signUpPassword, 'Password must contain a digit');
  else if (!(/[@$!%*?&]/.test(password)))
    showError(signUpPassword, 'Password must contain a special character');
  else {
    signUpPassword.classList.add('valid');
  }

  if (
    signUpUsername.classList.contains('valid') &&
    signUpEmail.classList.contains('valid') &&
    signUpPassword.classList.contains('valid')
  ) {
    try {
      const csrfResponse = await fetch(`${server_url}/api/csrf-token`, {
        method: 'GET',
        credentials: 'include',
      });

      const csrfData = await csrfResponse.json();

      const response = await fetch(`${server_url}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfData,
        },
        credentials: 'include',
        body: JSON.stringify({
          username: signUpUsername.value,
          email: signUpEmail.value,
          password: signUpPassword.value,
        }),
      });

      const data = await response.json();
      alert(`${data.message}`);
      if (data.success) {
        setAuthCookie(signUpUsername.value, data.user.email);
        window.location.replace(`${window.location.origin}/index.html`);
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    }
  }
});
