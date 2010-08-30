;(function($, io, toString){
  io.setPath("/js/socketio/")

  window.ko = {
    playersRemaining: 0
  , handle: 
    { jump: function(){ log("ko.jump");
       // log(arguments)
        }
    , punch: function(){ 
        log("ko.punch"); 
        //log(arguments) 
        }
    , start: function(){ 
        log("ko.start"); 
        //log(arguments)
        }
    , playerquit: function(){ 
        log("playerquit"); 
        //log(arguments) 
      }
    , countdown: function(){ 
        log("countdown"); 
        //log(arguments)
    }
    , gametimer: function(){ 
        log("gametimer"); 
        log(arguments) 
      }
    , status: function(status){
        log("status: %s" + status);
        $(document).trigger("gameover")
      }
    , die: function(killer, victim){
        log(ko.playersRemaining)
        log("%s killed %s", killer, victim) 
        if (1 === --ko.playersRemaining){
          ko.send({method:"gameover"})
        }
      }
    , givedamage: function(npcid, userkey){
        if (npcid == player.id)
          this.receiveBlow(npcid, userkey)
      }
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
  ko.handle.start = function() {
    log("Server says we can START the game!");
    ko._gameTimer = window.setInterval(main, 1000 / 77);
    $(document).trigger("gamestart")
  }
  ko.handle.receiveid = function(id, userkey) {
  	if (SINGLE_USER) {
	  	return;	
  	} 
    player = window.player = new Player(id, 0, -250, userkey);		
    camera.players.push(player);			
  }

  ko.handle.playerjoin = function() {
    ko.playersRemaining = arguments.length
    //log("Player joined with ids: %s", Array.prototype.slice.call(arguments, 0).join(","));
    for (var i = 0; i < arguments.length; i++) {
      var keys = arguments[i];
      var split = keys.split("~:)~")
      var id = split[0]
      var userkey = split.length > 1 ? split[1] : null
      if (id === player.id) {
        player.moveTo(i * 50, -250);
      }
      else if (!NPC.hash[id]) {
        var new_npc = new NPC(id, i * 50, -250, userkey);
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


// !Animations in development

function AnimState(anim_name) {
	this.animation = animation[anim_name];
	this.reset();
}
AnimState.prototype.reset = function() {
	this.time = 0;
	this.complete = false;
};
AnimState.prototype.enter_frame = function() {
	this.time += game.slice;
	if (this.animation.loop !== 0 && this.time > this.animation.runtime * this.animation.loop) {
		this.complete = true;
	}
};
AnimState.prototype.draw = function(ctx, x, y, scale, flip) {
  // here check
  // camera.players
  // each player has an y and x
  //
	var frame = (this.animation.runtime > 0) ? ~~(((this.time % this.animation.runtime) / this.animation.runtime) * (this.animation.order.length)) : 0;
	this.animation.draw(frame, ctx, x, y, scale, flip);
  return !!this.animation.order[frame].damage
}


function Animation(sprite, runtime, loop) {
	this.sprite = sprite;
	this.order = [];
	this.loop = loop;
	this.runtime = runtime;
}
Animation.prototype.add_image = function(col, row) {
	this.order.concat([row, col]);
};

Animation.prototype.draw = function(frame, ctx, x, y, scale, flip) {
	try {
		var col = this.order[frame].c;
		var row = this.order[frame].r;
	}
	catch (e) {
		log("bad frame = " + frame);
	}
	try {
		ctx.save();
		if (flip) {
			ctx.translate(x, y);
			ctx.scale(scale, scale);
			ctx.drawImage(this.sprite.simg.img, this.sprite.col_w * col, this.sprite.row_h * row, this.sprite.w, this.sprite.h, 0, 0, this.sprite.w, this.sprite.h);		
		}
		else {
			
			ctx.translate(x + this.sprite.w * scale, y);			
			ctx.scale(-scale, scale);
			ctx.drawImage(this.sprite.simg.img, this.sprite.col_w * col, this.sprite.row_h * row, this.sprite.w, this.sprite.h, 0, 0, this.sprite.w, this.sprite.h);
			
		}
		ctx.restore();		
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
    poly_sh.restitution = 0;
    poly_sh.friction = 2;

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
    var gravity = new b2Vec2(0, 280);
    var doSleep = true;
    this.world = new b2World(world, gravity, doSleep);
  }
  Physics.prototype.step = function () {
    this.world.Step(Math.min(1 / 20, game.slice / 600), 3);
  }

  function Keyboard() {
    var that = this;
    
    this.map = {'38':'up', '39':'right', '40':'down', '37':'left', '32':'space', '68':'d', '83':'s'};
    
    for (var i in this.map) {
      this[this.map[i]] = {down: false, first: false};
    }
    
    $(document).keydown(function (event) {
      if (that.map[event.which]) {
        var key = that[that.map[event.which]];				
        key.down = true;
        return false;
      }
      else {
      	log(event.which);
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
  
  
  function NPC(id, x, y, userkey) {
    log("new NPC " + id + " : " + userkey)
    this.id = id;
    this.x = x;
    this.y = y;
    this.userkey = userkey;
    this.flipped = "false";
    this.anim_state = new AnimState('stand');
    NPC.hash[id] = this;
  }
  NPC.prototype.draw = function(ctx, ox, oy, scale) {
	if (this.flipped === "true") {	
	    ctx.fillStyle = "#f00";
		this.anim_state.enter_frame();
		this.anim_state.draw(ctx, ox + (this.x - 40) * scale, oy + (this.y - 115) * scale, scale, false);
	}
	else {
	    //log("NOT FLIPPED!");	
	    ctx.fillStyle = "#00f";
		this.anim_state.enter_frame();
		this.anim_state.draw(ctx, ox + (this.x - 40) * scale, oy + (this.y - 115) * scale, scale, true);
	}
	
	    ctx.fillRect(ox + this.x * scale - 5, oy + this.y * scale - 5, 10, 10);
    
  };
  NPC.prototype.moveTo = function(x, y) {
    this.x = x;
    this.y = y;
  };

  NPC.hash = [];
  
  function Player(id, x, y, userkey) {
    log("new player " + id + " : " + userkey)
    this.id = id;
    this.userkey = userkey;
    this.x = this.last_x = x;
    this.y = this.last_x = y;
    this.r = 8;
    this.lastHitBy = null;
    this.air_jump = true;
    this.flipped = false;
    this.body = this._build_body();
    this.current_action = [this._stand];
    this.wants_to = [];
    this.anim_state = new AnimState('stand');
  } 
  Player.prototype.push = function() {
  	if (Math.abs(this.x - this.last_x) > 1 || Math.abs(this.y - this.last_y) > 1) {
	  	this.last_x = this.x;
	 	this.last_y = this.y;  
  	}
  	else {
  		return;
  	}
    var data = {method: "position", args: [this.id, this.x, this.y] }
    if (!this.DEAD && this.y > level.deathline){
      this.DEAD = true
      data = [data, {method: "die", args:[this.lastHitBy || this.id, this.lastHitByUserKey]}];
    }
    ko.send(data);
  };
  Player.prototype.receiveBlow = function(npcid, userkey){
    this.lastHitBy = npcid
    this.lastHitByUserKey =userkey
  }
  Player.prototype.moveTo = function(x, y) {
    this.x = this.body.m_position.x = x;
    this.y = this.body.m_position.y = y;
  };
Player.prototype.draw = function(ctx, ox, oy, scale) {
	this.x = this.body.m_position.x;
	this.y = this.body.m_position.y;
	
  this.anim_state.enter_frame();
  var damage = this.anim_state.draw(ctx, ox + (this.x - 40) * scale, oy + (this.y - 115) * scale, scale, this.flipped)
  if (damage){
    for(var npc in NPC.hash) {
      if (Math.abs(npc.x - this.x) < 40 && Math.abs(npc.y - this.y) < 128){
        ko.send({method: "givedamage", args:[npc.id, npc.userkey]})
      }
    }
  }
};		
  Player.prototype._build_body = function() {
  	var body_margin = 10;
  
    var circle = new b2CircleDef();
    circle.density = 0.1;
    circle.restitution = 0;
    circle.radius = this.r;
    circle.friction = 2;
    
    var rect = new b2PolyDef();
    rect.vertexCount = 4;
    rect.vertices[0].Set(-this.r - body_margin, 0);
    rect.vertices[1].Set(-this.r - body_margin, -100);
    rect.vertices[2].Set(this.r + body_margin, -100);
    rect.vertices[3].Set(this.r + body_margin, 0);
    rect.density = 0.0001;
    rect.restitution = 0;
    rect.friction = 0;
 	
    var feet_bd = new b2BodyDef();
    feet_bd.AddShape(circle);
    feet_bd.position.Set(this.x, this.y);
    feet_bd.angularDamping = 0.7;
    feet_bd.linearDamping = 0.01;
    feet_bd.allowSleep = false;
    
    var body_bd = new b2BodyDef();
    body_bd.AddShape(rect);
    body_bd.position.Set(this.x, this.y);
    body_bd.allowSleep = false;
	body_bd.preventRotation = true;    
    
    var feet_body = physics.world.CreateBody(feet_bd);
    var body_body = physics.world.CreateBody(body_bd);
    
    var axle_def = new b2RevoluteJointDef();
    axle_def.anchorPoint.Set(this.x, this.y);
    axle_def.body2 = feet_body;
    axle_def.body1 = body_body;
    var axle = physics.world.CreateJoint(axle_def);
    
    return feet_body;
  };
  Player.prototype.handle_input = function() {
    if (keyboard.left.down && !keyboard.right.down) {
    	this.wants_to.push([this._run, -1]);
    	this.flipped = true;
      //this._run(-1);
    }
    else if (keyboard.right.down && !keyboard.left.down) {
      //this._run(1);
      	this.wants_to.push([this._run, 1]);
      	this.flipped = false;
    }
    if (keyboard.space.down && keyboard.space.first) {
      //this._jump();
      this.wants_to.push([this._jump]);
    }
    if (keyboard.d.down && keyboard.d.first) {
    	this.wants_to.push([this._stab]);
    }
    if (keyboard.s.down && keyboard.s.first) {
    	this.wants_to.push([this._kick]);
    }
    
    if (this.body.GetContactList()) {
      this.air_jump = true;
    }
  };
  Player.prototype.start_action = function(action) {
	this.current_action = action;
  	this.anim_state = new AnimState(action[0].animation);
  	//log("This.flipped: " + this.flipped);
  	window.ko.send({method: 'playanim', args: [this.id, action[0].animation, this.flipped]});
  };
  Player.prototype.execute_actions = function() {
  	if (this.wants_to.length > 0) {
	  	this.wants_to.sort(function(a, b) {
	  		return (b[0].priority - a[0].priority);
	  	});
	  	var action = this.wants_to.shift();
	  	if (action[0].priority > this.current_action[0].priority) {
	  		this.start_action(action);
	  	}
	 }
  	else if (this.anim_state.complete) {
//  		console.log("Just standing again");
		this.start_action([this._stand]);
  	}
  	this.current_action[0].apply(this, this.current_action.slice(1));  	
  	this.wants_to = [];	 
  }
  
// !Player movement


	Player.prototype._stand = function() {
	
	};
	Player.prototype._stand.priority = 10;
	Player.prototype._stand.animation = 'stand';
	
	Player.prototype._run = function(x) {
    var offset = b2Math.AddVV(this.body.GetCenterPosition(), new b2Vec2(0, -this.r * 15));
    this.body.ApplyForce(new b2Vec2(x * 5000, 0), this.body.GetCenterPosition());
    this.body.ApplyTorque(600000 * x);
  };
  Player.prototype._run.priority = 20;
  Player.prototype._run.animation = 'run';
  
  Player.prototype._jump = function() {
    if (this.body.GetContactList()) {
        this.air_jump = true;
        this.body.ApplyImpulse(new b2Vec2(0, -2000), this.body.GetCenterPosition());					
        return;
    }
    if (this.air_jump) {
      this.air_jump = false;
      this.body.ApplyImpulse(new b2Vec2(0, -4000), this.body.GetCenterPosition());					
      return;
    }			
  };
  Player.prototype._jump.priority = 30;
  Player.prototype._jump.animation = 'jump';
  
  Player.prototype._stab = function() {
  	
  };
  Player.prototype._stab.priority = 25;
  Player.prototype._stab.animation = 'stab';
  
  Player.prototype._kick = function() {};
  Player.prototype._kick.priority = 27;
  Player.prototype._kick.animation = 'kick';
  
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
  var level = window.level = new Level();
  var view = new View('arena');
  var physics = new Physics();
  var keyboard = new Keyboard();
  var camera = new Camera(.1, 100, 200, 100);
  var player;
  
  // !Animation definitions
  
	var animation = {};
	var sprite = {};
	sprite['aaron'] = new Sprite('/characters/aaron2.png', 80, 128, 80, 128);

	animation['stand'] = new Animation(sprite['aaron'], 0, 0);
	animation['stand'].order = [
		{c: 0, r: 0}
	];

	animation['run'] = new Animation(sprite['aaron'], 300, 1);
	animation['run'].order = [
		{c: 0, r: 0},
		{c: 6, r: 0},
		{c: 7, r: 0},
		{c: 8, r: 0},
		{c: 0, r: 0}
	];

	animation['stab'] = new Animation(sprite['aaron'], 300, 1);
	animation['stab'].order = [
		{c: 1, r: 0},
		{c: 2, r: 0},
		{c: 3, r: 0, damage: true}
	];
	animation['kick'] = new Animation(sprite['aaron'], 300, 1);
	animation['kick'].order = [
		{c: 4, r: 0},
		{c: 5, r: 0, damage: true}
	];
	animation['jump'] = new Animation(sprite['aaron'], 50, 1);
	animation['jump'].order = [
		{c: 0, r: 0}
	];
	

	   
     
  var SINGLE_USER = false;
  
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
  
  ko.handle.playanim = function(id, name, flipped) {
  	if (NPC.hash[id]) {
  		//log("Received flipped: " + flipped);
  		NPC.hash[id].flipped = flipped;
	  	NPC.hash[id].anim_state = new AnimState(name);
	 }
  };
  
  function log(msg) {
  	if (window.console) {
  		window.console.log.apply(window.console, arguments);
  	}
  }

  window.start = function start() {
  	log("Starting game");  
  	if (SINGLE_USER) {
      log("Starting game");
      player = new Player("testme", 0, -150);		
      camera.players.push(player);			
      ko._gameTimer = window.setInterval(main, 1000 / 77);
      return;
    }
    
    ko.join();
  }
  
  function main() {
    game.frame += 1;		
    game.update_slice();		

    player.handle_input();
    player.execute_actions();		
    physics.step();

    camera.update();
    view.render(camera);

    player.push();

    keyboard.monitor();			
  }
  
  //level.load('test_level', start);	// Start the game after loading!



})(jQuery, io, Object.prototype.toString)
