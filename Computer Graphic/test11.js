let player;
let terrain;
let circle= [];
let memeMode = false;
let memeTime = 0;
let jHeld = false;

function keyPressed() {
  if (key === 'j' || key === 'J') {
    if (!jHeld) {
      toggleMeme();
      jHeld = true;
    }
    return false;
  }
}

function keyReleased() {
  if (key === 'j' || key === 'J') jHeld = false;
}

// Release the key latch if the browser loses focus while J is held.
window.addEventListener('blur', () => { jHeld = false; });

      function setup() {
        let canvas = createCanvas(1300, 700,WEBGL);
        canvas.position(window.innerWidth / 2 - 650, window.innerHeight / 2 - 350);
        player = new Player();
        terrain = new Terrain();
        angleMode(DEGREES);
        installPhoneControls(canvas);
        for(let i=0; i< 300; i++)
          {
            let x = random(-width, width);
            let y = random(-height, height);
            let w = random(2, 10);
            let h = w;
            let r = random(100, 255);
            let g = random(100, 255);
            let b = random(100, 255);
            circle.push({x,y,w,h,r,g,b});
          }
      }

      function draw() {
        background(0);
        player.update();
        player.display();
        for (let i = 0; i < circle.length; i++) {
          fill(circle[i].r, circle[i].g, circle[i].b);
          ellipse(circle[i].x, circle[i].y, circle[i].w, circle[i].h);
        }
        push();
        stroke(255);
        noFill();
        rect(-30,-30,60);
        strokeWeight(50);
        rect(-width / 2 + 10, -height / 2, width - 20, height);
        strokeWeight(1);
        line(-30, -30, 0, -width / 2, -height / 2, 0); // Top-left corner
        line(30, -30, 0, width / 2, -height / 2, 0); // Top-right corner
        line(-30, 30, 0, -width / 2, height / 2, 0); // Bottom-left corner
        line(30, 30, 0, width / 2, height / 2, 0); // Bottom-right corner
        pop();
      }

      class Player {
        constructor() {
          this.pos = createVector(0, 0, 0);
          this.speed = 2;
          this.angle = 160;
          this.angle2 = 0;
        }

        update() {
          if (memeMode) {
            memeTime += Math.min(deltaTime, 50) / 1000;
          }
          if (controlDown(LEFT_ARROW)) {
            this.angle -= this.speed;
          }
          if (controlDown(RIGHT_ARROW)) {
            this.angle += this.speed;
          }
          if (controlDown(UP_ARROW)) {
            this.angle2 += this.speed;
          }
          if (controlDown(DOWN_ARROW)) {
            this.angle2 -= this.speed;
          }
          if (controlDown(87)) { // 'w' key
            this.pos.z -= this.speed;
          }
          if (controlDown(83)) { // 's' key
            this.pos.z += this.speed;
          }
          if (controlDown(65)) { // 'a' key
            this.pos.x -= this.speed;
          }
          if (controlDown(68)) { // 'd' key
            this.pos.x += this.speed;
          }
          if (controlDown(32)) { //space
            this.pos.y -= this.speed;
          }
          if (controlDown(CONTROL)) { //space
            this.pos.y += this.speed;
          }
        }

        display() {
          push();
          translate(this.pos.x, this.pos.y, this.pos.z);
          rotateY(this.angle);
          rotateX(this.angle2);
          if (memeMode) {
            // Two squishes and one full spin per second.
            const squeeze = (1 - cos(memeTime * 720)) / 2;
            rotateY(memeTime * 360);
            // Anchor the squash at the feet so the character stays grounded.
            translate(0, 80, 0);
            scale(1 + squeeze * 0.55, 1 - squeeze * 0.60, 1 + squeeze * 0.35);
            translate(0, -80, 0);
          }
          kuru();
          pop();
        }
      }

      class Terrain {
        display() {
          push();
          rotateX(250);
          translate(0, 30, 0);
          stroke(100);
          fill(100, 250, 100);
          plane(1000, 1000);
          pop();
        }
      }

      function kuru() {
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
        translate(-15, 70, 0);
        box(20, 20, 20); // Left leg
        pop();
      
        push();
        fill("#ffefe5");
        translate(15, 70, 0);
        box(20, 20, 20); // Right leg
        pop();
      }

// Phone controls share the same actions as the keyboard.
const touchPointers = new Map();
let phonePanel, memeButton, sketchCanvas;
function controlDown(code) {
  return keyIsDown(code) || [...touchPointers.values()].includes(code);
}
function toggleMeme() {
  memeMode = !memeMode;
  memeTime = 0;
  if (memeButton) {
    memeButton.textContent = memeMode ? 'Stop spin' : 'Squeeze + spin';
    memeButton.setAttribute('aria-pressed', String(memeMode));
  }
}
function clearPhoneInput() {
  touchPointers.clear();
  if (phonePanel) phonePanel.querySelectorAll('.holding').forEach(b => b.classList.remove('holding'));
  jHeld = false;
}
function fitPhoneCanvas() {
  if (!phonePanel || !sketchCanvas) return;
  const vw = document.documentElement.clientWidth;
  const vh = window.visualViewport ? window.visualViewport.height : window.innerHeight;
  const freeHeight = Math.max(100, vh - phonePanel.getBoundingClientRect().height - 12);
  const w = Math.min(1300, vw), h = Math.min(700, freeHeight);
  resizeCanvas(w, h);
  sketchCanvas.position((vw - w) / 2, (freeHeight - h) / 2);
}
function windowResized() { fitPhoneCanvas(); }
function installPhoneControls(canvas) {
  sketchCanvas = canvas;
  canvas.elt.style.touchAction = 'none';
  let viewport = document.querySelector('meta[name="viewport"]');
  if (!viewport) {
    viewport = document.createElement('meta'); viewport.name = 'viewport';
    viewport.content = 'width=device-width, initial-scale=1, viewport-fit=cover';
    document.head.appendChild(viewport);
  }
  const style = document.createElement('style');
  style.textContent = `
    body { margin:0; background:#000; }
    #phone-controls { position:fixed; z-index:100; bottom:0; left:0; right:0;
      box-sizing:border-box; padding:8px max(10px,env(safe-area-inset-right)) max(8px,env(safe-area-inset-bottom)) max(10px,env(safe-area-inset-left));
      background:rgba(17,15,28,.96); border-top:1px solid #49405e;
      color:#eee7ff; font:12px system-ui,sans-serif; user-select:none; -webkit-user-select:none; }
    #phone-controls .controls-inner { max-width:620px; margin:auto; }
    #phone-controls .action-row { display:flex; justify-content:center; gap:8px; margin-bottom:5px; }
    #phone-controls .pads { display:flex; justify-content:space-between; gap:12px; }
    #phone-controls .pad-title { text-align:center; margin:0 0 3px; color:#c9b6e7; }
    #phone-controls .pad { display:grid; grid-template-columns:repeat(3,44px); grid-template-rows:repeat(2,44px); gap:4px; }
    #phone-controls button { min-width:44px; min-height:44px; box-sizing:border-box;
      border:1px solid #74618f; border-radius:12px; color:white; background:#30263e;
      font:600 14px system-ui,sans-serif; touch-action:none; -webkit-tap-highlight-color:transparent; }
    #phone-controls .action-row button { padding:0 12px; }
    #phone-controls button.holding, #phone-controls button:active { background:#7653a2; border-color:#e0c6ff; }
    #phone-controls button[aria-pressed=true] { background:#8054a2; }
    #phone-controls button:focus-visible { outline:2px solid #e9cfff; outline-offset:2px; }
    @media (max-height:450px) {
      #phone-controls .controls-inner { display:flex; align-items:center; gap:12px; }
      #phone-controls .action-row { flex-direction:column; margin:0; }
      #phone-controls .pads { flex:1; }
    }
  `;
  document.head.appendChild(style);
  phonePanel = document.createElement('div');
  phonePanel.id = 'phone-controls';
  phonePanel.setAttribute('aria-label', 'Character controls');
  phonePanel.innerHTML = `<div class="controls-inner"><div class="action-row"></div><div class="pads"></div></div>`;
  document.body.appendChild(phonePanel);
  function holdButton(parent, label, code, title, column, row) {
    const button = document.createElement('button'); button.type = 'button';
    button.textContent = label; button.setAttribute('aria-label', title); button.title = title;
    if (column) { button.style.gridColumn = column; button.style.gridRow = row; }
    button.addEventListener('contextmenu', e => e.preventDefault());
    button.addEventListener('pointerdown', e => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      e.preventDefault(); button.setPointerCapture(e.pointerId);
      touchPointers.set(e.pointerId, code); button.classList.add('holding');
    });
    const release = e => {
      touchPointers.delete(e.pointerId);
      if (![...touchPointers.values()].includes(code)) button.classList.remove('holding');
    };
    button.addEventListener('pointerup', release);
    button.addEventListener('pointercancel', release);
    button.addEventListener('lostpointercapture', release);
    // Allow focused buttons to be held using Enter or Space as well.
    const keyboardId = 'button-' + code;
    button.addEventListener('keydown', e => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault(); e.stopPropagation(); touchPointers.set(keyboardId, code); button.classList.add('holding');
      }
    });
    button.addEventListener('keyup', e => {
      if (e.code === 'Space' || e.code === 'Enter') { e.preventDefault(); e.stopPropagation(); touchPointers.delete(keyboardId); button.classList.remove('holding'); }
    });
    button.addEventListener('blur', () => { touchPointers.delete(keyboardId); button.classList.remove('holding'); });
    parent.appendChild(button); return button;
  }
  const actions = phonePanel.querySelector('.action-row');
  holdButton(actions, 'Rise', 32, 'Move up (Space)');
  memeButton = document.createElement('button'); memeButton.type = 'button';
  memeButton.textContent = 'Squeeze + spin'; memeButton.setAttribute('aria-pressed', 'false');
  memeButton.addEventListener('click', toggleMeme); actions.appendChild(memeButton);
  holdButton(actions, 'Lower', 17, 'Move down (Control)');
  function pad(title, keys) {
    const group = document.createElement('div');
    const caption = document.createElement('div'); caption.className = 'pad-title'; caption.textContent = title;
    const grid = document.createElement('div'); grid.className = 'pad';
    group.append(caption, grid); phonePanel.querySelector('.pads').appendChild(group);
    const cells = [[2,1],[1,2],[2,2],[3,2]];
    keys.forEach(([label,code,name], i) => holdButton(grid,label,code,name,...cells[i]));
  }
  pad('MOVE', [['▲',87,'Forward (W)'],['◀',65,'Left (A)'],['▼',83,'Back (S)'],['▶',68,'Right (D)']]);
  pad('ROTATE', [['↥',38,'Tilt up'],['↶',37,'Rotate left'],['↧',40,'Tilt down'],['↷',39,'Rotate right']]);
  window.addEventListener('blur', clearPhoneInput);
  document.addEventListener('visibilitychange', () => { if (document.hidden) clearPhoneInput(); });
  if (window.visualViewport) window.visualViewport.addEventListener('resize', fitPhoneCanvas);
  fitPhoneCanvas();
}
