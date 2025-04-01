export function initContact() {
    console.log("Contact route loaded");

    // Handle contact form submission
    const contactForm = document.querySelector(".contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            fetch("/api/contact", {
                method: "POST",
                body: formData,
            })
                .then((response) => {
                    if (response.ok) {
                        alert("Thank you for contacting us!");
                        contactForm.reset();
                    } else {
                        alert("There was an error. Please try again.");
                    }
                })
                .catch((err) => console.error("Error submitting contact form:", err));
        });
    }

    // Initialize map
    const mapContainer = document.querySelector(".map-container");
    if (mapContainer) {
        const map = new google.maps.Map(mapContainer, {
            center: { lat: 40.7128, lng: -74.0060 },
            zoom: 12,
        });
        new google.maps.Marker({
            position: { lat: 40.7128, lng: -74.0060 },
            map: map,
            title: "Our Location",
        });
    }
}
