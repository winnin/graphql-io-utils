const { SchemaDirectiveVisitor } = require("@graphql-tools/utils")
const { GraphQLScalarType, GraphQLNonNull } = require("graphql")

class StringUtilsDirective extends SchemaDirectiveVisitor {
  visitArgumentDefinition(field) {
    this.wrapType(field)
  }
  visitInputFieldDefinition(field) {
    this.wrapType(field)
  }
  visitFieldDefinition(field) {
    this.wrapType(field)
  }
  wrapType(field) {
    if ( field.type instanceof GraphQLNonNull && field.type.ofType instanceof GraphQLScalarType) {
      field.type = new GraphQLNonNull(new StringUtilsScalarType(field.type.ofType, this.args))
    } else if (field.type instanceof GraphQLScalarType) {
      field.type = new StringUtilsScalarType(field.type, this.args)
    } else {
      throw new Error(`Not a scalar type: ${field.type}`)
    }
  }
}
const reduceStringMethodsFn=function(acc,current){return acc[current]()}
const applyMethods = function(str,methods){
  if(str==null){
    return str
  }
  return methods.reduce(reduceStringMethodsFn,str)
}
class StringUtilsScalarType extends GraphQLScalarType {
  constructor(type, { stringMethods }) {
    super({
      name: `StringUtilsScalarType`,
      serialize(value) {
        value = type.serialize(value)
        return applyMethods(value,stringMethods)
      },
      parseValue(value) {
        return applyMethods(type.parseValue(value),stringMethods)
      },
      parseLiteral(ast) {
        return applyMethods(type.parseLiteral(ast),stringMethods)
      },
    })
  }
}
const definition = 'directive @stringUtils(stringMethods:[String!]!) on FIELD_DEFINITION | INPUT_FIELD_DEFINITION | ARGUMENT_DEFINITION'
module.exports= {
  definition,
  directive:{stringUtils:StringUtilsDirective}
}