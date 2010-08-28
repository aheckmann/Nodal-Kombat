;(function($, io){
  io.setPath("/js/socketio/")
  socket = new io.Socket(location.hostname)
  socket.connect()
  socket.send(JSON.stringify({ "type": "join"}))
  socket.on("message", function(data){
    alert("mmmm, yummy datas: " + data.status)  
  })
})(jQuery, io)
