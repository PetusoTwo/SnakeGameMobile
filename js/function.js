//Elementos del HTML
const board = document.getElementById("board");
const scoreBoard = document.getElementById("scoreBoard");
const startButton = document.getElementById("start");
const gameOverSign = document.getElementById("gameOver");
const controls = document.getElementById("controls");

//Configuracion del juego
const boardSize = 10; 
const gameSpeed = 170; //Velocidad
const squareTypes = {
    emptySquare: 0,
    snakeSquare: 1,
    foodSquare: 2
};

//Direcciones de la serpiente al moverse
const directions = {
    ArrowUp: -10,
    ArrowDown: 10,
    ArrowLeft: -1,
    ArrowRight: 1
}; 

//Variables que se modifican dentro del juego
let snake; 
let score; 
let direction; 
//Array
let boardSquares;
//s
let emptySquare; 
let moveInternal;  

//Detectar si el dispositivo es móvil
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

// Mostrar controles si es móvil
if (isMobile) {
    controls.classList.remove('hidden');
}

//Dibujar la serpiente
const drawSnake = () => {
    snake.forEach(square => drawSquare(square, 'snakeSquare'));
}

//Dibujar los cuadrados solos
const drawSquare = (square, type) => {
    const [row, column] = square.split('');
    boardSquares[row][column] = squareTypes[type]; 
    const squareElement = document.getElementById(square);
    squareElement.setAttribute('class', `square ${type}`);
    if(type == 'emptySquare') {
        emptySquare.push(square);
    }else{
        if(emptySquare.indexOf(square) !== -1){
            emptySquare.splice(emptySquare.indexOf(square), 1);
        }
    }
}

//Mover la serpiente
const moveSnake = () => {
    const newSquare = String(Number(snake[snake.length - 1]) + directions[direction]).padStart(2, '0');
    const [row, column] = newSquare.split('');
    //Condicionales para saber si la serpiente muere o no
    if (
        newSquare < 0 ||
        newSquare >= boardSize * boardSize ||
        (direction === 'ArrowRight' && column === '0') || // Se ajusta
        (direction === 'ArrowLeft' && column === '9') || // Se ajusta 
        boardSquares[row][column] === squareTypes.snakeSquare
    ) {
        gameOver();
    } else {
        snake.push(newSquare);
        if (boardSquares[row][column] === squareTypes.foodSquare) {
            addFood();
        } else {
            const emptySquare = snake.shift();
            drawSquare(emptySquare, 'emptySquare');
        }
        drawSnake();
    }
}

//Funcion para agregar comida
const addFood = () => {
    score++;
    updateScore();
    createdRandomFood();
}

//Funcion para cuando perdemos o se termina el juego 
const gameOver = () => {
    clearInterval(moveInternal);
    startButton.disabled = false;
    gameOverSign.style.display = 'flex';
    Swal.fire({
        icon: "error",
        title: "Game Over",
        text: "Intentalo Denuevo!",
        footer: '<a href="https://github.com/PetusoTwo" target="_blank">Necesitas ayuda?</a>',
        background: 'silver',
    });
}

//Funcion para setear la direccion
const setDirection = newDirection => {
    direction = newDirection;
}

//Creamos la funcion para las teclas 
const directionEvent = key => {
    switch(key.code) {
        case 'ArrowUp':
            direction != 'ArrowDown' && setDirection(key.code);
            break;
        case 'ArrowDown':
            direction != 'ArrowUp' && setDirection(key.code);
            break;
        case 'ArrowLeft':
            direction != 'ArrowRight' && setDirection(key.code);
            break;
        case 'ArrowRight':
            direction != 'ArrowLeft' && setDirection(key.code);
            break;
    }
}

//Crear la comida al azar
createdRandomFood = () => {
    const randomEmptySquare = emptySquare[Math.floor(Math.random() * emptySquare.length)];
    drawSquare(randomEmptySquare, 'foodSquare');
}

//Actualizar el puntaje 
const updateScore = () => {
    scoreBoard.innerText = score;
}

//Crear el mundo
const createdBoard = () => {
    boardSquares.forEach((row, rowIndex)=> {
        row.forEach((column, columnIndex) => {
            const squareValue = `${rowIndex}${columnIndex}`;
            const squareElement = document.createElement('div');
            squareElement.setAttribute('class', 'square emptySquare'); 
            squareElement.setAttribute('id', squareValue);
            board.appendChild(squareElement);
            emptySquare.push(squareValue);
        })
    })
}

//Funcion para setear el juego(darle valores iniciales)
const setGame = () => {
    snake = ['01', '02', '03', '04'];
    score = snake.length; 
    direction = 'ArrowRight';
    boardSquares = Array.from(Array(boardSize), () => new Array(boardSize).fill(squareTypes.emptySquare));
    console.log((boardSquares)); 
    board.innerHTML = '';
    emptySquare = []; 
    createdBoard();
}

//Funcion de poner musica
const playMusic = () => {
    const audio = new Audio('../music/music2.mp3');
    audio.play();
}

//Funcion de iniciar juego
const StarGame = () => {
    setGame();
    gameOverSign.style.display = 'none';
    startButton.disabled = true;
    drawSnake();
    updateScore();
    createdRandomFood();
    document.addEventListener('keydown', directionEvent);
    moveInternal = setInterval(() => { moveSnake() }, gameSpeed);
    playMusic();
}

startButton.addEventListener('click', StarGame);

// Event listeners for mobile controls
document.getElementById('up').addEventListener('click', () => directionEvent({ code: 'ArrowUp' }));
document.getElementById('down').addEventListener('click', () => directionEvent({ code: 'ArrowDown' }));
document.getElementById('left').addEventListener('click', () => directionEvent({ code: 'ArrowLeft' }));
document.getElementById('right').addEventListener('click', () => directionEvent({ code: 'ArrowRight' }));
