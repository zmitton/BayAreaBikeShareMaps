function Leg(){
  this.steps = []; 
}
Leg.prototype.addStepsFromResponse(response){
  //loops through and adds all the steps to this leg
}

function Step(x1, y1, x2, y2, start_time, end_time){
  this.x1 = x1; 
  this.y1 = y1; 
  this.x2 = x2; 
  this.y2 = y2;
  this.start_time = start_time ;
  this.end_time = end_time;
}
Step.prototype.m(){
  return (this.y2 - this.y1)/(this.x2 - this.x1);
}
Step.prototype.b(){
  return this.y1-(this.slope() * this.x1);
}
Step.prototype.duration(){
  return this.end_time - this.start_time;
}
Step.prototype.distance(){
  return Math.sqrt((this.x2 - this.x1)** + (this.y2 - this.y1)**) ;
}

Step.prototype.northPoint(){
  if(this.y1 < this.y2){
    return [this.x2, this.y2];
  }
  else{
    return [this.x1, this.y1];
  }
}
Step.prototype.southPoint(){
  if(this.y1 >= this.y2){
    return [this.x2, this.y2];
  }
  else{
    return [this.x1, this.y1];
  }
}