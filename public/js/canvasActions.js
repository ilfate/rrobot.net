/**
 * ILFATE PHP ENGINE
 * @autor Ilya Rubinchik ilfate@gmail.com
 * 2012
 */

CanvasActions = function() {
  
  this.tick_methods = [];
  this.objects = [];
  this.object_names = [];
  this.stage = {};
  this.loader = new createjs.PreloadJS();
  this.assets = [];
  
  
  this.init = function()
  {
    this.stage = new createjs.Stage("demoCanvas");
	this.container = new createjs.Container();
	this.width = $('#demoCanvas').width();
	this.height = $('#demoCanvas').height();
	
	var manifest = this.getMapManifest();
    this.loader.loadManifest(manifest);
	
    this.loader.onFileLoad = function(event){CanvasActions.handleFileLoad(event)};
    this.loader.onComplete = function(){CanvasActions.afterLoad()};
	
	
  }
  
  this.afterLoad = function()
  {
	this.createMap();  
	  
	this.container.x = this.width/2;  
	this.container.y = this.height/2;  
	this.stage.addChild(this.container);  
    this.stage.update(); 
    createjs.Ticker.addListener(CanvasActions);
    createjs.Ticker.setFPS(30); 
    createjs.Ticker.useRAF = true;
  }
  
  this.getMapManifest = function() {
	return [
      {src:"/images/game/tile1.png",id:"floor"},
      {src:"/images/game/tile1_damaged.png",id:"floor_d"},
      {src:"/images/game/tile2.png",id:"empty"},
      {src:"/images/game/block.png",id:"wall"}
    ];  
  }
  
  this.createMap = function() 
  {
    
	
    
    var map = new IL.Map();
	cells = ["floor","wall","floor_d"];
	for(var x = -5; x < 5; x++)
	{
		for(var y = -5; y < 5; y++)
		{
			var rand = Math.floor(Math.random() * 3);
			map.addSimpleCell(x, y, cells[rand]);
		}
	}
//    map.addSimpleCell(0, 0, 'floor');
//    map.addSimpleCell(1, 0, 'wall');
//    map.addSimpleCell(1, 1, 'wall');
//    map.addSimpleCell(0, 1, 'wall');
//    map.addSimpleCell(-1, 1, 'wall');
//    map.addSimpleCell(-1, 0, 'wall');
//    map.addSimpleCell(-1, -1, 'wall');
//    map.addSimpleCell(0, -1, 'wall');
//    map.addSimpleCell(1, -1, 'wall');
    
	map.draw(this.container);
    
   // var square = new createjs.Shape();
   // square.graphics.beginFill("black").drawRoundRect(0,0,30,80,0);
    
    //this.container.addChild(square);
//    container.x = 100;
//    container.y = 100;
    //container.rotation = 90;
    
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
  this.handleFileLoad = function(event) {
    //CanvasActions.assets.push(event);
	this.addObject(event.result, event.id);
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
  this.cell_width = 32;
  
  this.addCell = function(Cell)
  {
    this.cells.push(Cell);
    var name = Cell.Point.x + '_' + Cell.Point.y;
    this.cell_idx.push(name);
  }
  this.addSimpleCell = function(x, y, type) {
    this.addCell(new IL.Cell(new IL.Point(x, y), type))
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
  this.draw = function(container) {
	  for(var i in this.cells) {
		  this.cells[i].draw(container, this.cell_width);
	  }
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

IL.Cell = function(Point, type)
{
  if(Point) 
  {
    this.Point = Point;
  } else {
    info('error. Cell needs a Point object')
  }
  this.type = type ? type : 'empty';
  
  this.draw = function(container, width) {
	  var cell = new createjs.Shape();
	  cell.graphics
		.beginBitmapFill(CanvasActions.getObject(this.type))
		.drawRect(width * this.Point.x, width * this.Point.y, width, width);
	  container.addChild(cell);
  }
}