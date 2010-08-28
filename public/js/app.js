;(function($, io){
  io.setPath("/js/socketio/")

  window.ko = {
    handle: 
    { jump: function(){ console.log("ko.jump"); console.log(arguments) }
    , punch: function(){ console.log("ko.punch"); console.log(arguments) }
    , start: function(){ console.log("ko.start"); console.log(arguments) }
    , gameover: function(){ console.log("ko.gameover"); console.log(arguments) }
    , playerquit: function(){ console.log("playerquit"); console.log(arguments) }
    }
  }

  var socket = new io.Socket(location.hostname)
  socket.connect()
  socket.send("join")
  socket.on("message", function(message){
      
    // don't use JSON.parsing, too slow
    // "e:jump#40,400,60|e:punch|e:gameover"

    var msg = message.split("|")
      , tok
    while (tok = msg.shift()){
      console.log(tok)
      tok = tok.split("#")
      ko[tok[0]].apply(ko, tok[1].split(","))
    }

  })

  window.ko = {
    send: function(data){
      if ("string" == typeof data)
        return socket.send(data)
      var msg = ""
        , key
      for (key in data)
        msg += key + ":" + data[key] + "|"
      socket.send(msg)
    }
  }

})(jQuery, io)
