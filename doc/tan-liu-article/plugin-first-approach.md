# Testing the plugin: first approach

> ...
> Basically, your job is done here.

> If `currying` is not defined, then when executing the compiled code, the runtime will scream out `"currying is  not defined"`, just like the `"regeneratorRuntime is not defined"`.

> So probably you have to educate the users to install `currying` polyfills in order to use your `babel-plugin-transformation-curry-function`.
>  ...

## Steps to use the new Parser by a developer

This solution will be s.t. like this:

1. We publish an npm module `currying` that contains the `currying` function.
2. The user of our plugin will have to install the `currying` module in their project.
3. The user will have to explicitly import the `currying` function in their code or we can add to the plugin additional code to import the `currying` function.


## 1. Write the plugin

Let us start by writing the plugin in our learning workspace [`/src/tan-liu-article/babel-transform-curry-function.cjs`](/src/tan-liu-article/babel-transform-curry-function.cjs):

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
          node.body.unshift(curryTemplate); // Insert the require at the beginning of the program
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

## 2. Write and publish the npm module

We can now prepare [a npm module exporting the `currying` function](/src/tan-liu-article/currying ):

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

## 3. User: install the module

Once the module is available, the developer can install it:

```sh
➜  babel-learning git:(main) ✗ npm install src/tan-liu-article/currying
added 1 package, and audited 231 packages in 1s
```

## 4. User: run the modified babel compiler with the plugin

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
➜  babel-learning git:(main) babel-tanhauhau/packages/babel-cli/bin/babel.js \
     src/tan-liu-article/example.js \
     --plugins=./src/tan-liu-article/babel-transform-curry-function.cjs \ 
     -o src/tan-liu-article/salida.cjs
```

Or, if you made a symbolic link in `node_modules/.bin/mybabel` to your version of the babel compiler:

```sh
➜  babel-learning git:(main) ✗ npx mybabel \   
     src/tan-liu-article/example.js \
     --plugins=./src/tan-liu-article/babel-transform-curry-function.cjs \
     -o src/tan-liu-article/salida.cjs
```

Which gives the output:

`➜  babel-learning git:(main) cat src/tan-liu-article/salida.cjs`
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


## Running with the installed compiler using `parserOverride`

You can modify the parser used by your intalled Babel by your own custom parser.
For that we can add a plugin to our configuration [options](https://babeljs.io/docs/options#plugins) 
to call the parser via 

- its npm package name or 
- require it if using JavaScript,

Here is an example of how to do it using JavaScript:

`babel.config.js`
```js
const parse = require("custom-fork-of-babel-parser-on-npm-here");

module.exports = {
  plugins: [
    {
      parserOverride(code, opts) {
        return parse(code, opts);
      },
    },
  ],
};
```
Since we haven't published the plugin, we start making a symbolic link to the parser we want to use:

```sh
➜  tan-liu-article git:(main) ✗ ln -s /Users/casianorodriguezleon/campus-virtual/2122/learning/compiler-learning/babel-tanhauhau/packages/babel-parser/lib/index.js my-parser.js
```

Then we write [our configuration file `myParser.babel.config.js`](/src/tan-liu-article/myParser.babel.config.js) in which 
we load our parser, override the parser and set the plugin [babel-transform-curry-function.cjs](/src/tan-liu-article/babel-transform-curry-function.cjs). This plugin loads the `currying` function and applies the transformation to the `FunctionDeclaration` nodes whose `curry` property is set to `true`:

`➜  tan-liu-article git:(main) ✗ cat myParser.babel.config.js`
```js
const path = require('path');
// ./myParser.js -> /Users/casianorodriguezleon/campus-virtual/2122/learning/compiler-learning/babel-tanhauhau/packages/babel-parser/lib/index.js
const myParser = path.join('./my-parser.js');
const { parse } = require("./myParser.js");

module.exports = {
  "plugins": [
    {
      parserOverride(code, opts) {
        return parse(code, opts);
      },
    },
    path.join(__dirname, "babel-transform-curry-function.cjs"),
  ],
}
```

Now we can run [example.js](/src/tan-liu-article/example.js) using **the installed Babel compiler** with the 
`--config` option  set to the configuration described above.
This leads the compiler to using our parser:

```sh
➜  tan-liu-article git:(main) ✗ npx babel --config-file ./myParser.babel.config.js example.js
"use strict";

const currying = require("currying");
// '@@' makes the function `foo` curried
const foo = currying(function (a, b, c) {
  return a + b + c;
});
console.log(foo(1, 2)(3)); // 6
```
When the resulted code is executed, the output is the same as before:
```
➜  tan-liu-article git:(main) ✗ npx babel --config-file ./myParser.babel.config.js example.js | node
6
```

**Will the Babel parser support a plugin system?**

T[hey  aren't willing to change the  API to support "parser plugins"](https://babeljs.io/docs/babel-parser#faq)
because it's not clear how to make that API effective, and it would limit 
their ability to refactor and optimize the codebase.

## [Back to the article](/doc/tan-liu-article.md#testing-the-plugin-first-approach)