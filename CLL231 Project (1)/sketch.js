let boids = [];

function setup() {

  createCanvas(1000, 500);

  for (let i = 0; i < 100; i++) {
    boids[i] = new Boid();
  }
}

function draw() {

  background(57, 91, 100);
  
  for (let i = 0; i < boids.length; i++) {
    boids[i].run(boids);
  }
}


class Boid {

  constructor() {
    this.acc = createVector(0, 0);
    this.vel = p5.Vector.random2D();
    this.pos = createVector(random(width), random(height));
    this.r = 3.0;
    this.maxspeed = 3;
    this.maxforce = 0.05;
  }

  run(boids) {
    this.flocksimul(boids);
    this.update();
    this.wraparound();
    this.display();
  }
  
  flocksimul(boids) {
    this.acc.add(this.separate(boids).mult(2.5));
    this.acc.add(this.align(boids));
    this.acc.add(this.cohesion(boids));
  }
  
  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxspeed);

    this.pos.add(this.vel);
    
    this.acc.mult(0);
  }
  
  display() {
    fill('#E7ED9B');
    stroke('#8BDB81');
    triangle(this.pos.x, this.pos.y, this.pos.x+10, this.pos.y+5, this.pos.x+10, this.pos.y-5);
  }
  
  wraparound() {
    if (this.pos.x < -this.r) this.pos.x = width + this.r;
    if (this.pos.y < -this.r) this.pos.y = height + this.r;
    if (this.pos.x > width + this.r) this.pos.x = -this.r;
    if (this.pos.y > height + this.r) this.pos.y = -this.r;
  }

  align(boids) {

    let sum = createVector(0, 0);
    let count = 0;
    for (let i = 0; i < boids.length; i++) {
      let d = p5.Vector.dist(this.pos, boids[i].pos);
      if ((d > 0) && (d < 50)) {
        sum.add(boids[i].vel);
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      sum.normalize();
      sum.mult(this.maxspeed);
      let steer = p5.Vector.sub(sum, this.vel);
      steer.limit(this.maxforce);
      return steer;
    } else {
      return createVector(0, 0);
    }
  }
  
  cohesion(boids) {
    
    let sum = createVector(0, 0);
    let count = 0;

    for (let i = 0; i < boids.length; i++) {
      let d = p5.Vector.dist(this.pos, boids[i].pos);
      if ((d > 0) && (d < 50)) {
        sum.add(boids[i].pos); // Add location
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);

      let unitvec = p5.Vector.sub(sum, this.pos);
      unitvec.normalize();
      unitvec.mult(this.maxspeed);
      
      let steer = p5.Vector.sub(unitvec, this.vel);
      steer.limit(this.maxforce);
      return steer;

    } else {
      return createVector(0, 0);
    }
  }

  separate(boids) {

    let steer = createVector(0, 0);
    let count = 0;
    
    for (let i = 0; i < boids.length; i++) {
      let d = p5.Vector.dist(this.pos, boids[i].pos);
      
      if ((d > 0) && (d < 25)) {
        let unitvec = p5.Vector.sub(this.pos, boids[i].pos);
        unitvec.normalize();
        unitvec.div(d);
        steer.add(unitvec);
        count++;
      }
    }
    if (count > 0) {
      steer.div(count);
    }
  
    if (steer.mag() > 0) {
      steer.normalize();
      steer.mult(this.maxspeed);
      steer.sub(this.vel);
      steer.limit(this.maxforce);
    }
    return steer;
  }
}