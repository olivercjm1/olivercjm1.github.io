let position;
let velo;
let acc;
let maxv;
let kuruclass;
let gif, cic;

function preload() {
    gif = loadImage("pic/kuru.gif");
    cic = loadImage("pic/cic.png");
}

function setup() {
    let canvas = createCanvas(1280, 720);
    canvas.position(window.innerWidth / 2 - 650, window.innerHeight / 2 - 350);
    frameRate(25);
    kuruclass = new Kururin();
    angleMode(DEGREES);
    position = createVector(width / 2, height / 2);
    velo = createVector(0, 0.5);
    acc = createVector(0, 0.01);
    maxv = 2;
    kuruclass.kurusetup();
}

function draw() {
    kuruclass.drawout();
    kuruclass.drawCircles();
    kuruclass.move();

    scale(1, -1);
    translate(0, (-height + 100) / 2);
    kuruclass.drawCircles();
    kuruclass.move();
}

class Kururin {
    constructor() {
        this.angle = 75;
        this.kuru1 = 30;
        this.kuru2 = 20;
        this.kuru3 = 40;
        this.kuru4 = 67;
        this.kuru5 = -67;
        this.kuru6 = 30;
        this.kuru7 = -30;
        this.circleSizes = [19, 18, 17, 20, 19.5, 18, 20, 16];
        this.circleSizes2 = [];
        this.circleSizes3 = [];
        this.circleSizes4 = [];
        this.circleSizes5 = [];
        this.circleSizes6 = [];
        this.circleSizes7 = [];
        this.cs = 100;
        this.cs2 = 100;
        this.cs3 = 200;
        this.cs4 = 200;
        this.scaleX = 2;
        this.xSpeed = 35;
        this.xSpeed2 = 1.5;
    }

    kurusetup() {
        for (let i = 0; i < 8; i++) {
            this.circleSizes2.push(10);
            this.circleSizes3.push(15);
            this.circleSizes4.push(this.cs);
            this.circleSizes5.push(this.cs2);
            this.circleSizes6.push(this.cs3);
            this.circleSizes7.push(this.cs4);
        }
    }

    drawout() {
        background(0);
        stroke("pink");
        line(0, height / 2, width, height / 2);
        translate(width / 2, (height + 100) / 4);
    }

    drawCircles() {

        for (let i = 0; i < 8; i++) {
            push();
            stroke("pink");
            noFill();
            rotate((this.angle * 0.5) + 360 / 8 * i);
            ellipse(this.kuru1, 0, this.circleSizes[i], this.circleSizes[i]);
            pop();
        }

        for (let i = 0; i < 8; i++) {
            push();
            stroke("pink");
            noFill();
            rotate(((this.angle + 45) * 0.5) + 360 / 8 * i);
            ellipse(this.kuru2, 0, this.circleSizes2[i], this.circleSizes2[i]);
            pop();
        }

        for (let i = 0; i < 8; i++) {
            push();
            rotate(((this.angle + 45) * 0.5) + 360 / 8 * i);
            stroke("pink");
            noFill();
            ellipse(this.kuru3, 0, this.circleSizes3[i], this.circleSizes3[i]);
            pop();
        }

        for (let i = 0; i < 1; i++) {
            push();
            stroke("pink");
            noFill();
            rotate((this.angle * 0.5) + 360 * i);
            ellipse(this.kuru4, 0, (this.circleSizes4[i]) / this.scaleX, (this.circleSizes4[i]) / this.scaleX);
            if (this.angle >= -180 && this.angle <= 0) {
                this.circleSizes4[0] -= this.xSpeed;
                this.kuru4 -= 9;
            } else if (this.angle > 0 && this.angle >= -300) {
                this.circleSizes4[0] = this.cs;
                this.kuru4 = 75;
            } else {
                this.circleSizes4[0] += this.xSpeed;
                this.kuru4 += 9;
            }
            pop();
        }

        for (let i = 0; i < 1; i++) {
            push();
            stroke("pink");
            noFill();
            rotate((this.angle * 0.5) + 360 * i);
            ellipse(this.kuru5, 50, (this.circleSizes5[i]) / this.scaleX, (this.circleSizes5[i]) / this.scaleX);
            if (this.angle >= -180 && this.angle <= 0) {
                this.circleSizes5[0] = this.cs2;
                this.kuru5 = -50;
            } else if (this.angle > 0 && this.angle <= 180){
                this.circleSizes5[0] -= this.xSpeed;
                this.kuru5 -= 9;
                
            } else if (this.angle > 180 && this.angle <= 360) {
                this.circleSizes5[0] += this.xSpeed;
                this.kuru5 += 9;
            }

            pop();
        }

        for (let i = 0; i < 1; i++) {
            push();
            stroke("pink");
            noFill();
            rotate((this.angle * 0.5) + 360 * i);
            ellipse(this.kuru6, 70, (this.circleSizes6[i]) / this.scaleX, (this.circleSizes6[i]) / this.scaleX);
            if(this.angle >= -180 && this.angle <=280)
                {
                    this.cs3 = 100;
                    this.kuru6 = 30;
                    this.circleSizes6[0] = this.cs3;
                }
            if(this.angle >=-360 && this.angle <= -250){
                    this.kuru6 -= 0.5;
                    this.cs3 -= 1.6;
                    this.circleSizes6[0] = this.cs3;
                }
            else{
                this.kuru6 += 0.5;
                    this.cs3 += 1.6;
                    this.circleSizes6[0] = this.cs3;
            }
            pop();
        }

        for (let i = 0; i < 1; i++) {
            push();
            stroke("pink");
            noFill();
            rotate((this.angle * 0.5) + 360 * i);
            ellipse(this.kuru7, -70, (this.circleSizes7[i]) / this.scaleX, (this.circleSizes7[i]) / this.scaleX);
            if(this.angle >= -300 && this.angle <=-180)
                {
                    this.cs4 = 100;
                    this.kuru7 = 30;
                    this.circleSizes7[0] = this.cs4;
                }
            if(this.angle >=0 && this.angle <= 300){
                    this.kuru7 -= 0.1;
                    this.cs4 -= 0.3;
                    this.circleSizes7[0] = this.cs4;
                }
            else{
                this.kuru7 += 0.1;
                    this.cs4 += 0.4;
                    this.circleSizes7[0] = this.cs4;
            }
            pop();
        }
    }

    move() {
        fill(255);
        /*text("Kuru angle: ", -180, -100);
        text(this.angle.toFixed(2), -100, -100);*/
        velo.add(acc);
        velo.limit(maxv);
        this.angle += velo.y;
        if (this.angle >= 360 || this.angle <= -360) {
            this.angle *= -1;
        }
        image(cic,500, 0, 60, 60);
    }
}
