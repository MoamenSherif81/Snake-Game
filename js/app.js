const fruit = document.querySelector(".fruit");
const game = document.querySelector(".game");
const gameContainer = document.querySelector(".game-container");
const menu = document.querySelector(".menu-cont");
const currScoreCont = document.querySelector(".curr-score-num");
const finalScore = document.querySelector(".final-score-num");
const maxScore = document.querySelector(".max-score-num");
const startBtn = document.querySelector(".start-btn");
const gameOver = document.querySelector(".game-over");
const controlBtns = document.querySelectorAll(".control-button");
let snake = [];
let currDir;
let snakeMovementInterval;
let currScore;

gameContainer.remove();
startMenu();

startBtn.addEventListener("click", () => {
  initializeGame();
});

function startMenu() {
  gameContainer.remove();
  document.body.append(menu);  


  maxScore.textContent = localStorage.getItem("max-score") || "--";

  if (currScore != undefined) {
    document.body.append(menu);
    gameOver.style.display = "block";
    finalScore.closest(".final-score").style.display = "block";
    finalScore.textContent = currScore;
  }

  let imgs = ['body_horizontal.png', 'body_vertical.png', 'head_down.png', 'head_left.png', 'head_right.png', 'head_up.png', 'tail_down.png', 'tail_left.png', 'tail_right.png', 'tail_up.png']
  for(let i = 0; i < 10; i++){
    let img=new Image();
    img.src= '../images/' + imgs[i];
  }
}

function generateFruit() {
  fruit.style.top = Math.floor(Math.random() * (game.scrollHeight - 20)) + "px";
  fruit.style.left = Math.floor(Math.random() * (game.scrollWidth - 20)) + "px";
}

function initializeGame() {
  menu.remove();
  document.body.append(gameContainer);

  currScore = 0;
  currDir = "right";
  snake.forEach((part) => part.remove());
  snake = [];

  generateFruit();

  increaseSnakeLength("100px", "100px");
  increaseSnakeLength();

  let timer;
  if(window.innerWidth > 768){
    timer = 100;
  } else {
    timer = 150;
  }

  snakeMovementInterval = setInterval(() => {
    movingSnakeBody();
    movingSnakeHead();
    checkCollision();
    setTextures();
    currScoreCont.textContent = currScore;
  }, timer);

  movementEvents();
}

function increaseSnakeLength(x, y) {
  const newPart = document.createElement("div");
  newPart.className = "snake-part";
  snake.push(newPart);

  x = x ? x : snake[snake.length - 2]?.style.left;
  y = y ? y : snake[snake.length - 2]?.style.top;

  if (snake.length === 1) {
    newPart.style.backgroundColor = "transparent";
  }

  newPart.style.top = y;
  newPart.style.left = x;

  game.append(newPart);
}

function movingSnakeHead() {
  let headPosTop = +snake[0].style.top.slice(0, -2);
  let headPosLeft = +snake[0].style.left.slice(0, -2);

  if (currDir == "left") headPosLeft -= 20;
  else if (currDir == "right") headPosLeft += 20;
  else if (currDir == "up") headPosTop -= 20;
  else headPosTop += 20;

  snake[0].style.top = headPosTop + "px";
  snake[0].style.left = headPosLeft + "px";
}

function movingSnakeBody() {
  for (let i = snake.length - 1; i > 0; i--) {
    let prevPosTop = +snake[i - 1].style.top.slice(0, -2);
    let prevPosLeft = +snake[i - 1].style.left.slice(0, -2);

    snake[i].style.top = prevPosTop + "px";
    snake[i].style.left = prevPosLeft + "px";
  }
}

function checkCollision() {
  const snakeHead = snake[0];
  const snakeHeadTop = snakeHead.style.top.slice(0, -2);
  const snakeHeadLeft = snakeHead.style.left.slice(0, -2);

  if (isCollide(fruit, snakeHead)) {
    increaseSnakeLength();
    generateFruit();
    currScore++;
  } else if (
    snakeHeadTop < 0 ||
    snakeHeadLeft < 0 ||
    snakeHeadTop >= game.scrollHeight - 20 ||
    snakeHeadLeft >= game.scrollWidth - 20
  ) {
    endGame();
  } else {
    for (let i = 1; i < snake.length; i++) {
      if (
        snakeHeadTop === snake[i].style.top.slice(0, -2) &&
        snakeHeadLeft === snake[i].style.left.slice(0, -2)
      ) {
        endGame();
      }
    }
  }
}

function isCollide(obj1, obj2) {
  let rect1 = obj1.getBoundingClientRect();
  let rect2 = obj2.getBoundingClientRect();

  if (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.height + rect1.y > rect2.y
  ) {
    return true;
  }
  return false;
}

function setTextures() {
  snake[0].style.backgroundImage = `url('../images/head_${currDir}.png')`;

  for(let i = 1; i < snake.length - 1; i++) {
    if(snake[i - 1].style.top == snake[i].style.top){
      snake[i].style.backgroundImage = `url('../images/body_horizontal.png')`;
    } else if (snake[i - 1].style.left == snake[i].style.left){
      snake[i].style.backgroundImage = `url('../images/body_vertical.png')`;
    }
  }

  let tail = snake[snake.length - 1];
  let beforeTail = snake[snake.length - 2];
  let tailTop = tail.style.top;
  let tailLeft = tail.style.left;
  let beforeTailLeft = beforeTail.style.left;
  let beforeTailTop = beforeTail.style.top;
  let tailTexture;
  if(beforeTailTop > tailTop){
    tailTexture = `url('../images/tail_up.png')`;
  } else if(beforeTailTop < tailTop){
    tailTexture = `url('../images/tail_down.png')`;
  } else if(beforeTailLeft > tailLeft){
    tailTexture = `url('../images/tail_left.png')`;
  } else {
    tailTexture = `url('../images/tail_right.png')`;
  }

  tail.style.backgroundImage = tailTexture;
}

function movementEvents() {
  window.addEventListener("keydown", (e) => {
    const key = e.key;

    if (key === "a" || key === "ArrowLeft") currDir = "left";
    else if (key === "s" || key === "ArrowDown") currDir = "down";
    else if (key === "d" || key === "ArrowRight") currDir = "right";
    else if (key === "w" || key === "ArrowUp") currDir = "up";
  });

  controlBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      currDir = btn.dataset.id;
    });
  });
}

function endGame() {
  clearInterval(snakeMovementInterval);
  localStorage.setItem(
    "max-score",
    Math.max(localStorage.getItem("max-score") || 0, currScore)
  );
  startMenu();
}
