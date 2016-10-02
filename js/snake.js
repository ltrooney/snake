// TODO: replace snake.head with snake.coords[0][x]

var ROWS = COLS = 30;
var UPDATE_SPEED = 150; // default 150
var timeoutID;
var points = 0;

var direction_queue = [];

var Direction = {
	UP: 0,
	LEFT: 1,
	DOWN: 2,
	RIGHT: 3
}
var snake = {
	length: 1,
	direction: null,
	coords: [[ROWS/2, COLS/2]]
};

var food = { position: [] }

function tick() {
	timeoutID = window.setTimeout(tick, UPDATE_SPEED);
	move(); // updates the game stats
	render(); // renders the grid
}

function move() {
	// handle direction change
	direction_queue.unshift(snake.direction);

	// make sure the direction queue is only as long as the snake
	if(direction_queue.length > snake.length) {
		direction_queue.pop();	
	}	

	// updates the coordinates of the snake's body
	snake.coords = snake.coords.map(function(point, index) {
		// make the change to the coordinates
		switch(direction_queue[index]) {
			case Direction.UP:
				point[1]--;
				break;
			case Direction.DOWN:
				point[1]++;
				break;
			case Direction.LEFT:
				point[0]--;
				break;
			case Direction.RIGHT:
				point[0]++;
				break;
		}
		return point;
	});	

	// check to see if snake ate food
	if(snake.coords[0][0] === food.position[0] &&
		snake.coords[0][1] === food.position[1]) {
		points += 10;
		generateFood();
		extendSnake();
	}
	
	// check if snake crashes into itself
	if(snake.length > 4) {
		for(var p=1; p<snake.coords.length; p++) {
			if(snake.coords[0][0] === snake.coords[p][0] &&
				snake.coords[0][1] === snake.coords[p][1]) {
				console.log("head: "+snake.coords[0]+" "+
					"crashed into "+p+" "+snake.coords[p]);
				gameOver();
			}
		}
	}

	// check if snake is out of bounds
	if(snake.coords[0][0] < 1 || snake.coords[0][0] > COLS ||
		snake.coords[0][1] < 1 || snake.coords[0][1] > ROWS) {
		gameOver();
	}
}

function render() {
	// clear the grid first
	var clearGrid = function() {
		$("#grid").html("");
	}();

	// draw the food and empty blocks
	for (var r = 1; r <= ROWS; r++) {
		var row = "<div id='r"+r+"'>"; // start row
		for(var c = 1; c <= COLS; c++) {
			if(r === food.position[1] && c === food.position[0]) {
				row += "<div id='c"+c+"' class='food'></div>"; // food block
			} else {
				row += "<div id='c"+c+"' class='empty'></div>"; // empty block
			}
		}
		row += "</div>"; // end row
		$("#grid").append(row);
	}

	drawSnake(); // draw the snake
}

function drawSnake() {
	// draws each block in the snake
	for (var point = 0; point < snake.coords.length; point++) {
		var row_id = "#r"+snake.coords[point][1];
		var col_id = "#c"+snake.coords[point][0];
		$("#grid").find(row_id).find(col_id).removeClass("empty food");
		$("#grid").find(row_id).find(col_id).addClass("snake");
	};
}

function generateFood() {
	food.position = [Math.floor(Math.random()*ROWS)+1, Math.floor(Math.random()*COLS)+1];
}


/*
*	TODO: this is broken
*/
function extendSnake() {
	var lastXPoint = snake.coords[snake.coords.length-1][0];
	var lastYPoint = snake.coords[snake.coords.length-1][1];
	var tail;

	switch(direction_queue[direction_queue.length-1]) {
		case Direction.UP:
			tail = [lastXPoint, lastYPoint+1];
			break;
		case Direction.DOWN:
			tail = [lastXPoint, lastYPoint-1];
			break;
		case Direction.LEFT:
			tail = [lastXPoint+1, lastYPoint];
			break;
		case Direction.RIGHT:
			tail = [lastXPoint-1, lastYPoint];
			break;
	}

	if(snake.length < 10) {
		UPDATE_SPEED -= 5;
	} else if(snake.length < 15) {
		UPDATE_SPEED -= 3;
	}

	snake.coords.push(tail);
	snake.length += 1;
}

function gameOver() {
	show();
	window.clearTimeout(timeoutID);
}

function resetSnake() {
	snake.length = 1;
	snake.coords = [[ROWS/2, COLS/2]];
	snake.direction = null
	direction_queue = [];
	UPDATE_SPEED = 150;
	points = 0;
}

$(document).ready(function() {
	$("#gameover").hide();

	// direction handler
	$("body").keydown(function(event) {

		var currentDirection = snake.direction;
		if(event.which === 38 && currentDirection !== Direction.DOWN) {
			snake.direction = Direction.UP;
		} else if(event.which === 40 && currentDirection !== Direction.UP) {
			snake.direction = Direction.DOWN;
		} else if(event.which === 37 && currentDirection !== Direction.RIGHT) {
			snake.direction = Direction.LEFT;
		} else if(event.which === 39 && currentDirection !== Direction.LEFT) {
			snake.direction = Direction.RIGHT;
		}

	});

	var start = function() {
		resetSnake();
		generateFood();
		tick();
	}

	$("#restart").click(function() {
		$("#gameover").hide();
		start();
	});

	$("#close").click(function() {
		$("#gameover").hide();
	})

	// updates game and renders screen
	start();

	window.show = function() {
		$("#gameover #points").html("points: " + points);
		$("#gameover").show();
	}
});

