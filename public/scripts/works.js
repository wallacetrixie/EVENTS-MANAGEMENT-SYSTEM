document.addEventListener("DOMContentLoaded", function () {
  const howItWorksSection = document.querySelector(".how-it-works-container");

  function checkVisibility() {
    const rect = howItWorksSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (rect.top <= windowHeight - 100) {
      howItWorksSection.classList.add("visible");
    }
  }

  window.addEventListener("scroll", checkVisibility);
  checkVisibility(); // Check visibility on load in case the section is already in view
});
