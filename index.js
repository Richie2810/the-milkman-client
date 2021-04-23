const BG_COLOUR = "#001b47";
const PLAYER_1 = "#1fcc3e";
const PLAYER_2 = "#ff0000";
const FOOD_COLOUR = "#ffffff";
const image = document.getElementById("milk");

// const socket = io("http://localhost:3000");
const socket = io("https://multiplayersnakeserver.herokuapp.com");

socket.on("init", handleInit);
socket.on("gameState", handleGameState);
socket.on("gameOver", handleGameOver);
socket.on("gameCode", handleGameCode);
socket.on("unknownCode", handleUnknownCode);
socket.on("gameScore", handleScore);
socket.on("tooManyPlayers", handleTooManyPlayers);
socket.on("message", handleMessage);
socket.on("gameActive", handleGameActive);

const gameScreen = document.getElementById("gameScreen");
const initialScreen = document.getElementById("initialScreen");
const newGameForm = document.getElementById("newGameForm");
const joinGameForm = document.getElementById("joinGameForm");
const gameCodeInput = document.getElementById("gameCodeInput");
const gameCodeDisplay = document.getElementById("gameCodeDisplay");
const nameNewGame = document.getElementById("nameNewGame");
const nameJoinGame = document.getElementById("nameJoinGame");
const chatMessages = document.querySelector(".chatMessages");
const chatForm = document.getElementById("chatForm");
const playAgain = document.getElementById("playAgain");

newGameForm.addEventListener("submit", newGame);
joinGameForm.addEventListener("submit", joinGame);
chatForm.addEventListener("submit", submitMessage);

function newGame(e) {
  e.preventDefault();
  const playerName = nameNewGame.value;
  socket.emit("newGame", playerName);
  init();
}

function joinGame(e) {
  e.preventDefault();
  const playerName = nameJoinGame.value;
  const code = gameCodeInput.value;
  gameCodeDisplay.innerText = code;
  console.log(code);
  socket.emit("joinGame", playerName, code);
  init();
}

function restartGame() {
  socket.emit("restartGame");
  init();
}

let canvas, ctx;
let playerNumber;

playAgain.addEventListener("click", restartGame);

function init() {
  initialScreen.style.display = "none";
  playAgain.style.display = "none";
  gameScreen.style.display = "block";
  console.log("here");

  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");

  canvas.width = 600;
  canvas.height = 600;

  ctx.fillStyle = BG_COLOUR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  document.addEventListener("keydown", keydown);
}

const keysDown = {};
document.onkeydown = document.onkeyup = function (event) {
  keysDown[event.code] = event.type == "keydown";
};

function keydown(e) {
  if (
    (keysDown["ArrowUp"] && keysDown["ArrowLeft"]) ||
    (keysDown["ArrowUp"] && keysDown["ArrowRight"]) ||
    (keysDown["ArrowDown"] && keysDown["ArrowLeft"]) ||
    (keysDown["ArrowDown"] && keysDown["ArrowRight"])
  ) {
    console.log("two keys pressed");
    return;
  } else {
    socket.emit("keydown", e.keyCode);
  }
}

function paintGame(state) {
  ctx.fillStyle = BG_COLOUR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const food = state.food;
  const gridsize = state.gridsize;
  const size = canvas.width / gridsize;

  ctx.drawImage(image, food.x * size, food.y * size, size, size);
  // ctx.fillStyle = FOOD_COLOUR;
  // ctx.fillRect(food.x * size, food.y * size, size, size);

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
  gameState = JSON.parse(gameState);
  requestAnimationFrame(() => paintGame(gameState));
}

function handleGameOver(data) {
  data = JSON.parse(data);

  if (data.winner === playerNumber) {
    socket.emit("winnerMessage");
  }

  playAgain.style.display = "initial";
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
  data = JSON.parse(data);
  const playersScore = data.map((player) => player.score);
  playerOneScore.innerText = playersScore[0];
  playerTwoScore.innerText = playersScore[1];
  //console.log(playersScore[0]);
}

function handleMessage(message) {
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Message submit
function submitMessage(e) {
  e.preventDefault();

  // Get message text
  let message = e.target.elements.msg.value;

  message = message.trim();

  if (!message) {
    return;
  }

  // Emit message to server
  socket.emit("chatMessage", message);

  // Clear input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
}

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  const p = document.createElement("p");
  p.classList.add("meta");
  p.innerText = `${message.playername} `;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement("p");
  para.classList.add("text");
  para.innerText = message.text;
  div.appendChild(para);
  chatMessages.appendChild(div);
}

function handleGameActive() {
  playAgain.style.display = "none";
}
