const { GraphQLScalarType } = require('graphql')
const emailValidator = require("email-validator")

const emailScalar = new GraphQLScalarType({
  name: 'Email',
  description: 'String scalar type representing a valid email',
  parseValue(value) {
    if(emailValidator.validate(value)){
      return value
    }
    throw new Error(`Email Scalar Error: Invalid email ${value}`)
  },
  parseLiteral(ast) {
    if(emailValidator.validate(ast.value)){
      return ast.value
    }
    throw new Error(`Email Scalar Error: Invalid email ${ast.value}`)
  },
})

module.exports= {
  definition:"scalar Email",
  scalar:{Email:emailScalar}
}