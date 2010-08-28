;(function($, io){
  io.setPath("/js/socketio/")
  socket = new io.Socket("127.0.0.1")
  socket.connect()
  socket.send(JSON.stringify({ "type": "join"}))
  socket.on("message", function(data){
    alert("mmmm, yummy datas: " + data.status)  
  })
})(jQuery, io)
