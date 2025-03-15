console.log("Hello World!");
const myName="Gaurav Karakoti";
const h1=document.querySelector(".heading-primary");
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
const btnNavEl=document.querySelector(".btn-mobile-nav");
const headerEl=document.querySelector(".header");
btnNavEl.addEventListener("click",function(){
    headerEl.classList.toggle("nav-open");
});

///////////////////////////////////////////////////
const sectionHeroEl=document.querySelector(".section-hero");
const obs=new IntersectionObserver(function(entries){
    const ent=entries[0];
    console.log(ent);
    if(ent.isIntersecting===false) {
        document.querySelector("body").classList.add("sticky");
    }
    if(ent.isIntersecting===true) {
        document.querySelector("body").classList.remove("sticky");
    }
}, {
    root:null,
    threshold:0,
    rootMargin:"-80px"
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

        // Close mobile navigation if it's a main nav link
        if (link.classList.contains("main-nav-link")) {
            headerEl.classList.toggle("nav-open");
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
        await fetch("http://localhost:5000/track-click", {  
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

 // Registering the service worker
if ("serviceWorker" in navigator) {
    navigator.serviceWorker
        .register("/service-worker.js")
        .then(() => console.log("✅ Service Worker Registered"))
        .catch((err) => console.log("❌ Service Worker Registration Failed:", err));
    }
