export function initHome() {
    console.log("Home route loaded");

    // Initialize carousel
    const carousel = document.querySelector(".home-carousel");
    if (carousel) {
        let currentIndex = 0;
        const slides = carousel.querySelectorAll(".slide");
        const totalSlides = slides.length;

        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.style.display = i === index ? "block" : "none";
            });
        }

        document.querySelector(".carousel-next").addEventListener("click", () => {
            currentIndex = (currentIndex + 1) % totalSlides;
            showSlide(currentIndex);
        });

        document.querySelector(".carousel-prev").addEventListener("click", () => {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            showSlide(currentIndex);
        });

        showSlide(currentIndex); // Show the first slide
    }
}
