const { makeExecutableSchema } = require('@graphql-tools/schema')
const { graphql } = require('graphql')
const { definition, scalar } = require('../../src/scalar/email')

let schema = `
${definition}
type Query{
  sendEmailNotNull(email:Email!):Email!
  sendEmailNull(email:Email):Email
}`

const resolvers = Object.assign({
  Query: {
    sendEmailNotNull: (_,{email}) => email,
    sendEmailNull: (_,{email}) => email,
  }
},scalar  )
schema = makeExecutableSchema({ 
  typeDefs: schema,
  resolvers
})

describe('Email Scalar', function() {
  test("Must support email validation not null", async function (){
    const email = "test@test.com"
    const query = `
      query sendEmailNotNull {
        sendEmailNotNull(email:"${email}")
      }`
    const {data:{sendEmailNotNull}} = await graphql(schema, query)
    expect(sendEmailNotNull).toBe(email)    
    
    const invalid = "test"
    const queryInvalid = `
      query sendEmailNotNull {
        sendEmailNotNull(email:"${invalid}")
      }`
    const {errors} = await graphql(schema, queryInvalid)
    expect(errors.length).toBeGreaterThan(0)
  })
  test("Must support email validation null", async function (){
    const email = "test@test.com"
    const query = `
      query sendEmailNull {
        sendEmailNull(email:"${email}")
      }`
    const {data:{sendEmailNull}} = await graphql(schema, query)
    expect(sendEmailNull).toBe(email)    

    const queryNull = `
      query sendEmailNull {
        sendEmailNull
      }`
    const {data:{sendEmailNull:nullReturn}} = await graphql(schema, queryNull)
    expect(nullReturn).toBe(null)    
    
    const invalid = "test"
    const queryInvalid = `
      query sendEmailNull {
        sendEmailNull(email:"${invalid}")
      }`
    const {errors} = await graphql(schema, queryInvalid)
    expect(errors.length).toBeGreaterThan(0)
  })
})
