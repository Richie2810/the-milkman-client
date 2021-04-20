const BG_COLOUR = '#001b47';
const SNAKE_COLOUR = '#1cff3e';
const FOOD_COLOUR = '#ffee00';

const socket = io('http://localhost:3001')

socket.on('init', handleInit)

let canvas, ctx


const gameScreen = document.getElementById('gameScreen');

function init() {
    canvas = document.getElementById('canvas')
    ctx = canvas.getContext('2d')
    canvas.width = 600
    canvas.height = 600

    ctx.fillStyle = BG_COLOUR
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    document.addEventListener('keydown', keydown)
}

init()

function keydown(e) {
    socket.emit('keydown', e.keyCode);
  }

function paintGame (state) {
    const food = state.food;
    const gridsize = state.gridsize
}

function handleInit (msg){
    console.log(msg)
}