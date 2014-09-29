function Step(googleStep){
  this.googleStep = googleStep;
  this.x1 = googleStep.start_location.B;
  this.y1 = googleStep.start_location.k;
  this.x2 = googleStep.start_location.B;
  this.y2 = googleStep.start_location.k;
  this.duration = googleStep.duration.value; //seconds
}

Step.prototype.m = function(){
  return (this.y2 - this.y1)/(this.x2 - this.x1);
}
Step.prototype.b = function(){
  return this.y1-(this.m() * this.x1);
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
