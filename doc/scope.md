# Scope

See section [/src/manipulating-ast-with-js/README.md#scope](/src/manipulating-ast-with-js/README.md#scope) describing my experiences reproducing [Tan Li Hau lessons in youtube video "Manipulating AST with JavaScript"](https://youtu.be/5z28bsbJJ3w?si=-65NxcFhTM8wpGLX). Tan starts to talk about scope at [38:40](https://www.youtube.com/watch?v=5z28bsbJJ3w&list=PLoKaNN3BjQX0fEhzfpU9xHNWdxhIkP-hy&index=1&t=2320s)

## Checking if a local variable is bound

```js
FunctionDeclaration(path) {
  if (path.scope.hasBinding("n")) {
    // ...
  }
}
```

This will walk up the scope tree and check for that particular binding.

You can also check if a scope has its **own** binding:

```js
FunctionDeclaration(path) {
  if (path.scope.hasOwnBinding("n")) {
    // ...
  }
}
```

## Generating a UID

This will generate an identifier that doesn't collide with any locally defined
variables.

```js
FunctionDeclaration(path) {
  path.scope.generateUidIdentifier("uid");
  // Node { type: "Identifier", name: "_uid" }
  path.scope.generateUidIdentifier("uid");
  // Node { type: "Identifier", name: "_uid2" }
}
```

## Pushing a variable declaration to a parent scope

Sometimes you may want to push a `VariableDeclaration` so you can assign to it.

```js
FunctionDeclaration(path) {
  const id = path.scope.generateUidIdentifierBasedOnNode(path.node.id);
  path.remove();
  path.scope.parent.push({ id, init: path.node });
}
```

```diff
- function square(n) {
+ var _square = function square(n) {
    return n * n;
- }
+ };
```

## Rename a binding and its references

```js
FunctionDeclaration(path) {
  path.scope.rename("n", "x");
}
```

```diff
- function square(n) {
-   return n * n;
+ function square(x) {
+   return x * x;
  }
```

Alternatively, you can rename a binding to a generated unique identifier:

```js
FunctionDeclaration(path) {
  path.scope.rename("n");
}
```

```diff
- function square(n) {
-   return n * n;
+ function square(_n) {
+   return _n * _n;
  }
```

## referencePaths of a binding

During a traversing the `path.scope.bindings` object contains all the bindings in the current scope. 
The bindings are stored in an object where 
the keys are the names of the bindings and 
the values are objects with information about the binding. 

The `referencePaths` property of the binding object is an array of paths that reference the **usages** of the binding. 

This can be confirmed by the code in example [src/scope/referencepaths.mjs](/src/scope/referencepaths.mjs).

```js
import { parse } from "@babel/parser";
import _traverse from "@babel/traverse";
const traverse = _traverse.default || _traverse;

/* Return the path of the first Identifier node in the AST of the code */
function getIdentifierPath(code) {
  const ast = parse(code);
  let nodePath;
  traverse(ast, {
    Identifier: function (path) {
      nodePath = path;
      path.stop(); // Stop traversing
    },
  });

  return nodePath;
}

function testReferencePaths() { //0123456789012345678901234567890123456
  const path = getIdentifierPath("function square(n) { return n * n}"); 
  console.log(path.node.loc.start); // { line: 1, column: 9, index: 9 }
  const referencePaths = path.context.scope.bindings.n.referencePaths;
  console.log(referencePaths.length); // 2
  console.log(referencePaths[0].node.loc.start) /* { line: 1, column: 28, index: 28, } */
  console.log(referencePaths[1].node.loc.start) /* { line: 1, column: 32, index: 32, } */
}

testReferencePaths();
```

Notice that the array `referencePaths` does not contain the declaration as a parameter 
at column 26 of the binding `n`.

## Stack StackOverflow "How do I traverse the scope of a Path in a babel plugin"

See the question at Stack StackOverflow 
[How do I traverse the scope of a Path in a babel plugin](https://stackoverflow.com/questions/44309639/how-do-i-traverse-the-scope-of-a-path-in-a-babel-plugin)

> To illustrate this with a contrived example I'd like to transform source code like:

> ```js
> const f = require('foo-bar');
> const result = f() * 2;
> ```

> into something like:

> ```js
> const result = 99 * 2; // as i "know" that calling f will always return 99
> ```

I decided to slightly modify the input example to have at least two scopes:

```js
➜  manipulating-ast-with-js git:(main) cat example-scope-input.js 
const f = require('foo-bar');
const result = f() * 2;
let a = f();
function h() {
  let f = 2;
  return f;
}
```

The key point is that during a traversing the `path.scope.bindings` object contains all the bindings in the current scope. The bindings are stored in an object where the keys are the names of the bindings and the values are objects with information about the binding. The `referencePaths` property of the binding object is an array of paths that reference the **usages** of the binding. 

In the following code, we simple traverse the usages of the binding `localIdentifier`
replacing the references to the parent node (the `CallExpression`) with a `NumericLiteral(99)`:

```js
➜  manipulating-ast-with-js git:(main) ✗ cat example-scope-plugin.js 
module.exports = ({ types: t }) => {
  return {
    visitor: {
      CallExpression(path) {
        const { scope, node } = path;
        if (node.callee.name === 'require'
          && node.arguments.length === 1
          && t.isStringLiteral(node.arguments[0])
          && node.arguments[0].value === 'foo-bar'
        ) {
          const localIdentifier = path.parent.id.name; // f
          scope.bindings[localIdentifier].referencePaths.forEach(p => {
            p.parentPath.replaceWith(t.NumericLiteral(99));
          }); 
        }
      }
    }
  }
};
```

When we run Babel using this plugin we get:

```js
➜  manipulating-ast-with-js git:(main) ✗ npx babel example-scope-input.js --plugins=./example-scope-plugin.js
const f = require('foo-bar');
const result = 99 * 2;
let a = 99;
function h() {
  let f = 2;
  return f;
}
```

## Transforming a generator declaration on a constant function declaration and hoisting it

See examples in folder [/src/scope/generator/-transform/](/src/scope/generator/-transform/).

We want to write a transformation so that the generator declaration is hoisted to a constant declaration
with the same name of the generator function. The constant must be initialized to a call to the function  with name `buildGenerator`with argument the bare function.  
The transformed declarationmust be hoisted at the top of the scope where the generator is. 
For instance, given this input:

`➜  src git:(main) ✗ cat scope/generator-transform/input-generator-declaration-local.js`
```js
function chuchu() {
  function* add(a,b,c) { return a+b+c; }
  add(2,3,4)
}
```

It has to be transformed to:


`➜  generator-transform git:(main) ✗ npx babel input-generator-declaration-local.js --plugins=./generator-transform-plugin.cjs`
```js
function chuchu() {
  const add = buildGenerator(function (a, b, c) {
    return a + b + c;
  });
  add(2, 3, 4);
}
chuchu();
```

If the generator is in the global scope, it has to work also:

`➜  generator-transform git:(main) ✗ cat input-generator-declaration-global.js`
```js
function* add(a, b, c) { return a + b + c; }
add(2, 3, 4)

chuchu();
```

Has to be transformed into:

`➜  generator-transform git:(main) ✗ npx babel input-generator-declaration-global.js --plugins=./generator-transform-plugin.cjs`
```js
const add = buildGenerator(function (a, b, c) {
  return a + b + c;
});
add(2, 3, 4);
chuchu();
```