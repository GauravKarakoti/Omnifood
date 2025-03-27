const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

const passwordConfig = {
  minLength: 8,
  requireUppercase: true,
  requireNumber: true,
  requireSpecialChar: true,
};


sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});

const back_btn = document.querySelector(".back-btn");

back_btn.addEventListener("click", () => {
  window.location.href = "./index.html"; // Change this to your actual homepage link
});

// SIGN IN FORM VALIDATION
const signInForm = document.getElementById('signInForm');
const signInUsername = document.getElementById('signInUsername');
const signInPassword = document.getElementById('signInPassword');

// SIGN UP FORM VALIDATION
const signUpForm = document.getElementById('signUpForm');
const signUpUsername = document.getElementById('signUpUsername');
const signUpEmail = document.getElementById('signUpEmail');
const signUpPassword = document.getElementById('signUpPassword');

function showError(input, message) {
  const error = input.nextElementSibling;
  error.textContent = message;
  error.style.display = 'block';
  input.classList.add('invalid');
  input.classList.remove('valid');
}

function showSuccess(input) {
  const error = input.nextElementSibling;
  error.style.display = 'none';
  input.classList.add('valid');
  input.classList.remove('invalid');
}

function checkUsername(input) {
  if (input.value.trim() === '') {
    showError(input, 'Username is required');
  } else if (input.value.length < 3) {
    showError(input, 'Username must be at least 3 characters');
  } else {
    showSuccess(input);
  }
}

function checkEmail(input) {
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (input.value.trim() === '') {
    showError(input, 'Email is required');
  } else if (!emailRegex.test(input.value.trim())) {
    showError(input, 'Email is not valid');
  } else {
    showSuccess(input);
  }
}

const passwordStrength = document.getElementById('password-strength');
const lengthReq = document.getElementById('length');
const uppercaseReq = document.getElementById('uppercase');
const numberReq = document.getElementById('number');
const specialReq = document.getElementById('special');

function updatePasswordStrength(password) {
  let strength = 0;
  if (password.length >= passwordConfig.minLength) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[@$!%*?&]/.test(password)) strength++;

  const levels = ['Weak', 'Moderate', 'Strong', 'Very Strong'];
  passwordStrength.textContent = `Password Strength: ${levels[strength === 0 ? 0 : strength - 1]}`;
  passwordStrength.style.color = ['red', 'orange', 'blue', 'green'][strength === 0 ? 0 : strength - 1];
}

function validatePassword(password) {
  lengthReq.style.color = password.length >= passwordConfig.minLength ? 'green' : 'red';
  uppercaseReq.style.color = /[A-Z]/.test(password) ? 'green' : 'red';
  numberReq.style.color = /\d/.test(password) ? 'green' : 'red';
  specialReq.style.color = /[@$!%*?&]/.test(password) ? 'green' : 'red';
}

const server_url = 'https://omnifood-login.onrender.com';

function checkPassword(input) {
  if (input.value.trim() === '') {
    showError(input, 'Password is required');
  } else if (input.value.length < 8) {
    showError(
      input,
      'Password must contain at least 8 characters'
    );
  } else {
    showSuccess(input);
  }
}

// SIGN IN FORM HANDLING
signInForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  checkUsername(signInUsername);
  checkPassword(signInPassword);

  if (
    signInUsername.classList.contains('valid') &&
    signInPassword.classList.contains('valid')
  ) {
    try {
      //Fetching CSRF token 
      const csrfResponse = await fetch(`${server_url}/api/csrf-token`, {
        method: 'GET',
        credentials: 'include',
      })

      const csrfData = await csrfResponse.json();

      const response = await fetch(`${server_url}/api/auth/login`, {
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

      alert(`${data.message}`);
      if (data.success) {
        window.location.replace(`${window.location.origin}/index.html`);
        localStorage.setItem('omni:username', signInUsername.value);
        localStorage.setItem('omni:email', data.user.email);
        localStorage.setItem('omni:authenticated', 'true');
      }

      console.log(data)
    } catch (error) {
      console.log(error);
      alert(`${error.message}`);
    }
  }
});

signUpPassword.addEventListener('input', function () {
  updatePasswordStrength(signUpPassword.value);
  validatePassword(signUpPassword.value);
});

// SIGN UP FORM HANDLING
signUpForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  checkUsername(signUpUsername);
  checkEmail(signUpEmail);
  const password = signUpPassword.value.trim();

  if (
    !(password.length >= passwordConfig.minLength) &&
    !(/[A-Z]/.test(password)) &&
    !(/\d/.test(password)) &&
    !(/[@$!%*?&]/.test(password))) {
    showError(signUpPassword, 'Password must meet the requirements');
  } else {
    signUpPassword.classList.add('valid');
  }
  if (
    signUpUsername.classList.contains('valid') &&
    signUpEmail.classList.contains('valid') &&
    signUpPassword.classList.contains('valid')
  ) {
    try {
      
      //Fetching CSRF token
      const csrfResponse = await fetch(`${server_url}/api/csrf-token`,{
        method: 'GET',
        credentials: 'include', //cookies also included 
      })

      const csrfData = await csrfResponse.json();

      const response = await fetch(`${server_url}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfData.csrfToken,
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
        window.location.replace(`${window.location.origin}/index.html`);
        localStorage.setItem('omni:username', signInUsername.value);
        localStorage.setItem('omni:email', data.user.email);
        localStorage.setItem('omni:authenticated', 'true');
      }
    } catch (error) {
      alert(`${error.message}`);
    }
  }
});
