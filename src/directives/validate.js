const { SchemaDirectiveVisitor } = require("graphql-tools")
const { GraphQLScalarType, GraphQLNonNull } = require("graphql")
const emailValidator = require("email-validator")

const validations ={
  email:emailValidator.validate,
  url:function(value){
    try {
      new URL(value)
      return true
    } catch (e) {
      return false
    }
  },
  alpha:function(value){
    return value.match(/^[a-zA-Z]+$/)
  },
  alphaNum:function(value){ 
    return value.match(/^[a-zA-Z0-9]+$/)
  },
  alphaDash:function(value){  
    return value.match(/^[a-zA-Z0-9_-]+$/)
  },
  digits:function(value){ 
    return value.match(/^[0-9]+$/)
  },
  ip:function(value){
    return value.match(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/)
  },
  hex:function(value){
    return value.match(/^[A-Fa-f0-9]+$/)
  },
  lt:function(value,target){
    return value < target
  },
  lte:function(value,target){
    return value <= target
  },
  gt:function(value,target){
    return value > target
  },
  gte:function(value,target){
    return value >= target
  },
  stringLengthLT:function(value,target){
    return value.length < target
  },
  stringLengthLTE:function(value,target){
    return value.length <= target
  },
  stringLengthGT:function(value,target){
    return value.length > target
  },
  stringLengthGTE:function(value,target){
    return value.length >= target
  },
  stringLengthEquals:function(value,target){
    return value.length === target
  },
  notEmpty:function(value){
    return value != null && value.length > 0
  },
  startsWith:function(value,target){
    return value.startsWith(target)
  },
  endsWith:function(value,target){
    return value.endsWith(target)
  },
  contains:function(value,target){
    return value.indexOf(target) > -1
  },
  notContains:function(value,target){
    return value.indexOf(target) <= -1
  }
}
const validationMessages = {
  lt: target =>`Value must be less than ${target}`,
  lte: target =>`Value must be less than or equal to ${target}`,
  gt: target =>`Value must be greater than ${target}`,
  gte: target =>`Value must be greater than or equal to ${target}`,
  stringLengthLT: target =>`Lenght must be less than ${target}`,
  stringLengthLTE: target =>`Lenght must be less than or equal to ${target}`,
  stringLengthGT: target =>`Lenght must be greater than ${target}`,
  stringLengthGTE: target =>`Lenght must be greater than or equal to ${target}`,
  stringLengthEquals: target =>`Lenght must be equal to ${target}`,
  notEmpty: ()=> "Invalid empty value",
  startsWith: target =>`Value must starts with ${target}`,
  endsWith: target =>`Value must ends with ${target}`,
  contains: target =>`Value must contains ${target}`,
  notContains: target =>`Value must not contains ${target}`
}
class ValidateDirective extends SchemaDirectiveVisitor {
  visitArgumentDefinition(field) {
    field.type = this.wrapType(field.type,field.name)
  }
  visitInputFieldDefinition(field) {
    field.type = this.wrapType(field.type,field.name)
  }
  visitFieldDefinition(field) {
    field.type = this.wrapType(field.type,field.name)
  }
  wrapType(type,name) {
    if ( type instanceof GraphQLNonNull && type.ofType instanceof GraphQLScalarType) {
      return new GraphQLNonNull(new ValidateScalarType(type.ofType,name, this.args))
    } else if (type instanceof GraphQLScalarType) {
      return new ValidateScalarType(type,name, this.args)
    } else {
      throw new Error(`Not a scalar type: ${JSON.stringify(type)}`)
    }
  }
}

const applyValidation = function(value,args){
  if(value==null){
    return value
  }
  const argsValidations = Object.keys(args).filter(k=>args[k]!=null)
  for(const validation of argsValidations){
    if(!validations[validation](value,args[validation])){
      const message = validationMessages[validation]?validationMessages[validation](args[validation]):`Invalid ${validation}`
      throw new Error(message)
    }
  }
  return value
}
class ValidateScalarType extends GraphQLScalarType {
  constructor(type,name, args) {
    super({
      name: `Valid${name}`,
      serialize(value) {
        return applyValidation(type.serialize(value),args)
      },
      parseValue(value) {
        return applyValidation(type.parseValue(value),args)
      },
      parseLiteral(ast) {
        return applyValidation(type.parseLiteral(ast),args)
      },
    })
  }
}

module.exports={
  directive:{validate:ValidateDirective},
  definition:`directive @validate(
    email:Boolean,
    url:Boolean,
    alpha:Boolean,
    alphaNum:Boolean,
    alphaDash:Boolean,
    digits:Boolean,
    ip:Boolean,
    hex:Boolean,
    lt:Float,
    lte:Float,
    gt:Float,
    gte:Float,
    stringLengthLT:Int,
    stringLengthLTE:Int,
    stringLengthGT:Int,
    stringLengthGTE:Int,
    stringLengthEquals:Int,
    notEmpty:Boolean,
    startsWith:String,
    endsWith:String,
    contains:String,
    notContains:String
    ) on FIELD_DEFINITION | INPUT_FIELD_DEFINITION | ARGUMENT_DEFINITION`
}