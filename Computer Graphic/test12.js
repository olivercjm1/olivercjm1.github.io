// Third-person controller. Distances are world units, times are seconds.
let posX = 0, posY = -90, posZ = 0;
let angle = 180, x = 0;
let velocityX = 0, velocityZ = 0, velocityY = 0;
let grounded = true, jumpQueued = false, walkPhase = 0;
let cameraYaw = 0, cameraPitch = 20, cameraDistance = 440;
let targetYaw = 0, targetPitch = 20, targetDistance = 440;
let followX = posX, followY = posY - 25, followZ = posZ;
let gameCanvas;
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
  characterTime += dt;
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
  runBlend = damp(runBlend, Math.min(movementSpeed / WALK_SPEED, 1.4), 12, dt);
  airBlend = damp(airBlend, grounded ? 0 : 1, 14, dt);
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
  
    ambientLight(155, 155, 170);
    directionalLight(255, 240, 225, -0.4, 0.7, -1);
    directionalLight(150, 175, 230, 0.8, -0.3, 0.5);


  
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
    translate(-6000, -90, 0);
    bocchi();
    pop();
}




// Shared rounded geometry: moderate mesh detail keeps animation affordable.
let characterTime = 0, runBlend = 0, airBlend = 0;
const palettes = {
  kuru: { hair: '#aaa0ad', highlight: '#c9bdce', iris: '#7451b5',
    outfit: '#343043', trim: '#eed5a5', white: '#f7f3ed', shoe: '#423c57' },
  bocchi: { hair: '#ed9ab7', highlight: '#ffc0d3', iris: '#427b9f',
    outfit: '#ee9ab5', trim: '#fff0f3', white: '#fff1f5', shoe: '#f8e7ee' }
};

function softPart(px, py, pz, rx, ry, rz, color) {
  push();
  translate(px, py, pz);
  ambientMaterial(color);
  ellipsoid(rx, ry, rz, 20, 14);
  pop();
}

function drawEye(side, p, blink) {
  const eyeX = side * 13;
  // Layered curved eyes, with a dark rim and small reflected highlights.
  softPart(eyeX, -37, 28.8, 8.7, 11.2 * blink, 2.1, '#423446');
  softPart(eyeX, -36.8, 30, 7.4, 9.8 * blink, 1.6, '#fffaf8');
  softPart(eyeX + side * 0.4, -36, 31.5, 5, 8.4 * blink, 1.3, p.iris);
  softPart(eyeX, -36.8, 32.5, 2.6, 6 * blink, 0.8, '#292538');
  if (blink > 0.5) {
    softPart(eyeX - 1.8, -40, 33.2, 1.8, 2.3, 0.6, '#ffffff');
    softPart(eyeX + 2, -32.5, 33, 0.9, 1.1, 0.5, '#eee2ff');
  }
}

function drawHair(p, pink, sway) {
  // Back volume and top crown leave the face unobstructed.
  softPart(0, -38, -11, 36, 39, 24, p.hair);
  softPart(0, -64, -1, 35, 16, 29, p.hair);
  for (const side of [-1, 1]) {
    push();
    translate(side * 29, -54, 0);
    rotateZ(side * 5 + sway);
    softPart(side * 2, 32, -3, 9, pink ? 46 : 34, 17, p.hair);
    softPart(side * 4, 29, 8, 3, pink ? 36 : 25, 5, p.highlight);
    pop();
  }
  // Separate tapered-looking locks instead of intersecting cones/black sheets.
  for (let i = -2; i <= 2; i++) {
    push();
    translate(i * 11, -61 + Math.abs(i) * 2, 24);
    rotateZ(i * -12 + sway * 0.25);
    softPart(0, 5, 0, 7.5, 16 - Math.abs(i) * 2, 5, p.hair);
    softPart(-2, 0, 4, 1.4, 9, 1, p.highlight);
    pop();
  }
  if (pink) {
    push(); translate(-28, -53, 23); rotateZ(-14);
    softPart(0, 0, 0, 5, 5, 3, '#76b7dd');
    softPart(0, 9, 0, 5, 4, 3, '#edce72'); pop();
  }
}

function drawArm(side, p, swing, airborne) {
  push();
  translate(side * 24, 3, 0); // Shoulder joint.
  rotateZ(-side * (9 + airborne * 22));
  rotateX(swing);
  softPart(0, 9, 0, 9.5, 15, 10, p.outfit);
  translate(0, 22, 0); // Elbow joint.
  rotateX(-12 - Math.abs(swing) * 0.25 - airborne * 20);
  softPart(0, 8, 0, 6.5, 12, 7, p.white);
  softPart(0, 17, 0, 6.8, 3, 7.3, p.trim);
  softPart(0, 23, 1, 6, 7, 6, '#ffe3d5');
  pop();
}

function drawLeg(side, p, swing, airborne, pink) {
  push();
  translate(side * 11, 39, 0); // Hip joint, rather than the model origin.
  rotateX(swing - airborne * 20);
  softPart(0, 9, 0, 9, 12, 10, pink ? p.outfit : '#ffe3d5');
  translate(0, 19, 0);
  rotateX(Math.max(0, -swing) * 0.6 + airborne * 35);
  softPart(0, 8, 0, 7.8, 11, 8, pink ? p.outfit : p.white);
  softPart(0, 17, 3.5, 8.5, 5, 13, p.shoe);
  softPart(0, 20, 4, 8.8, 2, 13, '#686276');
  pop();
}

function drawCharacter(p, pink, moving) {
  const amount = moving ? runBlend : 0;
  const air = moving ? airBlend : 0;
  const time = characterTime + (pink ? 1.4 : 0);
  const breathe = Math.sin(time * 2.2);
  const stride = moving ? Math.sin(walkPhase) * 29 * amount * (1 - air) : 0;
  const bounce = -Math.abs(Math.sin(walkPhase)) * 2 * amount * (1 - air);
  const blinkPhase = time % 4.6;
  const blink = blinkPhase < 0.16 ? Math.max(0.08, Math.abs(blinkPhase - 0.08) / 0.08) : 1;
  const sway = Math.sin(time * 2.1) * 1.5 + stride * 0.055;
  push(); noStroke();
  translate(0, bounce, 0);
  drawLeg(-1, p, stride, air, pink);
  drawLeg(1, p, -stride, air, pink);
  push();
  translate(0, 36, 0);
  rotateX(amount * 4 * (1 - air));
  translate(0, -36, 0);
  // Subtle torso breathing does not move the feet off the floor.
  softPart(0, 17, 0, 25 + breathe * 0.25, 26 + breathe * 0.3, 15, p.outfit);
  softPart(0, 3, 13, 14, 12, 3, p.white);
  if (pink) {
    softPart(0, 20, 15, 1.3, 22, 1.2, p.trim);
    for (const side of [-1, 1]) softPart(side * 13, 22, 13, 1.5, 10, 1.8, p.trim);
  } else {
    softPart(0, 38, 0, 29, 10, 18, p.outfit);
    softPart(0, 42, 0, 29.5, 3, 18.5, p.trim);
    for (const side of [-1, 1]) {
      push(); translate(side * 7, 6, 17); rotateZ(side * 25);
      softPart(0, 0, 0, 8, 4, 2.5, '#7771ce'); pop();
    }
    softPart(0, 8, 18, 3, 4, 3, p.trim);
  }
  drawArm(-1, p, -stride * 0.7, air);
  drawArm(1, p, stride * 0.7, air);
  softPart(0, -7, 0, 9, 10, 8, '#ffe3d5');
  push();
  translate(0, -10, 0); rotateZ(Math.sin(time * 1.4) * 0.7 * (1 - amount)); translate(0, 10, 0);
  softPart(0, -40, 0, 33, 34, 29, '#ffe3d5');
  softPart(-29, -35, 0, 6, 9, 6, '#ffe3d5');
  softPart(29, -35, 0, 6, 9, 6, '#ffe3d5');
  drawEye(-1, p, blink); drawEye(1, p, blink);
  softPart(-22, -26, 24, 5, 2, 1, '#efa8ab');
  softPart(22, -26, 24, 5, 2, 1, '#efa8ab');
  softPart(0, -28, 29, 2, 2.5, 2, '#f5c6b7');
  softPart(0, -20, 25, 3.5, 0.8, 1, '#9e687b');
  drawHair(p, pink, sway);
  pop(); pop(); pop();
}

function kuru() { drawCharacter(palettes.kuru, false, true); }
function bocchi() { drawCharacter(palettes.bocchi, true, false); }
