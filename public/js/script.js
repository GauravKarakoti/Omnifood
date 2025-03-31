console.log("Hello World!");
const myName = "Gaurav Karakoti";
const h1 = document.querySelector(".heading-primary");
console.log(myName);
console.log(h1);
// h1.addEventListener("click",function(){
//     h1.textContent=myName;
//     h1.style.backgroundColor="red";
//     h1.style.padding="5rem";
// });

///////////////////////////////////////////////////
// const yearEl=document.querySelector(".year");
// const currentYear=new Date().getFullYear();
// yearEl.textContent=currentYear;

///////////////////////////////////////////////////
const btnNavEl = document.querySelector(".btn-mobile-nav");
const headerEl = document.querySelector(".header");
const mainNav = document.querySelector(".main-nav");

let scrollPosition = 0;

function closeNavbar() {
    document.body.style.position = ""; // Reset to default
    document.body.style.top = ""; // Reset top positioning
    window.scrollTo(0, scrollPosition); // Restore original scroll position
}

function removeEventListeners() {
    btnNavEl.removeEventListener("click", toggleNav);
    document.removeEventListener("click", closeNavOnClickOutside);
    mainNav.removeEventListener("click", preventNavClose);
    window.removeEventListener('resize', handleResize);
}

function toggleNav(e) {
    e.stopPropagation(); // Prevent click from bubbling to document
    headerEl.classList.toggle("nav-open");
    if (headerEl.classList.contains("nav-open")) {
        openNavbar();
    } else {
        closeNavbar();
    }
}

// Handle resize to reset nav and scrolling when switching to desktop view
function handleResize() {
    if (window.innerWidth > 944) { // Breakpoint for mobile navigation
        headerEl.classList.remove("nav-open");
        closeNavbar(); // Ensure scrolling is re-enabled
    }
}

// Add click handler to close mobile nav when clicking outside
function closeNavOnClickOutside(e) {
    if (
        headerEl.classList.contains("nav-open") &&
        !mainNav.contains(e.target) &&
        !btnNavEl.contains(e.target)
    ) {
        headerEl.classList.remove("nav-open");
        closeNavbar();
    }
}

// Prevent nav close when clicking inside the nav
function preventNavClose(e) {
    e.stopPropagation();
}

// Refactor: Ensure event listeners are registered only once
function initializeNavListeners() {
    btnNavEl.addEventListener("click", toggleNav);
    document.addEventListener("click", closeNavOnClickOutside);
    mainNav.addEventListener("click", preventNavClose);
    window.addEventListener("resize", handleResize);

    // Close nav on Escape key press
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && headerEl.classList.contains("nav-open")) {
            headerEl.classList.remove("nav-open");
            closeNavbar();
        }
    });
}

// Cleanup function to remove all navigation-related listeners
function cleanupNavListeners() {
    btnNavEl.removeEventListener("click", toggleNav);
    document.removeEventListener("click", closeNavOnClickOutside);
    mainNav.removeEventListener("click", preventNavClose);
    window.removeEventListener("resize", handleResize);
    document.removeEventListener("keydown", closeNavbarOnEscape);
}

// Ensure listeners are initialized only once
initializeNavListeners();

///////////////////////////////////////////////////
const sectionHeroEl = document.querySelector(".section-hero");

// Create an intersection observer to add/remove sticky header
const obs = new IntersectionObserver(function (entries) {
    const ent = entries[0];  // Get the first entry
    console.log(ent);
    if (ent.isIntersecting === false) { // If hero section is not in view
        document.querySelector("body").classList.add("sticky"); // Add sticky class
    }
    if (ent.isIntersecting === true) {
        document.querySelector("body").classList.remove("sticky");// Remove sticky class
    }
}, {
    root: null, // Observe relative to viewport
    threshold: 0,// Trigger as soon as it leaves
    rootMargin: `-${headerEl.offsetHeight}px` // Adjust dynamically
});
obs.observe(sectionHeroEl); // Start observing the hero section

///////////////////////////////////////////////////
const allLinks = document.querySelectorAll("a:link");

// Loop through all links and add event listeners
allLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
        const href = link.getAttribute("href");

        // Prevent default only for internal links (# and section links)
        if (href === "#" || href.startsWith("#")) {
            e.preventDefault();

            // Scroll to top
            if (href === "#") {
                window.scrollTo({ top: 0, behavior: "smooth" });
            }

            // Smooth scroll to section
            if (href.startsWith("#")) {
                const sectionEl = document.querySelector(href);
                if (sectionEl) {
                    sectionEl.scrollIntoView({ behavior: "smooth" });
                }
            }
        }

        // Close mobile navigation if it's a main nav link and in mobile view
        if (link.classList.contains("main-nav-link") && window.innerWidth <= 944) {
            headerEl.classList.remove("nav-open");
        }
    });
});

///////////////////////////////////////////////////
// Function to check if the browser supports flexbox gap
function checkFlexGap() {
    var flex = document.createElement("div");
    flex.style.display = "flex";
    flex.style.flexDirection = "column";
    flex.style.rowGap = "1px";
    flex.appendChild(document.createElement("div"));
    flex.appendChild(document.createElement("div"));
    document.body.appendChild(flex);
    var isSupported = flex.scrollHeight === 1;
    flex.parentNode.removeChild(flex);
    console.log(isSupported);
    if (!isSupported) document.body.classList.add("no-flexbox-gap");
}
checkFlexGap();

// hero section dynamic height calculator

document.addEventListener("DOMContentLoaded", function () {
    const header = document.querySelector(".header");
    const heroSection = document.querySelector(".section-hero");

    function updateHeroMargin() {
        const headerHeight = header.offsetHeight;
        if (header.classList.contains("sticky")) {
            heroSection.style.marginTop = `${headerHeight + 30}px`;
        } else {
            heroSection.style.marginTop = "0";
        }
    }

    // Run on page load
    updateHeroMargin();

    // Update dynamically when window resizes
    window.addEventListener("resize", updateHeroMargin);

    // Observe when navbar becomes sticky
    const observer = new IntersectionObserver(
        function (entries) {
            const [entry] = entries;
            if (!entry.isIntersecting) {
                header.classList.add("sticky");
            } else {
                header.classList.remove("sticky");
            }
            updateHeroMargin();
        },
        {
            root: null,
            threshold: 0,
            rootMargin: `-${header.offsetHeight}px`,
        }
    );

    observer.observe(heroSection);
});

//track button clicks tracking

document.addEventListener("DOMContentLoaded", function () {
    function trackButtonClick(buttonId, action) {
        document.getElementById(buttonId).addEventListener("click", function () {
            console.log(`User clicked on: ${action}`);
        });
    }

    trackButtonClick("try-for-free", "Try for free");
    trackButtonClick("start-eating-well", "Start eating well");
});

// Track button clicks
const trackClick = async (buttonName) => {
    try {
        await fetch("https://omnifood-clicks.onrender.com/track-click", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ buttonName }),
        });
        console.log(`✅ Click recorded for: ${buttonName}`);
    } catch (error) {
        console.error("❌ Error tracking click:", error);
    }
};

// Attach Event Listeners to Buttons

document.querySelector("#try-for-free").addEventListener("click", () => trackClick("Try for free"));
document.querySelector("#start-eating-well").addEventListener("click", () => trackClick("Start eating well"));


document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".cta-form");
    const fullNameInput = document.getElementById("full-name");
    const emailInput = document.getElementById("email");
    const selectWhere = document.getElementById("select-where");
    const errorName = document.getElementById("error-name");
    const errorEmail = document.getElementById("error-email");
    const errorSelect = document.getElementById("error-select");
    const modal = document.getElementById("confirmation-modal");
    const closeBtn = document.querySelector(".close-btn");
    const confirmationMessage = document.getElementById("confirmation-message");

    // Add ARIA live region for error messages
    const errorLiveRegion = document.createElement("div");
    errorLiveRegion.setAttribute("aria-live", "assertive");
    errorLiveRegion.setAttribute("role", "alert");
    errorLiveRegion.style.position = "absolute";
    errorLiveRegion.style.left = "-9999px"; // Visually hidden
    document.body.appendChild(errorLiveRegion);

    let isSubmitting = false; // Flag to prevent multiple submissions

    // Helper function to show error messages
    function showError(input, errorElement, message) {
        input.classList.add("error");
        input.setAttribute("aria-invalid", "true");
        errorElement.textContent = message;
        errorElement.style.display = "block";
        errorLiveRegion.textContent = message; // Update ARIA live region
    }

    // Helper function to clear error messages
    function clearError(input, errorElement) {
        input.classList.remove("error");
        input.setAttribute("aria-invalid", "false");
        errorElement.style.display = "none";
    }

    // Validate full name field
    function validateFullName() {
        const value = fullNameInput.value.trim();
        if (!/^\w+\s+\w+/.test(value)) {
            showError(fullNameInput, errorName, "Full name must include first and last name.");
            return false;
        }
        clearError(fullNameInput, errorName);
        return true;
    }

    // Validate email field
    function validateEmail() {
        const value = emailInput.value.trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            showError(emailInput, errorEmail, "Please enter a valid email address.");
            return false;
        }
        clearError(emailInput, errorEmail);
        return true;
    }

    // Validate select field
    function validateSelect() {
        if (selectWhere.value === "") {
            showError(selectWhere, errorSelect, "Please select an option.");
            return false;
        }
        clearError(selectWhere, errorSelect);
        return true;
    }

    // Trap focus inside the modal
    function trapFocusInModal() {
        const focusableElements = modal.querySelectorAll("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])");
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        modal.addEventListener("keydown", function (e) {
            if (e.key === "Tab") {
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault(); // Prevent default form submission

        if (isSubmitting) return; // Exit if already submitting
        isSubmitting = true; // Set flag to true

        const isFullNameValid = validateFullName();
        const isEmailValid = validateEmail();
        const isSelectValid = validateSelect();

        if (!isFullNameValid || !isEmailValid || !isSelectValid) {
            isSubmitting = false; // Reset flag if validation fails
            return;
        }

        // Simulate form submission (replace this with actual form submission logic)
        setTimeout(() => {
            // Show success message
            confirmationMessage.textContent = "Thank you! Your submission has been received.";
            modal.style.display = "block";
            trapFocusInModal(); // Trap focus inside the modal
            modal.querySelector("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])").focus();
            isSubmitting = false; // Reset flag after submission
        }, 1000);
    });

    // Close the modal when the user clicks on <span> (x)
    closeBtn.addEventListener("click", function () {
        modal.style.display = "none";
        isSubmitting = false; // Reset flag when modal is closed
    });

    // Close the modal when the user clicks anywhere outside of the modal
    window.addEventListener("click", function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
            isSubmitting = false; // Reset flag when modal is closed
        }
    });

    // Validate fields on blur or change
    fullNameInput.addEventListener("blur", validateFullName);
    emailInput.addEventListener("blur", validateEmail);
    selectWhere.addEventListener("change", validateSelect);
});

document.querySelector("#try-for-free").addEventListener("click", () => trackClick("Try for free"));
document.querySelector("#start-eating-well").addEventListener("click", () => trackClick("Start eating well"));

// Registering the service worker
if ("serviceWorker" in navigator) {
    navigator.serviceWorker
        .register("/serviceworker.js")
        .then(() => console.log("✅ Service Worker Registered"))
        .catch((err) => console.log("❌ Service Worker Registration Failed:", err));
}
document.addEventListener("DOMContentLoaded", function () {
    const locationText = document.querySelector(".location-text");
    const locationInput = document.querySelector(".location-input");

    locationInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevent form submission
            if (locationInput.value.trim() !== "") {
                locationText.textContent = locationInput.value; // Update location text
            }
            locationInput.style.display = "none"; // Hide input box
        }
    });

    document.querySelector(".location-container").addEventListener("mouseleave", function () {
        locationInput.style.display = "none"; // Hide input on mouse leave
    });

    document.querySelector(".location-icon").addEventListener("click", function () {
        locationInput.style.display = "block"; // Show input on click
        locationInput.focus();
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".cta-form");
    const modal = document.getElementById("confirmation-modal");
    const closeBtn = document.querySelector(".close-btn");
    const confirmationMessage = document.getElementById("confirmation-message");
    let isSubmitting = false; // Flag to prevent multiple submissions

    form.addEventListener("submit", function (e) {
        e.preventDefault(); // Prevent default form submission

        if (isSubmitting) return; // Exit if already submitting
        isSubmitting = true; // Set flag to true

        // Simulate form submission (replace this with actual form submission logic)
        setTimeout(() => {
            // Show success message
            confirmationMessage.textContent = "Thank you! Your submission has been received.";
            modal.style.display = "block";
            isSubmitting = false; // Reset flag after submission
        }, 1000);
    });

    // Close the modal when the user clicks on <span> (x)
    closeBtn.addEventListener("click", function () {
        modal.style.display = "none";
        isSubmitting = false; // Reset flag when modal is closed
    });

    // Close the modal when the user clicks anywhere outside of the modal
    window.addEventListener("click", function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
            isSubmitting = false; // Reset flag when modal is closed
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const isAuthenticated = localStorage.getItem("omni:authenticated");
    const authLink = document.querySelector(".auth");

    if (isAuthenticated) {
        authLink.textContent = 'Profile';
        authLink.href = "/profile.html";
    }
});

// Function to scroll to the top
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// Add event listener for the scroll-to-top button
document.addEventListener("DOMContentLoaded", function () {
    const scrollToTopBtn = document.querySelector(".scroll-to-top-btn");
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener("click", scrollToTop);
    }
});

function setCSPHeaders() {
    const meta = document.createElement('meta');
    meta.httpEquiv = "Content-Security-Policy";
    meta.content = "default-src 'self'; script-src 'self' https://apis.google.com; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://api.example.com";
    document.head.appendChild(meta);
}

function removeHoverOnTouch() {
    if ('ontouchstart' in document.documentElement) {
        try {
            for (let si in document.styleSheets) {
                let styleSheet = document.styleSheets[si];
                if (!styleSheet.rules) continue;

                for (let ri = styleSheet.rules.length - 1; ri >= 0; ri--) {
                    if (!styleSheet.rules[ri].selectorText) continue;

                    if (styleSheet.rules[ri].selectorText.match(':hover')) {
                        styleSheet.deleteRule(ri);
                    }
                }
            }
        } catch (ex) {
            console.error("Error removing hover states:", ex);
        }
    }
}

document.addEventListener("DOMContentLoaded", function () {
    removeHoverOnTouch();
    const scrollToTopBtn = document.querySelector(".scroll-to-top-btn");
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener("click", scrollToTop);
    }
    setCSPHeaders();
});

// iOS viewport height calculation
function setViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Update viewport height on load and resize
window.addEventListener('resize', setViewportHeight);
document.addEventListener('DOMContentLoaded', setViewportHeight);

// Apply dynamic height to hero section
document.addEventListener("DOMContentLoaded", function () {
    const heroSection = document.querySelector(".section-hero");
    function updateHeroHeight() {
        const vh = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--vh'));
        heroSection.style.height = `${vh * 100}px`;
    }

    setViewportHeight();
    updateHeroHeight();
    window.addEventListener('resize', updateHeroHeight);
});

document.addEventListener("DOMContentLoaded", function () {
    const currentPath = window.location.pathname;

    // Dynamically load JavaScript based on the route
    if (currentPath === "/home" || currentPath === "/") {
        import("./routes/home.js")
            .then((module) => module.initHome())
            .catch((err) => console.error("Error loading home.js:", err));
    } else if (currentPath === "/about") {
        import("./routes/about.js")
            .then((module) => module.initAbout())
            .catch((err) => console.error("Error loading about.js:", err));
    } else if (currentPath === "/contact") {
        import("./routes/contact.js")
            .then((module) => module.initContact())
            .catch((err) => console.error("Error loading contact.js:", err));
    }
});

function setupServiceWorker() {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/serviceworker.js')
            .then((registration) => {
                console.log('Service Worker registered with scope:', registration.scope);

                // Listen for updates
                registration.onupdatefound = () => {
                    const newSW = registration.installing;
                    newSW.onstatechange = () => {
                        if (newSW.state === 'installed' && navigator.serviceWorker.controller) {
                            console.log('New content is available, please refresh.');
                        }
                    };
                };
            })
            .catch((error) => console.error('Service Worker registration failed:', error));
    });
}

setupServiceWorker();

// Enhanced Form Validation
const enhancedForm = document.querySelector('.cta-form');
const firstNameInput = enhancedForm.querySelector('.first-name input');
const lastNameInput = enhancedForm.querySelector('.last-name input');
const errorMessages = enhancedForm.querySelectorAll('.error-message');
const modal = document.querySelector('.modal'); // Assuming modal exists
const modalCloseButton = modal.querySelector('.modal-close'); // Assuming close button exists

// Add ARIA live region for error messages
const ariaLiveRegion = document.createElement('div');
ariaLiveRegion.setAttribute('aria-live', 'polite');
ariaLiveRegion.classList.add('visually-hidden');
document.body.appendChild(ariaLiveRegion);

// Real-time Validation
function validateInput(input, errorMessage) {
    const value = input.value.trim();
    if (!value) {
        input.setAttribute('aria-invalid', 'true');
        errorMessage.textContent = 'This field is required.';
        errorMessage.style.display = 'block';
        ariaLiveRegion.textContent = 'This field is required.';
        return false;
    } else if (input === firstNameInput || input === lastNameInput) {
        if (!/^[a-zA-Z]+$/.test(value)) {
            input.setAttribute('aria-invalid', 'true');
            errorMessage.textContent = 'Must include only letters.';
            errorMessage.style.display = 'block';
            ariaLiveRegion.textContent = 'Must include only letters.';
            return false;
        }
    }
    input.setAttribute('aria-invalid', 'false');
    errorMessage.style.display = 'none';
    return true;
}

[firstNameInput, lastNameInput].forEach((input, index) => {
    const errorMessage = errorMessages[index];
    input.addEventListener('input', () => validateInput(input, errorMessage));
});

// Form Submission Validation
enhancedForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    [firstNameInput, lastNameInput].forEach((input, index) => {
        const errorMessage = errorMessages[index];
        if (!validateInput(input, errorMessage)) {
            isValid = false;
        }
    });

    if (isValid) {
        // Show modal and trap focus
        modal.style.display = 'block';
        modalCloseButton.focus();
        trapFocus(modal);
    }
});

// Focus Trap for Modal
function trapFocus(element) {
    const focusableElements = element.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    });
}

// Close Modal
modalCloseButton.addEventListener('click', () => {
    modal.style.display = 'none';
});