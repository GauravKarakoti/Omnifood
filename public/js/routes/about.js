export function initAbout() {
    console.log("About route loaded");

    // Toggle FAQ sections
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach((item) => {
        const question = item.querySelector(".faq-question");
        const answer = item.querySelector(".faq-answer");

        question.addEventListener("click", () => {
            const isOpen = answer.style.display === "block";
            answer.style.display = isOpen ? "none" : "block";
        });
    });

    // Load team member profiles dynamically
    fetch("/api/team")
        .then((response) => response.json())
        .then((team) => {
            const teamContainer = document.querySelector(".team-container");
            team.forEach((member) => {
                const memberEl = document.createElement("div");
                memberEl.classList.add("team-member");
                memberEl.innerHTML = `
                    <img src="${member.photo}" alt="${member.name}" />
                    <h3>${member.name}</h3>
                    <p>${member.role}</p>
                `;
                teamContainer.appendChild(memberEl);
            });
        })
        .catch((err) => console.error("Error loading team members:", err));
}
