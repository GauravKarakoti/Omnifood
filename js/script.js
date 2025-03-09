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
const allLinks=document.querySelectorAll("a:link");
allLinks.forEach(function(link){
    link.addEventListener("click",function(e){
        e.preventDefault();
        const href=link.getAttribute("href");
        if(href==="#") 
            window.scrollTo({
                top:0,
                behavior:"smooth"
            });
        if(href!=="#" && href.startsWith("#")){
            const sectionEl=document.querySelector(href);
            sectionEl.scrollIntoView({behavior:"smooth"});
        }
        if(link.classList.contains("main-nav-link"))
            headerEl.classList.toggle("nav-open");
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
        const headerHeight = header.offsetHeight; // Get actual header height
        if (header.classList.contains("sticky")) {
            heroSection.style.marginTop = `${headerHeight + 30}px`; // Add extra space for better spacing
        } else {
            heroSection.style.marginTop = "0"; // Reset when not sticky
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
            updateHeroMargin(); // Ensure correct spacing
        },
        {
            root: null,
            threshold: 0,
            rootMargin: `-${header.offsetHeight}px`,
        }
    );

    observer.observe(heroSection);
});

