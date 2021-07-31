# graphql-io-utils
 
Utilities directives to help on graphql input/output validation and sanitization.

# Installation

```sh
npm i @winninjs/graphql-io-utils
```
It includes two directives:

1 - stringUtils, which lets you run a method over a string input or output

```graphql
type Query{
  
  returnTrimmedAndUpper:String! @stringUtils(stringMethods:["trim","toUpperCase"]) # runs trim and toUpperCase on returned String
  
  sendTrimmedAndLower(trimmedAndLower:String!@stringUtils(stringMethods:["trim","toLowerCase"])):String! # runs trim and toLowerCase on query argument

}
```

2 - validate, runs common validations over input

```graphql
type Query{
  email(value:String! @validate(email:true)):String! #validates if the value is an valid email
}
```

Currently supports the following validations:

- email
- url
- alpha
- alphaNum
- alphaDash
- digits
- ip
- hex
- lt
- lte
- gt
- gte
- stringLengthLT
- stringLengthLTE
- stringLengthGT
- stringLengthGTE
- stringLengthEquals
- notEmpty
- startsWith
- endsWith
- contains
- notContains
