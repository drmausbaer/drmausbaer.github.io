class Node { //used to define short term goals for the players
  //------------------------------------------------------------------------------------------------------------------------------
  constructor(nodeTileOrCoin, isTile, isCoin) {

    if(level==1){

    this.reached = false;
    this.distToFinish = 0.0;
    this.pos = createVector(nodeTileOrCoin.pixelPos.x, nodeTileOrCoin.pixelPos.y);
    this.w =  tileSize;
    this.h =  tileSize;
    this.bottomRight = createVector(this.pos.x + this.w, this.pos.y + this.h);
    }


    if(level == 2){
      this.reached = false;
      this.distToFinish = 0.0;
      this.isCoin = isCoin;

      if(isTile){
        this.pos = createVector(nodeTileOrCoin.pixelPos.x, nodeTileOrCoin.pixelPos.y);
        this.w =  tileSize;
        this.h =  tileSize;
      }else if(isCoin){
        this.pos = createVector(nodeTileOrCoin.pos.x- nodeTileOrCoin.diameter/2.0, nodeTileOrCoin.pos.y- nodeTileOrCoin.diameter/2.0);
        this.w =  nodeTileOrCoin.diameter;
        this.h =  nodeTileOrCoin.diameter;
      }
      this.bottomRight = createVector(this.pos.x + this.w, this.pos.y + this.h);

    }
  }

//   constructor(nodeTileOrCoin, isTile, isCoin) {
//   this.reached = false;
//   this.distToFinish = 0.0;
//   this.isCoin = isCoin;
//
//   if(isTile){
//     this.pos = createVector(nodeTileOrCoin.pixelPos.x, nodeTileOrCoin.pixelPos.y);
//     this.w =  tileSize;
//     this.h =  tileSize;
//   }else if(isCoin){
//     this.pos = createVector(nodeTileOrCoin.pos.x- nodeTileOrCoin.diameter/2.0, nodeTileOrCoin.pos.y- nodeTileOrCoin.diameter/2.0);
//     this.w =  nodeTileOrCoin.diameter;
//     this.h =  nodeTileOrCoin.diameter;
//   }
//   this.bottomRight = createVector(this.pos.x + this.w, this.pos.y + this.h);
//
// }
  //------------------------------------------------------------------------------------------------------------------------------
   collision( ptl,  pbr) {//player dimensions
    if ((ptl.x <this.bottomRight.x && pbr.x > this.pos.x) &&( ptl.y < this.bottomRight.y && pbr.y > this.pos.y)) {
      this.reached = true;
      return true;
    }else if(level ==2 &&!this.isCoin && pbr.x < this.pos.x){
      this.reached = false;

    }else if(level==1&&pbr.x < this.pos.x){
      this.reached = false;

    }
    return false;
  }
//------------------------------------------------------------------------------------------------------------------------------
  //set the distance to finish by adding the distance to the finish for the node n plus the distance from this node to node n
  setDistanceToFinish(n) {
    this.distToFinish = n.distToFinish + dist(this.pos.x, this.pos.y, n.pos.x, n.pos.y);
  }
}
