const BG_COLOUR = '#001b47';
const SNAKE_COLOUR = '#1cff3e';
const FOOD_COLOUR = '#ffee00';

const socket = io('http://localhost:3000')

socket.on('init', handleInit)
socket.on('gameState', handleGameState)
socket.on('gameOver', handleGameOver)


let canvas, ctx

function init() {
    canvas = document.getElementById('canvas')
    ctx = canvas.getContext('2d')
    canvas.width = canvas.height = 600

    ctx.fillStyle = BG_COLOUR
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    document.addEventListener('keydown', keydown)
}

init()

function keydown(e) {
    socket.emit('keydown', e.keyCode);
  }

function paintGame (state) {
    ctx.fillStyle = BG_COLOUR
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const food = state.food;
    const gridsize = state.gridsize
    const size = canvas.width / gridsize

    ctx.fillStyle = FOOD_COLOUR
    ctx.fillRect(food.x * size, food.y * size, size, size)

    paintPlayer(state.player, size, SNAKE_COLOUR)
}

function paintPlayer (playerState , size, colour) {
 const snake = playerState.snake

 ctx.fillStyle = colour

 for (let cell of snake) {
     ctx.fillRect(cell.x * size, cell.y * size, size, size)
 }
}

function handleInit (msg){
    console.log(msg, 'test')
}

function handleGameState (gameState) {
    gameState = JSON.parse(gameState)
    requestAnimationFrame(()=> paintGame(gameState))

}

function handleGameOver (){
    alert('You Lose')
}