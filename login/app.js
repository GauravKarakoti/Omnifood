const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});

const back_btn = document.querySelector("#back-btn");

back_btn.addEventListener("click", () => {
  window.location.href = "./index.html"; // Change this to your actual homepage link
});
