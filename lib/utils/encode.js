module.exports = function encode(event){
  //console.dir(event)
  if (!(event && event.method)) return ""

  if (!(event.args && event.args.length))
    return event.method 

  return event.method += "#" + event.args
}
