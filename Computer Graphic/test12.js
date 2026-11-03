let posX = 0;
let posY = -100;
let posZ = 0;
let speed = 5;
let jumpSpeed = 0;
let gravity = 0.5;
let isJumping = false;
let groundY = 0;
let x = 0;
let xs = 2;
let movex = false;
let angle = 0;
let angle2 = -6000;
let sa = 5;

function setup() {
  let canvas = createCanvas(window.innerWidth, window.innerHeight, WEBGL);
  canvas.position(0, 0);
  angleMode(DEGREES);
}

function draw() {
    background(0);
  
    directionalLight(255, 0, 0, 1, 1, -1);
    directionalLight(0, 255, 0, -1, 1, -1);
    directionalLight(0, 0, 255, 0, 1, -1);
    pointLight(55,155, 100, -9000, -255, 255);
    pointLight(255,255, 0, -6000, -255, 255);
    pointLight(255,100, 0, -2000, -255, 255);
    pointLight(255,0, 200, -1000, -255, 255);
    pointLight(255,0, 0, 0, -255, 255);
    pointLight(0, 255, 0, 1000, -255, 255);
    pointLight(0, 255, 234, 2000, -255, 255);
    pointLight(0, 0, 255, 3000, -255, 255);
    pointLight(0, 255, 0, 4000, -255, 255);
    pointLight(0, 255, 200, 5000, -255, 255);
    pointLight(0, 255, 100, 7500, -255, 255);
    pointLight(100, 255, 0, 9500, -255, 255);

    updatePosition();
    handleJumping();
    checkCollision();
  
    let cdis = 400;
    let camX = posX + cos(mouseX / width * 360) * cdis;
    let camY = posY - 100 + sin(mouseY / height * 360) * 400;
    let camZ = posZ + sin(mouseX / width * 360) * cdis;
  
    camera(camX, camY, camZ, posX, posY, posZ, 0, 1, 0);
  
    // Draw the box surface
    push();
    translate(0, 0, 0);
    ambientMaterial(255,255,255);
    box(20000, 20, 60000);
    pop();
  
    // Draw the character
    push();
    translate(posX, posY, posZ);
    rotateY(angle);
    kuru();
    pop();

    let sx = random(-sa, sa);
    let sy = random(-sa, sa);

    push();
    translate(angle2 + sx, -150 + sy,0);
    bocchi();
    if(angle2 <= -6000 || angle2 >= -6005)
        {angle2 -= 0.5;};
    angle2 += 0.5;
    pop();
}




function kuru() {
    push();
    // Draw head
    push();
    noStroke();
    fill("#ffefe5");
    translate(0, -40, 0);
    sphere(40); // Head
    pop();
  
    push();
    translate(0, -15, 32);
    fill(0);
    noStroke();
    plane(5,0.4);
    pop();
  
    push();
    noStroke();
    translate(-15, -30, 35);
    fill("#eda9e7");
    cylinder(5,10);
    pop();
  
    push();
    noStroke();
    translate(-15, -32, 35);
    fill("#5b34ad");
    cylinder(5.1,6);
    pop();
  
    push();
    noStroke();
    translate(15, -30, 35);
    fill("#eda9e7");
    cylinder(5,10);
    pop();
  
    push();
    noStroke();
    translate(15, -32, 35);
    fill("#5b34ad");
    cylinder(5.1,6);
    pop();
  
    push();
    noStroke();
    translate(-25, -32, 30);
    fill("#a4909b");
    cone(5,50);
    pop();
  
    push();
    noStroke();
    translate(25, -32, 30);
    fill("#a4909b");
    cone(5,50);
    pop();
  
    push();
    noStroke();
    translate(0, -50, 0);
    fill("#a4909b");
    ellipsoid(40,30,50);
    pop();
  
    push();
    noStroke();
    translate(30, -40, 0);
    fill("#a4909b");
    ellipsoid(10,30,30);
    pop();
  
    push();
    noStroke();
    translate(-30, -40, 0);
    fill("#a4909b");
    ellipsoid(10,30,30);
    pop();
  
    
    push();
    noStroke();
    translate(0, -20, -30);
    fill("#a4909b");
    ellipsoid(40,60,20);
    pop();
  
    // Draw body
    push();
    fill("#f7f7f7");
    translate(0, 30, 0);
    box(50, 60, 30); // Body
    pop();
  
    push();
    noStroke();
    fill("#292435");
    translate(-15, 30, 0);
    rotate(10);
    cylinder(18,60);
    pop();
  
    push();
    noStroke();
    fill("#292435");
    translate(15, 30, 0);
    rotate(-10);
    cylinder(18,60);
    pop();
  
    push();
    translate(-10, 5,0);
    rotate(20);
    stroke(0);
    fill("#ebcf99");
    box(20,2,40);
    pop();
  
    push();
    translate(10, 5,0);
    rotate(-20);
    stroke(0);
    fill("#ebcf99");
    box(20,2,40);
    pop();
  
    push();
    stroke(0);
    rotate(30);
    translate(5,15,15);
    fill("#ebcf99");
    box(10,5,10);
    pop();
  
    push();
    stroke(0);
    rotate(-30);
    translate(-5,15,15);
    fill("#ebcf99");
    box(10,5,10);
    pop();
  
    push();
    rotate(40);
    noStroke();
    translate(20,10,15);
    fill("#5245d5");
    box(10,5,10);
    pop();
  
    push();
    rotate(60);
    noStroke();
    translate(21,6,15);
    fill("#5245d5");
    box(10,5,10);
    pop();
  
    push();
    rotate(90);
    noStroke();
    translate(21,0,15);
    fill("#5245d5");
    box(10,5,10);
    pop();
  
    push();
    rotate(90);
    noStroke();
    translate(25,-5,15);
    fill("#b17ee7");
    box(10,5,10);
    pop();
  
    push();
    rotate(90);
    noStroke();
    translate(35,0,15);
    fill("#b17ee7");
    box(10,5,10);
    pop();
  
    push();
    noStroke();
    translate(-20,35,0);
    rotateX(90);
    rotateY(-45);
    fill("#ebcf99");
    torus(30,2);
    pop();
  
    push();
    noStroke();
    translate(20,35,0);
    rotateX(90);
    rotateY(45);
    fill("#ebcf99");
    torus(30,2);
    pop();
  
  
    // Draw arms
    push();
    fill("#ffefe5");
    translate(-35, 10, 0);
    box(60, 10, 10); // Left arm
    pop();
  
    push();
    fill("#f7f7f7");
    translate(-35, 11, 0);
    box(30, 20, 20);
    pop();
  
    push();
    fill("#292435");
    translate(-35, 11, 0);
    box(24, 22, 22);
    pop();
  
    push();
    fill("#ffefe5");
    translate(35, 10, 0);
    box(60, 10, 10); // Right arm
    pop();
  
    push();
    fill("#f7f7f7");
    translate(35, 11, 0);
    box(30, 20, 20);
    pop();
  
    push();
    fill("#292435");
    translate(35, 11, 0);
    box(24, 22, 22);
    pop();
  
    // Draw legs
    push();
    fill("#ffefe5");
    rotateX(-x);
    translate(-15, 70, 0);
    box(20, 20, 20); // Left leg
    pop();
  
    push();
    fill("#ffefe5");
    rotateX(x);
    translate(15, 70, 0);
    box(20, 20, 20); // Right leg
    pop();
    pop();
  }

  function updatePosition() {
    movex = false;

    if (keyIsDown(87)) { // W key
        movex = true;
        posZ -= speed+2;
        angle = 180;
    }
    if (keyIsDown(83)) { // S key
        movex = true;
        posZ += speed+2;
        angle = 0;
    }
    if (keyIsDown(65)) { // A key
        movex = true;
        posX -= speed+2;
        angle = -90;
    }
    if (keyIsDown(68)) { // D key
        movex = true;
        posX += speed+2;
        angle = 90;
    }

    if (keyIsDown(87)&& keyIsDown(68)) { // W & D key
        movex = true;
        posZ -= speed;
        posX += speed;
        angle = 120;
    }

    if (keyIsDown(83) && keyIsDown(65)) { // S & A key
        movex = true;
        posZ += speed;
        posX -= speed;
        angle = -30;
    }

    if (keyIsDown(87) && keyIsDown(65)) { // W & A key
        movex = true;
        posZ -= speed;
        posX -= speed;
        angle = -120;
    }

    if (keyIsDown(83) && keyIsDown(68)) { // S & D key
        movex = true;
        posZ += speed;
        posX += speed;
        angle = 30;
    }

    move();
}

function move() {
    if (movex) {
        if (x >= 20 || x <= -20) {
            xs = -xs;
        }
        x += xs;
    } else {
        x = 0;
    }
}
  
function handleJumping() {
    if (isJumping) {
        posY -= jumpSpeed;
        jumpSpeed -= gravity;

        if (posY >= groundY-100) {
            posY = groundY -100;
            isJumping = false;
            jumpSpeed = 0;
        }
    } else {
        if (keyIsDown(32)) { 
            isJumping = true;
            jumpSpeed = 15; 
        }
    }
}

function bocchi()
{
  //head
  push();
  translate(0,0,0);
  fill("#ffefe5");
  noStroke();
  sphere(40); 
  pop();
//hair
  push();
  fill("#5992bd");
  translate(-45,-30,20);
  box(10);
  pop();

  push();
  fill("#b49b3e");
  translate(-45,-20,15);
  box(10);
  pop();

  push();
  noStroke();
  fill("#f7a4b9");
  translate(-50,-25,15);
  rotate(60);
  cone(2,40);
  pop();
  
  push();
  noStroke();
  fill("black");
  translate(-50,-25,15);
  rotate(60);
  rotateY(90);
  cone(4,42,2);
  pop();

  push();
  noStroke();
  translate(0,-30,0);
  fill("#f7a4b9");
  ellipsoid(40,20,50);
  pop();
  
  push();
  noStroke();
  translate(0,-30,0);
  fill("black");
  ellipsoid(42,22,2);
  pop();

  push();
  noStroke();
  translate(0,40,-40);
  fill("#f7a4b9");
  ellipsoid(30,70,30);
  pop();
  
  push();
  noStroke();
  translate(0,40,-40);
  fill("black");
  ellipsoid(32,72,2);
  pop();

  push();
  translate(0,-15,40);
  noStroke();
  fill("#f7a4b9");
  cone(5,40,10);
  pop();

  push();
  translate(0,-15,40);
  noStroke();
  rotateY(90);
  fill("black");
  cone(6,40,2);
  pop();

  push();
  translate(-5,-15,40);
  rotateZ(-20);
  noStroke();
  fill("#f7a4b9");
  cone(8,40,10);
  pop();
  
    push();
  translate(-5,-15,40);
  rotateZ(-20);
  rotateY(90);
  noStroke();
  fill("black");
  cone(10,42,2);
  pop();

  push();
  translate(4,-15,40);
  noStroke();
  fill("#f7a4b9");
  cone(5,30,10);
  pop();
  
  push();
  translate(4,-15,40);
  noStroke();
  rotateY(90);
  fill("black");
  cone(7,32,2);
  pop();

  push();
  translate(10,-15,40);
  noStroke();
  fill("#f7a4b9");
  cone(5,30,10);
  pop();
  
  push();
  translate(10,-15,40);
  noStroke();
  rotateY(90);
  fill("black");
  cone(7,32,2);
  pop();

  push();
  translate(15,-15,40);
  noStroke();
  rotateZ(10);
  fill("#f7a4b9");
  cone(5,30,10);
  pop();
  
  push();
  translate(15,-15,40);
  noStroke();
  rotateZ(10);
  rotateY(90);
  fill("black");
  cone(7,32,2);
  pop();
  
  push();
  translate(22,-15,40);
  noStroke();
  rotateZ(-10);
  fill("#f7a4b9");
  cone(5,30,10);
  pop();
  
  push();
  translate(21,-15,40);
  noStroke();
  rotateZ(-13);
  rotateY(90);
  fill("black");
  cone(7,32,2);
  pop();
  
  push();
  translate(30,25,30);
  noStroke();
  fill("#f7a4b9");
  cone(7,120,10);
  pop();
  
  push();
  translate(30,25,30);
  noStroke();
  rotateY(130);
  fill("black");
  cone(9,122,2);
  pop();

  push();
  translate(35,25,20);
  noStroke();
  fill("#f7a4b9");
  cone(10,100,10);
  pop();
  
  push();
  translate(35,25,20);
  noStroke();
  fill("black");
  cone(12,102,2);
  pop();

  push();
  translate(35,25,10);
  noStroke();
  fill("#f7a4b9");
  cone(10,120,10);
  pop();
  
  push();
  translate(36,25,10);
  noStroke();
  rotateY(-30);
  fill("black");
  cone(12,122,2);
  pop();

  push();
  translate(35,25,-5);
  noStroke();
  fill("#f7a4b9");
  cone(10,120,10);
  pop();
  
  push();
  translate(38,25,-5);
  noStroke();
  rotate(5);
  fill("black");
  cone(12,122,2);
  pop();

  push();
  translate(35,25,-10);
  noStroke();
  fill("#f7a4b9");
  cone(10,100,10);
  pop();
  
  push();
  translate(35,15,-10);
  noStroke();
  rotate(5);
  rotateX(5);
  fill("black");
  cone(12,102,2);
  pop();

  push();
  translate(35,25,-20);
  noStroke();
  rotateZ(-10);
  fill("#f7a4b9");
  cone(15,100,10);
  pop();
  
  push();
  translate(35,25,-20);
  noStroke();
  rotateZ(-10);
  fill("black");
  cone(17,102,2);
  pop();

  push();
  translate(-15,-15,40);
  noStroke();
  rotateZ(-10);
  fill("#f7a4b9");
  cone(5,30,10);
  pop();
  
  push();
  translate(-15,-15,40);
  noStroke();
  rotateZ(-10);
  rotateY(90);
  fill("black");
  cone(7,32,2);
  pop();

  push();
  translate(-20,-15,40);
  noStroke();
  fill("#f7a4b9");
  cone(5,35,10);
  pop();
  
  push();
  translate(-20,-15,40);
  noStroke();
  rotateY(90);
  fill("black");
  cone(7,37,2);
  pop();
  
  push();
  translate(-25,-15,35);
  noStroke();
  fill("#f7a4b9");
  cone(8,35,10);
  pop();
  
  push();
  translate(-25,-15,35);
  noStroke();
  rotateY(90);
  fill("black");
  cone(10,37,2);
  pop();

  push();
  translate(-30,25,25);
  noStroke();
  fill("#f7a4b9");
  cone(7,120,10);
  pop();
  
  push();
  translate(-30,25,27);
  noStroke();
  rotateY(60);
  fill("black");
  cone(9,122,2);
  pop();

  push();
  translate(-35,25,15);
  noStroke();
  fill("#f7a4b9");
  cone(10,100,10);
  pop();
  
  push();
  translate(-35,25,15);
  noStroke();
  fill("black");
  cone(12,102,2);
  pop();

  push();
  translate(-35,25,5);
  noStroke();
  fill("#f7a4b9");
  cone(10,120,10);
  pop();
  
  push();
  translate(-38,25,5);
  noStroke();
  rotate(-5);
  fill("black");
  cone(12,122,2);
  pop();

  push();
  translate(-35,25,-10);
  noStroke();
  fill("#f7a4b9");
  cone(10,120,10);
  pop();
  
  push();
  translate(-35,25,-10);
  noStroke();
  fill("black");
  cone(12,122,2);
  pop();

  push();
  translate(-40,25,-20);
  noStroke();
  rotateZ(10);
  fill("#f7a4b9");
  cone(15,120,10);
  pop();
  
  push();
  translate(-40,25,-20);
  noStroke();
  rotateZ(10);
  fill("black");
  cone(17,122,2);
  pop();

  push();
  translate(-26,20,-25);
  noStroke();
  //rotateZ(10);
  fill("#f7a4b9");
  cone(15,120,10);
  pop();
  
  push();
  translate(-26,20,-25);
  noStroke();
  rotateY(90);
  //rotateZ(10);
  fill("black");
  cone(17,122,2);
  pop();

  push();
  translate(26,20,-25);
  noStroke();
  //rotateZ(10);
  fill("#f7a4b9");
  cone(15,120,10);
  pop();
  
  push();
  translate(26,20,-25);
  noStroke();
  rotateY(90);
  //rotateZ(10);
  fill("black");
  cone(17,122,2);
  pop();
  //eye

  push();
  translate(0,0,40);
  fill('#273b70');
  noStroke();
  ellipse(13,2,13,15);
  pop();

  push();
  translate(0,0,40);
  fill('#273b70');
  noStroke();
  ellipse(-13,2,13,15);
  pop();

  push();
  translate(0,3,40.2);
  fill('#85d1df');
  noStroke();
  ellipse(-13,2,11,8);
  pop();

  push();
  translate(0,3,40.2);
  fill('#85d1df');
  noStroke();
  ellipse(13,2,11,8);
  pop();

  push();
  translate(0,0,40.3);
  fill('#111725');
  noStroke();
  ellipse(13,2,5,8);
  pop();

  push();
  translate(0,0,40.3);
  fill('#111725');
  noStroke();
  ellipse(-13,2,5,8);
  pop();


  push();
  translate(0,20,40);
  noStroke();
  fill(0);
  plane(5,0.5);
  pop();

  // body
  push();
  noStroke();
  translate(0,40,0);
  fill("#f7a4b9");
  cone(40,20,10);
  pop();

  push();
  noStroke();
  translate(0,31,0);
  fill("black");
  cylinder(39,1);
  pop();

  push();
  noStroke();
  rotate(30);
  translate(0,40,15);
  fill("black");
  cylinder(10,1);
  pop();

  push();
  noStroke();
  rotate(-30);
  translate(0,40,15);
  fill("black");
  cylinder(10,1);
  pop();
//body
  push();
  translate(0,35,25);
  rotateX(-60);
  fill("white");
  box(5,13,5);
  pop();

  push();
  translate(0,55,15);
  fill("white");
  box(5,85,5);
  pop();

  push();
  translate(-10,37,35);
  rotate(-45)
  fill("white");
  triangle(10,10,10,5,5,5,0,15,15);
  pop();
  
  push();
  translate(0,70,0);
  fill("#f7a4b9");
  box(65,60,30);
  pop();
  
  //hand
  push();
  translate(-40,70,0);
  noStroke();
  fill("#f7a4b9");
  cylinder(5,60);
  pop();
  
  push();
  translate(-40,70,0);
  noStroke();
  rotateY(90);
  fill("black");
  cylinder(7,62,2);
  pop();
  
  push();
  noStroke();
  translate(-42,70,3);
  fill("white");
  rotateY(-15);
  box(4,58,4);
  pop();
  
  push();
  translate(-40,102,0);
  noStroke();
  fill("#ffefe5");
  sphere(5);
  pop();
  
  //left
  push();
  translate(40,70,0);
  noStroke();
  fill("#f7a4b9");
  cylinder(5,60);
  pop();
  
  push();
  translate(40,70,0);
  noStroke();
  rotateY(90);
  fill("black");
  cylinder(7,62,2);
  pop();
  
  push();
  noStroke();
  translate(42,70,3);
  fill("white");
  rotateY(-15);
  box(4,58,4);
  pop();
  
  push();
  translate(40,102,0);
  noStroke();
  fill("#ffefe5");
  sphere(5);
  pop();
//leg
  
  push();
  translate(-15,130,0);
  fill("#f7a4b9");
  box(25,60,30);
  translate(-14,-30,0);
  rotateY(90);
  fill("white");
  rect(0,0,6,60);
  pop();
  
  push();
  translate(15,130,0);
  fill("#f7a4b9");
  box(25,60,30);
  translate(14,-30,0);
  rotateY(90);
  fill("white");
  rect(0,0,6,60);
  pop();
  
}

function checkCollision() {
    
}
