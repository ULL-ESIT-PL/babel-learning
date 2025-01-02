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
See the example at [/src/scope/non-declared/](/src/scope/non-declared/).


### path.scope.hasOwnBinding

You can also check if a scope has its **own** binding. The following example replaces
all references to local variables `n` with `x` but not the global variable `n`.

```js
const varName = process.env["VARNAME"] || "z";
const replace = process.env["REPLACE"] || "z";

export default function({ types: t }) {
  return {
    visitor: {
      FunctionDeclaration(path) {
        if (path.scope.hasOwnBinding(varName)) {
          path.traverse({
            Identifier(path) {
              if (path.node.name ===  varName) {
                path.node.name = replace;
              }
            }
          });
          return;
        }
      }
    }
  };
}
```

See the example at [/src/scope/replace-local-n-by-x/](/src/scope/replace-local-n-by-x/).

## Generating a UID

This will generate an identifier that doesn't collide with any locally defined variables.

```js
FunctionDeclaration(path) {
  path.scope.generateUidIdentifier("uid");
  // Node { type: "Identifier", name: "_uid" }
  path.scope.generateUidIdentifier("uid");
  // Node { type: "Identifier", name: "_uid2" }
}
```

See examples at:

- Section [Pushing a variable declaration to a parent scope](#pushing-a-variable-declaration-to-a-parent-scope) in this file.
- [/src/awesome/tc39-pattern-matching/](/src/awesome/tc39-pattern-matching/) in function `function transformMatch (babel, referencePath)`

  ```js
  module.exports = function transformMatch (babel, referencePath) {
    const $root = referencePath.parentPath.parentPath
    const $$uid = $root.scope.generateUidIdentifier('uid')
    const $matching = getMatching($root)
    const $$matching = $matching.node
    const $patterns = getPatterns($root)
    const $$blocks = transformPatterns(babel, $patterns, $$uid).filter(item => item)

    const $$IIFE = babel.template(`
      (v=> {
        const UID = EXP
        BLOCKS
        throw new Error("No matching pattern");
      })()
      `)({
      UID: $$uid,
      EXP: $$matching,
      BLOCKS: $$blocks
    })
    $root.replaceWith($$IIFE)
  }
  ```
- [/src/nicolo-how-to-talk](/src/nicolo-howto-talk/) for the optional chaining plugin [optional-chaining-plugin.cjs](/src/nicolo-howto-talk/optional-chaining-plugin.cjs) and [optional-chaining-plugin2.cjs](/src/nicolo-howto-talk/optional-chaining-plugin2.cjs)

  ```js 
  //const generate = require('@babel/generator').default;
  module.exports = function myPlugin(babel, options) {
    const { types: t, template } = babel;
    return {
      name: "optional-chaining-plugin",
      manipulateOptions(opts) {
        opts.parserOpts.plugins.push("OptionalChaining")
      },
      visitor: {
        OptionalMemberExpression(path) {

          while (!path.node.optional) path = path.get("object");

          let { object, property, computed } = path.node;
          let tmp = path.scope.generateUidIdentifierBasedOnNode(property);
          path.scope.push({ id: tmp, kind: 'let', init: t.NullLiteral() });

          
          let memberExp = t.memberExpression(tmp, property, computed);
          let undef = path.scope.buildUndefinedNode();
          path.replaceWith(
            template.expression.ast`
              (${tmp} = ${object}) == null? ${undef} :
              ${memberExp}
            `
          )

        }
      }
    }
  }
  ```

## Pushing a variable declaration

The `path.scope.push` method has the following signature:

```javascript
scope.push({
  id: t.identifier("myVar"),
  init: t.numericLiteral(42),
  kind: "const"
});
```

The method takes an object with the following properties:

- `id`: The identifier node representing the variable name. This is typically created using `t.identifier(name)`.
- `init`: (Optional) The initial value of the variable. This should be an AST node representing the value, such as `t.numericLiteral(42)` for the number `42`.
- `kind`: (Optional) The kind of variable declaration. This can be `"var"`, `"let"`, or `"const"`. If omitted, it defaults to `"var"`.

Here is an example of how you might use `path.scope.push` within a Babel plugin to add a new constant variable to the current scope:

```javascript
module.exports = function(babel) {
  const { types: t } = babel;

  return {
    name: "add-variable-plugin",
    visitor: {
      FunctionDeclaration(path) {
        path.scope.push({
          id: t.identifier("newVar"),
          init: t.numericLiteral(42),
          kind: "const"
        });
      }
    }
  };
};
```

In this example:
- The plugin defines a visitor for `FunctionDeclaration` nodes.
- When a function declaration is encountered, the plugin adds a new constant variable `newVar` with an initial value of `42` to the scope of that function.


Given the input:

`➜  babel-learning git:(main) ✗ cat src/scope/scopepush/input.js`
```js
function tutu(x) {
  return newVar;
}
```
When we run Babel using this plugin we get:

`➜  babel-learning git:(main) npx babel src/scope/scopepush/input.js --plugins=./src/scope/scopepush/scopepush.cjs`
```js
"use strict";

function tutu(x) {
  const newVar = 42;
  return newVar;
}
```

## Pushing a variable declaration to a parent scope

This example shows how to 

- The `path.scope.generateUidIdentifierBasedOnNode(path.node.id)` generates a unique identifier based on the node id
- The function declaration is converted to an expression `t.toExpression(path.node)` and
- remove a function declaration from its current scope `path.remove()` 
- push it to the parent scope.
- the expression is pushed to the parent scope.

`➜  src git:(main) cat scope/scopepush/scopeparentpush.cjs`
```js
module.exports = function(babel) {
  const { types: t } = babel;

  return {
    name: "pushing-to-parent-plugin",
    visitor: {
      FunctionDeclaration(path) {
        const id = path.scope.generateUidIdentifierBasedOnNode(path.node.id);
        let node = t.toExpression(path.node);
        path.remove();
        path.scope.parent.push({ id, init: node });
      }
    }
  };
};
```

When we run Babel using this plugin and [pipe the output to `diff -y`](https://stackoverflow.com/questions/17195308/unix-diff-side-to-side-results) we get:

```
➜  scopepush git:(main) ✗ npx babel square.js --plugins=./scopeparentpush.cjs | diff -y - square.js
var _square = function square(n) {                              |       function square(n) {
  return n * n;                                                           return n * n;
};                                                              |       }
\ No newline at end of file
```

Notice that since `kind` was not specified in `path.scope.parent.push({ id, init: node });` the variable is declared as `var`.

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

We want to write a transformation so that a generator declaration `function* xxx(...) { ...}` 
is hoisted to a constant declaration with the same name of the generator function. The constant must be initialized to a call to the function  with name `buildGenerator`with argument the bare function.  `const xxx = buildGenerator(function(...) { ... })`.
The transformed declaration must be hoisted at the top of the scope where the generator is. 
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

Here is the plugin [generator-transform-plugin.cjs](/src/scope/generator/-transform/generator-transform-plugin.cjs):

`/src/scope/generator-transform/generator-transform-plugin.cjs`
```js
module.exports = function (babel) {
  const { types: t } = babel;

  return {
    name: "generator-transform", 
    visitor: {
      FunctionDeclaration(path) {
        if (path.get("generator").node) { 
          const functionName = path.get("id.name").node;
          path.node.id = undefined;
          path.node.generator = false; // avoid infinite loop

          path.replaceWith(
            t.variableDeclaration("const", [
              t.variableDeclarator(
                t.identifier(functionName),
                t.callExpression(t.identifier("buildGenerator"), [ 
                  t.toExpression(path.node),
                ]),
              ), 
            ]),
          );

          // hoist it
          const node = path.node;
          const currentScope = path.scope.path.node;
          path.remove();
          if (currentScope.body.body) {
            currentScope.body.body.unshift(node);
          } else {
            currentScope.body.unshift(node);
          }
        }
      },
    },
  }
}
```