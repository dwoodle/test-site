const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

//devtools
const devOverlay = document.getElementById("devtools");
let devVisible = false;

//camera
let cameraX = 0;
let cameraY = 0;
const levelWidth = 2160;
const levelHeight = 1440;
const cameraDeadZone = {
  x: canvas.width / 4,
  y: canvas.height / 4
};

const level = {
  x: -440,       // top-left corner X
  y: -360,      // top-left corner Y
  width: 2160,  // size of the box
  height: 1440
};

// Player
let playerX = 100;
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
  { x: 130.14, y: 1003.88, width: 2029.86 - 130.14, height: 1080 - 1003.88 },
  { x: 846.621, y: 899.124, width: 1168.78 - 846.621, height: 949.956 - 899.124 },
  { x: 1231.98, y: 820.395, width: 1554.15 - 1231.98, height: 844.841 - 820.395 },
  { x: 1620.38, y: 767.086, width: 1981.34 - 1620.38, height: 805.804 - 767.086 },
  { x: 980.639, y: 683.433, width: 1197.56 - 980.639, height: 707.879 - 683.433 },
  { x: 700.667, y: 626.604, width: 940.208 - 700.667, height: 639.043 - 626.604 },
  { x: 336.289, y: 614.164, width: 575.83 - 336.289, height: 626.604 - 614.164 }
];

// Input
const input = { up: false, left: false, right: false, shoot: false};
window.addEventListener("keydown", e => {
  if (e.key === "ArrowUp") input.up = true;
  if (e.key === "ArrowLeft") input.left = true;
  if (e.key === "ArrowRight") input.right = true;
  if (e.key === "z") input.shoot = true;
});
window.addEventListener("keyup", e => {
  if (e.key === "ArrowUp") input.up = false;
  if (e.key === "ArrowLeft") input.left = false;
  if (e.key === "ArrowRight") input.right = false;
  if (e.key === "z") input.shoot = false;
});
window.addEventListener("keydown", (e) => {
  if (e.key === "1") {
    devVisible = !devVisible;
    devOverlay.style.display = devVisible ? "block" : "none";
  }
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

//update devtools
function updateDevOverlay() {
  document.getElementById("devpX").textContent = Math.round(playerX);
  document.getElementById("devpY").textContent = Math.round(playerY);
  document.getElementById("devcX").textContent = Math.round(cameraX);
  document.getElementById("devcY").textContent = Math.round(cameraY);
  document.getElementById("devshoot").textContent = input.shoot;
}

function updateCamera() {

  const targetX = playerX - canvas.width / 2 + playerWidth / 2;
  const targetY = playerY - canvas.height / 2 + playerHeight / 2;

  const smooth = 0.08;

  //move camera
  cameraX += (targetX - cameraX) * smooth;
  cameraY += (targetY - cameraY) * smooth;
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

// draw everything
function draw() {
  // clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // draw platforms
  ctx.fillStyle = "#3395ff"; // or use images later
  for (let p of platforms) {
    ctx.fillRect(p.x - cameraX, p.y - cameraY, p.width, p.height);
  }

  // draw player
  ctx.fillStyle = "blue";
  ctx.fillRect(playerX - cameraX, playerY - cameraY, playerWidth, playerHeight);
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

  updateCamera();

  // draw
  draw();

  // fps
  updateFPS();

  //devtools
  updateDevOverlay();

  requestAnimationFrame(loop);
}

loop();