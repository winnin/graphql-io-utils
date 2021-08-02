const {definition:definitionEmail,scalar:scalarEmail} = require('./email')
const {definition:definitionURL,scalar:scalarURL} = require('./url')
const {definition:definitionPII,scalar:scalarPII} = require('./pii')

module.exports = {
  resolvers:Object.assign({},scalarEmail,scalarURL,scalarPII),
  definition:`${definitionEmail}\n${definitionURL}\n${definitionPII}`
}