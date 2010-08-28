;(function($, io){
  io.setPath("/js/socketio/")
  socket = new io.Socket("127.0.0.1")
  socket.connect()
  socket.send("hello")
  socket.on("message", function(data){
    alert("mmmm, yummy datas: " + data)  
  })
})(jQuery, io)
