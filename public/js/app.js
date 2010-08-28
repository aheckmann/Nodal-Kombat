;(function($, io){
  io.setPath("/js/socketio/")

  window.ko = {
    handle: 
    { jump: function(){ console.log("ko.jump"); console.log(arguments) }
    , punch: function(){ console.log("ko.punch"); console.log(arguments) }
    , start: function(){ console.log("ko.start"); console.log(arguments) }
    , gameover: function(){ console.log("ko.gameover"); console.log(arguments) }
    , playerquit: function(){ console.log("playerquit"); console.log(arguments) }
    , countdown: function(){ console.log("countdown"); console.log(arguments) }
    , status: function(){console.log("status: gameover");console.log(arguments) }
    }
  , send: function(event){
      if (!(event && event.method)) return 
      return socket.send(event)
    }
  }

  var socket = new io.Socket(location.hostname)
  socket.connect()
  socket.send("join")
  socket.on("message", function(message){
    console.dir(message)
    
    // don't use JSON.parsing, too slow
    // "jump#40,400,60|e:punch|e:gameover"

    var msg = message.split("|")
      , ko = window.ko
      , tok
    while (tok = msg.shift()){
      tok = tok.split("#")
      ko.handle[tok[0]].apply(ko, tok.length > 1 ? tok[1].split(",") : [])
    }

  })


})(jQuery, io)
