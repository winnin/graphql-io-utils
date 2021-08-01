const { makeExecutableSchema } = require('@graphql-tools/schema')
const { graphql } = require('graphql')
const { SchemaDirectiveVisitor } = require('@graphql-tools/utils')
const { definition, directive } = require('../../src/directives/validate')
const floatValidator = 5
const lengthValidator = 1
const stringValidator = "test"
let schema = `
${definition}
type Query{
  email(value:String! @validate(email:true)):String!
  url(value:String! @validate(url:true)):String!
  alpha(value:String! @validate(alpha:true)):String!
  alphaNum(value:String! @validate(alphaNum:true)):String!
  alphaDash(value:String! @validate(alphaDash:true)):String!
  digits(value:String! @validate(digits:true)):String!
  ip(value:String! @validate(ip:true)):String!
  lt(value:Float! @validate(lt:${floatValidator})):Float!
  lte(value:Float! @validate(lte:${floatValidator})):Float!
  gt(value:Float! @validate(gt:${floatValidator})):Float!
  gte(value:Float! @validate(gte:${floatValidator})):Float!
  stringLengthLT(value:String! @validate(stringLengthLT:${lengthValidator})):String!
  stringLengthLTE(value:String! @validate(stringLengthLTE:${lengthValidator})):String!
  stringLengthGT(value:String! @validate(stringLengthGT:${lengthValidator})):String!
  stringLengthGTE(value:String! @validate(stringLengthGTE:${lengthValidator})):String!
  stringLengthEquals(value:String! @validate(stringLengthEquals:${lengthValidator})):String!
  notEmpty(value:String! @validate(notEmpty:true)):String!
  startsWith(value:String! @validate(startsWith:"${stringValidator}")):String!
  endsWith(value:String! @validate(endsWith:"${stringValidator}")):String!
  contains(value:String! @validate(contains:"${stringValidator}")):String!
  notContains(value:String! @validate(notContains:"${stringValidator}")):String!
}`

const resolvers = {
  Query: {
    email: (_,{value}) => value,
    url: (_,{value}) => value,
    alpha: (_,{value}) => value,
    alphaNum: (_,{value}) => value,
    alphaDash: (_,{value}) => value,
    digits: (_,{value}) => value,
    ip: (_,{value}) => value,
    lt: (_,{value}) => value,
    lte: (_,{value}) => value,
    gt: (_,{value}) => value,
    gte: (_,{value}) => value,
    stringLengthLT: (_,{value}) => value,
    stringLengthLTE: (_,{value}) => value,
    stringLengthGT: (_,{value}) => value,
    stringLengthGTE: (_,{value}) => value,
    stringLengthEquals: (_,{value}) => value,
    notEmpty: (_,{value}) => value,
    startsWith: (_,{value}) => value,
    endsWith: (_,{value}) => value,
    contains: (_,{value}) => value,
    notContains: (_,{value}) => value,
  }
}
schema = makeExecutableSchema({ 
  typeDefs: schema,
  resolvers
})
SchemaDirectiveVisitor.visitSchemaDirectives(schema, directive)

describe('Validate', function() {
  test("Must support email", async function (){
    let validValue = "test@test.com"
    const queryValid = `query { email(value:"${validValue}")}`
    const {data:{email}} = await graphql(schema, queryValid)
    expect(email).toBe(validValue)    

    let invalidValue = "test"
    const queryInvalid = `query {email(value:"${invalidValue}")}`
    
    const {errors} = await graphql(schema, queryInvalid)
    expect(errors.length).toBeGreaterThan(0)
  })
  test("Must support email", async function (){
    let validValue = "https://www.google.com"
    const queryValid = `query { url(value:"${validValue}")}`
    const {data:{url}} = await graphql(schema, queryValid)
    expect(url).toBe(validValue)    

    let invalidValue = "test"
    const queryInvalid = `query {url(value:"${invalidValue}")}`
    
    const {errors} = await graphql(schema, queryInvalid)
    expect(errors.length).toBeGreaterThan(0)
  })
  test("Must support alpha", async function (){
    let validValue = "fdsfsgfdsgdf"
    const queryValid = `query { alpha(value:"${validValue}")}`
    const {data:{alpha}} = await graphql(schema, queryValid)
    expect(alpha).toBe(validValue)    

    let invalidValue = "fsd121fsd4ew2we11"
    const queryInvalid = `query {alpha(value:"${invalidValue}")}`
    
    const {errors} = await graphql(schema, queryInvalid)
    expect(errors.length).toBeGreaterThan(0)
  })
  test("Must support alphaNum", async function (){
    let validValue = "fdsfsgfdsgd1323f"
    const queryValid = `query { alphaNum(value:"${validValue}")}`
    const {data:{alphaNum}} = await graphql(schema, queryValid)
    expect(alphaNum).toBe(validValue)    

    let invalidValue = "fsd121fsd4ew2we11--"
    const queryInvalid = `query {alphaNum(value:"${invalidValue}")}`
    
    const {errors} = await graphql(schema, queryInvalid)
    expect(errors.length).toBeGreaterThan(0)
  })
  test("Must support alphaDash", async function (){
    let validValue = "fdsfsgfdsgdf232--"
    const queryValid = `query { alphaDash(value:"${validValue}")}`
    const {data:{alphaDash}} = await graphql(schema, queryValid)
    expect(alphaDash).toBe(validValue)    

    let invalidValue = "fsd121fsd4ew2we11@@@!"
    const queryInvalid = `query {alphaDash(value:"${invalidValue}")}`
    
    const {errors} = await graphql(schema, queryInvalid)
    expect(errors.length).toBeGreaterThan(0)
  })
  test("Must support digits", async function (){
    let validValue = "12245"
    const queryValid = `query { digits(value:"${validValue}")}`
    const {data:{digits}} = await graphql(schema, queryValid)
    expect(digits).toBe(validValue)    

    let invalidValue = "fsd121fsd4ew2we11@@@!"
    const queryInvalid = `query {digits(value:"${invalidValue}")}`
    
    const {errors} = await graphql(schema, queryInvalid)
    expect(errors.length).toBeGreaterThan(0)
  })
  test("Must support ip", async function (){
    let validValue = "127.0.0.1"
    const queryValid = `query { ip(value:"${validValue}")}`
    const {data:{ip}} = await graphql(schema, queryValid)
    expect(ip).toBe(validValue)    

    let invalidValue = "fsd121fsd4ew2we11@@@!"
    const queryInvalid = `query {ip(value:"${invalidValue}")}`
    
    const {errors} = await graphql(schema, queryInvalid)
    expect(errors.length).toBeGreaterThan(0)
  })
  test("Must support lt", async function (){
    let validValue = floatValidator-1
    const queryValid = `query { lt(value:${validValue})}`
    const {data:{lt}} = await graphql(schema, queryValid)
    expect(lt).toBe(validValue)    

    let invalidValue = floatValidator
    const queryInvalid = `query {lt(value:${invalidValue})}`
    
    const {errors} = await graphql(schema, queryInvalid)
    expect(errors.length).toBeGreaterThan(0)
  })
  test("Must support lte", async function (){
    let validValue = floatValidator
    const queryValid = `query { lte(value:${validValue})}`
    const {data:{lte}} = await graphql(schema, queryValid)
    expect(lte).toBe(validValue)    

    let invalidValue = floatValidator+1
    const queryInvalid = `query {lte(value:${invalidValue})}`
    
    const {errors} = await graphql(schema, queryInvalid)
    expect(errors.length).toBeGreaterThan(0)
  })
  test("Must support gt", async function (){
    let validValue = floatValidator+1
    const queryValid = `query { gt(value:${validValue})}`
    const {data:{gt}} = await graphql(schema, queryValid)
    expect(gt).toBe(validValue)    

    let invalidValue = floatValidator
    const queryInvalid = `query {gt(value:${invalidValue})}`
    
    const {errors} = await graphql(schema, queryInvalid)
    expect(errors.length).toBeGreaterThan(0)
  })
  test("Must support gte", async function (){
    let validValue = floatValidator
    const queryValid = `query { gte(value:${validValue})}`
    const {data:{gte}} = await graphql(schema, queryValid)
    expect(gte).toBe(validValue)    

    let invalidValue = floatValidator-1
    const queryInvalid = `query {gte(value:${invalidValue})}`
    
    const {errors} = await graphql(schema, queryInvalid)
    expect(errors.length).toBeGreaterThan(0)
  })
  test("Must support stringLengthLT", async function (){
    let validValue = ""
    const queryValid = `query { stringLengthLT(value:"${validValue}")}`
    const {data:{stringLengthLT}} = await graphql(schema, queryValid)
    expect(stringLengthLT).toBe(validValue)    

    let invalidValue = "1"
    const queryInvalid = `query {stringLengthLT(value:"${invalidValue}")}`
    
    const {errors} = await graphql(schema, queryInvalid)
    expect(errors.length).toBeGreaterThan(0)
  })
  test("Must support stringLengthLTE", async function (){
    let validValue = "1"
    const queryValid = `query { stringLengthLTE(value:"${validValue}")}`
    const {data:{stringLengthLTE}} = await graphql(schema, queryValid)
    expect(stringLengthLTE).toBe(validValue)    

    let invalidValue = "12"
    const queryInvalid = `query validation {stringLengthLTE(value:"${invalidValue}")}`
    
    const {errors} = await graphql(schema, queryInvalid)
    expect(errors.length).toBeGreaterThan(0)
  })
  test("Must support stringLengthGT", async function (){
    let validValue = "12"
    const queryValid = `query { stringLengthGT(value:"${validValue}")}`
    const {data:{stringLengthGT}} = await graphql(schema, queryValid)
    expect(stringLengthGT).toBe(validValue)    

    let invalidValue = "1"
    const queryInvalid = `query validation {stringLengthGT(value:"${invalidValue}")}`
    
    const {errors} = await graphql(schema, queryInvalid)
    expect(errors.length).toBeGreaterThan(0)
  })
  test("Must support stringLengthGTE", async function (){
    let validValue = "1"
    const queryValid = `query { stringLengthGTE(value:"${validValue}")}`
    const {data:{stringLengthGTE}} = await graphql(schema, queryValid)
    expect(stringLengthGTE).toBe(validValue)    

    let invalidValue = ""
    const queryInvalid = `query validation {stringLengthGTE(value:"${invalidValue}")}`
    
    const {errors} = await graphql(schema, queryInvalid)
    expect(errors.length).toBeGreaterThan(0)
  })
  test("Must support stringLengthEquals", async function (){
    let validValue = "1"
    const queryValid = `query { stringLengthEquals(value:"${validValue}")}`
    const {data:{stringLengthEquals}} = await graphql(schema, queryValid)
    expect(stringLengthEquals).toBe(validValue)    

    let invalidValue = "12"
    const queryInvalid = `query validation {stringLengthLT(value:"${invalidValue}")}`
    
    const {errors} = await graphql(schema, queryInvalid)
    expect(errors.length).toBeGreaterThan(0)
  })
  test("Must support notEmpty", async function (){
    let validValue = "123"
    const queryValid = `query { notEmpty(value:"${validValue}")}`
    const {data:{notEmpty}} = await graphql(schema, queryValid)
    expect(notEmpty).toBe(validValue)    

    let invalidValue = ""
    const queryInvalid = `query {notEmpty(value:"${invalidValue}")}`
    
    const {errors} = await graphql(schema, queryInvalid)
    expect(errors.length).toBeGreaterThan(0)
  })
  test("Must support startsWith", async function (){
    let validValue = stringValidator+"123"
    const queryValid = `query { startsWith(value:"${validValue}")}`
    const {data:{startsWith}} = await graphql(schema, queryValid)
    expect(startsWith).toBe(validValue)    

    let invalidValue = "123"+stringValidator
    const queryInvalid = `query {startsWith(value:"${invalidValue}")}`
    
    const {errors} = await graphql(schema, queryInvalid)
    expect(errors.length).toBeGreaterThan(0)
  })
  test("Must support endsWith", async function (){
    let validValue = "123"+stringValidator
    const queryValid = `query { endsWith(value:"${validValue}")}`
    const {data:{endsWith}} = await graphql(schema, queryValid)
    expect(endsWith).toBe(validValue)    

    let invalidValue = stringValidator+"123"
    const queryInvalid = `query {endsWith(value:"${invalidValue}")}`
    
    const {errors} = await graphql(schema, queryInvalid)
    expect(errors.length).toBeGreaterThan(0)
  })
  test("Must support contains", async function (){
    let validValue = "123"+stringValidator
    const queryValid = `query { contains(value:"${validValue}")}`
    const {data:{contains}} = await graphql(schema, queryValid)
    expect(contains).toBe(validValue)    

    let invalidValue = "123"
    const queryInvalid = `query {contains(value:"${invalidValue}")}`
    
    const {errors} = await graphql(schema, queryInvalid)
    expect(errors.length).toBeGreaterThan(0)
  })
  test("Must support notContains", async function (){
    let validValue = "123"
    const queryValid = `query { notContains(value:"${validValue}")}`
    const {data:{notContains}} = await graphql(schema, queryValid)
    expect(notContains).toBe(validValue)    

    let invalidValue = "123"+stringValidator
    const queryInvalid = `query {notContains(value:"${invalidValue}")}`
    
    const {errors} = await graphql(schema, queryInvalid)
    expect(errors.length).toBeGreaterThan(0)
  })
})
