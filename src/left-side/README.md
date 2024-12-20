> [!IMPORTANT]
> **Warning: This is work in progress. These comments can be outdated.**


# Pablo's function expressions on the left side of the assignment

You can find Pablo's current (2024-12-20) implementation of function expressions on the left side of the assignment
[pablo-tfg branch](https://github.com/ULL-ESIT-PL/babel-tanhauhau/tree/pablo-tfg/packages/babel-parser) of the `ULL-ESIT-PL/babel-tanhauhau` repo. 

Here I am using the `pabloparser` and `pablobabel` links to compile the code:

```bash 
➜  left-side git:(main) ls -l ../../node_modules/.bin/pablo*
lrwxr-xr-x@ 1 casianorodriguezleon  staff  128  7 nov 13:21 ../../node_modules/.bin/pablobabel -> /Users/casianorodriguezleon/campus-virtual/2324/learning/compiler-learning/babel-tanhauhau-pablo/packages/babel-cli/bin/babel.js
lrwxr-xr-x@ 1 casianorodriguezleon  staff  138  7 nov 13:20 ../../node_modules/.bin/pabloparser -> /Users/casianorodriguezleon/campus-virtual/2324/learning/compiler-learning/babel-tanhauhau-pablo/packages/babel-parser/bin/babel-parser.js
➜  left-side git:(main) 
```

This works because I keep a workspace per development branch of the babel-tanhauhau repo in my computer at the same level that my workspace of this repo:

```
➜  left-side git:(main) pwd -P                         
/Users/casianorodriguezleon/campus-virtual/2324/learning/babel-learning/src/left-side
➜  left-side git:(main) ✗ ls -ld ../../../babel-tanhauhau*/
drwxr-xr-x@ 41 casianorodriguezleon  staff  1312  2 dic 08:46 ../../../babel-tanhauhau-adrian/
drwxr-xr-x  37 casianorodriguezleon  staff  1184  8 nov 11:21 ../../../babel-tanhauhau-feat-curry-function/
drwxr-xr-x@ 40 casianorodriguezleon  staff  1280 20 dic 12:49 ../../../babel-tanhauhau-pablo/
drwxr-xr-x  42 casianorodriguezleon  staff  1344  5 nov 11:24 ../../../babel-tanhauhau/
➜  left-side git:(main) ✗ ls -ld ../../../babel-learning   
drwxr-xr-x@ 16 casianorodriguezleon  staff  512  2 dic 09:13 ../../../babel-learning
```
You can build these links with commands like:

```bash
➜  left-side git:(main) ln -s /Users/casianorodriguezleon/campus-virtual/2324/learning/compiler-learning/babel-tanhauhau-pablo/packages/babel-cli/bin/babel.js ../../node_modules/.bin/pablobabel
ln -s /Users/casianorodriguezleon/campus-virtual/2324/learning/compiler-learning/babel-tanhauhau-pablo/packages/babel-parser/bin/babel-parser.js ../../node_modules/.bin/pabloparser 
```

Let us consider the following code:

`➜  left-side git:(main) ✗ cat left-side-original.mjs`
```js
➜  left-side git:(main) ✗ cat left-side-original.mjs 
//foo.assign(10, 9) Alternative, defining assignable functions.
function @@ foo(bar) {
  return bar * 2;
}
foo(10) = 5;

console.log(foo(4));   // 8
console.log(foo(10));  // 5
```
  
When compiled with [Pablo's parser]() we get an AST like:
  
``` 
➜  left-side git:(main) npx pabloparser left-side-original.mjs | jq '.program.body[0].assignable'
true
```
and:

`➜  left-side git:(main) ✗ npx pabloparser left-side-original.mjs | jq '.program.body[1]'`    
```json 
{
  "type": "ExpressionStatement",
  "start": 107,
  "end": 119,
  "expression": {
    "type": "AssignmentExpression",
    "start": 107,
    "end": 118,
    "loc": {
      "start": {
        "line": 5,
        "column": 0
      },
      "end": {
        "line": 5,
        "column": 11
      }
    },
    "operator": "=",
    "left": {
      "type": "CallExpression",
      "start": 107,
      "end": 114,
      "loc": {
        "start": {
          "line": 5,
          "column": 0
        },
        "end": {
          "line": 5,
          "column": 7
        }
      },
      "callee": {
        "type": "Identifier",
        "start": 107,
        "end": 110,
        "loc": {
          "start": {
            "line": 5,
            "column": 0
          },
          "end": {
            "line": 5,
            "column": 3
          },
          "identifierName": "foo"
        },
        "name": "foo"
      },
      "arguments": [
        {
          "type": "NumericLiteral",
          "start": 111,
          "end": 113,
          "loc": {
            "start": {
              "line": 5,
              "column": 4
            },
            "end": {
              "line": 5,
              "column": 6
            }
          },
          "extra": {
            "rawValue": 10,
            "raw": "10"
          },
          "value": 10
        }
      ]
    },
    "right": {
      "type": "NumericLiteral",
      "start": 117,
      "end": 118,
      "loc": {
        "start": {
          "line": 5,
          "column": 10
        },
        "end": {
          "line": 5,
          "column": 11
        }
      },
      "extra": {
        "rawValue": 5,
        "raw": "5"
      },
      "value": 5
    }
  }
}
```
Using the configuration file:

`➜  left-side git:(main) ✗ cat babel.config.json` 
```json 
{
  "plugins": [
    "../../../babel-tanhauhau-pablo/packages/babel-parser/babel-left-side-plugin.cjs"
  ]
}
```

We can use now Pablo's version of babel transpiler for the input:

`➜  left-side git:(main) ✗ npx pablobabel left-side-original.mjs`
```js
//foo.assign(10, 9) Alternative, defining assignable functions.
const foo = functionObject(function (bar) {
  return bar * 2;
});
assign(foo, 10, 5);
console.log(foo(4)); // 8

console.log(foo(10)); // 5
```

<!--
We can execute it this way:

```
➜  left-side git:(main) ✗ npx pablobabel left-side-original.mjs -o left-side-original.cjs
```

and then we add to `NODE_PATH` the path to the `src` directory of the plugin:

```
➜  left-side git:(main) ✗ tree -I node_modules  /Users/casianorodriguezleon/campus-virtual/2122/learning/compiler-learning/babel-tanhauhau-pablo/packages/babel-plugin-left-side-support/
/Users/casianorodriguezleon/campus-virtual/2122/learning/compiler-learning/babel-tanhauhau-pablo/packages/babel-plugin-left-side-support/
├── lib
│   ├── assign.js
│   ├── function-object.js
│   └── index.js
├── package.json
└── src
    ├── assign.js
    ├── function-object.js
    └── index.js

2 directories, 7 files
➜  left-side git:(main) ✗ export NODE_PATH=/Users/casianorodriguezleon/campus-virtual/2122/learning/compiler-learning/babel-tanhauhau-pablo/packages/babel-plugin-left-side-support/ 
```

Now we open a node session and require the `left-side-original.cjs` file defining the `functionObject` and `assign` functions:

```
➜  left-side git:(main) ✗ node
Welcome to Node.js v20.5.0.
Type ".help" for more information.
> const { functionObject, assign } = require("src/index")
undefined
> require("./left-side-original.cjs")
8
20
{}
```
-->