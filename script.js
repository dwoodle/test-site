const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const levelImage = new Image();
levelImage.src = "level.png";

const level = {
  x: -440,       // top-left corner X
  y: -360,      // top-left corner Y
  width: 2160,  // size of the box
  height: 1440
};

// Player
let playerX = 50;
let playerY = 100;
const playerWidth = 50;
const playerHeight = 50;

// Physics
let speedX = 0;
let speedY = 0;
const gravity = 0.35;
let falling = 0;

// Platforms
const platforms = [
  { x: 50, y: 500, width: 1000, height: 50 },
  { x: 200, y: 340, width: 100, height: 50 }
];

// Input
const input = { up: false, left: false, right: false };
window.addEventListener("keydown", e => {
  if (e.key === "ArrowUp") input.up = true;
  if (e.key === "ArrowLeft") input.left = true;
  if (e.key === "ArrowRight") input.right = true;
});
window.addEventListener("keyup", e => {
  if (e.key === "ArrowUp") input.up = false;
  if (e.key === "ArrowLeft") input.left = false;
  if (e.key === "ArrowRight") input.right = false;
});

// FPS
let lastTime = performance.now();
function updateFPS() {
  const now = performance.now();
  const delta = (now - lastTime) / 1000;
  const fps = Math.round(1 / delta);
  lastTime = now;
  document.getElementById("fps").textContent = "FPS: " + fps;
}

// Collision
function isTouchingRect(ax, ay, aw, ah, bx, by, bw, bh) {
  return ax < bx + bw &&
         ax + aw > bx &&
         ay < by + bh &&
         ay + ah > by;
}

function isTouchingAnyRect(x, y, w, h, rects) {
  for (let rect of rects) {
    if (isTouchingRect(x, y, w, h, rect.x, rect.y, rect.width, rect.height)) return true;
  }
  return false;
}

// Movement steps (prevents tunneling)
function moveInSteps(steps) {
  const stepX = speedX / steps;
  const stepY = speedY / steps;
  falling += 1;

  for (let i = 0; i < steps; i++) {
    // X axis
    playerX += stepX;
    if (isTouchingAnyRect(playerX, playerY, playerWidth, playerHeight, platforms)) {
      playerX -= stepX;
      speedX = 0;
    }

    // Y axis
    playerY += stepY;
    if (isTouchingAnyRect(playerX, playerY, playerWidth, playerHeight, platforms)) {
      playerY -= stepY;
      if (speedY > 0) falling = 0;
      speedY = 0;
    }
  }
}

// Draw everything
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Platforms
  ctx.fillStyle = "greenyellow";
  for (let plat of platforms) {
    ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
  }


  // Player
  ctx.fillStyle = "blue";
  ctx.fillRect(playerX, playerY, playerWidth, playerHeight);
}

// Game loop
function loop() {
  // Input
  if (input.up && falling < 10) speedY = -8.5;
  if (input.left) speedX -= 0.9;
  if (input.right) speedX += 0.9;
  speedX *= 0.85;

  // Gravity
  speedY += gravity;

  // Move
  const steps = Math.ceil(Math.abs(speedX) + Math.abs(speedY));
  moveInSteps(steps);

  // Draw
  draw();

  // FPS
  updateFPS();

  requestAnimationFrame(loop);
}

loop();