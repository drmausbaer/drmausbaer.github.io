class Player{
  constructor(){
    this.pos = createVector(3*tileSize + xoff,4* tileSize + yoff);
    this.vel = createVector(0,0);
    this.size = tileSize/2.0;
    this.playerSpeed = tileSize/15.0;
    this.dead = false;
    this.reachedGoal = false;
    this.fadeCounter = 255;
    this.isBest = false;
    this.deathByDot = false;
    this.deathAtStep = 0;
    this.moveCount = 0;
    this.gen =1;
    this.fitness = 0;
    this.nodes = [];
    this.fading = false;
    this.brain = new Brain(numberOfSteps);
    this.coin = new Coin(11*tileSize+xoff, 5*tileSize+yoff);
    this.human = true;
    //let this.av;
    this.setNodes();
    this.Death = 0;
  }

  setNodes() {
    if(level == 1){
    this.nodes[0] = new Node(tiles[6][7],false,true);
    this.nodes[1] = new Node(tiles[17][2],true,false);
    }
    if (level == 2){
    this.nodes[1] = new Node(tiles[19][5],true,false);
    this.nodes[0] = new Node(this.coin,false,true);
    }
    this.nodes[0].setDistanceToFinish(this.nodes[1]);
  }

  show(){
    //image(avatar, this.pos.x, this.pos.y, this.size, this.size/*, 50, 50, 50, 50*/);
    fill(255, 0, 0, this.fadeCounter);
    if (this.isBest && !showBest) {
      fill(0, 255, 0, 255-this.fadeCounter);
    }
    stroke(0, 0, 0, this.fadeCounter);
    strokeWeight(2);
    //image(avatar, this.x, this.y);
    rect(this.pos.x, this.pos.y, this.size, this.size);
    //stroke(0);
    if(level==2){
      this.coin.show();
    }
  }

  move(){
    if (!humanPlaying){
      if (this.moveCount == 0) {//move in the direction for 6 frames
        if (this.brain.directions.length > this.brain.step) {//if there are still directions left then set the velocity as the next PVector in the direcitons array
          this.vel = this.brain.directions[this.brain.step];
          this.brain.step++;
        } else {//if at the end of the directions array then the player is dead
          this.dead = true;
          this.fading = true;
        }
        this.moveCount =6;
      } else {
        this.moveCount--;
      }
    }
    var temp = createVector(this.vel.x, this.vel.y);
    temp.normalize();
    temp.mult(this.playerSpeed);
    for (var i = 0; i< solids.length; i++) {
      temp = solids[i].restrictMovement(this.pos, createVector(this.pos.x+this.size, this.pos.y+this.size), temp);
    }
    this.pos.add(temp);

  }

  //checks if the player
checkCollisions() {
  this.coin.collides(this.pos, createVector(this.pos.x+this.size, this.pos.y+this.size));
  for (var i = 0; i< dots.length; i++) {
    if (dots[i].collides(this.pos, createVector(this.pos.x+this.size, this.pos.y+this.size))) {
      this.fading = true;
      this.dead = true;
      Death = Death + 1;
      this.deathByDot = true;
      this.deathAtStep = this.brain.step;

      for (var i = 0; i< 22; i++) {
        tiles[i] = [];
        for (var j = 0; j< 10; j++) {
          tiles[i][j] = new Tile(i, j);
        }
      }
      solids=[];
      dots=[];
      resetDots();
      setDots();
      setLevel1Walls();
       setLevel1Goal();
       setLevel1SafeArea();
       setEdges();
       setSolids();
    }
  }
  if (winArea.collision(this.pos, createVector(this.pos.x+this.size, this.pos.y+this.size))&&level==1) {
    this.reachedGoal = true;
  } else if (level==2&&this.coin.taken && winArea.collision(this.pos, createVector(this.pos.x+this.size, this.pos.y+this.size))) {
    this.reachedGoal = true;
  }
  for (var i = 0; i< this.nodes.length; i++) {
    this.nodes[i].collision(this.pos, createVector(this.pos.x+this.size, this.pos.y+this.size));
  }
}
//----------------------------------------------------------------------------------------------------------------------------------------------------------
 update() {
  if (!this.dead && !this.reachedGoal) {
    this.move();
    this.checkCollisions();
  } else if (this.fading) {
    if (this.fadeCounter > 0) {
      if(humanPlaying || replayGens){
      this.fadeCounter -=10;
    }else{
      this.fadeCounter = 0;

    }
    }
  }
}
//----------------------------------------------------------------------------------------------------------------------------------------------------------

 calculateFitness() {
  if (this.reachedGoal) {//if the dot reached the goal then the fitness is based on the amount of steps it took to get there
    this.fitness = 1.0/16.0 + 10000.0/(this.brain.step * this.brain.step);
  } else {//if the dot didn't reach the goal then the fitness is based on how close it is to the goal
    var estimatedDistance = 0.0;//the estimated distance of the path from the player to the goal
    for (var i = this.nodes.length-1; i>=0; i--) {
      if (!this.nodes[i].reached) {
        estimatedDistance = this.nodes[i].distToFinish;
        estimatedDistance += dist(this.pos.x, this.pos.y, this.nodes[i].pos.x, this.nodes[i].pos.y);
      }
    }
    if (this.deathByDot) {
      estimatedDistance *= 0.9;
    }
    this.fitness = 1.0/(estimatedDistance * estimatedDistance);
  }
  this.fitness*=this.fitness;
}



//----------------------------------------------------------------------------------------------------------------------------------------------------------
 gimmeBaby() {
  var baby = new Player();
  baby.brain = this.brain.clone();//babies have the same brain as their parents
  baby.deathByDot = this.deathByDot;
  baby.deathAtStep = this.deathAtStep;
  baby.gen = this.gen;
  return baby;
}
}
