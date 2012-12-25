/**
 * ILFATE PHP ENGINE
 * @autor Ilya Rubinchik ilfate@gmail.com
 * 2012
 */

CanvasActions = function() {
  
  this.tick_methods = [];
  
  this.init = function()
  {
    stage = new createjs.Stage("demoCanvas");
    
    this.circle_t();
    
    createjs.Ticker.addListener(CanvasActions);
    createjs.Ticker.setFPS(30); 
    createjs.Ticker.useRAF = true;
  }
  
  this.circle_t = function () {
    
    circle = new createjs.Shape();
    circle.graphics.beginFill("red").drawCircle(0, 0, 50);
    circle.x = 100;
    circle.y = 100;
    circle.onTick = function(elapsedTime) {
      if(elapsedTime) {
        this.x += elapsedTime/1000*100;
        if(this.x > stage.canvas.width) this.x = 0;
      }
      info(elapsedTime);
    }
    stage.addChild(circle);
    // stage.addChild(new createjs.Shape()).setTransform(100,100).graphics.f("red").dc(0,0,50);
    stage.update(); 
    this.addTick(function(elapsedTime){
      // move 100 pixels per second (elapsedTimeInMS / 1000msPerSecond * pixelsPerSecond):
      // 
      // this will log a steadily increasing value:
//      console.log("FPS: "+createjs.Ticker.getMeasuredFPS());
    });
  }
  
  this.addTick = function(func) {
    this.tick_methods.push(func);
  }
  
  this.tick = function(elapsedTime) {
    if(this.tick_methods) 
    {
      for(var i in this.tick_methods) 
      {
        this.tick_methods[i](elapsedTime);
      }
    }
    stage.update(elapsedTime); 
  }
  
  this.stop = function() {
    createjs.Ticker.setPaused(true);
  }
  this.start = function() {
    createjs.Ticker.setPaused(false);
  }
}

CanvasActions = new CanvasActions();


  
  
