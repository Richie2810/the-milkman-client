const BG_COLOUR = "#001b47";
const PLAYER_1 = "#1cff3e";
const PLAYER_2 = "#8773d9";
const FOOD_COLOUR = "#ffee00";

const socket = io("http://localhost:3000");

socket.on("init", handleInit);
socket.on("gameState", handleGameState);
socket.on("gameOver", handleGameOver);
socket.on("gameCode", handleGameCode);
socket.on("unknownCode", handleUnknownCode);
socket.on("gameScore", handleScore);
socket.on("tooManyPlayers", handleTooManyPlayers);

const gameScreen = document.getElementById("gameScreen");
const initialScreen = document.getElementById("initialScreen");
const newGameForm = document.getElementById("newGameForm");
const joinGameForm = document.getElementById("joinGameForm");
const gameCodeInput = document.getElementById("gameCodeInput");
const gameCodeDisplay = document.getElementById("gameCodeDisplay");

newGameForm.addEventListener("submit", newGame);
joinGameForm.addEventListener("submit", joinGame);

function newGame(e) {
  e.preventDefault();
  socket.emit("newGame");
  init();
}

function joinGame(e) {
  e.preventDefault();
  const code = gameCodeInput.value;
  console.log(code);
  socket.emit("joinGame", code);
  init();
}

let canvas, ctx;
let playerNumber;
let gameActive = false;

function init() {
  initialScreen.style.display = "none";
  gameScreen.style.display = "block";

  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");

  canvas.width = 800;
  canvas.height = 500;

  ctx.fillStyle = BG_COLOUR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  document.addEventListener("keydown", keydown);
  gameActive = true;
}

function keydown(e) {
  socket.emit("keydown", e.keyCode);
}

function paintGame(state) {
  ctx.fillStyle = BG_COLOUR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const food = state.food;
  const gridsize = state.gridsize;
  const size = canvas.width / gridsize;

  ctx.fillStyle = FOOD_COLOUR;
  ctx.fillRect(food.x * size, food.y * size, size, size);

  paintPlayer(state.players[0], size, PLAYER_1);
  paintPlayer(state.players[1], size, PLAYER_2);
}

function paintPlayer(playerState, size, colour) {
  const snake = playerState.snake;

  ctx.fillStyle = colour;
  for (let cell of snake) {
    ctx.fillRect(cell.x * size, cell.y * size, size, size);
  }
}

function handleInit(number) {
  playerNumber = number;
}

function handleGameState(gameState) {
  if (!gameActive) {
    return;
  }
  gameState = JSON.parse(gameState);
  requestAnimationFrame(() => paintGame(gameState));
}

function handleGameOver(data) {
  if (!gameActive) {
    return;
  }
  data = JSON.parse(data);

  gameActive = false;

  if (data.winner === playerNumber) {
    alert("You Win!");
  } else {
    alert("You Lose :(");
  }
}

function handleGameCode(gameCode) {
  gameCodeDisplay.innerText = gameCode;
}

function handleUnknownCode(room) {
  reset();
  alert("Unknown Game Code", room);
}

function handleTooManyPlayers() {
  reset();
  alert("This game is already in progress");
}

function reset() {
  playerNumber = null;
  gameCodeInput.value = "";
  initialScreen.style.display = "block";
  gameScreen.style.display = "none";
}

function handleScore(data) {
  if (!gameActive) {
    return;
  }
  data = JSON.parse(data);
  const playersScore = data.map((player) => player.score);
  //  playerOneScore.innerText = playersScore[0]
  //  playerTwoScore.innerText = playerScore[1]
  console.log(playersScore[0]);
}
