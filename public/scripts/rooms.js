function toggleRooms() {
  const hiddenRooms = document.querySelector(".hidden-rooms");
  const viewMoreBtn = document.querySelector(".view-more-btn");

  if (
    hiddenRooms.style.display === "none" ||
    hiddenRooms.style.display === ""
  ) {
    hiddenRooms.style.display = "block";
    viewMoreBtn.textContent = "View Less";
  } else {
    hiddenRooms.style.display = "block";
    viewMoreBtn.textContent = "View More";
  }
}
