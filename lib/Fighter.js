
var uid = require("../support/express/support/connect/lib/connect/utils").uid

var Fighter = module.exports = function(client){
  client.on("disconnect", this.quit.bind(this))
  this.client = client
  this.uid = uid()
}

Fighter.prototype.send = function(msg){
  this.client.send(msg)
}

Fighter.prototype.quit = function(msg){
  console.log("No fair, I quit!")
}
