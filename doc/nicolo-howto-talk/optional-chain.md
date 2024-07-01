## Babel.js  AST for `obj?.foo.bar`

```json
{
  "type": "File",
    "program": {
    "type": "Program",
    "body": [
      {
        "type": "ExpressionStatement",
        "expression": {
          "type": "OptionalMemberExpression",
          "object": {
            "type": "OptionalMemberExpression",
            "object": {
              "type": "Identifier",
              "name": "obj"
            },
            "computed": false,
            "property": {
              "type": "Identifier",
              "name": "foo"
            },
            "optional": true
          },
          "computed": false,
          "property": {
            "type": "Identifier",
            "name": "bar"
          },
          "optional": false
        }
      }
    ]
  }
}
```

## Espree AST for `obj?.foo.bar`

The ASt produced by Babel.js is different from the one produced by Espree. The `OptionalMemberExpression` node is not present in the Espree AST. Instead, the `ChainExpression` node is used to represent the optional chaining operation.


`➜  babel-learning git:(main) ✗ compast -lp 'obj?.foo.bar'`
```yml
type: "Program"
body:
  - type: "ExpressionStatement"
    expression:
      type: "ChainExpression"
      expression:
        type: "MemberExpression"
        object:
          type: "MemberExpression"
          object:
            type: "Identifier"
            name: "obj"
          property:
            type: "Identifier"
            name: "foo"
          computed: false
          optional: true
        property:
          type: "Identifier"
          name: "bar"
        computed: false
        optional: false
sourceType: "module"
```