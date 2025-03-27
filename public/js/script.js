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
    if (window.innerWidth <= 944) { // Only toggle nav in mobile view
        headerEl.classList.toggle("nav-open");
        if (headerEl.classList.contains("nav-open")) {
        } else {
            closeNavbar();
        }
    }
}

// Add click handler to close mobile nav when clicking outside
document.addEventListener("click", function (e) {
    function closeNavOnClickOutside(e) {
        // Close nav if clicking outside nav and nav is open
        if (headerEl.classList.contains("nav-open") &&
            !mainNav.contains(e.target) &&
            !btnNavEl.contains(e.target)) {
            headerEl.classList.remove("nav-open");
            closeNavbar();
        }
    }

    function preventNavClose(e) {
        e.stopPropagation();
    }

    // Handle resize to reset nav and scrolling when switching to desktop view
    function handleResize() {
        if (window.innerWidth > 944) { // Breakpoint for mobile navigation
            headerEl.classList.remove('nav-open');
            closeNavbar(); // Ensure scrolling is re-enabled
        }
    }

    // Listen for window resize
    window.addEventListener("resize", handleResize);

    // Attach event listeners
    btnNavEl.addEventListener("click", toggleNav);
    document.addEventListener("click", closeNavOnClickOutside);
    mainNav.addEventListener("click", preventNavClose);
    window.addEventListener('resize', handleResize);

    // Call removeEventListeners() when needed to clean up
    // Example: removeEventListeners() when unmounting a component in a SPA
});

///////////////////////////////////////////////////
const sectionHeroEl = document.querySelector(".section-hero");
const obs = new IntersectionObserver(function (entries) {
    const ent = entries[0];
    console.log(ent);
    if (ent.isIntersecting === false) {
        document.querySelector("body").classList.add("sticky");
    }
    if (ent.isIntersecting === true) {
        document.querySelector("body").classList.remove("sticky");
    }
}, {
    root: null,
    threshold: 0,
    rootMargin: `-${headerEl.offsetHeight}px` // Adjust dynamically
});
obs.observe(sectionHeroEl);

///////////////////////////////////////////////////
const allLinks = document.querySelectorAll("a:link");

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
    errorLiveRegion.setAttribute("aria-live", "polite");
    errorLiveRegion.setAttribute("role", "alert");
    errorLiveRegion.style.position = "absolute";
    errorLiveRegion.style.left = "-9999px"; // Visually hidden
    document.body.appendChild(errorLiveRegion);

    form.addEventListener("submit", function (e) {
        let isValid = true;
        let errorMessage = "";

        // Full Name validation: Must contain at least two words
        if (!/^\w+\s+\w+/.test(fullNameInput.value.trim())) {
            fullNameInput.classList.add("error");
            fullNameInput.setAttribute("aria-invalid", "true");
            errorName.style.display = "block";
            errorMessage += "Please enter your full name. ";
            isValid = false;
        } else {
            fullNameInput.classList.remove("error");
            fullNameInput.setAttribute("aria-invalid", "false");
            errorName.style.display = "none";
        }

        // Email validation: Must be a valid email format
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
            emailInput.classList.add("error");
            emailInput.setAttribute("aria-invalid", "true");
            errorEmail.style.display = "block";
            errorMessage += "Please enter a valid email address. ";
            isValid = false;
        } else {
            emailInput.classList.remove("error");
            emailInput.setAttribute("aria-invalid", "false");
            errorEmail.style.display = "none";
        }

        // Select validation: Must select an option
        if (selectWhere.value === "") {
            selectWhere.classList.add("error");
            selectWhere.setAttribute("aria-invalid", "true");
            errorSelect.style.display = "block";
            errorMessage += "Please select an option. ";
            isValid = false;
        } else {
            selectWhere.classList.remove("error");
            selectWhere.setAttribute("aria-invalid", "false");
            errorSelect.style.display = "none";
        }

        if (!isValid) {
            e.preventDefault(); // Prevent form submission if there's an error
            errorLiveRegion.textContent = errorMessage; // Update ARIA live region
        } else {
            // Simulate form submission (replace this with actual form submission logic)
            setTimeout(() => {
                // Show success message
                confirmationMessage.textContent = "Thank you! Your submission has been received.";
                modal.style.display = "block";
            }, 1000);
        }
    });

    // Close the modal when the user clicks on <span> (x)
    closeBtn.addEventListener("click", function () {
        modal.style.display = "none";
    });

    // Close the modal when the user clicks anywhere outside of the modal
    window.addEventListener("click", function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });

    // Validate full name field on blur (when the user leaves the field)
    fullNameInput.addEventListener("blur", function () {
        if (/^\w+\s+\w+/.test(fullNameInput.value.trim())) {
            fullNameInput.classList.remove("error");
            fullNameInput.setAttribute("aria-invalid", "false");
            errorName.style.display = "none";
        }
    });

    // Validate email field on blur (when the user leaves the field)
    emailInput.addEventListener("blur", function () {
        if (/^[^\s@]+\@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
            emailInput.classList.remove("error");
            emailInput.setAttribute("aria-invalid", "false");
            errorEmail.style.display = "none";
        }
    });

    // Validate select field on change
    selectWhere.addEventListener("change", function () {
        if (selectWhere.value !== "") {
            selectWhere.classList.remove("error");
            selectWhere.setAttribute("aria-invalid", "false");
            errorSelect.style.display = "none";
        }
    });
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

    form.addEventListener("submit", function (e) {
        e.preventDefault(); // Prevent default form submission

        // Simulate form submission (replace this with actual form submission logic)
        setTimeout(() => {
            // Show success message
            confirmationMessage.textContent = "Thank you! Your submission has been received.";
            modal.style.display = "block";
        }, 1000);
    });

    // Close the modal when the user clicks on <span> (x)
    closeBtn.addEventListener("click", function () {
        modal.style.display = "none";
    });

    // Close the modal when the user clicks anywhere outside of the modal
    window.addEventListener("click", function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
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
document.addEventListener("click", function (event) {
    const locationBox = document.querySelector(".location-box");
    const locationInput = document.querySelector("#location-input");

    if (locationBox.contains(event.target)) {
        // Show input field when clicking inside the location-box
        locationInput.style.display = "block";
    } else {
        // Hide input field when clicking outside
        locationInput.style.display = "none";
    }
});
// Toggle Mobile Navigation Menu
// Toggle Mobile Navigation Menu
document.getElementById("mobile-menu-btn").addEventListener("click", function () {
    document.querySelector(".mobile-nav").classList.toggle("show");
});

// Toggle Location Input on Click
document.querySelector(".location-box").addEventListener("click", function (event) {
    let locationInput = document.getElementById("location-input");
    
    // Show input and focus when clicked
    locationInput.style.display = "block";
    locationInput.focus();
    
    // Prevent event from bubbling up (so it doesn't immediately close)
    event.stopPropagation();
});

// Hide location input when clicking outside
document.addEventListener("click", function (event) {
    let locationBox = document.querySelector(".location-box");
    let locationInput = document.getElementById("location-input");

    // Hide input if clicked outside the location box
    if (!locationBox.contains(event.target)) {
        locationInput.style.display = "none";
    }
});
