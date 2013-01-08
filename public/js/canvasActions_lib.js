/**
 * ILFATE PHP ENGINE
 * @autor Ilya Rubinchik ilfate@gmail.com
 * 2012
 */

new function () {
  LibCanvas.extract();
  atom.ImagePreloader.run({ logo: '/files/img/html5-logo.png' },
    function (images) {
    var helper, element;
    helper = new App.Light(new Size(600, 400));
    element = helper.createImage(
    new Rectangle(64, 64, 256, 256),
    images.get('logo')
    );
    element.behaviors.get('draggable').start();
    [element.shape.from, element.shape.to].forEach(function (point) {
    var vector = helper.createVector(new Circle(point, 5))
    .setStyle({ fill: 'red' });
    vector.behaviors.get('draggable').start();
    });
  });
}; 
/*
CanvasActions = function() {
  
  this.tick_methods = [];
  this.objects = [];
  this.object_names = [];
  this.stage = {};

  this.libcanvas;
  this.images;
  
  this.init = function()
  {
    //this.libcanvas = new LibCanvas('#demoCanvas');
    
    LibCanvas.extract();
    info(atom.ImagePrealoader);
    new atom.ImagePrealoader({
//      prefix: '/images/game',
      images: {
          'map'           : '/images/game/map.png'
      },
      onReady: function (imagePreloader) {info('awd');
          CanvasActions.afterLoad(imagePreloader)
      }
    });
    info(1);
    
    info(atom);
    info(atom.ImagePrealoader);
    atom.ImagePrealoader.run({ unit: '/images/game/map.png' }, function (preloader) {
      alert(1);
    });
    info(2);
//    this.stage = new createjs.Stage("demoCanvas");
//    this.stage.enableMouseOver(10);
//    this.stage.mouseMoveOutside = true;
//    this.container = new createjs.Container();
//    this.width = $('#demoCanvas').width();
//    this.height = $('#demoCanvas').height();

//    var manifest = this.getMapManifest();
//    this.loader.loadManifest(manifest);
  
//    this.loader.onFileLoad = function(event){CanvasActions.handleFileLoad(event)};
//    this.loader.onComplete = function(){CanvasActions.afterLoad()};
  
  
  }
  
  this.afterLoad = function(imagePreloader)
  {
    this.images = imagePreloader;
    info('a');
//    this.createMap();  
//    this.createRobot();
    
//    this.stage.addChild(this.container);  
//    this.stage.update(); 
//    createjs.Ticker.addListener(CanvasActions);
//    createjs.Ticker.setFPS(30); 
//    createjs.Ticker.useRAF = true;
  }
}

CanvasActions = new CanvasActions();
 /**
  * 
 
  
  
  this.getMapManifest = function() 
  {
    return [
      {src:"/images/game/tile1.png",id:"floor"},
      {src:"/images/game/tile1_damaged.png",id:"floor_d"},
      {src:"/images/game/tile2.png",id:"empty"},
      {src:"/images/game/block.png",id:"wall"},
      {src:"/images/game/map.png",id:"map"}
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
  }
  
  this.createRobot = function()
  {
    var robot_container = new createjs.Container();
    this.robot = new IL.Robot(robot_container, this.map);
    this.robot.draw();
    this.map.bindObject(this.robot);
    this.addTick(function(elapsedTime){
      CanvasActions.robot.draw();
    });
    this.container.addChild(robot_container);
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
  this.binded_objects = [];
  this.cell_width = 64;
  this.map_radius = 4;
  this.vision_radius = 3;
  this.x = 0;
  this.y = 0;
  this.camera = new IL.Point(0, 0);
  this.center = new IL.Point(0, 0);
  this.centerPoint = new IL.Point(0, 0);
  
  this.animation = new IL.Animation("move");

  this.setCamera = function(x, y, speed) 
  {
    // if new point is out of vision radius we set this new point to our vision radius border
    if(Math.abs(x - this.center.x) > this.vision_radius * this.cell_width ) {
        x = this.center.x + this.vision_radius * this.cell_width * ( this.center.x > this.camera.x ? -1 : 1 );
      }
    if(Math.abs(y - this.center.y) > this.vision_radius * this.cell_width ) {
        y = this.center.y + this.vision_radius * this.cell_width * ( this.center.y > this.camera.y ? -1 : 1 );
//        info(y);
      }
    if(!speed) {
      this.camera.x = x;
      this.camera.y = y;
    } else {
      this.animation
        .setSpeed(speed)
        .setStart(this.camera)
        .setEnd(new IL.Point(x, y))
        .start();
    }
    this.needDraw = true;
  }
  this.move = function(x, y) 
  {
    this.center.x += x * this.cell_width;
    this.center.y += y * this.cell_width;
    this.centerPoint.x += x;
    this.centerPoint.y += y;
    this.setCamera(this.center.x, this.center.y, 250);//(this.map_radius * this.cell_width - this.center.distance(this.camera)) * 5 );
    this.needDraw = true;
  }
  var map = this;
  this.container.onPress = function(evt) 
  {
    var offset = {x: map.camera.x + evt.stageX, y: map.camera.y + evt.stageY};

    evt.onMouseMove = function(ev) 
    {
      map.setCamera(offset.x - ev.stageX, offset.y - ev.stageY);
    }
  }
  this.bindObject = function(obj)
  {
    this.binded_objects.push(obj);
  }
  this.getSpriteType = function(type) 
  {
    var x = 0;
    var y = 0;
    switch(type) {
      case  "floor" :
        x = 0;y = 0;
      break;
      case  "wall" :
        x = 8;y = 5;
      break;
      case  "wall_d1" :
        x = 7;y = 5;
      break;
      case  "wall_d2" :
        x = 6;y = 6;
      break;
      case  "wall_d3" :
        x = 6;y = 5;
      break;
      case  "floor_d" :
        x = 0;y = 1;
      break;
      case  "floor_1" :
        x = 2;y = 1;
      break;
      case  "floor_2" :
        x = 7;y = 0;
      break;
      case  "floor_3" :
        x = 3;y = 1;
      break;
      case  "floor_4" :
        x = 1;y = 1;
      break;
    }
    return {"x": x*this.cell_width,"y":y*this.cell_width};
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
      this.cell_idx[idx] = '';
    }
  }
  this.cells_options = [
    "floor", "floor", "floor", "floor", 
    "wall", "wall", "wall", "wall", "wall", "wall",
    "floor_d", 
    "floor_1", 
    "floor_2", 
    "floor_3", 
    "floor_4"
  ];
  this.loadCell = function(x, y)
  {
    var rand = Math.floor(Math.random() * this.cells_options.length);
    this.addSimpleCell(x, y, this.cells_options[rand]);
    return this.getCell(x, y);
  }
  
  this.getMiddlePoint = function()
  {
      return this.camera; 
  }
  this.checkAllVisibleCells = function()
  {
    var middle = this.getMiddlePoint();
    var pixel_radius = this.map_radius * this.cell_width;
    var left_border = middle.x - pixel_radius;
    var top_border = middle.y - pixel_radius;
    if(left_border < 0) {var left_cut = -(left_border % this.cell_width);} 
    else {var left_cut = (this.cell_width - left_border % this.cell_width);}
    if(top_border < 0) {var top_cut = -(top_border % this.cell_width);} 
    else {var top_cut = (this.cell_width - top_border % this.cell_width);}

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
      for(var i in this.binded_objects)
      {
        this.binded_objects[i].update();
      }
      if(this.animation.isRunning()) {
        this.camera = this.animation.tic();
      }
      this.checkAllVisibleCells();
      this.container.removeAllChildren();
      var cell_need_more_draw = false;
      for(var i in this.cells) 
      {
        if(this.cells[i].visible) 
        {
          if(this.cells[i].draw(this.container, this.cell_width))
          {
            cell_need_more_draw = true;
          }
          this.cells[i].visible = false;
        }
      }
      if(!this.animation.isRunning() && !cell_need_more_draw) {
        this.needDraw = false;
      }
    }
  }
  this.update = function()
  {
    this.needDraw = true;
  }
  
}
////////////////////////////////////////////////////////////////////////////////
///////////////////    ROBOT ///////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

IL.Robot = function(container, map)
{
  this.container = container;
  this.map = map;
  this.direction = 3;
  this.needDraw = true;
  
  this.container.x = this.map.container.x + this.map.cell_width / 2;
  this.container.y = this.map.container.y + this.map.cell_width / 2;
  
  this.point = new IL.Point(this.map.centerPoint.x, this.map.centerPoint.y);
  this.animation = new IL.Animation("move");
  
  this.img =  new createjs.Bitmap(CanvasActions.getObject("map"));
  this.img.sourceRect = new createjs.Rectangle(64, 128, 64, 64);
  this.img.regX = this.map.cell_width / 2;
  this.img.regY = this.map.cell_width / 2;
  
  
  this.move = function(x, y)
  {
    if(this.animation.isRunning()) return false;
    var cell = this.map.getCell(this.point.x + x, this.point.y + y);
    if(cell.isPassable()) 
    {
      this.animation.setStart(new IL.Point(this.point.x * this.map.cell_width, this.point.y * this.map.cell_width));
      this.point.x += x;
      this.point.y += y;
      this.animation
        .setEnd(new IL.Point(this.point.x * this.map.cell_width, this.point.y * this.map.cell_width))
        .setSpeed(150)
        .setType("move")
        .start();
      this.map.move(x, y);
      this.update();
    }
    return this;
  }
  this.rotate = function(side)
  {
    if(this.animation.isRunning()) return false;
    this.animation.setStart(this.img.rotation);
    if(side > 0) {
      this.direction++;
      if(this.direction > 3) {
        this.direction = 0;
        this.animation.setStart(-180);
      }
    }
    if(side < 0) {
      this.direction--;
      if(this.direction < 0) {
        this.direction = 3;
        this.animation.setStart(270);
      }
    }
    this.animation
      .setType("rotate")
      .setSpeed(150)
      .setEnd(90 * this.direction - 90)
      .start();
    this.needDraw = true;
    
    return this;
  }
  this.forward = function()
  {
    switch(this.direction){
      case 0:
        this.move(0, -1);
      break;
      case 1:
        this.move(1, 0);
      break;
      case 2:
        this.move(0, 1);
      break;
      case 3:
        this.move(-1, 0);
      break;
    }
  }
  this.backward = function()
  {
    switch(this.direction){
      case 0:
        this.move(0, 1);
      break;
      case 1:
        this.move(-1, 0);
      break;
      case 2:
        this.move(0, -1);
      break;
      case 3:
        this.move(1, 0);
      break;
    }
  }
  this.destroyWall = function()
  {
    var next = this.point.next(this.direction);
    var cell = this.map.getCell(next.x, next.y);
    if(cell.type == "wall")
    {
//      cell.setType("floor");
      cell.runAnimation("destroyWall");
      this.animation
        .setType("wait")
        .setSpeed(1000)
        .start();
      this.map.update();
    }
  }
  this.getPosition = function()
  {
    if(this.animation.isRunning() && this.animation.isType("move"))
    {
      return this.animation.getLast();
    } else {
      return new IL.Point(this.point.x * this.map.cell_width, this.point.y * this.map.cell_width);
    }
  }
  this.checkAngle = function()
  {
    if(this.animation.isRunning() && this.animation.isType("rotate")) {
        this.img.rotation = this.animation.getLast();
    } else {
      this.img.rotation = 90 * this.direction - 90;
    }
  }
  this.draw = function()
  {
    if(this.needDraw)
    {
      if(this.animation.isRunning()) {
        this.animation.tic();
      }
      this.container.removeAllChildren();
      var position = this.getPosition();
      this.checkAngle();
      
      this.img.x = -this.map.camera.x + position.x;
      this.img.y = -this.map.camera.y + position.y;
      
      this.container.addChild(this.img);
      if(!this.animation.isRunning()) {
        this.needDraw = false;
      }
    }
  }
  this.update = function()
  {
    this.needDraw = true;
  }
}
  
////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////   POINT    ///////////////
////////////////////////////////////////////////////////////////////////////////

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
  this.distance = function(point)
  {
    return Math.sqrt(Math.pow((point.x - this.x), 2) + Math.pow((point.y - this.y), 2));
  }
  this.next = function(direction)
  {
    switch(direction)
    {
      case 0:
        return new IL.Point(this.x, this.y - 1);
      case 1:
        return new IL.Point(this.x + 1, this.y);
      case 2:
        return new IL.Point(this.x, this.y + 1);
      case 3:
        return new IL.Point(this.x - 1, this.y);
        
    }
  }
}

////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////   CELL     ///////////////
////////////////////////////////////////////////////////////////////////////////

IL.Cell = function(Point, type)
{
  this.visible = false;
  this.shape = new createjs.Shape();
  this.window_point = new IL.Point(0, 0);
  this.cutLeft = 0;
  this.cutRight = 0;
  this.cutTop = 0;
  this.cutBottom = 0;
  
  this.newType = true;
  if(Point) 
  {
    this.Point = Point;
  } else {
    info('error. Cell needs a Point object')
  }
  
  this.setType = function(type)
  {
    this.type = type;
    this.sprite = CanvasActions.map.getSpriteType(type);
  }
  this.setType(type);
  
  this.runAnimation = function(name)
  {
    this.animation = new IL.Animation("spriteAnimation");
    this.animation
      .setSpeed(1000)
      .setStart(["wall_d1", "wall_d2", "wall_d3", "floor"])
      .start()
  }
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
  
  this.isPassable = function()
  {
    if(this.type == "wall" || this.type == "hole") {
      return false;
    }
    return true;
  }
  
  
  this.draw = function(container, width) 
  {
    if(this.newType) {
      this.bitmap = new createjs.Bitmap(CanvasActions.getObject("map"));
      this.bitmap.sourceRect = new createjs.Rectangle(0, 0, 0, 0);
      this.newType = false;
    }
    
    this.bitmap.x = width * this.window_point.x + this.cutLeft;
    this.bitmap.y = width * this.window_point.y + this.cutTop;
    this.bitmap.sourceRect.x = this.sprite.x + this.cutLeft;
    this.bitmap.sourceRect.y = this.sprite.y + this.cutTop;
    this.bitmap.sourceRect.width = width - this.cutLeft - this.cutRight;
    this.bitmap.sourceRect.height = width - this.cutTop - this.cutBottom;
    
    container.addChild(this.bitmap);
    
    if(this.animation && this.animation.isRunning())
    {
      var new_type = this.animation.tic();
      if(new_type != this.type)
      this.setType(new_type);
      return true;
    }
    return false; // false means that we dont need to draw it. well cell dont need
  }
}

////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////   ANIMATION    ///////////
////////////////////////////////////////////////////////////////////////////////
IL.Animation = function(type)
{
  this.startObj;
  this.endObj;
  this.type = type;
  this.started = false;
  this.working = false;
  this.repeat = false;
  this.speed = 0;
  this.start_time = 0;
  this.last_tic = false;
  
  this.start = function(repeat)
  {
    this.started = true;
    this.working = true;
    this.start_time = 0;
    this.repeat = !!repeat;
    return this;
  }
  this.stop = function() {
    this.working = false;
    return this;
  }
  this.isRunning = function() {
    return this.working;
  }
  this.setStart = function(e)
  {
    this.startObj = e;
    return this;
  }
  this.setEnd = function(e)
  {
    this.endObj = e;
    return this;
  }
  this.setSpeed = function(speed)
  {
    this.speed = speed;
    return this;
  }
  this.setType = function(type)
  {
    this.type = type;
    return this;
  }
  this.isType = function(type)
  {
    return this.type === type;
  }
  this.tic = function()
  {
    if(!this.working) {
      info('WTF tic try but animation is not working');
      return false;
    }
    
    if(!this.start_time)
    {
      this.start_time = new Date().getTime();
    }
    var time = new Date().getTime();
    var dT = time - this.start_time;
    if(dT >= this.speed) {
      dT = this.speed;
      this.stop();
    }
    var k = dT / this.speed;
    switch(this.type) {
      case "move":
        var dX = (this.endObj.x - this.startObj.x) * k + this.startObj.x;
        var dY = (this.endObj.y - this.startObj.y) * k + this.startObj.y;
        this.last_tic = new IL.Point(dX, dY);
        return this.last_tic;
      break;
      
      case "rotate":
        this.last_tic = (this.endObj - this.startObj) * k + this.startObj;
        return this.last_tic;
        break;
        
      case "spriteAnimation":
        var idx = Math.round(this.startObj.length * k);
        if(idx == this.startObj.length) idx = this.startObj.length - 1;
        this.last_tic = this.startObj[idx];
        return this.last_tic;
        break;
      case "wait":
        this.last_tic = true;
        return this.last_tic;
        break;
    }
    return false;
  }
  this.getLast = function()
  {
    return this.last_tic;
  }
}

$(document).keypress(function(event) {
//  info(event);
  switch(event.keyCode)
  {
    case 37: // left
      //CanvasActions.robot.move(-1, 0);
      CanvasActions.robot.rotate(-1);
      break;
    case 38: // down
//      CanvasActions.robot.move(0, -1);
      CanvasActions.robot.backward();
      break;
    case 39: // right
//      CanvasActions.robot.move(1, 0);
      CanvasActions.robot.rotate(1);
      break;
    case 40: // up
      CanvasActions.robot.forward();
      break;
    case 13:  // Enter
      break;
    case 0 :
      switch(event.charCode)
      {
        case 119 : // w
          CanvasActions.robot.forward();
          break;
        case 97 : // a
          CanvasActions.robot.rotate(-1);
          break;
        case 115 : // s
          CanvasActions.robot.backward();
          break;
        case 100 : // d
          CanvasActions.robot.rotate(1);
          break;
        case 32 :  // space
          break;
        case 101 :  // e
          CanvasActions.robot.destroyWall();
          break;
        case 114 :  // r
          break;
        case 102 :  // f
          break;
      }
      break;
  }
});

//*/