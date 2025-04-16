const canvas = document.getElementById('drawingCanvas');
const img = document.getElementById('court');
const ctx = canvas.getContext('2d');

// Match canvas to image size
img.onload = () => {
  canvas.width = img.width;
  canvas.height = img.height;
};

let drawing = false;

canvas.addEventListener('mousedown', () => drawing = true);
canvas.addEventListener('mouseup', () => drawing = false);
canvas.addEventListener('mouseout', () => drawing = false);

canvas.addEventListener('mousemove', e => {
  if (!drawing) return;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.strokeStyle = 'black';
  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);
});

canvas.addEventListener('mouseup', () => ctx.beginPath());

// Below is js for hamburger menu//
const hamburger = document.getElementById('hamburger')
const sidebar = document.getElementById('sidebar')
const overlay = document.getElementById('overlay')

let menuOpen = false

function openMenu() {
  menuOpen = true
  overlay.style.display = 'block'
  sidebar.style.width = '250px'
}

function closeMenu() {
  menuOpen = false
  overlay.style.display = 'none'
  sidebar.style.width = '0px'
}

hamburger.addEventListener('click', function () {
  if (!menuOpen) {
    openMenu()
  }
})

overlay.addEventListener('click', function () {
  if (menuOpen) {
    closeMenu()
  }
})
// END OF MENU//