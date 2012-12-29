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
    this.stage.enableMouseOver(10);
    this.stage.mouseMoveOutside = true;
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
	//container.x = 100;
	//container.y = 100;
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
  this.container_def_point = new IL.Point(container.x, container.y)
  this.needDraw = true;
  this.cells = [];
  this.cell_idx = [];
  this.cell_width = 32;
  this.map_radius = 5;
  this.vision_radius = 15;
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
  this.set = function(x, y) {
	if(Math.abs(x) <= this.vision_radius * this.cell_width ) {
		this.Point.x = x;
	}
	if(Math.abs(y) <= this.vision_radius * this.cell_width ) {
		this.Point.y = y;
	}
	this.needDraw = true;
  }
  var map = this;
  this.container.onPress = function(evt) 
  {
    var offset = {x: map.Point.x + evt.stageX, y: map.Point.y + evt.stageY};

    evt.onMouseMove = function(ev) 
    {
	  map.set(offset.x - ev.stageX, offset.y - ev.stageY);
    }
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
	var pixel_radius = this.map_radius * this.cell_width;
	var left_border = middle.x - pixel_radius;
	var top_border = middle.y - pixel_radius;
	if(left_border < 0) { var left_cut = -(left_border % this.cell_width); } 
	else { var left_cut = (this.cell_width - left_border % this.cell_width); }
	if(top_border < 0) { var top_cut = -(top_border % this.cell_width); } 
	else { var top_cut = (this.cell_width - top_border % this.cell_width); }
	
	if(left_cut) {
		this.container.x = this.container_def_point.x - (this.cell_width - left_cut);
	} else {
		this.container.x = this.container_def_point.x;
	}
	if(top_cut) {
		this.container.y = this.container_def_point.y - (this.cell_width - top_cut);
	} else {
		this.container.y = this.container_def_point.y;
	}
	var cells_to_left = (Math.floor(left_border / this.cell_width));
	var cells_to_top = (Math.floor(top_border / this.cell_width));
	var row_end = cells_to_left + this.map_radius*2 + 1 + ((left_cut == 0) ? 0 : 1);
	var col_end = cells_to_top + this.map_radius*2 + 1 + ((top_cut == 0) ? 0 : 1);
	
    var window_x = -this.map_radius;
    var window_y = -this.map_radius;
    for(var x = cells_to_left; x < row_end; x++,window_x++)
    {
      window_y = -this.map_radius;
      for(var y = cells_to_top; y < col_end; y++,window_y++)
      {
        var cell = this.getCell(x, y);
        if(!cell) {
          cell = this.loadCell(x, y);
        }
        cell.set(window_x, window_y);
		if(left_cut) {
			if(x == cells_to_left) {
				cell.cutX(left_cut - this.cell_width);
			} else if(x == row_end-1) {
				cell.cutX(left_cut);
			} else {
				cell.cutX(0);
			}
		} else {
			cell.cutX(0);
		}
		if(top_cut) {
			if(y == cells_to_top) {
				cell.cutY(top_cut - this.cell_width);
			} else if(y == col_end-1) {
				cell.cutY(top_cut);
			} else {
				cell.cutY(0);
			}
		} else {
			cell.cutY(0);
		}
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
  this.cutLeft = 0;
  this.cutRight = 0;
  this.cutTop = 0;
  this.cutBottom = 0;
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
  this.cutX = function(cut) {
	  if(cut < 0) {
		this.cutLeft = -cut;
		this.cutRight = 0;
	  } else if(cut > 0) {
		this.cutLeft = 0;
		this.cutRight = cut;
	  } else {
		this.cutRight = this.cutLeft = 0;  
	  }
  }
  this.cutY = function(cut) {
	  if(cut < 0) {
		this.cutTop = -cut;
		this.cutBottom = 0;
	  } else if(cut > 0) {
		this.cutTop = 0;
		this.cutBottom = cut;
	  } else {
		this.cutTop = this.cutBottom = 0;  
	  }
  }
  
  this.draw = function(container, width) 
  {
	this.bitmap = new createjs.Bitmap(CanvasActions.getObject(this.type));
	this.bitmap.x = width * this.window_point.x + this.cutLeft;
	this.bitmap.y = width * this.window_point.y + this.cutTop;

	this.bitmap.sourceRect = new createjs.Rectangle(this.cutLeft, this.cutTop, width - this.cutLeft - this.cutRight, width - this.cutTop - this.cutBottom);
	container.addChild(this.bitmap);
	//this.bitmap.sourceRect = new createjs.Rectangle(-10,0, width, width);
	//this.bitmap.cache(10,10,width,width);
	//this.bitmap.updateCache();
	
	//info(this.bitmap.sourceRect);
	/*
    this.shape.graphics
      .clear()
      .beginBitmapFill(this.bitmap.image)
      .drawRect(width * this.window_point.x, width * this.window_point.y, width -15 , width);
	  
	this.shape.x = -15; 
	
    container.addChild(this.shape);
	*/
  }
}

$(document).keypress(function(event) {
//  info(event.keyCode);
  switch(event.keyCode)
  {
    case 37:
      CanvasActions.map.addX(-8);
      break;
    case 38:
      CanvasActions.map.addY(-8);
      break;
    case 39:
      CanvasActions.map.addX(8);
      break;
    case 40:
      CanvasActions.map.addY(8);
      break;
  }
});