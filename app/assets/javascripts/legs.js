function Leg(){
  this.steps = []; 
}
Leg.prototype.addStepsFromResponse = function(response){
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
Step.prototype.m = function(){
  return (this.y2 - this.y1)/(this.x2 - this.x1);
}
Step.prototype.b = function(){
  return this.y1-(this.slope() * this.x1);
}
Step.prototype.duration = function(){
  return this.end_time - this.start_time;
}
Step.prototype.distance = function(){
  return Math.sqrt(Math.pow((this.x2 - this.x1)) + Math.pow((this.y2 - this.y1))) ;
}

Step.prototype.northPoint = function(){
  if(this.y1 < this.y2){
    return [this.x2, this.y2];
  }
  else{
    return [this.x1, this.y1];
  }
}
Step.prototype.southPoint = function(){
  if(this.y1 >= this.y2){
    return [this.x2, this.y2];
  }
  else{
    return [this.x1, this.y1];
  }
}