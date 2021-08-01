const { makeExecutableSchema } = require('@graphql-tools/schema')
const { graphql } = require('graphql')
const { definition, scalar } = require('../../src/scalar/url')

let schema = `
${definition}
type Query{
  sendURLNotNull(url:URL!):URL!
  sendURLNull(url:URL):URL
}`

const resolvers = Object.assign({
  Query: {
    sendURLNotNull: (_,{url}) => url,
    sendURLNull: (_,{url}) => url,
  }
},scalar  )
schema = makeExecutableSchema({ 
  typeDefs: schema,
  resolvers
})

describe('URL Scalar', function() {
  test("Must support url validation not null", async function (){
    const url = "https://google.com/"
    const query = `
      query sendURLNotNull {
        sendURLNotNull(url:"${url}")
      }`
    const {data:{sendURLNotNull}} = await graphql(schema, query)
    expect(sendURLNotNull).toBe(url)    
    
    const invalid = "test"
    const queryInvalid = `
      query sendURLNotNull {
        sendURLNotNull(url:"${invalid}")
      }`
    const {errors} = await graphql(schema, queryInvalid)
    expect(errors.length).toBeGreaterThan(0)
  })
  test("Must support email validation null", async function (){
    const url = "https://google.com/"
    const query = `
      query sendURLNull {
        sendURLNull(url:"${url}")
      }`
    const {data:{sendURLNull}} = await graphql(schema, query)
    expect(sendURLNull).toBe(url)    

    const queryNull = `
      query sendURLNull {
        sendURLNull
      }`
    const {data:{sendURLNull:nullReturn}} = await graphql(schema, queryNull)
    expect(nullReturn).toBe(null)    
    
    const invalid = "test"
    const queryInvalid = `
      query sendURLNull {
        sendURLNull(url:"${invalid}")
      }`
    const {errors} = await graphql(schema, queryInvalid)
    expect(errors.length).toBeGreaterThan(0)
  })
})
