let player;
let terrain;
let circle= [];

      function setup() {
        let canvas = createCanvas(1300, 700,WEBGL);
        canvas.position(window.innerWidth / 2 - 650, window.innerHeight / 2 - 350);
        player = new Player();
        terrain = new Terrain();
        angleMode(DEGREES);
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
        rect(-width+660,-height+350,1280,700);
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
          if (keyIsDown(LEFT_ARROW)) {
            this.angle -= this.speed;
          }
          if (keyIsDown(RIGHT_ARROW)) {
            this.angle += this.speed;
          }
          if (keyIsDown(UP_ARROW)) {
            this.angle2 += this.speed;
          }
          if (keyIsDown(DOWN_ARROW)) {
            this.angle2 -= this.speed;
          }
          if (keyIsDown(87)) { // 'w' key
            this.pos.z -= this.speed;
          }
          if (keyIsDown(83)) { // 's' key
            this.pos.z += this.speed;
          }
          if (keyIsDown(65)) { // 'a' key
            this.pos.x -= this.speed;
          }
          if (keyIsDown(68)) { // 'd' key
            this.pos.x += this.speed;
          }
          if (keyIsDown(32)) { //space
            this.pos.y -= this.speed;
          }
          if (keyIsDown(CONTROL)) { //space
            this.pos.y += this.speed;
          }
        }

        display() {
          push();
          translate(this.pos.x, this.pos.y, this.pos.z);
          rotateY(this.angle);
          rotateX(this.angle2);
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