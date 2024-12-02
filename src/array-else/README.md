# Adrian's `else` clause for Arrays and Objects

You can find Adrian's current (2024-11-07) implementation of the `else` clause
for Arrays and Objects in the [Adrian-tfg branch](https://github.com/ULL-ESIT-PL/babel-tanhauhau/tree/Adrian-tfg/packages/babel-parser) of the `ULL-ESIT-PL/babel-tanhauhau` repo. 

> [!IMPORTANT]
> **Warning: This is work in progress. These comments can be outdated.**

Place yourself in the `array-else` directory: 

```
➜  array-else git:(main) ✗ pwd -P
/Users/casianorodriguezleon/campus-virtual/2324/learning/babel-learning/src/array-else
```
Here I am using the `adrianparser` and `adrianbabel` links to compile the code:

```bash
➜  array-else git:(main) ls -l ../../node_modules/.bin/adrian*
lrwxr-xr-x@ 1 casianorodriguezleon  staff  129  5 nov 12:17 ../../node_modules/.bin/adrianbabel -> /Users/casianorodriguezleon/campus-virtual/2122/learning/compiler-learning/babel-tanhauhau-adrian/packages/babel-cli/bin/babel.js
lrwxr-xr-x@ 1 casianorodriguezleon  staff  139  5 nov 12:08 ../../node_modules/.bin/adrianparser -> /Users/casianorodriguezleon/campus-virtual/2122/learning/compiler-learning/babel-tanhauhau-adrian/packages/babel-parser/bin/babel-parser.js
```

> [!IMPORTANT] I have noticed that if you re-`build` the [Adrian-tfg]((https://github.com/ULL-ESIT-PL/babel-tanhauhau/tree/Adrian-tfg/packages/babel-parser) branch the links no longer work and you have to recreate them. 



## Extending Arrays and Objects with an `else` clause

Given the following code:

`➜  babel-learning git:(main) ✗ cat src/array-else/array-else.js`
```javascript
let a = [1, 2, 3, else x => x * x];

console.log(a[2]);  // 3
console.log(a[5]);  // 25 (porque 5 * 5 = 25)
```

When compiled with [Adrian's parser](https://github.com/ULL-ESIT-PL/babel-tanhauhau/blob/Adrian-tfg/packages/babel-parser/src/parser/expression.js) we get an AST like:

```
➜  babel-learning git:(main) ✗ npx adrianparser src/array-else/array-else.js 2> /dev/null | jq '[.program.body[0].declarations[0].init.elements[] | .type ]' 
[
  "NumericLiteral",
  "NumericLiteral",
  "NumericLiteral",
  "ElseExpression"
]
```

To use Adrian's babel transpiler we write a `babel.config.json` linking to the support plugin (currently 2024-11-07 in the wrong place)

`➜  babel-learning git:(main) ✗ cat src/array-else/babel.config.json`
```json
{
  "plugins": [ 
    "../../../babel-tanhauhau-adrian/packages/babel-parser/defaultvector.cjs"
  ]
}
```
Assuming we have (2024/12/02):

```bash
➜  babel-learning git:(main) ✗ ln -s /Users/casianorodriguezleon/campus-virtual/2425/learning/compiler-learning/babel-tanhauhau-adrian/packages/babel-cli/bin/babel.js node_modules/.bin/adrianbabel
```

and now we can transpile the code:

`➜  babel-learning git:(main) ✗ npx adrianbabel src/array-else/array-else.js --config-file $(pwd)/src/array-else/`
```js 
babel.config.json 
function isNumeric(n) {
  return !isNaN(n) && isFinite(n);
}

let a = new Proxy([1, 2, 3], {
  [Symbol.isConcatSpreadable]: true,
  length: 3,
  get: function (target, prop) {
    if (typeof prop === "symbol" && prop === Symbol.isConcatSpreadable) return true;
    if (typeof target[prop] === "function") return function (...args) {
      return target[prop].apply(target, args);
    };
    if (typeof target[prop] === "string") return target[prop];
    if (isNumeric(prop) && prop < target.length && prop >= 0) return target[prop];
    return (x => x * x)(prop);
  }
});
console.log(a[2]); // 3

console.log(a[5]); // 25 (porque 5 * 5 = 25)
```

and we can execute it:

```bash
➜  babel-learning git:(main) ✗ npx adrianbabel src/array-else/array-else.js --config-file $(pwd)/src/array-else/babel.config.json | node -
3
25
```

## Links to Adrian's compiler for the `else` clause on Arrays and Objects

Context:

```
➜  babel-parser git:(adrian) ✗ date
lunes,  2 de diciembre de 2024, 09:38:22 WET
➜  babel-parser git:(adrian) ✗ pwd -P
/Users/casianorodriguezleon/campus-virtual/2122/learning/compiler-learning/babel-tanhauhau-adrian/packages/babel-parser
➜  babel-parser git:(adrian) ✗ git lg | head -n 1
5226ff943 - (HEAD -> adrian, origin/Adrian-tfg) Now the concat doesn´t give an error when trying to concat a normal vector with a else vector (hace 13 horas Adrián Mora)
```

Involved files in branch [Adrian-tfg](https://github.com/ULL-ESIT-PL/babel-tanhauhau/blob/Adrian-tfg):

- [packages/babel-parser/babel.config.json](https://github.com/ULL-ESIT-PL/babel-tanhauhau/blob/Adrian-tfg/packages/babel-parser/babel.config.json)
- [packages/babel-parser/defaultvector.cjs](https://github.com/ULL-ESIT-PL/babel-tanhauhau/blob/Adrian-tfg/packages/babel-parser/defaultvector.cjs)
- [packages/babel-parser/pruebas.js](https://github.com/ULL-ESIT-PL/babel-tanhauhau/blob/Adrian-tfg/packages/babel-parser/pruebas.js)
- [packages/babel-parser/src/parser/expression.js](https://github.com/ULL-ESIT-PL/babel-tanhauhau/blob/Adrian-tfg/packages/babel-parser/src/parser/expression.js#L2079-L2091)


## Semantics of the `else` clause for Arrays 

Warning! the final semantic of the `else` clause for Arrays is not yet defined.
Under discussion.

Assume the following input:

``` 
➜  array-else git:(main) ✗ pwd -P
/Users/casianorodriguezleon/campus-virtual/2324/learning/babel-learning/src/array-else
➜  array-else git:(main) ✗ cat array-else-undefined.js 
```
```javascript
let a = [1, undefined, 3, else x => x * x];

console.log(a[0]);  // 1
console.log(a[1]);  // undefined
console.log(a[5]);  // 25 (porque 5 * 5 = 25)
```
  
When compiled with Adrian's parser we get:
  
```javascript
                                                                    
➜  array-else git:(main) ✗ npx adrianbabel array-undefined-else.js 
babel:
  array-undefined-else.js does not exist
➜  array-else git:(main) ✗ npx adrianbabel array-else-undefined.js 
function isNumeric(n) {
  return !isNaN(n) && isFinite(n);
}

let a = new Proxy([1, undefined, 3], {
  [Symbol.isConcatSpreadable]: true,
  length: 3,
  get: function (target, prop) {
    if (typeof prop === "symbol" && prop === Symbol.isConcatSpreadable) return true;
    if (typeof target[prop] === "function") return function (...args) {
      return target[prop].apply(target, args);
    };
    if (typeof target[prop] === "string") return target[prop];
    if (isNumeric(prop) && prop < target.length && prop >= 0) return target[prop];
    return (x => x * x)(prop);
  }
});
console.log(a[0]); // 1

console.log(a[1]); // undefined

console.log(a[5]); // 25 (porque 5 * 5 = 25)
```


We notice that

- If `prop` is numeric
- Is not checking if `prop` is an integer
- Is not checking if `prop` is negative


```
➜  array-else git:(main) ✗ npx adrianbabel array-else-undefined.js | node
1
undefined
25
➜  array-else git:(main) ✗ 
```

### Family of functions supporting different semantics

Asume  we want to make negative indexation available:

```js
➜  array-else git:(main) ✗ cat array-else-negative-access.js
let a = [1, 2, 3, else x => { if (x < 0) return a[a.length+x]; else return a[x]; }];

console.log(a[2]);   // 3
console.log(a[-1]);  // undefined but a[3+-1] = a[2] = 3
```

Execution:

```                                                                                            
➜  array-else git:(main) ✗ node babel.js array-else-negative-access.js | node
3
undefined
```

Seems to be convenient to pass as second argument the object/array so that
sets of functions like

```js
const neg = (x , a) => { if (x < 0) return a[a.length+x]; else return a[x]; }
```

can be provided so that several *common* semantics are easily available (negative-indices, throw-by-default, etc.)

**We can imagine a family of functions supporting different semantics** like **`neg`** above, **`throw`** (throw an exception if out of bounds), **`wrap`** (wrap around), etc


## Concatenation and Symbols

See [a.concat(b)](aconcatb/README.md) section for a discussion on the semantics of `a.concat(b)`.

## Issues

- Issue #22: [Adrian-tfg branch: Semantics of array-else #22](https://github.com/ULL-ESIT-PL/babel-tanhauhau/issues/22)
- Issue #13: [Move defaultvector to babel-plugin-helper-defaultvector as external plugin](https://github.com/ULL-ESIT-PL/babel-tanhauhau/issues/13)?
- Discussion #17: [a.concat(b)](https://github.com/ULL-ESIT-PL/babel-tanhauhau/discussions/17)
- Issue #23 a.concat(b): https://github.com/ULL-ESIT-PL/babel-tanhauhau/issues/23