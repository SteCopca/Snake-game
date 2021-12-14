/* LOS ESTADOS DE CORRER Y PERDER */
const STATE_RUNNING = 1;
const STATE_LOSING = 2;
/* INTERVALOS DE TIEMPO DE LOS DESPLAZAMIENTOS DE LA SERPIENTE */
const PASO = 70;
/* TAMAÑO DE CADA CUADRO QUE SE VAN A DIBUJAR EN EL JUEGO*/
const SQUARE_SIZE = 10;
/* CUANTOS CUADROS CABRAN EN EL JUEGO*/
const BOARD_WIDTH = 50;
const BOARD_HEIGHT = 50;
/*CUANTOS CUADROS DE LONGITUD VA A CRECER CADA QUE COMA EL PUNTO O FRESA */
const GROW_SCALE = 1;
/* DESPLAZAMIENTO DE X y Y. */
/*  para desplazar con mayúsculas y miniscúlas  */
const DIRECTIONS_MAP = {
	'A':[-1,0],
	'D':[1,0],
	'S':[0,1],
	'W':[0,-1],
	'a':[-1,0],
	'd':[1,0],
	's':[0,1],
	'w':[0,-1],
};
let state = {
	canvas: null,
	context: null,
	/* VALOR MÁS ADELANTE */
	snake:[{x: 0, y: 0}],
	/* que dirección va, y donde se guarda la variable */
direction: {x:1, y: 0},
 /*Posición en X y posición en Y */
prey: {x:0, y:0},
/* cuantos cuadros hay pendientes por llenar */
growing: 0,
runState: STATE_RUNNING
};
function randomXY(){
	return {
		/* PARA EL ANCHO */
		x:parseInt(Math.random() * BOARD_WIDTH),
	/* PARA LA ALTURA */
	y:parseInt(Math.random() * BOARD_HEIGHT)
	};
}
/* FUNCIÓN TICK */
function paso(){
	const cabeza = state.snake[0];
	const dx = state.direction.x;
	const dy = state.direction.y;
	const highestIndex = state.snake.length - 1;
	let tail = {};
	let interval = PASO;
	Object.assign(tail, state.snake[state.snake.length -1]);
	let score = (cabeza.x===state.prey.x
		&& cabeza.y === state.prey.y
		);
/*Si el estado de la vibora es igual a que este corriendo */
	if (state.runState === STATE_RUNNING) {
      for(let idx = highestIndex; idx > -1; idx--){
      	const sq = state.snake[idx];
      	if(idx === 0){
      		sq.x += dx;
      		sq.y += dy;
      	}else{
      		sq.x = state.snake[idx - 1].x;
      		sq.y = state.snake[idx - 1].y;
      	}
      }
	} else if (state.runState === STATE_LOSING){
   interval = 10;
   if(state.snake.length > 0){
   	state.snake.splice(0, 1);
   }/* REGRESAR EL JUEGO */
   if (state.snake.length === 0 ) {
   	state.runState = STATE_RUNNING;
   	state.snake.push(randomXY());
   	state.prey = randomXY();
   }
	}
	/* COLISIÓN */
	if (detectCollision()) {
		state.runState = STATE_LOSING;
		state.growing = 0;
	}
 if(score){
 	state.growing += GROW_SCALE;
 	state.prey= randomXY();
 }
 if (state.growing > 0){
 	state.snake.push(tail);
 	state.growing -= 1;
 }
	requestAnimationFrame(draw);
setTimeout(paso, interval);
}
function detectCollision(){
	const cabeza = state.snake[0];
	if(cabeza.x < 0 || cabeza.x >= BOARD_WIDTH || cabeza.y >= BOARD_HEIGHT || cabeza.y < 0){
   return true;
	}
	for(var idx = 1; idx < state.snake.length; idx++){
		const sq = state.snake[idx];

		if ( sq.x === cabeza.x && sq.y === cabeza.y){
			return true;
		}
	}
	return false;
}
function drawPixel(color, x, y){
	state.context.fillStyle = color;
	state.context.fillRect(x * SQUARE_SIZE, y * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE );
}
function draw(){/*borrar el contexto */ /*posición y tamaño */
	state.context.clearRect(0,0,600,550);
	for (var idx = 0; idx < state.snake.length; idx++){
		const {x,y} = state.snake[idx];
		drawPixel('#00FFF4', x, y);
	}
	const{x,y} = state.prey;
	drawPixel('#FF1E07', x, y);
}
window.onload= function(){
	state.canvas = document.querySelector(/* elemento que utilizamos para la pantalla: */ 'canvas');
	state.context = state.canvas.getContext('2d');

	window.onkeydown = function(e){
		const direction = DIRECTIONS_MAP[e.key];
		if(direction){
			const [x, y] = direction;
			/* para comprobar si es la dirección contraria */
			if (-x !== state.direction.x
				&& -y !== state.direction.y)
			{
				state.direction.x = x;
				state.direction.y = y;
				/* podemos tener la dirección de la vibora */

			}
		}
	}
	paso();
};
/* La Lógica de este juego consiste en: - El desplazamiento de la serpiente
Consumir el cuadro, El largo de la serpiente, Cuando choca, Cuando desaparece */