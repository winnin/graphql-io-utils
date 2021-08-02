const { makeExecutableSchema } = require('@graphql-tools/schema')
const { graphql } = require('graphql')
const { definition, scalar } = require('../../src/scalar/pii')

let schema = `
${definition}
type Query{
  receivePIIData(pii:String!):PII!
}`

const resolvers = Object.assign({
  Query: {
    receivePIIData: (_,{pii}) => pii,
  }
},scalar  )
schema = makeExecutableSchema({ 
  typeDefs: schema,
  resolvers
})

describe('PII Scalar', function() {
  test("Must redact pii info", async function (){
    const pii = "my email is test@test.com"
    const query = `
      query receivePIIData {
        receivePIIData(pii:"${pii}")
      }`
    const {data:{receivePIIData}} = await graphql(schema, query)
    expect(receivePIIData).toBe("my email is EMAIL_ADDRESS")    
    
  })
})
