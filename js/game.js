// Get canvas and set width & height
const canvas = document.querySelector('canvas');
const world = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;
const maxWidth = 1024;
const offsetX = (canvas.width >= maxWidth)? (canvas.width-maxWidth)/2 : 0;
const scale = (canvas.width >= maxWidth)? 1.5 : 1;
console.log(`Created World`);

// Set y position for ground
const groundY = canvas.height - 30*scale;

// Player class
class Player{
    constructor(x, y, r, color, glowColor, hitColor, v, isGrounded){
        this.x = x;
        this.y = y;
        this.r = r;
        this.color = color;
        this.glowColor = glowColor;
        this.glowMin = 1.2;
        this.glowMax = 1.4;
        this.isGrowing = true;
        this.glow = this.glowMin; // multiplier
        this.v = v;
        this.isGrounded = isGrounded;

        this.normalColor = color;
        this.hitColor = hitColor;
        console.log("Created player");
    }

    draw(){
        world.beginPath();
        // glowing effect
        if (this.glow <= this.glowMin){
            this.glow = this.glowMin;
            this.isGrowing = true;
        }
        if (this.glow >= this.glowMax){
            this.glow = this.glowMax;
            this.isGrowing = false;
        }
        this.glow = (this.isGrowing)? this.glow + 0.005 : this.glow - 0.005;
        world.arc(this.x, this.y, this.r * this.glow, 0, 2*Math.PI, false);
        world.fillStyle = this.glowColor;
        world.fill();

        // ball
        world.beginPath();
        world.arc(this.x, this.y, this.r, 0, 2*Math.PI, false);
        world.fillStyle = this.color;
        world.fill();
    }

    hit() {
        this.color = this.hitColor;
        setTimeout(() => {
            this.color = this.normalColor;
        }, 250);
    }

    update(){
        this.draw();
        this.x = this.x + this.v.x;
        this.y = (this.isGrounded)? groundY : this.y + this.v.y;
        
        // If player hits the top, reset player's y-velocity
        if (this.y <= 0 + this.r){
            this.y = this.r;
            this.v.y = 0;
        }

        // If player is not grounded but already hits the ground, set grounded
        if (!this.isGrounded && this.y >= groundY){
            this.isGrounded = true;
            console.log("grounded");
        }

        // If player is not grounded (in the air), add gravity (1) to y-axis
        this.v.y = (this.isGrounded)? 0 : this.v.y + 1;
    }
}
// Define boundaries limiting player's x and y position
const leftBound = 50 + offsetX;
const rightBound = canvas.width - 50 - offsetX;

// Define x, y, radius and velocity for creating player 
const px = canvas.width/2;
const py = groundY;
const pr = 20*scale;
const pv = {x: 3*scale, y: 0};
const pJump = -20*scale;
const pColor = 'rgba(114, 137, 218, 1)';
const pGlowColor = 'rgba(255, 255, 255, 1)';
const player = new Player(px, py - pr, pr, pColor, pGlowColor, 'white', pv, true);
player.draw();
console.log(player);

// Coin class
class Coin {
    constructor(x, y, r, color, glowColor){
        this.x = x;
        this.y = y;
        this.r = r;
        this.glowColor = glowColor;
        this.glowMin = 1.2;
        this.glowMax = 1.4;
        this.glow = this.glowMin;
        this.isGrowing = true;
        this.color = color;
    }

    draw(){
        world.beginPath();
        // glowing effect
        if (this.glow <= this.glowMin){
            this.glow = this.glowMin;
            this.isGrowing = true;
        }
        if (this.glow >= this.glowMax){
            this.glow = this.glowMax;
            this.isGrowing = false;
        }
        this.glow = (this.isGrowing)? this.glow + 0.005 : this.glow - 0.005;
        world.arc(this.x, this.y, this.r * this.glow, 0, 2*Math.PI, false);
        world.fillStyle = this.glowColor;
        world.fill();

        world.beginPath();
        world.arc(this.x, this.y, this.r, 0, 2*Math.PI, false);
        world.fillStyle = this.color;
        world.fill();
    }

    update(){
        this.draw();
    }
}

// Define radius, color, spawn time interval and maximum number for coins
const coins = [];
const maxNumCoins = 5;
const spawnInterval = 2000;
const coinR = 10*scale;
const coinColor = 'rgba(153, 170, 181, 1)';
const coinGlowColor = 'rgba(255, 255, 255, 1)';
// Spawn function that spawns coins with given values at random x and y
function spawnCoin(){
    setInterval(() => {
        const w = (canvas.width <= maxWidth)? canvas.width : maxWidth;  
        const randR = coinR + Math.round(Math.random() * 5);
        const randX = Math.round(Math.random() * (w - 2*randR) + randR + offsetX);
        const randY = Math.round(Math.random() * (canvas.height/2) + randR);
        let newCoin = new Coin(randX, randY, randR, coinColor, coinGlowColor);
        if (coins.length >= maxNumCoins){
            coins.shift();
        }
        coins.push(newCoin);
        newCoin.draw();
        console.log(`spawned coin at (${randX}, ${randY})`);
    }, spawnInterval);
}


// Update: Run the game 
function run(){
    requestAnimationFrame(run);
    world.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update and render coins and player
    player.update();
    for (let coin of coins){
        coin.update();
    }
    
    // Update player horizontal move speed, change x direction if hit boundaries
    if (player.x < leftBound || player.x > rightBound){
        player.v.x = -player.v.x;
    }

    // Check collisions between coins and player
    coins.forEach((coin, index)=>{
        const dist = Math.hypot(coin.x - player.x, coin.y - player.y);
        if (dist - coinR - pr < 1){
            coins.splice(index, 1);
            player.hit();
        }
    });
}

// Event listener: Player jumps when detecting mousedown
window.addEventListener('mousedown', (event)=>{
    console.log("jump");
    player.isGrounded = false;
    player.v.y = pJump;
});

// Event listener: Once the page is loaded,  run the game and spawn coins
window.addEventListener('DOMContentLoaded', (event)=>{
    spawnCoin();
    run();
});
