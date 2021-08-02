const { GraphQLScalarType } = require('graphql')
const { AsyncRedactor } = require('redact-pii')
const redactor = new AsyncRedactor()

const piiScalar = new GraphQLScalarType({
  name: 'PII',
  description: 'String scalar type representing a valid URL',
  serialize(value) {
    return redactor.redactAsync(value)
  }
})

module.exports= {
  definition:"scalar PII",
  scalar:{PII:piiScalar}
}