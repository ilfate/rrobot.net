/**
 * ILFATE PHP ENGINE
 * @autor Ilya Rubinchik ilfate@gmail.com
 * 2012
 */

CanvasActions = function() {
  
  this.tick_methods = [];
  this.objects = [];
  this.objects_names = [];
  this.stage = {};
  
  this.init = function()
  {
    this.stage = new createjs.Stage("demoCanvas");
    
//    this.circle_t();
	this.createMap();
    
	this.stage.update(); 
    createjs.Ticker.addListener(CanvasActions);
    createjs.Ticker.setFPS(30); 
    createjs.Ticker.useRAF = true;
  }
  
  this.createMap = function() 
  {
	  var map = new IL.Map();
	  map.addSimpleCell(0, 0, 'dirt');
	  map.addSimpleCell(1, 0, 'wall');
	  map.addSimpleCell(1, 1, 'wall');
	  map.addSimpleCell(0, 1, 'wall');
	  map.addSimpleCell(-1, 1, 'wall');
	  map.addSimpleCell(-1, 0, 'wall');
	  map.addSimpleCell(-1, -1, 'wall');
	  map.addSimpleCell(0, -1, 'wall');
	  map.addSimpleCell(1, -1, 'wall');
	  var square = new createjs.Shape();
	  square.graphics.beginFill("black").drawRoundRect(0,0,30,80,0);
	  square.x = 100;
	  square.y = 100;
	  this.stage.addChild(square);
  }
  
  this.circle_t = function () {
    
    circle = new createjs.Shape();
    circle.graphics.beginFill("red").drawCircle(0, 0, 50);
    circle.x = 100;
    circle.y = 100;
    circle.onTick = function(elapsedTime) {
      if(elapsedTime) {
        this.x += elapsedTime/1000*100;
        if(this.x > CanvasActions.stage.canvas.width) this.x = 0;
      }
      info(elapsedTime);
    }
    this.stage.addChild(circle);
    // stage.addChild(new createjs.Shape()).setTransform(100,100).graphics.f("red").dc(0,0,50);
    
    this.addTick(function(elapsedTime){
      // move 100 pixels per second (elapsedTimeInMS / 1000msPerSecond * pixelsPerSecond):
      // 
      // this will log a steadily increasing value:
//      console.log("FPS: "+createjs.Ticker.getMeasuredFPS());
    });
  }
  
  this.addObject = function(obj, name) {
	  this.objects.push(obj);
	  this.object_names.push(name);
  }
  this.getObject = function(name) {
	  var idx = $.inArray(name,this.object_names);
	  if(idx != -1) {
		  return this.objects[idx];
	  } else {
		  return false;
	  }
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
    this.stage.update(elapsedTime); 
  }
  
  this.stop = function() {
    createjs.Ticker.setPaused(true);
  }
  this.start = function() {
    createjs.Ticker.setPaused(false);
  }
}

CanvasActions = new CanvasActions();


function IL () {
  
}
IL = new IL();

IL.Map = function() 
{
  this.cells = [];
  this.cell_idx = [];
  
  this.addCell = function(Cell)
  {
		this.cells.push(Cell);
		var name = Cell.Point.x + '_' + Cell.Point.y;
		this.cell_idx.push(name);
  }
  this.addSimpleCell = function(x, y, area) {
	  this.addCell(new IL.Cell(new IL.Point(x, y), area))
  }
  this.getCell = function(x, y)
  {
	  var name = x + '_' + y;
	  var idx = $.inArray(name, this.cell_idx)
	  if(idx != -1) {
		  return this.cells[idx];
	  } else {
		  return false;
	  }
  }
  this.getMiddlePoint = function()
  {
	  return new ILPoint(0,0);
  }
  
}
  

IL.Point = function(x, y)
{
	this.x = x ? x : 0;
	this.y = y ? y : 0;
	this.set = function(x,y)
	{
		this.x = x;
		this.y = y;
		return this;
	}
}

IL.Cell = function(Point, area)
{
	if(Point) 
	{
		this.Point = Point;
	} else {
		info('error. Cell needs a Point object')
	}
	this.area = area ? area : 'empty';
}