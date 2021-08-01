const {definition:definitionEmail,scalar:scalarEmail} = require('./email')
const {definition:definitionURL,scalar:scalarURL} = require('./url')

module.exports = {
  resolvers:Object.assign({},scalarEmail,scalarURL),
  definition:`${definitionEmail}\n${definitionURL}`
}