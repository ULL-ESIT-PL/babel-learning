# Testing the plugin: first approach

Let us start by writing the plugin in our learning workspace:

`➜  babel-learning git:(main) ✗ cat src/tan-liu-article/babel-transform-curry-function.cjs`
```js
module.exports = function (babel) {
  const { types: t } = babel;

  return {
    name: "curry-function",
    visitor: {
      FunctionDeclaration(path) {
        if (path.get("curry").node) { 
          const functionName = path.get("id.name").node;
          path.node.id = undefined;
          path.node.curry = false; // avoid infinite loop

          path.replaceWith(
            t.variableDeclaration("const", [
              t.variableDeclarator(
                t.identifier(functionName),
                // t.callExpression(this.addHelper("currying"), [
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
We can now run the babel compiler with the plugin for this input:

`➜  babel-learning git:(main) ✗ cat src/tan-liu-article/example.js`
```js
// '@@' makes the function `foo` curried
function @@ foo(a, b, c) {
  return a + b + c;
}
console.log(foo(1, 2)(3)); // 6
```

we compile it using the symbolic link to the babel compiler:
`➜  babel-learning git:(main) ✗ babel-tanhauhau/packages/babel-cli/bin/babel.js src/tan-liu-article/example.js  --plugins=./src/tan-liu-article/babel-transform-curry-function.cjs`
```js
"use strict";

// '@@' makes the function `foo` curried
const foo = currying(function (a, b, c) {
  return a + b + c;
});
console.log(foo(1, 2)(3)); // 6
```
Now, if we want to run it we have to provide the `currying` function.

