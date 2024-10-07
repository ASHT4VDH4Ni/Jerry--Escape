const boardSize = 10;
let level = 1;
const gameBoard = document.getElementById('game-board');
const levelInfo = document.getElementById('level-info');

let jerryPosition = { x: 0, y: 0 };
let robotTomPosition = { x: 9, y: 9 };
let holePosition = { x: 0, y: 0 };
const traps = [];
let tomChaseInterval; 

function initBoard() {
    gameBoard.innerHTML = ''; 
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.x = i;
            cell.dataset.y = j;
            gameBoard.appendChild(cell);
        }
    }
    setupLevel();
    updateBoard();
    startTomChasing();
}

function setupLevel() {
    levelInfo.textContent = `Level: ${level}`;
    
    traps.length = 0; 
    for (let i = 0; i < level; i++) {
        traps.push({ x: Math.floor(Math.random() * boardSize), y: Math.floor(Math.random() * boardSize) });
    }
    holePosition = { x: Math.floor(Math.random() * boardSize), y: Math.floor(Math.random() * boardSize) };
}

function updateBoard() {
    document.querySelectorAll('.cell').forEach(cell => {
        cell.classList.remove('jerry', 'robot-tom', 'trap', 'hole', 'explosion');
        const x = parseInt(cell.dataset.x);
        const y = parseInt(cell.dataset.y);
        if (x === jerryPosition.x && y === jerryPosition.y) {
            cell.classList.add('jerry');
        } else if (x === robotTomPosition.x && y === robotTomPosition.y) {
            cell.classList.add('robot-tom');
        } else if (x === holePosition.x && y === holePosition.y) {
            cell.classList.add('hole');
        } else if (traps.some(trap => trap.x === x && trap.y === y)) {
            cell.classList.add('trap');
        }
    });
}

function move(direction) {
    switch (direction) {
        case 'up':
            if (jerryPosition.x > 0) jerryPosition.x--;
            break;
        case 'down':
            if (jerryPosition.x < boardSize - 1) jerryPosition.x++;
            break;
        case 'left':
            if (jerryPosition.y > 0) jerryPosition.y--;
            break;
        case 'right':
            if (jerryPosition.y < boardSize - 1) jerryPosition.y++;
            break;
    }
    updateBoard();
    checkGameState();
}

function useGadget(gadget) {
    if (gadget === 'Teleport') {
        jerryPosition = {
            x: Math.floor(Math.random() * boardSize),
            y: Math.floor(Math.random() * boardSize),
        };
        updateBoard();
    } else if (gadget === 'bomb') {
        explodeBomb(jerryPosition.x, jerryPosition.y);
    }
}

function moveTom() {
    if (robotTomPosition.x < jerryPosition.x) robotTomPosition.x++;
    if (robotTomPosition.x > jerryPosition.x) robotTomPosition.x--;
    if (robotTomPosition.y < jerryPosition.y) robotTomPosition.y++;
    if (robotTomPosition.y > jerryPosition.y) robotTomPosition.y--;
}

function startTomChasing() {
    if (tomChaseInterval) {
        clearInterval(tomChaseInterval);
    }
    tomChaseInterval = setInterval(() => {
        moveTom();
        updateBoard();
        checkGameState();
    }, 1000);
}

function checkGameState() {
    if (jerryPosition.x === robotTomPosition.x && jerryPosition.y === robotTomPosition.y) {
        alert('Caught by Tom! Kya Chuha banega re tu !!!');
        resetGame();
    } else if (traps.some(trap => trap.x === jerryPosition.x && trap.y === jerryPosition.y)) {
        alert('Game over.');
        resetGame();
    } else if (jerryPosition.x === holePosition.x && jerryPosition.y === holePosition.y) {
        alert('Mission Complete, Respect++. Next level,');
        level++;
        resetGame();
    }
}

function resetGame() {
    jerryPosition = { x: 0, y: 0 };
    robotTomPosition = { x: 9, y: 9 };
    initBoard();
}

initBoard();
