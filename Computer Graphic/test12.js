// Third-person controller. Distances are world units, times are seconds.
let posX = 0, posY = -90, posZ = 0;
let angle = 180, x = 0;
let velocityX = 0, velocityZ = 0, velocityY = 0;
let grounded = true, jumpQueued = false, walkPhase = 0;
let cameraYaw = 0, cameraPitch = 20, cameraDistance = 440;
let targetYaw = 0, targetPitch = 20, targetDistance = 440;
let followX = posX, followY = posY - 25, followZ = posZ;
let gameCanvas;
let animationTime = 0;
const heldKeys = new Set();
const WALK_SPEED = 340, SPRINT_SPEED = 570;
const GRAVITY = 1800, JUMP_SPEED = 720;
const GROUND_POSITION = -90; // Floor top (-10) minus character foot offset (80).
const radians = degrees => degrees * Math.PI / 180;
const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
const damp = (a, b, rate, dt) => a + (b - a) * (1 - Math.exp(-rate * dt));

function setup() {
  const canvas = createCanvas(window.innerWidth, window.innerHeight, WEBGL);
  canvas.position(0, 0);
  gameCanvas = canvas.elt;
  gameCanvas.tabIndex = 0;
  angleMode(DEGREES);
  perspective(60, width / height, 5, 100000);
  gameCanvas.addEventListener('click', () => {
    gameCanvas.focus();
    // Some embedded editors disallow pointer lock; dragging still works there.
    try {
      const request = gameCanvas.requestPointerLock?.();
      if (request && request.catch) request.catch(() => {});
    } catch (_) {}
  });
  gameCanvas.addEventListener('keydown', event => {
    if (['KeyW', 'KeyA', 'KeyS', 'KeyD', 'Space', 'ShiftLeft', 'ShiftRight'].includes(event.code)) {
      event.preventDefault();
      heldKeys.add(event.code);
      if (event.code === 'Space' && !event.repeat && grounded) jumpQueued = true;
    }
  });
  window.addEventListener('keyup', event => heldKeys.delete(event.code));
  const clearInput = () => { heldKeys.clear(); jumpQueued = false; };
  window.addEventListener('blur', clearInput);
  gameCanvas.addEventListener('blur', clearInput);
  document.addEventListener('pointerlockchange', () => {
    if (document.pointerLockElement !== gameCanvas) clearInput();
  });
  document.addEventListener('mousemove', event => {
    const locked = document.pointerLockElement === gameCanvas;
    const dragging = event.target === gameCanvas && (event.buttons & 1);
    if (!locked && !dragging) return;
    targetYaw -= event.movementX * 0.18;
    targetPitch = clamp(targetPitch + event.movementY * 0.14, 5, 65);
  });
  gameCanvas.addEventListener('wheel', event => {
    event.preventDefault();
    targetDistance = clamp(targetDistance + event.deltaY * 0.3, 240, 800);
  }, { passive: false });
}

function updateController(dt) {
  animationTime += dt;
  cameraYaw = damp(cameraYaw, targetYaw, 22, dt);
  cameraPitch = damp(cameraPitch, targetPitch, 22, dt);
  cameraDistance = damp(cameraDistance, targetDistance, 12, dt);
  let forward = Number(heldKeys.has('KeyW')) - Number(heldKeys.has('KeyS'));
  let right = Number(heldKeys.has('KeyD')) - Number(heldKeys.has('KeyA'));
  const inputLength = Math.hypot(forward, right);
  if (inputLength > 0) { forward /= inputLength; right /= inputLength; }
  const yaw = radians(cameraYaw);
  const dirX = -Math.sin(yaw) * forward + Math.cos(yaw) * right;
  const dirZ = -Math.cos(yaw) * forward - Math.sin(yaw) * right;
  const speed = heldKeys.has('ShiftLeft') || heldKeys.has('ShiftRight') ? SPRINT_SPEED : WALK_SPEED;
  const response = grounded ? (inputLength > 0 ? 14 : 20) : 5;
  velocityX = damp(velocityX, dirX * speed, response, dt);
  velocityZ = damp(velocityZ, dirZ * speed, response, dt);
  posX += velocityX * dt;
  posZ += velocityZ * dt;
  // Keep the character on this sketch's rectangular platform.
  const boundedX = clamp(posX, -9900, 9900);
  const boundedZ = clamp(posZ, -29900, 29900);
  if (boundedX !== posX) velocityX = 0;
  if (boundedZ !== posZ) velocityZ = 0;
  posX = boundedX; posZ = boundedZ;
  if (inputLength > 0) {
    const desiredAngle = Math.atan2(dirX, dirZ) * 180 / Math.PI;
    const difference = ((desiredAngle - angle + 540) % 360 + 360) % 360 - 180;
    angle += difference * (1 - Math.exp(-16 * dt));
    angle = ((angle + 180) % 360 + 360) % 360 - 180;
  }
  if (jumpQueued && grounded) { velocityY = -JUMP_SPEED; grounded = false; }
  jumpQueued = false;
  if (!grounded) {
    posY += velocityY * dt + 0.5 * GRAVITY * dt * dt;
    velocityY += GRAVITY * dt;
    if (posY >= GROUND_POSITION) { posY = GROUND_POSITION; velocityY = 0; grounded = true; }
  }
  const movementSpeed = Math.hypot(velocityX, velocityZ);
  walkPhase += movementSpeed * dt * 0.045;
  const legAngle = grounded ? Math.sin(walkPhase) * 24 * Math.min(movementSpeed / WALK_SPEED, 1) : 0;
  x = damp(x, legAngle, 20, dt);
  followX = damp(followX, posX, 18, dt);
  followY = damp(followY, posY - 25, 10, dt);
  followZ = damp(followZ, posZ, 18, dt);
}

function updateCamera() {
  const yaw = radians(cameraYaw), pitch = radians(cameraPitch);
  const horizontal = Math.cos(pitch) * cameraDistance;
  const eyeY = Math.min(followY - Math.sin(pitch) * cameraDistance, -35);
  camera(followX + Math.sin(yaw) * horizontal, eyeY,
    followZ + Math.cos(yaw) * horizontal, followX, followY, followZ, 0, 1, 0);
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
  perspective(60, width / height, 5, 100000);
}

function draw() {
    background(0);
    updateController(Math.min(deltaTime / 1000, 0.05));
    updateCamera();
  
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

    push();
    // Restore the standing character's nervous shaking (original 5-unit range).
    // Continuous motion avoids frame-to-frame random teleporting.
    const shakeX = 3 * Math.sin(animationTime * 39) + 2 * Math.sin(animationTime * 67);
    const shakeY = 3 * Math.sin(animationTime * 43 + 1) + 2 * Math.sin(animationTime * 71);
    translate(-6000 + shakeX, -150 + shakeY, 0);
    bocchi();
    pop();
}




function kuru() {
    push();
    // Draw head
    push();
    noStroke();
    fill("#ffefe5");
    translate(0, -40, 0);
    sphere(40, 32, 24); // Head
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
    cylinder(5,10, 32, 1);
    pop();
  
    push();
    noStroke();
    translate(-15, -32, 35);
    fill("#5b34ad");
    cylinder(5.1,6, 32, 1);
    pop();
  
    push();
    noStroke();
    translate(15, -30, 35);
    fill("#eda9e7");
    cylinder(5,10, 32, 1);
    pop();
  
    push();
    noStroke();
    translate(15, -32, 35);
    fill("#5b34ad");
    cylinder(5.1,6, 32, 1);
    pop();
  
    push();
    noStroke();
    translate(-25, -32, 30);
    fill("#a4909b");
    cone(5,50, 32, 1);
    pop();
  
    push();
    noStroke();
    translate(25, -32, 30);
    fill("#a4909b");
    cone(5,50, 32, 1);
    pop();
  
    push();
    noStroke();
    translate(0, -50, 0);
    fill("#a4909b");
    ellipsoid(40,30,50, 32, 24);
    pop();
  
    push();
    noStroke();
    translate(30, -40, 0);
    fill("#a4909b");
    ellipsoid(10,30,30, 32, 24);
    pop();
  
    push();
    noStroke();
    translate(-30, -40, 0);
    fill("#a4909b");
    ellipsoid(10,30,30, 32, 24);
    pop();
  
    
    push();
    noStroke();
    translate(0, -20, -30);
    fill("#a4909b");
    ellipsoid(40,60,20, 32, 24);
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
    cylinder(18,60, 32, 1);
    pop();
  
    push();
    noStroke();
    fill("#292435");
    translate(15, 30, 0);
    rotate(-10);
    cylinder(18,60, 32, 1);
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
    translate(-15, 60, 0);
    rotateX(-x);
    translate(0, 10, 0);
    box(20, 20, 20); // Left leg
    pop();
  
    push();
    fill("#ffefe5");
    translate(15, 60, 0);
    rotateX(x);
    translate(0, 10, 0);
    box(20, 20, 20); // Right leg
    pop();
    pop();
  }

function bocchi()
{
  //head
  push();
  translate(0,0,0);
  fill("#ffefe5");
  noStroke();
  sphere(40, 32, 24); 
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
  cone(2,40, 32, 1);
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
  ellipsoid(40,20,50, 32, 24);
  pop();
  
  push();
  noStroke();
  translate(0,-30,0);
  fill("black");
  ellipsoid(42,22,2, 32, 24);
  pop();

  push();
  noStroke();
  translate(0,40,-40);
  fill("#f7a4b9");
  ellipsoid(30,70,30, 32, 24);
  pop();
  
  push();
  noStroke();
  translate(0,40,-40);
  fill("black");
  ellipsoid(32,72,2, 32, 24);
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
  cylinder(39,1, 32, 1);
  pop();

  push();
  noStroke();
  rotate(30);
  translate(0,40,15);
  fill("black");
  cylinder(10,1, 32, 1);
  pop();

  push();
  noStroke();
  rotate(-30);
  translate(0,40,15);
  fill("black");
  cylinder(10,1, 32, 1);
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
  cylinder(5,60, 32, 1);
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
  sphere(5, 32, 24);
  pop();
  
  //left
  push();
  translate(40,70,0);
  noStroke();
  fill("#f7a4b9");
  cylinder(5,60, 32, 1);
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
  sphere(5, 32, 24);
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

