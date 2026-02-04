const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 1280;
canvas.height = 720;

let x = 0;
let y = 360;
let lastTime = 0;

function loop(currentTime) {

  const deltaTime = (currentTime - lastTime) / 1000;
  lastTime = currentTime;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  x += 240 * deltaTime;
  
  ctx.fillStyle = "blue";
  ctx.fillRect(x, y, 50, 50);
  
  requestAnimationFrame(loop);
  
}

loop(0);