//function to toggle the humbuger icon
function toggleMenu() {
  const hamburgerMenu = document.getElementById("hamburger-menu");
  hamburgerMenu.classList.toggle("active");
}

//method that changes the background images after some given intervals
const images = [
  'url("styles/img1.jpg")',
  'url("styles/img2.jpg")',
  'url("styles/img3.jpg")',
  'url("styles/img4.jpg")',
];

const texts = [
  "Organize, Plan, and Celebrate with Ease",
  "Streamline Your Event Management",
  "Get All Your Guests Managed Effortlessly",
  "Enjoy easy Event Coordination",
];

let currentIndex = 0;
const backgroundSection = document.querySelector(".welcome-section");
const dynamicText = document.getElementById("dynamic-text");

function changeBackgroundAndText() {
  currentIndex = (currentIndex + 1) % images.length; // Loop through the images and text
  backgroundSection.style.backgroundImage = images[currentIndex];
  dynamicText.textContent = texts[currentIndex];
}
setInterval(changeBackgroundAndText, 3000);

//room booking section
document.querySelector(".view-more-btn").addEventListener("click", function () {
  const hiddenRooms = document.querySelector(".hidden-rooms");
  hiddenRooms.style.display =
    hiddenRooms.style.display === "block" ? "none" : "block";
  this.textContent =
    hiddenRooms.style.display === "block" ? "View Less" : "View More";
});

// Function to open the popup with dynamic content for each room
function openPopup(title, mainImageSrc, price, location, subImages) {
  document.getElementById("popup-image").src = mainImageSrc; // Set the main image
  document.getElementById("popup-title").innerText = title; // Set the title
  document.getElementById("popup-price").innerText = "Price: " + price; // Set the price
  document.getElementById("popup-location").innerText = "Location: " + location; 

  // Clear and repopulate sub-images
  const subImagesContainer = document.getElementById("popup-sub-images");
  subImagesContainer.innerHTML = ""; // Clear any existing sub-images

  subImages.forEach((subImageSrc) => {
    const img = document.createElement("img");
    img.src = subImageSrc;
    img.className = "popup-sub-image";
    img.onclick = function () {
      document.getElementById("popup-image").src = subImageSrc; // Change main image
    };
    subImagesContainer.appendChild(img);
  });
  document.getElementById("room-popup").style.display = "flex";
}
function closePopup() {
  document.getElementById("room-popup").style.display = "none";
}


function Event() {
  window.location.href = 'events.html';
}