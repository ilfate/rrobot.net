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

    this.stage.addChild(this.container);  
    this.stage.update(); 
    createjs.Ticker.addListener(CanvasActions);
    createjs.Ticker.setFPS(30); 
    createjs.Ticker.useRAF = true;
  }
  
  this.getMapManifest = function() 
  {
    return [
      {src:"/images/game/tile1.png",id:"floor"},
      {src:"/images/game/tile1_damaged.png",id:"floor_d"},
      {src:"/images/game/tile2.png",id:"empty"},
      {src:"/images/game/block.png",id:"wall"}
    ];  
  }
  
  this.createMap = function() 
  {
    var map_container = new createjs.Container();
    map_container.x = this.width/2;  
    map_container.y = this.height/2;  
    this.map = new IL.Map(map_container);
    this.map.draw();
    
    this.addTick(function(elapsedTime){
      CanvasActions.map.draw();
    });
    this.container.addChild(map_container);
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

IL.Map = function(container) 
{
  this.container = container;
  this.needDraw = true;
  this.cells = [];
  this.cell_idx = [];
  this.cell_width = 32;
  this.map_radius = 3;
  this.x = 0;
  this.y = 0;
  this.Point = new IL.Point(0, 0);
  this.addX = function(val) {
    this.Point.x += val;
    this.needDraw = true;
  }
  this.addY = function(val) {
    this.Point.y += val;
    this.needDraw = true;
  }
  
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
  this.daleteCell = function(x, y) {
    var name = x + '_' + y;
    var idx = $.inArray(name, this.cell_idx)
    if(idx != -1) {
      //this.cells[idx] = '';
      this.cell_idx[idx] = '';
    }
  }
  this.loadCell = function(x, y)
  {
    var cells = ["floor","wall","floor_d"];
    var rand = Math.floor(Math.random() * 3);
    this.addSimpleCell(x, y, cells[rand]);
    return this.getCell(x, y);
  }
  
  this.getMiddlePoint = function()
  {
    return this.Point;
  }
  this.checkAllVisibleCells = function()
  {
    var middle = this.getMiddlePoint();
    var window_x = -this.map_radius;
    var window_y = -this.map_radius;
    for(var x = (middle.x - this.map_radius); x <= (middle.x + this.map_radius); x++,window_x++)
    {
      window_y = -this.map_radius;
      for(var y = (middle.y - this.map_radius); y <= (middle.y + this.map_radius); y++,window_y++)
      {
        var cell = this.getCell(x, y);
        if(!cell) {
          cell = this.loadCell(x, y);
        }
        cell.set(window_x, window_y);
        
      }
    }
  }
  this.draw = function() 
  {
    if(this.needDraw) 
    {
      this.checkAllVisibleCells();
      this.container.removeAllChildren();
      for(var i in this.cells) 
      {
        
        if(this.cells[i].visible) 
        {
          
          this.cells[i].draw(this.container, this.cell_width);
          this.cells[i].visible = false;
        }
      }
      this.needDraw = false;
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
  this.visible = false;
  this.shape = new createjs.Shape();
  this.window_point = new IL.Point(0, 0);
  if(Point) 
  {
    this.Point = Point;
  } else {
    info('error. Cell needs a Point object')
  }
  this.type = type ? type : 'empty';
  
  this.set = function(x, y)
  {
    this.window_point.x = x;
    this.window_point.y = y;
    this.visible = true;
  }
  
  this.draw = function(container, width) 
  {
    this.shape.graphics
      .clear()
      .beginBitmapFill(CanvasActions.getObject(this.type))
      .drawRect(width * this.window_point.x, width * this.window_point.y, width, width);
    container.addChild(this.shape);
  }
}

$(document).keypress(function(event) {
  info(event);
  switch(event.keyCode)
  {
    case 37:
      CanvasActions.map.addX(-1);
      break;
    case 38:
      CanvasActions.map.addY(-1);
      break;
    case 39:
      CanvasActions.map.addX(1);
      break;
    case 40:
      CanvasActions.map.addY(1);
      break;
  }
});

//$(document).bind("keydown", "up", function() { CanvasActions.map.addY(-1) });
//$(document).bind("keydown", "down", function() { CanvasActions.map.addY(1) });
//$(document).bind("keydown", "left", function() { CanvasActions.map.addX(1) });
//$(document).bind("keydown", "right", function() { CanvasActions.map.addY(-1) });