const {definition:definitionStringUtils,directive:directiveStringUtils} = require('./string_utils')
const {definition:definitionValidate,directive:directiveValidate} = require('./validate')

module.exports = {
  schemaDirectives:Object.assign({},directiveStringUtils,directiveValidate),
  definition:`${definitionStringUtils}\n${definitionValidate}`
}