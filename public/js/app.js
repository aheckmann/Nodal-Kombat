;(function($, io){
  io.setPath("/js/socketio/")
  socket = new io.Socket(location.hostname)
  socket.connect()
  socket.send("join")
  socket.on("message", function(data){
    console.log(data)
  })
})(jQuery, io)
