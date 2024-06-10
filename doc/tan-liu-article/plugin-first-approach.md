# Testing the plugin: first approach


## Write the plugin

Let us start by writing the plugin in our learning workspace:

`➜  babel-learning git:(main) ✗ cat src/tan-liu-article/babel-transform-curry-function.cjs`
```js
module.exports = function (babel) {
  const { types: t, template } = babel;
  const curryTemplate = template(`const currying = require("currying")`)();

  return {
    name: "curry-function",
    visitor: {
      Program: {
        exit(path) {
          let node = path.node;
          node.body.unshift(curryTemplate);
        }
      },
      FunctionDeclaration(path) {
        if (path.get("curry").node) { 
          const functionName = path.get("id.name").node;
          path.node.id = undefined;
          path.node.curry = false; // avoid infinite loop

          path.replaceWith(
            t.variableDeclaration("const", [
              t.variableDeclarator(
                t.identifier(functionName),
                t.callExpression(t.identifier("currying"), [ 
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
  };
}
```

## Write and publish the npm module

We can now prepare a npm module for the `currying` function:

```sh
➜  babel-learning git:(main) ✗ tree src/tan-liu-article/currying 
src/tan-liu-article/currying
├── index.js
└── package.json
➜  babel-learning git:(main) ✗ cat src/tan-liu-article/currying/index.js 
module.exports = function currying(fn) {
  const numParamsRequired = fn.length;
  function curryFactory(params) {
    return function (...args) {
      const newParams = params.concat(args);
      if (newParams.length >= numParamsRequired) {
        return fn(...newParams);
      }
      return curryFactory(newParams);
    }
  }
  return curryFactory([]);
}
```
Once is ready, we install it:

## User: install the module

```sh
➜  babel-learning git:(main) ✗ npm install src/tan-liu-article/currying
added 1 package, and audited 231 packages in 1s
```

## User: run the babel compiler with the plugin

We can now run the babel compiler with the plugin for this input:

`➜  babel-learning git:(main) ✗ cat src/tan-liu-article/example.js`
```js
// '@@' makes the function `foo` curried
function @@ foo(a, b, c) {
  return a + b + c;
}
console.log(foo(1, 2)(3)); // 6
```

we compile it using the symbolic link to our version of the babel compiler and save the output to a file 
`src/tan-liu-article/salida.cjs`:

```
➜  babel-learning git:(main) ✗ babel-tanhauhau/packages/babel-cli/bin/babel.js \
     src/tan-liu-article/example.js\
     --plugins=./src/tan-liu-article/babel-transform-curry-function.cjs \ 
     -o src/tan-liu-article/salida.cjs
```
Which gives the output:
```js
"use strict";

const currying = require("currying");

// '@@' makes the function `foo` curried
const foo = currying(function (a, b, c) {
  return a + b + c;
});
console.log(foo(1, 2)(3)); // 6
```

we can now run it using the node interpreter:

```sh
➜  babel-learning git:(main) ✗ node src/tan-liu-article/salida.cjs
6
```

Notice that the user has to be aware that the word `currying` is a word reserved for the plugin.

## [Back to the article](/doc/tan-liu-article.md#testing-the-plugin-first-approach)