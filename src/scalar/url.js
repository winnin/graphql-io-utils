const { GraphQLScalarType } = require('graphql')

const urlScalar = new GraphQLScalarType({
  name: 'URL',
  description: 'String scalar type representing a valid URL',
  serialize(value) {
    return value.toString()
  },
  parseValue(value) {
    try{
      return new URL(value)
    }catch(e){
      throw new Error(`URL Scalar Error: Invalid url ${value}`)
    }
  },
  parseLiteral(ast) {
    try{
      return new URL(ast.value)
    }catch(e){
      throw new Error(`URL Scalar Error: Invalid url ${ast.value}`)
    }
    
  },
})

module.exports= {
  definition:"scalar URL",
  scalar:{URL:urlScalar}
}