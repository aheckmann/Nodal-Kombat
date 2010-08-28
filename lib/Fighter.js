
var uid = require("../support/express/support/connect/lib/connect/utils").uid

var Fighter = module.exports = function(client){
  this.client = client
  this.uid = uid()
}

Fighter.prototype.send = function(msg){
  this.client.send(msg)
}
