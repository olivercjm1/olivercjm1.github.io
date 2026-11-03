let player;
let obstacles = [];
let collectibles = [];
let particles = [];

let bg, r, g, b;
let gameState = 'start';
let spacePressed = false;
let score = 0;
let maxParticles = 30;
let soundPlaying = false;
let vol = 0.5;
let die = 0;
let pos = 0;
let finishLineX = 500;
let collectibleCount = 0;
let maxCollectibles = 3;
let lastCollectibleX = -1000; 
let displayedScore = 0;
let speed = 1600;
let marker;


function preload() {
    gif = loadImage("pic/pix.gif");
    mbg = loadImage("pic/mbg.png");
    mbg1 = loadImage("pic/mbg1.png");
    bat = loadImage("pic/bat.gif");
    fre = loadImage("pic/frieren.gif");
    ryo = loadImage("pic/ryo.gif");
    grave = loadImage("pic/grave.gif");
    coffee = loadImage("pic/coffee.gif");
    coin = loadImage("pic/coin.gif");
    star1 = loadImage("pic/star.gif");
    star2 = loadImage("pic/starg.gif");
    fl = loadImage("pic/fl.png");
    huh = loadImage("pic/huh.gif");
    sound = loadSound('sound/sad.mp3');
    sound2 = loadSound('sound/marioplant.mp3');
    sound3 = loadSound('sound/fm.mp3');
    mario = loadFont('Font/mario.ttf');
}

function setup() {
    let canvas = createCanvas(1200, 600);
    canvas.position(window.innerWidth / 2 - 600, window.innerHeight / 2 - 300);
    player = new Player();
    bg = new Background();
    r = random(100, 255);
    g = random(100, 255);
    b = random(100, 255);
    marker = new Marker(); 
    frameRate(60);
}

function draw() {
    background(0);

    if (gameState === 'start') {
        showStartScreen();
    } else if (gameState === 'levelSelect') {
        showLevelSelectScreen();
    } else if (gameState === 'playing') {
        pos++;
        console.log(pos);
        sound3.stop();
        soundPlaying = false;
        bg.update();
        bg.show();

        if (spacePressed) {
            player.up();
            if (particles.length < maxParticles) {
                particles.push(new Particle(player.x + player.size / 2, player.y + player.size));
            }
        }
        marker.show(pos, speed);
        player.update();
        player.show();

        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            particles[i].show();
            if (particles[i].isFinished()) {
                particles.splice(i, 1);
            }
        }

        if (frameCount % 60 === 0) {
            obstacles.push(new Obstacle());
        }

        for (let i = obstacles.length - 1; i >= 0; i--) {
            obstacles[i].update();
            obstacles[i].show();
            if (obstacles[i].hits(player)) {
                gameOver();
                if (gameState === 'playinge') {
                    die += 1;
                }
            }
            if (obstacles[i].x + obstacles[i].width < 0) {
                obstacles.splice(i, 1);
            }
        }

        if (frameCount % 100 === 0 && pos < 2000) {
            collectibles.push(new Collectible());
        }

        for (let i = collectibles.length - 1; i >= 0; i--) {
            collectibles[i].update();
            collectibles[i].show();
            if (collectibles[i].hits(player)) {
                collectibles.splice(i, 1);
                score += 100;
            }
            if (collectibles[i].x + collectibles[i].size < 0) {
                collectibles.splice(i, 1);
            }
        }

        if (pos >= 2000) {
            levelComplete();
        }


        if (score >= finishLineX) {
            levelComplete();
        }

        fill(255);
        textSize(32);
        textAlign(RIGHT);
        text(`Score: ${score}`, width - 20, 30);
        text(`Route: ${pos} m`, width - 20, 80);
        fill(255);
        stroke(0);
        strokeWeight(3);
        textSize(20);
        fill(0);
        stroke(255);
        text(`Target: Score ${finishLineX} within 2000 m to win`, width / 2 + 100, 30);
        stroke(0);
    }
    else if (gameState === 'playinge') {
        sound3.stop();
        soundPlaying = false;
        bg.update();
        bg.show();

        if (spacePressed) {
            player.up();
            if (particles.length < maxParticles) {
                particles.push(new Particle(player.x + player.size / 2, player.y + player.size));
            }
        }

        player.update();
        player.show();

        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            particles[i].show();
            if (particles[i].isFinished()) {
                particles.splice(i, 1);
            }
        }

        if (frameCount % 60 === 0) {
            obstacles.push(new Obstacle());
        }

        for (let i = obstacles.length - 1; i >= 0; i--) {
            obstacles[i].update();
            obstacles[i].show();
            if (obstacles[i].hits(player)) {
                gameOver();
                die +=1;
            }
            if (obstacles[i].x + obstacles[i].width < 0) {
                obstacles.splice(i, 1);
            }
        }

        if (frameCount % 100 === 0) {
            collectibles.push(new Collectible());
        }

        for (let i = collectibles.length - 1; i >= 0; i--) {
            collectibles[i].update();
            collectibles[i].show();
            if (collectibles[i].hits(player)) {
                collectibles.splice(i, 1);
                score += 100;
            }
            if (collectibles[i].x + collectibles[i].size < 0) {
                collectibles.splice(i, 1);
            }
        }

        fill(255);
        textSize(32);
        textAlign(RIGHT);
        text(`Score: ${score}`, width - 20, 30);
        fill(255);
        stroke(0);
        strokeWeight(3);
        text(`Attempt: ${die}`, 250, 30);
    }
     else if (gameState === 'gameOver') {
        showGameOverScreen();
    } else if (gameState === 'paused'||gameState === 'pausede') {
        showPausedScreen();
    } else if (gameState === 'levelComplete') {
        showLevelCompleteScreen();
    }
}

function levelComplete() {
    pos = 0;
    gameState = 'levelComplete';
    sound2.stop();
    soundPlaying = false;
    if (!soundPlaying) {
        sound3.loop();
        sound3.setVolume(vol);
        soundPlaying = true;
    }
}

function showStartScreen() {
    sound.stop();
    sound2.stop();
    sound3.stop();
    soundPlaying = false;
    bg.update();
    bg.show();
    player.show();
    r = random(100, 255);
    g = random(100, 255);
    b = random(100, 255);
    let textColor = color(r,g,b);
    stroke(textColor);
    strokeWeight(3);
    textSize(82);
    textAlign(CENTER);
    textFont(mario);

    fill(0);
    beginShape();
    vertex(290,280);
    vertex(1200,280);
    vertex(1150,100);
    vertex(230,100);
    endShape(CLOSE);

    fill(255);
    beginShape();
    vertex(305,260);
    vertex(1200,260);
    vertex(1150,80);
    vertex(240,80);
    endShape(CLOSE);

    fill(0);
    text(' Stickjet \n', width / 2 - 90, height / 2 - 140);
    textColor = color(r,g,b);
    text('Challenge', width / 2 +320, height / 2 - 50);
    textSize(32);
    fill(0);
    text(' BY OLIVER ', width / 2 +400, height / 2 - 140);
    text('Press S to Start', width / 2, height- 80);
    text('Press E for ENDLESS', width / 2, height - 120);
}

function showLevelSelectScreen() {
    soundPlaying = false;
    sound.stop();
    sound2.stop();
    sound3.stop();
    fill(0);
    r = random(100, 255);
    g = random(100, 255);
    b = random(100, 255);
    let textColor = color(r,g,b);
    stroke(textColor);
    strokeWeight(3);
    textSize(64);
    textAlign(CENTER);
    textFont(mario);
    text('Select Level', width / 2, height / 2 - 50);
    textSize(32);
    stroke(255);
    text('Press 1 for Level 1', width / 2, height / 2);
    text('Press 2 for Level 2', width / 2, height / 2 + 40);
    text('Press 3 for Level 3', width / 2, height / 2 + 80);
}

function showGameOverScreen() {

    pos = 0;
    fill(255);
    textSize(80);
    textAlign(CENTER);
    text('Game Over', width / 2, height / 2 - 50);
    image(grave, width/2-150, height/2, 300, 300);
    textSize(32);

    if (displayedScore < score) {
        displayedScore ++;
        if (displayedScore > score) {
            displayedScore = score;
        }
        requestAnimationFrame(showGameOverScreen);
    }

    text(`Score: ${displayedScore}`, width / 2, height / 2 + 20);
    text(`Press R or Click to Retry`, width / 2, height / 2 + 60);

    if (!soundPlaying) {
        sound.play();
        soundPlaying = true;
    }
}

function showPausedScreen() {
    fill(255);
    textSize(64);
    textAlign(CENTER);
    text('Paused', width / 2, height / 2 - 50);
    textSize(32);
    text('Press S to Resume', width / 2, height / 2);
    image(coffee,width/2-110, height/2 +10);
}

function showLevelCompleteScreen() {
    fill(255);
    textSize(64);
    textAlign(CENTER);
    if (score <= 0)
        {
            image(star2, width/2-180,height/2-200,100,100);
            image(star2, width/2-60,height/2-250,150,150);
            image(star2, width/2+110,height/2-200,100,100);
            textSize(16);
            text("HOW YOU GET NO SCORE???",width/2,40);
            image(huh,10,10,200,300);
        }
    else if (score > 0 &&score <= finishLineX/3)
        {
            image(star1, width/2-180,height/2-200,100,100);
            image(star2, width/2-60,height/2-250,150,150);
            image(star2, width/2+110,height/2-200,100,100);
        }
    else if (score > finishLineX/3 && score <= finishLineX -100)
        {
            image(star1, width/2-180,height/2-200,100,100);
            image(star1, width/2-60,height/2-250,150,150);
            image(star2, width/2+110,height/2-200,100,100);
        }
    else if(score >= finishLineX)
        {
            image(star1, width/2-180,height/2-200,100,100);
            image(star1, width/2-60,height/2-250,150,150);
            image(star1, width/2+110,height/2-200,100,100);
        }
    textSize(32);
    text('Level Complete!', width / 2, height / 2);
    if (displayedScore < score) {
        displayedScore ++;
        if (displayedScore > score) {
            displayedScore = score;
        }
        requestAnimationFrame(showLevelCompleteScreen);
    }

    text(`Score: ${displayedScore}`, width / 2, height / 2 + 40);
    text('Press R or Click to Play Again', width / 2, height / 2 + 80);
    image(gif, width / 2 - 100, height-200, 180, 200);
}

function startGame() {
    displayedScore = 0;
    gameState = 'playing';
    soundPlaying = false;
    if (!soundPlaying) {
        sound2.loop();
        sound2.setVolume(vol);
        soundPlaying = true;
    }
}

function startGame2() {
    displayedScore = 0;
    gameState = 'playinge';
    soundPlaying = false;
    if (!soundPlaying) {
        sound2.loop();
        sound2.setVolume(vol);
        soundPlaying = true;
    }
}

function pauseGame() {
    sound2.pause();
    soundPlaying = false;
    if (gameState === 'playing') 
        {
        gameState = 'paused';
    } else if (gameState === 'paused') {
        gameState = 'playing';
    }
    if (gameState === 'playinge')
        {
            gameState = 'pausede';
        }
    else if (gameState === 'pausede') {
        gameState = 'playinge';
    }
}

function retryGame() {
    gameState = 'start';
    obstacles = [];
    collectibles = [];
    particles = [];
    player = new Player();
    score = 0;
    sound.stop();
    soundPlaying = false;
}

function gameOver() {
    sound2.stop();
    soundPlaying = false;
    gameState = 'gameOver';
}

class Marker {
    constructor() {
        this.width = 300;
        this.height = 800;
        this.offsetY = -150;
    }

    show(pos, speed) {
        if (pos >= 1200) {
            fill(0);
            let markerX = 3000-pos + width / 2;
            markerX -= speed;
            image(fl,markerX, this.offsetY, this.width, this.height);
        }
    }
}


class Player {
    constructor() {
        this.x = 100;
        this.y = height / 2;
        this.size = 150;
        this.ySpeed = 0;
        this.gravity = 0.3;
        this.lift = -6;
    }

    update() {
        this.ySpeed += this.gravity;
        this.y += this.ySpeed;

        if (this.y > height - this.size) {
            this.y = height - this.size;
            this.ySpeed = 0;
        } else if (this.y < 0) {
            this.y = 0;
            this.ySpeed = 0;
        }
    }

    show() {
        image(gif, this.x - 50, this.y, this.size-20, this.size);
    }

    up() {
        this.ySpeed = this.lift;
    }
}

function keyPressed() {
    if (key === ' ') {
        spacePressed = true;
    } else if (key === 's' || key === 'S') {
        if (gameState === 'start') {
            gameState = 'levelSelect';
        } 
        else if (gameState === 'paused') {
            startGame();
        }
        else if (gameState === 'pausede') {
            startGame2();
        }
    } 
    else if (key === 'e'|| key === 'E') {
        if (gameState === 'start') {
            startGame2();
        }
    } 
    else if (key === '1') {
        if (gameState === 'levelSelect') {
            startGame();
            finishLineX = 500;
        }
    } else if (key === '2') {
        if (gameState === 'levelSelect') {
            startGame();
            finishLineX = 1000;
        }
    } else if (key === '3') {
        if (gameState === 'levelSelect') {
            startGame();
            finishLineX = 1500;
        }
    } 
    else if (key === 'r' || key === 'R') {
        if (gameState === 'gameOver' || gameState === 'levelComplete') {
            retryGame();
        }
    } else if (key === 'p' || key === 'P') {
        if (gameState === 'playing' || gameState === 'playinge') {
            pauseGame();
        }
    }
    else if (key === 'm'|| key === 'M')
        {
            if (gameState === 'playing' || gameState === 'playinge')
                {
                        sound2.stop();
                        soundPlaying = false;
                }
            if (gameState === 'levelComplete')
                { 
                    sound3.stop();
                }
        }
    else if (key === 'o'|| key === 'O')
        {
            if (gameState === 'playing' || gameState === 'playinge')
                {
                    if(soundPlaying === false){
                        sound2.play();
                        soundPlaying = true;
                    }
                }
            if (gameState === 'levelComplete')
                { 
                    sound3.play();
                }
        }
}

function keyReleased() {
    if (key === ' ') {
        spacePressed = false;
    }
}

function mousePressed() {
    if (mouseButton === LEFT) {
        if (gameState === 'paused') {
            startGame();
        } 
        else if (gameState === 'gameOver' || gameState === 'levelComplete') {
            retryGame();
        } else {
            spacePressed = true;
        }
    }
}

function mouseReleased() {
    if (mouseButton === LEFT) {
        spacePressed = false;
    }
}

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = random(-1, 1);
        this.vy = random(1, 3);
        this.alpha = 255;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= 5;
    }

    show() {
        noStroke();
        r = random(100, 255);
        g = random(100, 255);
        b = random(100, 255);
        push();
        fill(0,0,255, this.alpha);
        rect(this.x-50, this.y, 5, 40);
        fill(255,0,0, this.alpha);
        rect(this.x-30, this.y, 5, 40);
        pop();
    }

    isFinished() {
        return this.alpha < 0;
    }
}

class Obstacle {
    constructor() {
        this.x = width;
        this.y = random(height - 100);
        this.width = random(50, 200);
        this.height = this.width;
        this.speed = 6;
    }

    update() {
        this.x -= this.speed;
    }

    show() {
        tint("red");
        image(bat, this.x, this.y, this.width + 10, this.height + 10);
        noTint();
        image(bat, this.x, this.y, this.width, this.height);
    }

    hits(player) {
        if (player.x + player.size - 100 > this.x && player.x < this.x + this.width - 25) {
            if (player.y + player.size - 75 > this.y && player.y < this.y + this.height - 25) {
                return true;
            }
        }
        return false;
    }
}

class Collectible {
    constructor() {
        this.x = width;
        this.y = random(height - 50);
        this.size = 20;
        this.speed = 6;
        this.ran = random(1) < 0.5 ? 'coinp' : 'rect';
    }
    update() {
        this.x -= this.speed;
    }
    show() {
        fill(0, 255, 0);
        stroke(0);
        strokeWeight(5);
        if (this.ran === 'coinp') {
            image(coin, this.x, this.y, this.size + 100, this.size + 50);
        } else {
            rect(this.x, this.y, this.size, this.size);
        }
    }
    hits(player) {
        let d = dist(this.x, this.y, player.x + player.size / 2, player.y + player.size / 2);
        return d < this.size / 2 + player.size / 2;
    }
}




class Background {
    constructor() {
        this.x1 = 0;
        this.x2 = 1200;
        this.x3 = 1000;
        this.speed = 3;
    }
    update() {
        this.x1 -= this.speed;
        this.x2 -= this.speed;
        this.x3 -= this.speed;

        if (this.x1 <= -width) {
            this.x1 = width;
        }

        if (this.x2 <= -width) {
            this.x2 = width;
        }

        if (this.x3 <= -width) {
            this.x3 = width;
        }
    }
    show() {
        fill(200);
        image(mbg, this.x1 - 1, 0, width - 200, height);
        image(mbg, this.x2 - 1, 0, width, height);
        image(mbg1, this.x3 - 2.3, 0, width - 998, height);
    }
}

