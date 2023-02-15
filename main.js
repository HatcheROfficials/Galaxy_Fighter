var canvas = document.getElementById("playground");
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

if (!canvas.getContext) {
  console.log("Not able to play media");
}

var ctx = canvas.getContext("2d");

// Defining Shape Class
class shape {
  x;
  y;
  velX;
  velY;

  constructor(x, y, velX, velY) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
  }
}


// Defining Evil Circle Class
class evilBall extends shape {
  radius;
  color;

  constructor(x, y, velX, velY, radius, color) {
    super(x, y, velX, velY);
    this.radius = radius;
    this.color = color;

    window.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "ArrowLeft":
          this.x -= velX;
          break;
        case "ArrowRight":
          this.x += velX;
          break;
        case "ArrowUp":
          this.y -= velY;
          break;
        case "ArrowDown":
          this.y += velY;
      }
    });
  }

  draw() {
    ctx.beginPath();

    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.lineWidth = 1;
    ctx.strokeStyle = this.color;
    ctx.stroke();
  }
  
  checkBounds(){
    if (this.x >= width - this.radius) {
      this.x = width - this.radius;
    }
    if (this.x < this.radius) {
      this.x = this.radius;
    }
    if (this.y >= height - this.radius) {
      this.y = height - this.radius;
    }
    if (this.y < this.radius) {
      this.y = this.radius;
    }
  }

  collosion() {
    for(var b of balls){
      var dx = this.x - b.x;
      var dy = this.y - b.y;
      var dist = Math.sqrt(dx*dx + dy*dy);

      if(dist < this.radius + b.radius){
        b.exist = 0;
        b.color = "red";
        console.log("capture");
      }
    }
  }
}

// initializing evil circle
var evil = new evilBall(50,50,10,10,20,"white");

// defining balls
class ball extends shape{
  radius;
  color;
  exist;

  constructor(x, y, velX, velY, radius, color) {
    super(x, y, velX, velY);
    this.radius = radius;
    this.color = color;
    this.exist = 1;
  }

  draw() {
    ctx.beginPath();

    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update() {
    this.x += this.velX;
    this.y += this.velY;

    if (this.x >= width - this.radius || this.x < this.radius) {
      this.velX = -this.velX;
    }
    if (this.y >= height - this.radius || this.y < this.radius) {
      this.velY = -this.velY;
    }
  }

  collosion() {
    for (var b of balls) {
      if (this.exist && this !== b && b.exist) {
        const dx = this.x - b.x;
        const dy = this.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.radius + b.radius) {
          // b.color = this.color = randomCol();
          b.velX = this.velX + b.velX;
          this.velX = b.velX - this.velX;
          b.velX = b.velX - this.velX;

          b.velY = this.velY + b.velY;
          this.velY = b.velY - this.velY;
          b.velY = b.velY - this.velY;
        }
      }
    }
  }
}

// function return random number between num1 and num2
function random(num1, num2) {
  return Math.floor(Math.random() * (num2 - num1 + 1) + num1);
}
// function returns a random color
function randomCol() {
  return "rgb(" + random(0, 255) + "," + random(0, 255) + "," + random(0, 255) + ")";
}

// declaring balls
var balls = new Array(); // array containing each ball object
var numBalls = 15; // number of balls
var minVel = -2;
var maxVel = 2;
var minRadius = 10;
var maxRadius = 20;

// initializing balls
for (let i = 0; i < numBalls; i++) {
  var x = random(maxRadius, width - maxRadius);
  var y = random(maxRadius, height - maxRadius);

  var velX = random(minVel, maxVel);
  var velY = random(minVel, maxVel);

  var radius = random(minRadius, maxRadius);
  var color = randomCol();

  var newBall = new ball(x, y, velX, velY, radius, color);
  balls.push(newBall);
}

// update the position of each ball
function loop() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(0, 0, width, height);

  for (var i = 0; i < numBalls; i++) {
    balls[i].update();
    balls[i].draw();
    balls[i].collosion();
  }
  evil.draw();
  evil.checkBounds();
  evil.collosion();
  requestAnimationFrame(loop);
}


loop();




