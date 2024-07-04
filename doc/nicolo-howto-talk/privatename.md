# What is a `PrivateName` in the Babel Abstract Syntax Tree (AST)?

In the Babel Abstract Syntax Tree (AST), a `PrivateName` is a node type that represents private class fields and methods in JavaScript. These are part of the [class fields proposal](https://github.com/tc39/proposal-class-fields), which allows developers to define **private properties** and methods within a class that are not accessible outside of that class. Private fields provide a strong encapsulation boundary: It's impossible to access the private field from outside of the class, unless there is some explicit code to expose it (for example, providing a getter). This differs from JavaScript properties, which support various kinds of reflection and metaprogramming, and is instead analogous to mechanisms like closures and WeakMap, which don't provide access to their internals. See [these FAQ entries](https://github.com/tc39/proposal-class-fields/blob/master/PRIVATE_SYNTAX_FAQ.md#why-doesnt-this-proposal-allow-some-mechanism-for-reflecting-on--accessing-private-fields-from-outside-the-class-which-declares-them-eg-for-testing-dont-other-languages-normally-allow-that) for more information on the motivation for this decision.

## Private Fields and Methods in JavaScript

Private fields and methods are denoted by a `#` prefix in JavaScript:

`➜  babel-learning git:(main) ✗ cat src/nicolo-howto-talk/privatename-example.js`
```js 
class Counter {
  #x = 0;

  click() {
    this.#x++;
  }

  constructor() {
    this.#x = 0;
  }

  render() {
    return this.#x.toString();
  }
}

const counter = new Counter();
counter.click();
console.log(counter.render()); // 1
```

In the example above, `#x` is private to the `Counter` class.

### The `PrivateName` Node in Babel AST

The `PrivateName` node in the Babel AST represents these private identifiers. It typically appears in conjunction with nodes that define or reference private fields and methods. Here is the YML representation of the babel AST for the above code:

`➜  babel-learning git:(main) ✗ compast -b  src/nicolo-howto-talk/privatename-example.js`
```yml
type: "File"
program:
  type: "Program"
  interpreter: null
  body:
    - type: "ClassDeclaration"
      id:
        type: "Identifier"
        name: "Counter"
      superClass: null
      body:
        type: "ClassBody"
        body:
          - type: "ClassPrivateProperty"
            static: false
            key:
              type: "PrivateName"
              id:
                type: "Identifier"
                name: "x"
            value:
              type: "NumericLiteral"
              value: 0
          - type: "ClassMethod"
            static: false
            key:
              type: "Identifier"
              name: "click"
            kind: "method"
            id: null
            generator: false
            async: false
            params: []
            body:
              type: "BlockStatement"
              body:
                - type: "ExpressionStatement"
                  expression:
                    type: "UpdateExpression"
                    operator: "++"
                    prefix: false
                    argument:
                      type: "MemberExpression"
                      object:
                        type: "ThisExpression"
                      property:
                        type: "PrivateName"
                        id:
                          type: "Identifier"
                          name: "x"
              directives: []
          - type: "ClassMethod"
            static: false
            key:
              type: "Identifier"
              name: "constructor"
            kind: "constructor"
            id: null
            generator: false
            async: false
            params: []
            body:
              type: "BlockStatement"
              body:
                - type: "ExpressionStatement"
                  expression:
                    type: "AssignmentExpression"
                    operator: "="
                    left:
                      type: "MemberExpression"
                      object:
                        type: "ThisExpression"
                      property:
                        type: "PrivateName"
                        id:
                          type: "Identifier"
                          name: "x"
                    right:
                      type: "NumericLiteral"
                      value: 0
              directives: []
          - type: "ClassMethod"
            static: false
            key:
              type: "Identifier"
              name: "render"
            kind: "method"
            id: null
            generator: false
            async: false
            params: []
            body:
              type: "BlockStatement"
              body:
                - type: "ReturnStatement"
                  argument:
                    type: "CallExpression"
                    callee:
                      type: "MemberExpression"
                      object:
                        type: "MemberExpression"
                        object:
                          type: "ThisExpression"
                        property:
                          type: "PrivateName"
                          id:
                            type: "Identifier"
                            name: "x"
                      property:
                        type: "Identifier"
                        name: "toString"
                    arguments: []
              directives: []
    - type: "VariableDeclaration"
      declarations:
        - type: "VariableDeclarator"
          id:
            type: "Identifier"
            name: "counter"
          init:
            type: "NewExpression"
            callee:
              type: "Identifier"
              name: "Counter"
            arguments: []
      kind: "const"
    - type: "ExpressionStatement"
      expression:
        type: "CallExpression"
        callee:
          type: "MemberExpression"
          object:
            type: "Identifier"
            name: "counter"
          property:
            type: "Identifier"
            name: "click"
        arguments: []
    - type: "ExpressionStatement"
      expression:
        type: "CallExpression"
        callee:
          type: "MemberExpression"
          object:
            type: "Identifier"
            name: "console"
          property:
            type: "Identifier"
            name: "log"
        arguments:
          - type: "CallExpression"
            callee:
              type: "MemberExpression"
              object:
                type: "Identifier"
                name: "counter"
              property:
                type: "Identifier"
                name: "render"
            arguments: []
  directives: []
```
Notice the `ClassPrivateProperty` and `ClassMethod` nodes that use the `PrivateName` node for their `key` property.

The `PrivateName` node typically has the following structure:

- `type`: A string with the value `"PrivateName"`.
- `id`: An `Identifier` node that contains the name of the private field or method.

## Implementations

The class fields proposal has been implemented in various JavaScript engines and transpilers, including node.js: 

```sh
➜  babel-learning git:(main) node src/nicolo-howto-talk/privatename-example.js 
1
```