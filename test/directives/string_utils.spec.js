const { makeExecutableSchema } = require('@graphql-tools/schema')
const { graphql } = require('graphql')
const { SchemaDirectiveVisitor } = require('@graphql-tools/utils')
const { definition, directive } = require('../../src/directives/string_utils')

let schema = `
${definition}
type Query{
  getTrimmedAndUpper:String! @stringUtils(stringMethods:["trim","toUpperCase"])
  sendTrimmedAndLower(trimmedAndLower:String!@stringUtils(stringMethods:["trim","toLowerCase"])):String!
  sendInputTrimmedAndLower(inputTest:Test):String!

}
input Test{
  str:String! @stringUtils(stringMethods:["trim","toLowerCase"])
}`

let trimmedAndUpper=""
const resolvers = {
  Query: {
    getTrimmedAndUpper: () => trimmedAndUpper,
    sendTrimmedAndLower: (_,{trimmedAndLower}) => trimmedAndLower,
    sendInputTrimmedAndLower: (_,{inputTest}) => inputTest?inputTest.str:"dsdsa",
  }
}
schema = makeExecutableSchema({ 
  typeDefs: schema,
  resolvers
})
SchemaDirectiveVisitor.visitSchemaDirectives(schema, directive)

describe('StringUtils', function() {
  test("Must fix output", async function (){
    trimmedAndUpper = " test TRIM and upper    "
    const query = `
      query getTrimmedAndUpper {
        getTrimmedAndUpper
      }`
    const {data:{getTrimmedAndUpper}} = await graphql(schema, query)
    expect(getTrimmedAndUpper).toBe(trimmedAndUpper.trim().toUpperCase())    
  })
  test("Must fix argument", async function() {
    let trimmedAndLower = " test TRIM and lower    "
    const query = `
      query sendTrimmedAndLower {
        sendTrimmedAndLower(trimmedAndLower:"${trimmedAndLower}")
      }`
    const {data:{sendTrimmedAndLower}} = await graphql(schema, query)
    expect(sendTrimmedAndLower).toBe(trimmedAndLower.trim().toLowerCase())    
  })
  test("Must input field", async function() {
    let trimmedAndLower = " test TRIM and lower    "
    const query = `
      query sendInputTrimmedAndLower {
        sendInputTrimmedAndLower(inputTest:{str:"${trimmedAndLower}"})
      }`
    const {data:{sendInputTrimmedAndLower}} = await graphql(schema, query)
    expect(sendInputTrimmedAndLower).toBe(trimmedAndLower.trim().toLowerCase())    
  })
})
