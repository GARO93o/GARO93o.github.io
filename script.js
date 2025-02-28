const board = document.getElementById("game-board");
const instrText = document.getElementById("instruction-text");
const logo = document.getElementById("logo");
const score = document.getElementById("score");
const highScoreText = document.getElementById("highScore");
let snake = [{
    x: 10,
    y: 10,
}];
let audio = new Audio("./mixkit-arcade-retro-game-over-213.wav")
let isGameStart = false;
let gameSpeed = 200;
let gridSize = 20;
let food = generateFood();
let direction = "left";
let highScore = 0;
let gameIntervalId;

function draw() {
    board.innerHTML = "";
    drawSnake();
    drawFood();
    updateScore()
}

function drawSnake() {
    snake.forEach((segment) => {
        const snakeElement = createElement("div", "snake");
        setPosition(snakeElement, segment);
        board.appendChild(snakeElement)

    });
}

function createElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

function setPosition(element, position) {
    // console.log(position.x);
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}

function drawFood() {
    let foodElement = createElement("div", "food");
    setPosition(foodElement, food);
    board.appendChild(foodElement)


}

function generateFood() {
    let x = Math.floor(Math.random() * gridSize) + 1;
    let y = Math.floor(Math.random() * gridSize) + 1;
    return { x, y };
}

function move() {
    let head = { ...snake[0] }
    console.log(snake);
    switch (direction) {
        case "up":
            head.y--
            break;
        case "down":
            head.y++
            break;
        case "left":
            head.x--
            break;
        case "right":
            head.x++
            break;
    }
    snake.unshift(head);
    // snake.pop();
    if (head.x === food.x && head.y === food.y) {
        audio
        food = generateFood();
        clearInterval(gameIntervalId)
        gameIntervalId = setInterval(() => {
            move();
            checkCollision();
            draw();
        }, gameSpeed);
    } else {
        snake.pop();
    }
}

document.addEventListener("keydown", handKeyPress);

function handKeyPress(event) {
    // console.log(event);
    if ((!isGameStart && event.code === "Space") ||
        (!isGameStart && event.key === " ")) {
        startGame();
    } else {
        switch (event.key) {
            case "ArrowUp":
                direction = "up"
                break;
            case "ArrowDown":
                direction = "down"
                break;
            case "ArrowLeft":
                direction = "left"
                break;
            case "ArrowRight":
                direction = "right"
                break;

        }
    }
}

function startGame() {
    isGameStart = true;

    logo.style.display = "none";
    instrText.style.display = "none"

    gameIntervalId = setInterval(() => {
        move();
        checkCollision();
        draw();
    }, gameSpeed);

}


function checkCollision() {

    let head = { ...snake[0] };

    if (head.x > gridSize || head.x < 1 || head.y > gridSize || head.y < 1) {
        resetGame();
        audio.play();
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame();
            audio.play();
            break;

        }

    }


}

function resetGame() {
    updateHighScore();
    stopGame();
    snake = [{ x: 10, y: 10 }];
    food = generateFood();
    direction = "right";
    gameSpeed = 200;
    updateScore()

}

function stopGame() {
   
    clearInterval(gameIntervalId);
    isGameStart = false;

    logo.style.display = "block";
    instrText.style.display = "block";
    
}


function updateScore() {
    const currentScore = snake.length-1;
    score.textContent = currentScore.toString().padStart(3,"0");
}


function updateHighScore(){
    const currentScore = snake.length-1;
    if(currentScore > highScore){
        highScore = currentScore;
    }

    highScoreText.textContent = highScore.toString().padStart(3, "0");
    highScoreText.style.display = "block";
}