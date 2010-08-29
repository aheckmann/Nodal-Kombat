;(function($, io, toString){
  io.setPath("/js/socketio/")

  window.ko = {
    handle: 
    { jump: function(){ log("ko.jump"); log(arguments) }
    , punch: function(){ log("ko.punch"); log(arguments) }
    , start: function(){ log("ko.start"); log(arguments) }
    , playerquit: function(){ log("playerquit"); log(arguments) }
    , countdown: function(){ log("countdown"); log(arguments) }
    , status: function(){log("status: gameover");log(arguments) }
    , kill: function(killer, victim){ log("%s killed %s", killer, victim) }
    , chatspeed: function(speed){ log("set the game speed to %s", speed) }
    }
  , send: function(events){
      if (!events) return
      if ("[object Array]" != toString.call(events)){
        events = [events];
      }
      socket.send(events)
    }
  , join: function(){
      socket.send("join")
    }
  }

  var socket = new io.Socket(location.hostname)
  socket.connect()
  socket.on("message", function(message){
    //console.dir(message)
    
    // don't use JSON.parsing, too slow
    // "jump#40,400,60|punch|gameover"

    var msg = message.split("|")
      , ko = window.ko
      , tok
    while (tok = msg.shift()){
      tok = tok.split("#")
      ko.handle[tok[0]].apply(ko, tok.length > 1 ? tok[1].split(",") : [])
    }

  })



function Sprite(url, col_w, row_h, w, h) {
	this.col_w = col_w;
	this.row_h = row_h;
	this.w = w;
	this.h = h;
	this.simg = new SmartImage(url);
}


function Animation(sprite, runtime) {
	this.sprite = sprite;
	this.time = 0;
	this.order = [];
	this.runtime = runtime;
}
Animation.prototype.enter_frame = function() {
	this.time = (this.time + game.slice) % this.runtime;
};
Animation.prototype.add_image = function(col, row) {
	this.order.concat([row, col]);
};

Animation.prototype.draw = function(ctx, x, y, scale) {
	var frame = ~~((this.time / this.runtime) * (this.order.length));
	var col = this.order[frame].c;
	var row = this.order[frame].r;
	try {
		ctx.drawImage(this.sprite.simg.img, this.sprite.col_w * col, this.sprite.row_h * row, this.sprite.w, this.sprite.h, x, y, this.sprite.w * scale, this.sprite.h * scale);
	}
	catch (e) {
		log("error: " + e.message);
		log("draw(" + ctx + ", " + x + ", " + y + ", " + scale);
		log("Row = " + row + ", col = " + col);
	}
};





  function SmartImage(src, callback) {
    var that = this;
    this.img = new Image();
    this.src = src;
    this.img.onload = function () {
      log("Loaded " + src);
      callback && callback(that.img);
      SmartImage.queue.splice(SmartImage.queue.indexOf(that), 1);
      if (!SmartImage.queue.length) {
        SmartImage.callback();
      }
    };
    this.img.onerror = function () {
      log("Error: Couldn't load image " + src);
    }
	  SmartImage.queue.push(this);
	}
  
  SmartImage.load_all = function(callback) {
    ////log("Loading all...");
    SmartImage.callback = callback;
    for (var i = 0; i < SmartImage.queue.length; i++) {
      SmartImage.queue[i].img.src = SmartImage.queue[i].src;
    }
  };
  SmartImage.queue = [];
		


  function Platform(url, plat_data) {
    this.simg = new SmartImage(url + plat_data.image);
    this.x = plat_data.left;
    this.y = plat_data.top;
			
    var poly_sh = new b2PolyDef();
    poly_sh.vertexCount = plat_data.polygon.length / 2;
    for (var i = 0; i < plat_data.polygon.length / 2; i++) {
      poly_sh.vertices[i].Set(plat_data.polygon[i*2], plat_data.polygon[i*2+1]);
    }
    poly_sh.restitution = 0.2;
    poly_sh.friction = 0.4;

    var poly_bd = new b2BodyDef();				
    poly_bd.AddShape(poly_sh);
    poly_bd.position.Set(0, 0);
						
    this.body = physics.world.CreateBody(poly_bd);			
  }


  function View(canvas_id) {
    this.canvas = document.getElementById(canvas_id);
    this.ctx = this.canvas.getContext('2d');
    this.ox = this.canvas.width * .5;
    this.oy = this.canvas.height * .5;
  } 
  
  // !Rendering the scene
  
  View.prototype.render = function(camera) {
    var camWidth = camera.width
      , camHeight = camera.height
      , cam_aspect = camWidth / camHeight
      , canvWidth = this.canvas.width
      , canvHeight = this.canvas.height
      , view_aspect = canvWidth / canvHeight
      , lev = level
      , h_added
      , w_added
      , view_box = 
        { x: camera.x
        , y: camera.y
        , width: camWidth
        , height: camHeight
        }
      ;
			
    if (cam_aspect > view_aspect) {
      h_added = (view_box.width * (view.canvas.height / canvWidth) - view_box.height) * .5;
      view_box.y -= h_added;
      view_box.height += h_added * 2;
		} 
    else {
      w_added = (view_box.height * (canvWidth / canvHeight) - view_box.width) * .5;
      view_box.x -= w_added;
      view_box.width += w_added * 2;
    }
			
    var scale = canvWidth / view_box.width
		  , bg = lev.background.img
      , px = (((view_box.x + view_box.width * .5) + lev.w) / (lev.w * 2))
      , py = (((view_box.y + view_box.height * .5) + lev.h) / (lev.h * 2))
      , fx = -view_box.x * scale
      , fy = -view_box.y * scale
      ;
				
    px = Math.max(Math.min(1, px), 0);
    py = Math.max(Math.min(1, py), 0);
    var bx = (canvWidth - bg.width) * px
      , by = (canvHeight - bg.height) * py
      , ctx = this.ctx
      ;
				
    // Draw background	
    ctx.drawImage(bg, bx, by, bg.width, bg.height);
			
    // Draw players
    var players = camera.players
      , len = players.length
    while (len--)
      players[len].draw(ctx, fx, fy, scale);
			
    // Draw platforms
    var platforms = lev.platforms
      , len = platforms.length
      , plat
      , img
    while (len--){
      plat = platforms[len];
      img = plat.simg.img;
      ctx.drawImage(
        img
      , fx + plat.x * scale
      , fy + plat.y * scale
      , img.width * scale
      , img.height * scale
      );
    }
		
    drawWorld(physics.world, ctx, fx, fy, scale);
  }
		
		
  function Physics() {
    var world = new b2AABB();
    world.minVertex.Set(-2000, -2000);
    world.maxVertex.Set(2000, 2000);
    var gravity = new b2Vec2(0, 250);
    var doSleep = true;
    this.world = new b2World(world, gravity, doSleep);
  }
  Physics.prototype.step = function () {
    this.world.Step(Math.min(1 / 20, game.slice / 600), 3);
  }

  function Keyboard() {
    var that = this;
    
    this.map = {'38':'up', '39':'right', '40':'down', '37':'left', '32':'space'};
    
    for (var i in this.map) {
      this[this.map[i]] = {down: false, first: false};
    }
    
    $(document).keydown(function (event) {
      if (that.map[event.which]) {
        var key = that[that.map[event.which]];				
        key.down = true;
        return false;
      }
      return true;
    });
    
    $(document).keyup(function (event) {
      if (that.map[event.which]) {
        var key = that[that.map[event.which]];
        key.down = false;
      }
    });	
  }
  Keyboard.prototype.monitor = function() {
    for (var i in this.map) {
      var key = this[this.map[i]];
      key.first = (key.down) ? false : true;
    }
  };
		
		
  function Camera(spring, margin_x, margin_top, margin_bottom) {
    this.x = -200;
    this.y = -500;
    this.width = 400;
    this.height = 240;
    this.margin_x = margin_x;
    this.margin_top = margin_top;
    this.margin_bottom = margin_bottom;
    this.spring = spring;
    this.target = {
      left: -400,			
      top: -400,
      right: 400,
      bottom: 0,				
    };
    this.players = [];
  }
  Camera.prototype.update = function() {
    // Track players
    if (this.players.length > 0) {
      this.target = {left: 1000, top: 1000, right: -1000, bottom: -1000};
      for (var i = 0; i < this.players.length; i++) {
        var p = this.players[i];
        //console.dir(p.body);
        this.target.left = Math.min((p.x - this.margin_x), this.target.left);
        this.target.right = Math.max((p.x + this.margin_x), this.target.right);
        this.target.top = Math.min((p.y - this.margin_top), this.target.top);
        this.target.bottom = Math.max((p.y + this.margin_bottom), this.target.bottom);
      }
    }
    var right = this.x + this.width,
      bottom = this.y + this.height;
    this.x += (this.target.left - this.x) * this.spring;
    this.y += (this.target.top - this.y) * this.spring;
    right += (this.target.right - right) * this.spring;
    bottom += (this.target.bottom - bottom) * this.spring;
    this.width = right - this.x;
    this.height = bottom - this.y;
  };


  function Level(canvas_id) {
    this.background = null;
    this.platforms = [];
    this.w = 0;
    this.h = 0;
    this.start_x = 0;
    this.start_y = 0;
  }
  Level.prototype.load = function(name, callback) {
    var that = this,
      url = "/levels/" + name + "/";
    
    $.getJSON(url + "data.json", function(data) {
      that.deathline = data.deathline;
      that.background = new SmartImage(url + data.background);
      that.w = data.horizontal;
      that.h = data.vertical;
      that.start_x = data.start_x;
      that.start_y = data.start_y;
      for (var i = 0; i < data.platforms.length; i++) {
        var new_platform = new Platform(url, data.platforms[i]);
        that.platforms.push(new_platform);
      }
      SmartImage.load_all(function() {
        callback();											
      });
    });
  };
  
  
  function NPC(id, x, y) {
    this.id = id;
    this.x = x;
    this.y = y;
    NPC.hash[id] = this;
  }
  NPC.prototype.draw = function(ctx, ox, oy, scale) {
    ctx.fillStyle = "#f00";
    ctx.fillRect(ox + this.x * scale - 5, oy + this.y * scale - 5, 10, 10);
  };
  NPC.prototype.moveTo = function(x, y) {
    this.x = x;
    this.y = y;
  };

  NPC.hash = [];
  
  /*
  function Sprite(url, col_w, row_h, w, h) {
    this.col_w = col_w;
    this.row_h = row_h;
    this.w = w;
    this.h = h;
    this.sheet = new SmartImage(url);
  }
  
  
  function Animation(sprite) {
    this.sprite = sprite;
    this.
  }
  Animation.prototype.enter_frame = function() {
    this.frame = (this.frame + 1) % this.images.length;
  };
  Animation.prototype.add_image = function(url) {
    this.images.push(new SmartImage(url));
  };
  Animation.prototype.draw(ctx, x, y, scale) {
    
  };
  */
  
  function Player(id, x, y) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.r = 8;
    this.lastHitBy = null;
    this.air_jump = true;
    this.body = this._build_body();
  } 
  Player.prototype.push = function() {
    var data = {method: "position", args: [this.id, this.x, this.y] }
    if (!this.DEAD && this.y < level.deathline){
      this.DEAD = true
      data = [data, {method: "die", args:[this.lastHitBy || this.id]}];
    }
    ko.send(data);
  };
  Player.prototype.moveTo = function(x, y) {
    this.x = this.body.m_position.x = x;
    this.y = this.body.m_position.y = y;
  };
Player.prototype.draw = function(ctx, ox, oy, scale) {
	this.x = this.body.m_position.x;
	this.y = this.body.m_position.y;
	//ctx.fillStyle = "#f00";
	//ctx.fillRect(ox + this.x * scale - 5, oy + this.y * scale - 5, 10, 10);
	
	animation['run'].enter_frame();
	animation['run'].draw(ctx, ox + (this.x - 32) * scale, oy + (this.y - 115) * scale, scale);
};		
  Player.prototype._build_body = function() {
    var circle = new b2CircleDef();
    circle.density = 0.25;
    circle.restitution = -0.1;
    circle.radius = this.r;
    circle.friction = 1.5;
    
    var rect = new b2PolyDef();
    rect.vertexCount = 4;
    rect.vertices[0].Set(-this.r, 0);
    rect.vertices[1].Set(-this.r, -128);
    rect.vertices[2].Set(this.r, -128);
    rect.vertices[3].Set(this.r, 0);
    
    var body = new b2BodyDef();
    body.AddShape(circle);
    body.position.Set(this.x, this.y);
    body.angularDamping = 0.7;
    body.linearDamping = 0.01;
    body.allowSleep = false;
    
    return physics.world.CreateBody(body);		
  };
  Player.prototype.handle_input = function() {
    if (keyboard.left.down && !keyboard.right.down) {
      this._run(-1);
    }
    else if (keyboard.right.down && !keyboard.left.down) {
      this._run(1);
    }
    if (keyboard.space.down && keyboard.space.first) {
      this._jump();
    }
    if (this.body.GetContactList()) {
      this.air_jump = true;
    }
  };
  
// !Player movement

	Player.prototype._run = function(x) {
    var offset = b2Math.AddVV(this.body.GetCenterPosition(), new b2Vec2(0, -this.r * 15));
/*			for (var k in this.body) {
				if (typeof(this.body[k]) === 'function') {
					log(k);
				}
			}
*/
//			this.body.ApplyForce(new b2Vec2(x * 15, 0), offset);
    this.body.ApplyForce(new b2Vec2(x * 15000, 0), this.body.GetCenterPosition());
    this.body.ApplyTorque(1500000 * x);
  };
  Player.prototype._jump = function() {
    var contact = this.body.GetContactList();
    while (contact) {
      //console.dir(contact);
      if (contact.contact.m_manifold[0].normal.y < 0) {
        this.air_jump = true;
        this.body.ApplyImpulse(new b2Vec2(0, -11000), this.body.GetCenterPosition());					
        return;
      }
      contact = contact.next;
    }
    if (this.air_jump) {
      this.air_jump = false;
      this.body.ApplyImpulse(new b2Vec2(0, -11000), this.body.GetCenterPosition());					
      return;
    }			
  };
  
  
  function Game() {
    this.target_fps = 77;	// 80 seems to be the max Chrome can handle
    this.frame = 0;
    this.slice = 0;		// Current time slice
    this.tick = 0;
    this.fps = 0;
    this.fps_lastframe = 0;
    this.fps_lasttick = 0;
  }
  Game.get_tick = function () {
    return new Date().getTime();
  };
  Game.prototype.update_fps = function () {
    var frame_difference = this.frame - this.fps_lastframe;
    if (frame_difference > this.target_fps) {
      this.fps = ~~((frame_difference / (this.tick - this.fps_lasttick)) * 1000);
      this.fps_lastframe = this.frame;
      this.fps_lasttick = this.tick;
    }
  };
  Game.prototype.update_slice = function () {
    var tick = Game.get_tick();
    this.slice = tick - this.tick;
    this.tick = tick;
  };
  Game.prototype.start = function() {	
    this.tick = Game.get_tick();
  }
  
  
  
  
  var game = new Game();
  var level = new Level();
  var view = new View('arena');
  var physics = new Physics();
  var keyboard = new Keyboard();
  var camera = new Camera(.1, 100, 200, 200);
  var player;
	var animation = {};
	animation['run'] = new Animation(new Sprite('/characters/aaron.png', 64, 128, 64, 128), 1000);
	animation['run'].order = [
		{c: 0, r:0},
		{c:1, r:0},
		{c:2, r:0},
		{c:3, r:0}
	];
	   
     
  var SINGLE_USER = true;
  
  //camera.target = player;
  
  ko.handle.receiveid = function(id) {
  	if (SINGLE_USER) {
	  	return;	
  	} 
    player = window.player = new Player(id, 0, -250);		
    camera.players.push(player);			
  }

  ko.handle.playerjoin = function() {
    log("Player joined with ids: %s", Array.prototype.slice.call(arguments, 0).join(","));
    for (var i = 0; i < arguments.length; i++) {
      var id = arguments[i];
      if (id === player.id) {
        player.moveTo(i * 50, -250);
      }
      else if (!NPC.hash[id]) {
        var new_npc = new NPC(id, i * 50, -250);
        camera.players.push(new_npc);
      }
    }
  };
  
  ko.handle.status = function(status){
    log("status: "+status)
    if ("gameover" === status)
      clearInterval(ko._gameTimer)
  }
  
  ko.handle.position = function(id, x, y) {
    var players = camera.players
      , len = players.length
      , p
    while (len--){
      p = players[len];
      if (p.id == id) {
        p.moveTo(x, y);
        return;
      }
    }
  };
  
  function log(msg) {
  	if (window.console) {
  		window.console.log(msg);
  	}
  }

  function start() {
  		log("Starting game");  
  	if (SINGLE_USER) {
  		log("Starting game");
		player = new Player("testme", 0, -250);		
		camera.players.push(player);			
		ko._gameTimer = window.setInterval(main, 1000 / 77);
  		return;
  	}
    ko.handle.start = function() {
      log("Server says we can START the game!");
      ko._gameTimer = window.setInterval(main, 1000 / 77);
    }
    ko.join();
  }
  
  function main() {
    game.frame += 1;		
    game.update_slice();		

    player.handle_input();		
    physics.step();

    camera.update();
    view.render(camera);

    player.push();

    keyboard.monitor();			
  }
  
  level.load('test_level', start);	// Start the game after loading!



})(jQuery, io, Object.prototype.toString)
