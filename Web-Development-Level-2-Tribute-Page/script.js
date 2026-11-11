// Get the Back to Top button
const backToTopButton = document.getElementById("back-to-top");

// Get the copyright year element
const yearElement = document.getElementById("current-year");

// Automatically update the copyright year
yearElement.textContent = new Date().getFullYear();

// Show or hide the Back to Top button
function toggleBackToTopButton() {
  if (window.scrollY > 300) {
    backToTopButton.hidden = false;
  } else {
    backToTopButton.hidden = true;
  }
}

// Listen for page scrolling
window.addEventListener("scroll", toggleBackToTopButton);

// Scroll smoothly to the top when clicked
backToTopButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

// Set the correct initial button visibility
toggleBackToTopButton();