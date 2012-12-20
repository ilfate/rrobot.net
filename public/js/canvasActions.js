/**
 * ILFATE PHP ENGINE
 * @autor Ilya Rubinchik ilfate@gmail.com
 * 2012
 */

CanvasActions = function() {
  
  this.close = function()
  {
    $('#ilfateModal').modal('hide')
  }
  
  this.init = function()
  {
    
    stage = new createjs.Stage("demoCanvas");
    circle = new createjs.Shape();
    circle.graphics.beginFill("red").drawCircle(0, 0, 50);
    circle.x = 100;
    circle.y = 100;
    stage.addChild(circle);
    // stage.addChild(new createjs.Shape()).setTransform(100,100).graphics.f("red").dc(0,0,50);
    stage.update(); 
  
    createjs.Ticker.addListener(window);
    createjs.Ticker.setFPS(30); 
    createjs.Ticker.useRAF = true;
    
  }
}

CanvasActions = new CanvasActions();


  
  
function tick(elapsedTime) {
    // move 100 pixels per second (elapsedTimeInMS / 1000msPerSecond * pixelsPerSecond):
    circle.x += elapsedTime/1000*100;
    if(circle.x > stage.canvas.width) circle.x = 0;
    // this will log a steadily increasing value:
    console.log("FPS: "+createjs.Ticker.getMeasuredFPS());
    stage.update(); 
}