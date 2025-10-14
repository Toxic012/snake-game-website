const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let snake = [{ x: 100, y: 100 }];
let direction = "RIGHT";
let food = { x: 200, y: 200 };
let score = 0;
let speed = 10;
let snakeColor = "#00ff00";
let mouseMode = false;

document.getElementById("startBtn").addEventListener("click", startGame);

function startGame() {
  snakeColor = document.getElementById("snakeColor").value;
  speed = parseInt(document.getElementById("difficulty").value);
  document.querySelector(".menu").style.display = "none";
  document.querySelector(".game-container").style.display = "block";
  gameLoop();
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});

canvas.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  mouseMode = !mouseMode;
});

canvas.addEventListener("mousemove", (e) => {
  if (mouseMode) {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const head = snake[0];
    const angle = Math.atan2(my - head.y, mx - head.x);
    head.x += Math.cos(angle) * speed;
    head.y += Math.sin(angle) * speed;
  }
});

function randomFood() {
  return {
    x: Math.floor(Math.random() * 79) * 10,
    y: Math.floor(Math.random() * 59) * 10
  };
}

function drawSnake() {
  ctx.fillStyle = snakeColor;
  snake.forEach((part) => ctx.fillRect(part.x, part.y, 10, 10));
}

function gameLoop() {
  ctx.clearRect(0, 0, 800, 600);

  let head = { ...snake[0] };

  if (!mouseMode) {
    if (direction === "UP") head.y -= speed;
    if (direction === "DOWN") head.y += speed;
    if (direction === "LEFT") head.x -= speed;
    if (direction === "RIGHT") head.x += speed;
  }

  snake.unshift(head);

  if (Math.abs(head.x - food.x) < 10 && Math.abs(head.y - food.y) < 10) {
    score += 10;
    document.getElementById("score").textContent = score;
    food = randomFood();
  } else {
    snake.pop();
  }

  // Collision
  if (head.x < 0 || head.x >= 800 || head.y < 0 || head.y >= 600) endGame();

  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, 10, 10);
  drawSnake();

  requestAnimationFrame(gameLoop);
}

function endGame() {
  fetch("/update_score", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ score })
  })
  .then(res => res.json())
  .then(data => {
    alert(`Game Over!\nScore: ${score}\nHigh Score: ${data.highscore}`);
    location.reload();
  });
}
