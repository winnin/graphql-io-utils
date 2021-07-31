const {definition:definitionStringUtils,directive:directiveStringUtils} = require('./string_utils')
const {definition:definitionValidate,directive:directiveValidate} = require('./validate')

let exportedObj = null
module.exports = function(){
  if(!exportedObj){
    exportedObj = {
      direcives:{
        schemaDirectives:{
          stringUtils:directiveStringUtils,
          validate:directiveValidate,
        },
        definition:`${definitionStringUtils}\n${definitionValidate}`
      }
    }
  }
  return exportedObj
}