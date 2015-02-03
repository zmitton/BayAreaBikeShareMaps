function Step(googleStep){
  this.googleStep = googleStep;
  this.x1 = googleStep.start_location.lng();
  this.y1 = googleStep.start_location.lat();
  this.x2 = googleStep.end_location.lng();
  this.y2 = googleStep.end_location.lat();
  this.duration = googleStep.duration.value; //seconds
  this.startTime;
  this.endTime;
  // debugger;

}

Step.prototype.m = function(){
  if (this.x2 == this.x1){return 10000}; //infinite slope!
  return (this.y2 - this.y1)/(this.x2 - this.x1);
}
Step.prototype.b = function(){
  return this.y1-(this.m() * this.x1);
}

Step.prototype.distance = function(){
  return Math.sqrt(Math.pow((this.x2 - this.x1), 2) + Math.pow((this.y2 - this.y1), 2)) ;
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
