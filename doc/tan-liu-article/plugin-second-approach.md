# Plugin Second Approach: using the Babel Helpers

You can find the files for this section in the folder [/src/tan-liu-article](https://github.com/ULL-ESIT-PL/babel-learning/tree/main/src/tan-liu-article):

```
/Users/casianorodriguezleon/campus-virtual/2324/learning/babel-learning/src/tan-liu-article
```

## t.callExpression(this.addHelper("currying")

Here is the code for the plugin:

`➜  tan-liu-article git:(main) ✗ cat babel-transform-curry-function-withhelper.cjs`
``` 
```
module.exports = function (babel) {
  const { types: t, template } = babel;
  const curryTemplate = template(`const currying = require("currying")`)();

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
                t.callExpression(this.addHelper("currying"), [
                //t.callExpression(t.identifier("currying"), [ 
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

## npx mybabel example.js --plugins=./babel-transform-curry-function-withhelper.cjs

We can execute it using the `npx mybabel` command containing the symbolic link pointing 
to the babel version in our `learning` workspace that we created in a previous step:

```
➜  tan-liu-article git:(main) npx mybabel example.js --plugins=./babel-transform-curry-function-withhelper.cjs | js-beautify
// '@@' makes the function `foo` curried
const foo = _currying(function(a, b, c) {
    return a + b + c;
});

function _currying(fn) {
    const numParamsRequired = fn.length;

    function curryFactory(params) {
        return function(...args) {
            const newParams = params.concat(args);
            if (newParams.length >= numParamsRequired) {
                return fn(...newParams);
            }
            return curryFactory(newParams);
        };
    }
    return curryFactory([]);
}

console.log(foo(1, 2)(3)); // 6
```
We can pipe it to `node` and see it working:

```
➜  tan-liu-article git:(main) ✗ npx mybabel example.js --plugins=./babel-transform-curry-function-withhelper.cjs | node       
6
```

## [Back to the article](/doc/tan-liu-article.md#testing-the-plugin-first-approach)