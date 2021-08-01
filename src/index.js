const directives = require('./directives')
const scalar = require('./scalar')

let exportedObj = null
module.exports = function(){
  if(!exportedObj){
    exportedObj = {
      directives,
      scalar
    }
  }
  return exportedObj
}