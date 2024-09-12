// Default, Player
let board;
let boardWidth = 1000;
let boardHeight = 300;
let context;
let playerWidth = 85;
let playerHeight = 100;
let playerX = 50;
let playerY = 200;
let playerImg;
playerImg = new Image()
playerImg.src = "player.png"
let player = {
    x: playerX,
    y: playerY,
    width: playerWidth,
    height: playerHeight
};
let gameOver = false;
let score = 0;
let time = 0;
let life = 3;

// Object
let boxImg;
boxImg = new Image();
boxImg.src = "boss.png"
let boxWidth = 80;
let boxHeight = 165;
let boxX = 1000;
let boxY = 165;

// Setting Object
let boxesArray = [];
let boxSpeed = -6;

// Gravity, Velocity
let VelocityY = 0;
let Gravity = 0.25;

let Retry = document.getElementById("RetryButton");

console.log(player);
window.onload = function () {
    // Display
    board = document.getElementById("Board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    // Player
    playerImg.onload = function () {
        context.drawImage(playerImg, player.x, player.y, player.width, player.height);
    };

    // Request animation frame
    requestAnimationFrame(update);

    document.addEventListener("keydown", movePlayer);
    Retry.addEventListener("click", gameReset);


    createBoxWithRandomInterval();
};

// Function to create a box at a random time interval
function createBoxWithRandomInterval() {
    setTimeout("", 2);
    if (gameOver) {
        return;
    }

    createBox(); // Create a box

    // Generate a random time between 1 and 3 seconds (1000 to 3000 milliseconds)
    let randomTime = rnd(1000, 2500);

    // Use setTimeout instead of setInterval to create boxes at random times
    setTimeout(createBoxWithRandomInterval, randomTime);
}

function rnd(min, max) {
    return Math.floor((Math.random() * (max - min + 1)) + min);
}

// Update Function
function update() {
    requestAnimationFrame(update); // Always update animation

    if (gameOver) {
        return;
    }

    context.clearRect(0, 0, board.width, board.height);
    VelocityY += Gravity;

    player.y = Math.min(player.y + VelocityY, playerY);
    context.drawImage(playerImg, player.x, player.y, player.width, player.height);

    for (let index = 0; index < boxesArray.length; index++) {
        let box = boxesArray[index];
        box.x += boxSpeed;
        context.drawImage(box.img, box.x, box.y, box.width, box.height);

        if (onCollision(player, box)) {
            gameOver = true;
            life -= 1;

            context.font = "normal bold 40px Arial";
            context.textAlign = "center";
            context.fillText("GameOver!", boardWidth / 2, boardHeight / 2);
            context.fillText("Your Score : "+score,boardWidth/2 ,(boardHeight/2)+50);


            setTimeout(() => {
                Retry.style.display = "block";
            }, 500);
        }
    }
    score++;
    time += 0.01;
    context.font = "normal bold 40px Arial";
    context.textAlign = "left";
    context.fillText("Score : " + score, 700, 30);
    context.fillText("Time : " + time.toFixed(0), 20, 40);
    context.fillText("Life Remain : " + life, 20, 80);
    if (time >= 60) {
        gameOver = true;
        context.font = "normal bold 40px Arial";
        context.textAlign = "center";
        context.fillText("You Won! With Score :" + score, boardWidth / 2, boardHeight / 2);
        



        setTimeout(() => {
            Retry.style.display = "block";
        }, 500);
    }
}

function movePlayer(e) {
    if (gameOver) {
        return;
    }

    if (e.code === "Space" && player.y === playerY) {
        VelocityY = -10;
    }
}

function createBox(e) {
    if (gameOver) {
        return;
    }

    let box = {
        img: boxImg,
        x: boxX,
        y: boxY,
        width: boxWidth,
        height: boxHeight
    };

    boxesArray.push(box);

    if (boxesArray.length > 5) {
        boxesArray.shift();
    }
}

function onCollision(obj1, obj2) {
    return obj1.x+20 < (obj2.x + obj2.width) && (obj1.x-20 + obj1.width) > obj2.x // Crash in X move
        && obj1.y < (obj2.y + obj2.height) && (obj1.y + obj1.height) > obj2.y; // Crash in Y move
}

function gameReset() {
    if (!gameOver) {
        return;
    }

    if (life > 0) {
        gameOver = false;
        Retry.style.display = "none"; // Hide the Retry button
        

        score = 0;
        time = 0;
        boxesArray = [];
        VelocityY = 0; // Reset gravity effect
        player.y = playerY; // Reset player position

        createBoxWithRandomInterval(); // Restart creating boxes
    }
}
