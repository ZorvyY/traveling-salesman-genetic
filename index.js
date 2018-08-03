class Vec {
  constructor(x, y, isPolar) {
    if (!(this instanceof Vec)) {
      return new Vec(...arguments);
    }
    if (x === undefined) {
      this.x = 0;
      this.y = 0;
      return;
    }
    if (isPolar) {
      // x = magnitude, y = angle
      this.x = x * Math.cos(y);
      this.y = x * Math.sin(y);
      return;
    }
    this.x = x;
    this.y = y;
  }

  toPolar() {
    return {
      magnitude: Math.hypot(this.x, this.y),
      angle: Math.atan2(this.y, this.x)
    };
  }

  get magnitude() {
    return this.toPolar().magnitude;
  }

  get angle() {
    return this.toPolar().angle;
  }
  
  get degrees() {
    return this.angle / Math.PI * 180;
  }

  //TODO: Rewrite this so it's not its own method... 
  //It should be part of the constructor.
  /*
  static fromPolar(mag, angle) {
    return new Vec(
      mag * Math.cos(angle),
      mag * Math.sin(angle)
    );
  }
  */

  normalize() {
    return this.times(1/this.magnitude);
  }

  plus(v) {
    return new Vec(
      this.x + v.x,
      this.y + v.y
    );
  }

  minus(v) {
    return new Vec(
      this.x - v.x,
      this.y - v.y
    );
  }

  times(scalar) {
    return new Vec(
      this.x * scalar,
      this.y * scalar
    );
  }

  dot(v) {
    return this.x * v.x + this.y * v.y;
  }

  cross(v) {
    return this.x * v.y - this.y * v.x;
  }

  rotateAround(a, point) {
    let {magnitude, angle} = this.minus(point).toPolar();
    angle += a;
    return (new Vec(magnitude, angle, true)).plus(point);
  }

  rotate(a) {
    if (Math.abs(a) > 2 * Math.PI) console.log('Check to see if your rotations are in radians');
    let {magnitude, angle} = this.toPolar();
    angle += a;
    return new Vec(magnitude, angle, true);
  }

  proj(v) {
    let vhat = v.normalize();
    return vhat.times(this.dot(vhat));
  }
}

let _old = Vec;
Vec = function(...args) { return new _old(...args); };

function shuffle(array) {
  var m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

const POPULATION_SIZE = 100;
const NUM_CITIES = 30;
const NUM_SUCCESSFUL = 40;
const POINT_SWAP_CHANCE = 0.6;
const SECTION_SWAP_CHANCE = 0.5;
const SECTION_REVERSE_CHANCE = 0.3;

let canvas = document.getElementById('canv');
let cx = canvas.getContext('2d');
let cities = generateNodes();
let population = generatePopulation();

let fitnessTracker = {
  best: [],
  worst: [],
  median: [],
}


let displayCallBack = () => {
  population.length = NUM_SUCCESSFUL;
  for (let i = NUM_SUCCESSFUL; i < POPULATION_SIZE; i++) {
    let newPath = 
      PMX(
        population[getRandomInt(0,NUM_SUCCESSFUL)].path,
        population[getRandomInt(0,NUM_SUCCESSFUL)].path
      );

    if (Math.random() < POINT_SWAP_CHANCE)
      newPath = mutateSwap(newPath);
    if (Math.random() < SECTION_SWAP_CHANCE) 
      newPath = mutateSwapSection(newPath);
    if (Math.random() < SECTION_REVERSE_CHANCE)
      newPath = mutateReverseSection(newPath);

    addToPopulation(newPath);
  }

  population.sort((a, b) => b.fitness - a.fitness);

  canvas.width = canvas.width;
  drawNodes(cities);
  displayPath(cities, population[0].path, displayCallBack);

  //Tracking fitness
  fitnessTracker.best.push(population[0].fitness);
  fitnessTracker.worst.push(population[POPULATION_SIZE-1].fitness);
  fitnessTracker.median.push(population[Math.floor(POPULATION_SIZE/2)].fitness);
  visFitness(
    fitnessTracker.best, 
    fitnessTracker.worst, 
    [fitnessTracker.median]
  );
}

drawNodes(cities);
displayPath(cities, population[0].path, displayCallBack);

function addToPopulation(path) {
  population.push({path: path, fitness: fitness(path)});
}

function getRandomInt(lo, hi) {
  return Math.floor((hi-lo)*Math.random())+lo;
}

function generateNodes() {
  let nodes = [];
  for (let i = 0; i < NUM_CITIES; i++) {
    nodes.push(Vec(
      getRandomInt(100,canvas.width-100),
      getRandomInt(100,canvas.height-100)
    ));
  }
  return nodes;
}

function drawNodes(nodes) {
  nodes.forEach(node => {
    cx.fillRect(node.x-2,node.y-2,4,4)
  });
}

function generatePath() {
  let sequence = [];
  for (let i = 0; i < NUM_CITIES; i++) {
    sequence.push(i);
  }
  shuffle(sequence);
  return sequence;
}

function displayPath(nodes, sequence, callback) {
  let i = 1;
  function step() {
    if (i == nodes.length) { setTimeout(callback, 50); return; }
    let start = nodes[sequence[i-1]];
    let end = nodes[sequence[i]];
    cx.beginPath();
    cx.moveTo(start.x, start.y);
    cx.lineTo(end.x, end.y);
    cx.stroke();
    i++;
    step();
  }
  step();
}

function computeDistance (i, j) {
  return cities[i].minus(cities[j]).magnitude;
}

//Fitness function
function fitness (path) {
  function tourLength(sequence) {
    let length = 0;
    for (let i = 1; i < sequence.length; i++) {
      length += computeDistance(sequence[i-1], sequence[i]);
    }
    return length;
  }
  return 1000/tourLength(path);
}

//Generates population and sorts and calculates fitness.
function generatePopulation() {
  let population = [];
  for (let i = 0; i < POPULATION_SIZE; i++) {
    let path = generatePath();
    let pathFitness = fitness(path);
    population.push({path: path, fitness: pathFitness});
  }
  population.sort((a, b) => b.fitness - a.fitness);
  return population;
}

//Point mutation (swap), Frame shift mutation (swap sections), and reversing sections
function mutateSwap(sequence) {
  let i = getRandomInt(0, sequence.length);
  let j = getRandomInt(0, sequence.length);
  let newSeq = sequence.slice(0);
  newSeq[j] = sequence[i];
  newSeq[i] = sequence[j];
  return newSeq;
}

function mutateSwapSection(sequence) {
  let size = getRandomInt(1, sequence.length / 2);
  let pivot = getRandomInt(0, sequence.length - size);
  let newSeq = sequence.slice(0);
  let segment = newSeq.splice(pivot, size);
  newSeq.splice(getRandomInt(0, newSeq.length), 0, ...segment);
  return newSeq;
}

function mutateReverseSection(sequence) {
  let i = getRandomInt(0, sequence.length);
  let j = getRandomInt(0, sequence.length);
  if (i > j) [i, j] = [j, i];
  let reversed = sequence.slice(i, j).reverse();
  let newSeq = sequence.slice(0);
  newSeq.splice(i, j-i, ...reversed);
  return newSeq;
}

function PMX(p1, p2) {
  let i = getRandomInt(0, p1.length);
  let j = getRandomInt(0, p1.length);
  if (i > j) [i, j] = [j, i];
  let s1 = p1.slice(i,j);
  let s2 = p2.slice(i,j);
  let child = new Array(p1.length);
  child.splice(i, j-i, ...s1);
  s2.forEach((el, idx) => {
    idx += i;
    if (child.indexOf(el) == -1) {
      let V;
      do {
        V = p1[idx];
        idx = p2.indexOf(V);
      } while (i <= idx && idx < j);
      child[idx] = el;
    }
  });
  p2.forEach((_, idx) => {
    if (child[idx] === undefined) {
      child[idx] = p2[idx];
    }
  });
  //console.log(JSON.parse(JSON.stringify(child)));
  return child;
}

//TEST PMX;
                         
  /*
let parent1 = [8, 4, 7, 3, 6, 2, 5, 1, 9, 0]
let parent2 = '0123456789'.split('').map(e=>+e);
PMX(parent2, parent1);
*/





  /*
mutateSwap(sequence);
mutateSwapSection(sequence);
mutateReverseSection(sequence);
*/
