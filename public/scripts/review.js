let currentReviewIndex = 0;
const slides = document.querySelectorAll('.review-slide');
const totalSlides = slides.length;

document.querySelector('.next-review').addEventListener('click', () => {
    changeReview(1);
});

document.querySelector('.prev-review').addEventListener('click', () => {
    changeReview(-1);
});

function changeReview(direction) {
    slides[currentReviewIndex].classList.remove('active');
    currentReviewIndex = (currentReviewIndex + direction + totalSlides) % totalSlides;
    slides[currentReviewIndex].classList.add('active');
}
