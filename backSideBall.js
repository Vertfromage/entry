/***
Credits: This application uses code from Open Source components/tutorials. You can find the source code of their open source 
projects and tutorials along with license information if applicable below. I acknowledge and am grateful to these developers
for their helpful tutorials, I have learned alot in the process of making this game!
Tutorial: simple games with html canvas (http://bencentra.com/2017-07-11-basic-html5-canvas-games.html)
github: https://github.com/bencentra/computercamp/tree/master/pong
Tutorial: create-html5-canvas-javascript-sprite-animation 
(http://www.williammalone.com/articles/create-html5-canvas-javascript-sprite-animation/)
Copyright: Copyright 2013 William Malone
License: http://www.apache.org/licenses/LICENSE-2.0
Tutorial: Creating simple music using the Web Audio API 
https://7tonshark.com/2018-09-16-web-audio-part-1/#
Resizing the canvas - for this task I benefited from multiple tutorials listed below:
https://www.kirupa.com/html5/resizing_html_canvas_element.htm
https://www.html5rocks.com/en/tutorials/casestudies/gopherwoord-studios-resizing-html5-games/
https://webglfundamentals.org/webgl/lessons/webgl-anti-patterns.html#toc
(Note: I know I'm not using webgl, but this article got me thinking about ways to approach resizing my canvas)
Making my sprite sheet: www.piskelapp.com
***/
var canvas = document.querySelector("#canvas");
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
// Key Codes
var A = 65;
var D = 68;
var LEFT = 37;
var RIGHT = 39;
// Keep track of gameOver for restart
var gameOver = false;
// Keep track of pressed keys
var keys = {
  A: false,
  D: false,
  LEFT: false,
  RIGHT: false,
};
// Create a rectangle object - for paddles, ball, etc
function makeRect(x, y, width, height, speed, color) {
  if (!color) color = '#000000';
  return {
    x: x,
    y: y,
    w: width,
    h: height,
    s: speed,
    c: color,
    draw: function() {
      context.fillStyle = this.c;
      context.fillRect(this.x, this.y, this.w, this.h);
    }
  };
}
function makeEllipse(x, y, width, height, speed, color) {
  if (!color) color = '#000000';
  return {
    x: x,
    y: y,
    w: width,
    h: height,
    s: speed,
    c: color,
    draw: function() {
      context.fillStyle = this.c;
      context.beginPath();
      context.ellipse(this.x,this.y,this.w/2,this.h/2,0,0,2*Math.PI);
      context.strokeStyle = this.c;
      context.stroke();
      context.fill();
    }
  };
}
function makeCircle(x, y, radius, speed, color) {
  if (!color) color = '#000000';
  return {
    x: x,
    y: y,
    r: radius,
    s: speed,
    c: color,
    draw: function() {
      context.fillStyle = this.c;
      context.beginPath();
      context.arc(this.x,this.y,this.r,0,2*Math.PI);
      context.strokeStyle = this.c;
      context.stroke();
      context.fill();
    }
  };
}	   
// Create the wall
var wallThickness = canvas.height*0.2;
var floor = makeRect(wallThickness,wallThickness*1.5,canvas.width-(2*wallThickness),canvas.height-wallThickness,0, '#F0F8FF');
// invisible spot where the ball hits the wall
var midWall = canvas.height*0.1;
//var leftCorner =
//var rightCorner =
// Create the paddles
var paddleWidth = 0.1*canvas.width;
var paddleHeight = 0.020*canvas.width;
var leftPaddle = makeRect(25, canvas.height-paddleHeight-25, paddleWidth, paddleHeight, 8, '#eebb99');
var rightPaddle = makeRect(canvas.width - paddleWidth - 25, canvas.height-paddleHeight-25, paddleWidth, paddleHeight, 8, '#eebb99');
// how far between two hands
var armLength = canvas.width*0.2;
// Keep track of the score
var lives = 1;
var score = 0;
var highScore = 0;
// Create the ball
var ballLength = 0.008*canvas.width;
var ballSpeed = 4;
var ball = makeCircle(0, 0, ballLength, ballSpeed, '#FFA62F');
// Modify the ball object to have two speed properties, one for X and one for Y
ball.sX = ballSpeed;
ball.sY = ballSpeed/2;
// Randomize initial direction
if (Math.random() > 0.5) {
  ball.sX *= -1;
}
// Randomize initial direction
if (Math.random() > 0.5) {
  ball.sY *= -1;
}
// Reset the ball's position and speed after scoring
function resetBall() {
  ball.x = canvas.width / 2 - ball.r / 2;
  ball.y = canvas.height / 2 - ball.r / 2;
  ball.sY = ballSpeed/2;
  ball.sX = ballSpeed;
}
function slowBall(){
	if (ball.sY >ballSpeed||ball.sY< -ballSpeed){
		
		ball.sY = ball.sY*.65;
		if (ball.sX >ballSpeed||ball.sX< -ballSpeed){
			ball.sX = ball.sX*.65;
		}
		
	}
}
// Bounce the ball off of a paddle
function bounceBall() {
	// Increase and reverse the Y speed
    if (ball.sY > 0) {
  	ball.sY += 1;
    // Add some "spin"
    if (keys.LEFT||mouseMovingLeft||keys.A) {
      ball.sX -= 1;
    } else if (keys.RIGHT||mouseMovingRight||keys.D) {
      ball.sX += 1;
    }
    ball.sY *= -1;
  }else {
  	ball.sY -= 1;
    // Add some "spin"
    if (keys.LEFT||mouseMovingLeft||keys.A) {
      ball.sX -= 2;
    } else if (keys.RIGHT||mouseMovingRight||keys.D) {
      ball.sX += 2;
    }
  }
  score +=1;
  //make noise
  ballNoise();
}
function ballNoise(){
    play(gainNode, 274.17, ctx.currentTime + 0.0, 0.1);
    play(gainNode, 366.90, ctx.currentTime + 0.1, 0.1);
}
function gremlinCurse(){
   play(gainNode, 274.17, ctx.currentTime + 0.0, 0.2);
   play(gainNode, 308.06, ctx.currentTime + 0.2, 0.2);
   play(gainNode, 346.13, ctx.currentTime + 0.4, 0.2);
   play(gainNode, 366.90, ctx.currentTime + 0.6, 0.2);
}
function coinNoise(){
      play(gainNode, 346.13, ctx.currentTime + 0.0, 0.1);
      play(gainNode, 366.90, ctx.currentTime + 0.2, 0.1);
}
function play(node, frequency, start, length) {
    var o = node.context.createOscillator();
    o.connect(node);
    o.frequency.value = frequency;
    // At note=0%, volume should be 0%
    node.gain.setValueAtTime(0, start);
    // Over the first 10% of the note, ramp up to 100% volume
    node.gain.linearRampToValueAtTime(1, start + length * 0.1);
    // Keep it at 100% volume up until 90% of the note's length
    node.gain.setValueAtTime(1, start + length * 0.9);
    // By 99% of the note's length, ramp down to 0% volume
    node.gain.linearRampToValueAtTime(0, start + length * 0.99);
    o.start(start);
    o.stop(start + length);
}
// Listen for keydown events
canvas.addEventListener('keydown', function(e) {
  if (e.keyCode === A) {
    keys.A = true;
  }
  if (e.keyCode === D) {
    keys.D = true;
  }
  if (e.keyCode === LEFT) {
    keys.LEFT = true;
  }
  if (e.keyCode === RIGHT) {
    keys.RIGHT = true;
  }
});
// Listen for keyup events
canvas.addEventListener('keyup', function(e) {
  if (e.keyCode === A) {
    keys.A = false;
  }
  if (e.keyCode === D) {
    keys.D = false;
  }
  if (e.keyCode === LEFT) {
    keys.LEFT = false;
  }
  if (e.keyCode === RIGHT) {
    keys.RIGHT = false;
  }
});
	
/** 
I want to listen for swipes too... 
**/	
	    
//Listen for mouse move
var mouseX = 0;
var mouseY = 0;
function mouse(e) {
    var pos = getMousePos(canvas, e);
    mouseX = pos.x;
    mouseY = pos.y;
}
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
        y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    };
}
var mouseMovingRight = false;
var mouseMovingLeft = false;	
var gameOn = false;
function showMenu(){
  	gameOn = false;
	wiggleBum.x = canvas.width/2 - wiggleBum.w/2;
        wiggleBum.y = canvas.height/2 - wiggleBum.h*3/4;
  	// Start the game on a click
  	canvas.addEventListener('click', startGame);
  	menu();
}
function menu() {
   resize();
   context.fillStyle = '#F0F8FF';
   context.fillRect(0, 0, canvas.width, canvas.height);
   context.font = '40px Arial';
   context.textAlign = 'center';
   if(coilMember===true){
	context.fillStyle = '#A9A9A9';
        context.fillText('We love coil members!', canvas.width / 2, canvas.height / 6);
   }
   context.fillStyle = '#FFA62F';
   context.fillText('Backside Ball', canvas.width / 2, canvas.height / 4);
   context.fillStyle = '#A9A9A9';
   context.font = '18px Arial';
   context.fillText("Make the gremlin drop his coins! Hit coins to slow ball.",canvas.width / 2, canvas.height / 3)
   context.font = '40px Arial';
   context.fillStyle = '#FFA62F';   
   wiggleBum.update();
   wiggleBum.render();
   context.fillText('Click to Start', canvas.width / 2, canvas.height / 2+ wiggleBum.w/2);
   context.font = '14px Arial';
   context.textAlign = 'center';
   context.fillStyle = '#A9A9A9';
   context.fillText('Left Hand: A / D keys. Right Hand: Left / Right keys', canvas.width/2, (canvas.height / 3) * 2);
   context.fillText('Or Mouse / Tap at base.', canvas.width/2, (canvas.height / 3) * 2.2)
   if (!gameOn){
	window.requestAnimationFrame(menu);
   }
}
// Start the game
function startGame() {	
  gameOn = true;
  wiggleBum.move();
  // Don't accept any more clicks
  canvas.removeEventListener('click', startGame);
    //Add mouse listener
  window.addEventListener('mousemove', mouse, false);
  lives = 1;
  score = 0;
  // Put the ball in place	
  resetBall();
  // Kick off the game loop
  draw();
}
// Show the end game screen
function endGame() {
  gameOn = false;
  wiggleBum.x = canvas.width/2 - wiggleBum.w/2;
  wiggleBum.y = canvas.height/2 - wiggleBum.h*3/4;
  emptyCoins();
  canvas.addEventListener('click', startGame);
  restartMenu();
}
function restartMenu(){
  resize();
  context.fillStyle = '#F0F8FF';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.textAlign = 'center';
  if(coilMember===true){
	context.fillStyle = '#A9A9A9';
        context.fillText('Coil members are Awesome!', canvas.width / 2, canvas.height / 6);
  }
  if (score>highScore){
	  highScore = score;
	  context.font = '40px Arial';
	  context.fillStyle = '#FFA62F';
	  context.fillText('You beat your high score!', canvas.width/2, canvas.height/3.5);
	  context.font = '24px Arial';
	  context.fillStyle = '#A9A9A9';
          context.fillText('Your new high score is: '+ highScore+'!', canvas.width/2, canvas.height/2+ wiggleBum.w/2);
  }else{
      context.fillStyle = '#FFA62F';
      context.font = '40px Arial';
      context.fillText('Your highScore is: '+ highScore, canvas.width/2, canvas.height/3.5);
      context.fillStyle = '#A9A9A9';
      context.font = '24px Arial';
      context.fillText('Not bad, you scored: '+score, canvas.width/2, canvas.height/2+ wiggleBum.w/2);
  }
  wiggleBum.update();
  wiggleBum.render();
  context.fillStyle = '#FFA62F';
  context.fillText('Think you can do better? CLICK TO PLAY AGAIN!',canvas.width/2, (canvas.height / 3) * 2);
   
   if (!gameOn){
	window.requestAnimationFrame(restartMenu);
   }
}
function emptyCoins(){
	for (i = 0; i < coins.length; i += 1){
		destroyCoin(coins[i]);
  	}
}
// Clear the canvas
function erase() {
  context.fillStyle = '#FFFFFF';
  context.fillRect(0, 0, canvas.width, canvas.height);
}
// Main draw loop
function draw() {
  resize();
  erase();
  if (keys.A) {
    leftPaddle.x -= leftPaddle.s;
  }
  if (keys.D) {
    leftPaddle.x += leftPaddle.s;
  }
  // Moving the paddles. 
  if (keys.LEFT) {
    rightPaddle.x -= rightPaddle.s;
  }
  if (keys.RIGHT) {
    rightPaddle.x += rightPaddle.s;
  }  
	
   /** Good idea to move paddles when > 1/2 paddle **/
  // move the paddles with mouse simplified controls
  if (mouseY>rightPaddle.y-(rightPaddle.h*2)){
      if (mouseX>rightPaddle.x+(leftPaddle.w/2)){
          rightPaddle.x += rightPaddle.s;
	  mouseMovingRight = true;    
      }
      else{
	  mouseMovingRight = false;
      }
      if (mouseX<leftPaddle.x+(leftPaddle.w/2)){
          leftPaddle.x -= leftPaddle.s;
	  mouseMovingLeft = true;
      }else{
	  mouseMovingLeft = false;
      }
  }else{
	  mouseMovingRight = false;
	  mouseMovingLeft = false;
  }
  // Code for only updating ball when not mooning.
  if(!toMoon){	
  	// Move the ball
  	ball.x += ball.sX;
  	ball.y += ball.sY;
  }
  
  // Bounce the ball off the top/left/right
  if (ball.y < (wallThickness*1.5)-midWall) {
    ball.sY *= -1;
    ballNoise();
  }else if(ball.x < midWall || ball.x + ball.r > canvas.width-midWall){
      ball.sX *= -1;
      ballNoise();
  }
  // Dont let the paddles overlap - If I want to only use left and right only this needs to be changed.
  if (Math.abs(leftPaddle.x-rightPaddle.x)<leftPaddle.w){
      if(keys.D||rightPaddle.x===midWall||mouseMovingRight){
          rightPaddle.x = leftPaddle.x+leftPaddle.w;
      }else{
          leftPaddle.x = rightPaddle.x-leftPaddle.w;
          }
  }
  if (Math.abs(leftPaddle.x-rightPaddle.x)>armLength){
      if(keys.A||mouseMovingLeft){
          rightPaddle.x = leftPaddle.x+armLength;
      }else{
          leftPaddle.x = rightPaddle.x-armLength;
      }
  }
  // Don't let the paddles go off screen
  [leftPaddle, rightPaddle].forEach(function(paddle) {
    if (paddle.x < midWall) {
      paddle.x = midWall;
    }
    if (paddle.x + paddle.w > canvas.width-midWall) {
      paddle.x = canvas.width - paddle.w-midWall;
    }
  });
  // Bounce the ball off the paddles
  if (ball.x + ball.r/2 >= leftPaddle.x && ball.x + ball.r/2 <= leftPaddle.x + leftPaddle.w) {
    if (ball.y + ball.r >= leftPaddle.y) {
      bounceBall();
    }
  }
  if (ball.x + ball.r/2 >= rightPaddle.x && ball.x + ball.r/2 <= rightPaddle.x + rightPaddle.w) {
    if (ball.y + ball.r >= rightPaddle.y) {
      bounceBall();
    }
  }
  // Lose life if the ball goes past a paddle
  if (ball.y + ball.r > rightPaddle.y + rightPaddle.h) {
    lives--;
    resetBall();
    ball.sY *= -1;
  }
  // Check if ball is touching sprite
  if(wiggleBum.isTouching(ball.x,ball.y)){
	  score += 100;
	  gremlinCurse();
	  //resetBall();
	  toMoon = true;
	  blueMoon.x = wiggleBum.x;
	  blueMoon.y = wiggleBum.y;
	  wiggleBum.move();
  };
	
  // Draw the paddles and ball
  floor.draw();
  if(toMoon){
	  if(!blueMoon.completeLoop){
		  blueMoon.render();
		  blueMoon.update();
	  }else{
	       blueMoon.completeLoop=false;
	       toMoon =false;
	       // gremlin drops a coin after restarting ball.
	       spawnCoin();
	  }
  }else{
       //Only show if not mooning you  
       wiggleBum.update();
       wiggleBum.render();
       ball.draw();
  }
  
  /** Add stuff to show coins here**/
  var i;
  for (i = 0; i < coins.length; i += 1){
		  if(coins[i].isTouching(ball.x,ball.y)){
		  	destroyCoin(coins[i]);
			coinNoise();
			slowBall()
			score += 50;
		  }else if(wiggleBum.isTouching(coins[i].x,coins[i].y)){
		  	destroyCoin(coins[i]);
			coinNoise();
			score-=25;
		  }else{
		  	// If the ball didn't hit it and the gremlin didn't pick it back up.
		  	coins[i].update();
		  	coins[i].render();
		  }
  } 
	  
  leftPaddle.draw();
  rightPaddle.draw();
  
  // Draw the scores
  context.fillStyle = '#000000';
  context.font = '24px Arial';
  context.textAlign = 'right';
  context.fillText('Score: ' + score, canvas.width - 20, 24);
  // End the game or keep going
  if (lives <= 0) {
  	endGame();
  } else {
  	window.requestAnimationFrame(draw);
  }
}
//End of draw loop

function resize() {
  var width = document.documentElement.clientWidth;
  var height = document.documentElement.clientHeight;
  if (canvas.width != width ||
      canvas.height != height) {
     canvas.width = width;
     canvas.height = height;
     // Re-create the ball and paddles
    ballLength = 0.008*canvas.width;
    ball = makeCircle(0, 0, ballLength, ballSpeed, '#FFA62F');
    paddleWidth = 0.1*canvas.width;
    paddleHeight = 0.020*canvas.width;
    leftPaddle = makeRect(25, canvas.height-paddleHeight-25, paddleWidth, paddleHeight, 5, '#eebb99');
    rightPaddle = makeRect(canvas.width - paddleWidth - 25, canvas.height-paddleHeight-25, paddleWidth, paddleHeight, 5, '#eebb99');
    armLength = canvas.width*0.2; 
    wallThickness = canvas.height*0.2;
    floor = makeRect(wallThickness,wallThickness*1.5,canvas.width-(2*wallThickness),canvas.height-wallThickness,0, '#F0F8FF');
    midWall = canvas.height*0.1;
    wiggleBum.scaleRatio = (canvas.width/900)*.95;
    blueMoon.scaleRatio = (canvas.width/900)*.95;
    wiggleBum.resize();
    if(!gameOn){
     	wiggleBum.x = canvas.width/2 - wiggleBum.w/2;
        wiggleBum.y = canvas.height/2 - wiggleBum.h*3/4;
     }
    blueMoon.resize();
    for (var i = 0; i < coins.length; i += 1){
	   coins[i].scaleRatio = (canvas.width/900)*.35;
	   coins[i].resize();
    }
    resetBall();	  
  }
}
function sprite (options) {
	
		var that = {},
			frameIndex = 0,
			tickCount = 0,
			ticksPerFrame = options.ticksPerFrame || 0,
			numberOfFrames = options.numberOfFrames || 1;
		
		that.context = options.context;
		that.width = options.width;
		that.height = options.height;
		that.x = 0;
		that.y = canvas.height/5;
		that.image = options.image;
	        that.scaleRatio = (canvas.width/900)*0.95;
	        that.w = that.width / numberOfFrames * that.scaleRatio;
	        that.h = that.height * that.scaleRatio;
	        that.completeLoop = false;
		
		
		that.update = function () {
            tickCount += 1;
            if (tickCount > ticksPerFrame) {
				tickCount = 0;
				
                // If the current frame index is in range
                if (frameIndex < numberOfFrames - 1) {	
                    // Go to the next frame
                    frameIndex += 1;
                } else {
                    frameIndex = 0;
		    that.completeLoop = true;
                }
            }
        };
		
		that.render = function () {
		  // Draw the animation
		  that.context.drawImage(
		    that.image,
		    frameIndex * that.width / numberOfFrames,
		    0,
		    that.width / numberOfFrames,
		    that.height,
		    that.x,
		    that.y,
		    that.width / numberOfFrames * that.scaleRatio,
		    that.height * that.scaleRatio);
		};
		
		that.getFrameWidth = function () {
			return that.width / numberOfFrames;
		};
	        that.move = function (){
			that.x = Math.random() * (canvas.width - that.getFrameWidth() * that.scaleRatio);
			if(that.x < wallThickness){
				that.x += wallThickness;			
			}
			//I think there's something wrong with this test
			if (that.x > (canvas.width-(canvas.height*0.2)-that.w)){
				that.x = (canvas.width-(canvas.height*0.2)-that.w);
			}
			
		        that.y = (canvas.height/5) + Math.random()*(canvas.height/2) ;
		};
		that.resize = function(){
                        that.y = canvas.height/5;
			that.w = that.width / numberOfFrames * that.scaleRatio;
			that.h = that.height * that.scaleRatio;
			that.move();
		};
	        // should overload to allow another sprite to be passed in as argument
	        that.isTouching = function(x,y){
			var dx = (that.x + that.getFrameWidth() / 2 * that.scaleRatio) - x,
			dy = (that.y + that.getFrameWidth() / 2 * that.scaleRatio) - y;
			
		        var dist = Math.sqrt(dx * dx + dy * dy);
			
			if (dist < that.getFrameWidth() / 2 * that.scaleRatio) {
				// do any other changes reduce ball speed & add points
				return true;
			}
			return false;
		}		
		return that;
	}
/**
Coins - plan to have a new coin spawn every time you hit the wiggleBum, then disapear when hit by the ball. Worth 50pts.
**/
var coins = [];
var i;
function spawnCoin () {
	
		var coinIndex,
		coinImg;
	
		// Create sprite sheet
		coinImg = new Image();	
	
		coinIndex = coins.length;
		
		// Create sprite
		coins[coinIndex] = sprite({
			context: canvas.getContext("2d"),
			width: 1000,
			height: 100,
			image: coinImg,
			numberOfFrames: 10,
			ticksPerFrame: 4
		});
		
		coins[coinIndex].x = blueMoon.x;
		coins[coinIndex].y = blueMoon.y+((blueMoon.height * blueMoon.scaleRatio)/2);
		
		coins[coinIndex].scaleRatio = (canvas.width/900)*.35;
		
		// Load sprite sheet
		coinImg.src = "images/coin-sprite-animation.png";
	}
function destroyCoin (coin) {
	
	var i;
		
	for (i = 0; i < coins.length; i += 1) {
		if (coins[i] === coin) {
			coins[i] = null;
			coins.splice(i, 1);
			break;
		}
	}
}	
/**
End of section of coins 
**/
	
// keep track of if you're mooning the player
var toMoon = false;
// Create sprite sheet
wiggleBumImage = new Image();
blueMoonImage = new Image();
	
// Create sprites
wiggleBum = sprite({
	context: canvas.getContext("2d"),
	width: 600,
	height: 100,
	image: wiggleBumImage,
	numberOfFrames: 6,
	ticksPerFrame: 4,
});
blueMoon = sprite({
	context: canvas.getContext("2d"),
	width: 900,
	height: 100,
	image: blueMoonImage,
	numberOfFrames: 9,
	ticksPerFrame: 4,
});
// sound
var ctx = new AudioContext();
var gainNode = ctx.createGain();
gainNode.connect(ctx.destination);

var coilMember = false;
if(document.monetization && document.monetization.state === 'started') {
   coilMember = true;	
}
// Start game
wiggleBumImage.addEventListener("load", showMenu());
blueMoonImage.src ="images/blueMoon.png";
wiggleBumImage.src ="images/blueWiggle.png";	
canvas.focus();
