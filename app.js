document.querySelectorAll(".faq-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-target");
        const content = document.getElementById(id);

        // close all
        document.querySelectorAll(".faq-content").forEach(item => {
            if (item !== content) item.classList.add("hidden");
        });

        // toggle selected
        content.classList.toggle("hidden");
    });
});


 const track = document.querySelector('.carousel-track');
const slides = Array.from(track.children);
const dots = document.querySelectorAll('.dot');

let isDown = false;
let startX;
let currentTranslate = 0;
let prevTranslate = 0;
let currentIndex = 0;

const slideWidth = slides[0].offsetWidth + 40; // gap included
const totalSlides = slides.length / 2; // because we duplicated

// Set initial position
track.style.transform = `translateX(0px)`;
updateDots();

// --- Drag functionality ---
track.addEventListener('mousedown', dragStart);
track.addEventListener('touchstart', dragStart);

track.addEventListener('mouseup', dragEnd);
track.addEventListener('mouseleave', dragEnd);
track.addEventListener('touchend', dragEnd);

track.addEventListener('mousemove', dragMove);
track.addEventListener('touchmove', dragMove);

function dragStart(e) {
  isDown = true;
  startX = getX(e);
}

function dragEnd() {
  isDown = false;
  prevTranslate = currentTranslate;
  snapToSlide();
}

function dragMove(e) {
  if (!isDown) return;
  const x = getX(e);
  const diff = x - startX;
  currentTranslate = prevTranslate + diff;
  setTranslate(currentTranslate);
}

function getX(e) {
  return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
}

function setTranslate(x) {
  track.style.transform = `translateX(${x}px)`;
}

// Snap to nearest slide and loop infinitely
function snapToSlide() {
  currentIndex = Math.round(-currentTranslate / slideWidth);

  // Infinite loop adjustment
  if (currentIndex >= totalSlides) {
    currentIndex = 0;
    currentTranslate = 0;
  }
  if (currentIndex < 0) {
    currentIndex = totalSlides - 1;
    currentTranslate = -currentIndex * slideWidth;
  }

  currentTranslate = -currentIndex * slideWidth;
  prevTranslate = currentTranslate;
  setTranslate(currentTranslate);
  updateDots();
}

// --- Dots navigation ---
dots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    currentIndex = index;
    currentTranslate = -currentIndex * slideWidth;
    prevTranslate = currentTranslate;
    setTranslate(currentTranslate);
    updateDots();
  });
});

function updateDots() {
  dots.forEach((dot, i) => {
    dot.classList.toggle('bg-gray-800', i === currentIndex);
    dot.classList.toggle('bg-gray-400', i !== currentIndex);
  });
}

// --- Auto-scroll every 3 seconds ---
setInterval(() => {
  currentIndex++;
  snapToSlide();
}, 3000);