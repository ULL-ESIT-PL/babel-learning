# Plugin Second Approach: using the Babel Helpers

> You can add a new helper to `@babel/helpers`, which of course you are unlikely to merge that into the official `@babel/helpers`, so you would have to figure a way to make `@babel/core` to resolve to your `@babel/helpers`:

`package.json`
```json
{
  "resolutions": {
    "@babel/helpers": "7.6.0--your-custom-forked-version",
  }
}
```

> Disclaimer: *I have not personally tried this, but I believe it will work. If you encountered problems trying this, [DM me](https://twitter.com/lihautan), I am very happy to discuss it with you*.

> Adding a new helper function into `@babel/helpers` is very easy.
>
> Head over to [packages/babel-helpers/src/helpers.j](https://github.com/ULL-ESIT-PL/babel-tanhauhau/blob/learning/packages/babel-helpers/src/helpers.js#L2168-L2182) and add a new entry:

`packages/babel-helpers/src/helpers.js`
> ```js
> helpers.currying = helper("7.6.0")`
>   export default function currying(fn) {
>     const numParamsRequired = fn.length;
>     function curryFactory(params) {
>       return function (...args) {
>         const newParams = params.concat(args);
>         if (newParams.length >= numParamsRequired) {
>           return fn(...newParams);
>         }
>         return curryFactory(newParams);
>       }
>     }
>     return curryFactory([]);
>   }
> `;
> ```

The file [packages/babel-helpers/src/helpers.js](https://github.com/ULL-ESIT-PL/babel-tanhauhau/blob/learning/packages/babel-helpers/src/helpers.js#L2168-L2182) is a file that exports functions that are available inside 
the Babel transformations. It is a huge file with the following structure:

```js
// @flow

import template from "@babel/template";

const helpers = Object.create(null);
export default helpers;

const helper = (minVersion: string) => tpl => ({
  minVersion,
  ast: () => template.program.ast(tpl),
});

helpers.typeof = helper("7.0.0-beta.0")`
  export default function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) { return typeof obj; };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype
          ? "symbol"
          : typeof obj;
      };
    }

    return _typeof(obj);
  }
`;
/*
... hundreds of lines with helpers.something = helper(versionString)`...`
*/
```

> The helper tag function specifies the `@babel/core` version required. The trick here is to `export default` the `currying` function.

> To use the helper, just call the `this.addHelper()`:

> ```js
> // ...
> path.replaceWith(
>   t.variableDeclaration('const', [
>     t.variableDeclarator(
>       t.identifier(path.get('id.name').node),
>       t.callExpression(this.addHelper("currying"), [
>         t.toExpression(path.node),
>       ])
>     ),
>   ])
> );
> ```

> The `this.addHelper` will inject the helper at the top of the file if needed, and returns an `Identifier` to the injected function.

## Testing the parser and the plugin: second approach

You can find the files for this section in the folder [/src/tan-liu-article](https://github.com/ULL-ESIT-PL/babel-learning/tree/main/src/tan-liu-article):

```
/Users/casianorodriguezleon/campus-virtual/2324/learning/babel-learning/src/tan-liu-article
```

## Substitute t.identifier("currying") by this.addHelper("currying")

Once we have written the [helpers.currying](https://github.com/ULL-ESIT-PL/babel-tanhauhau/blob/learning/packages/babel-helpers/src/helpers.js#L2168-L2182) in our version of Babel, we can write the plugin that uses it.
Here is the code for the `babel-transform-curry-function-withhelper.cjs` plugin:

`➜  tan-liu-article git:(main) ✗ cat babel-transform-curry-function-withhelper.cjs`
```js
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
                t.callExpression(this.addHelper("currying"), [ // <= HERE
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

## Run with our version of babel using the new plugin withs the helper

We can execute it using the `npx mybabel` command containing the symbolic link pointing 
to our babel version[^symbolicLink] in our `learning` workspace that we created in a previous step:
[^symbolicLink]: Remember: `node_modules/.bin/mybabel` `->` `/Users/casianorodriguezleon/campus-virtual/2122/learning/compiler-learning/babel-tanhauhau/packages/babel-cli/bin/babel.js`

```
➜  tan-liu-article git:(main) npx mybabel example.js \
     --plugins=./babel-transform-curry-function-withhelper.cjs | js-beautify
```  
```js
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

## [Back to the article](/doc/tan-liu-article.md#testing-the-plugin-second-approach)