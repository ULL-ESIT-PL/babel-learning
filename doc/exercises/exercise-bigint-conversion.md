
# Promote Integer to BigInt when necessary

The semantics of the `BigInt` type are similar to the `Number` type.
When operating a `BigInt` with a number the result is an exception. 
To convert a `Number` to a `BigInt` use the `BigInt()` constructor.

Write a Babel plugin to promote the number to a `BigInt` when the constant is an integer one.

`➜  babel-learning git:(main) ✗ cat src/exercises/bigint-conversion/input-1-bigint-conversion.js`
```js
let a = 2n+3e30;
let b = 4e28 +5n;
let c = 6n + 7n;
console.log(a);
console.log(b);
```
```js
➜  babel-learning git:(main) ✗ npx babel src/exercises/bigint-conversion/input-1-bigint-conversion.js --plugins=./src/exercises/bigint-conversion/plugin-bigint-conversion.cjs      
"use strict";

let a = 2n + 2999999999999999778178897805312n;
let b = 39999999999999998332478947328n + 5n;
let c = 6n + 7n;
console.log(a);
console.log(b);
```

```
➜  babel-learning git:(main) ✗ npx babel src/exercises/bigint-conversion/input-1-bigint-conversion.js --plugins=./src/exercises/bigint-conversion/plugin-bigint-conversion.cjs | node
2999999999999999778178897805314n
39999999999999998332478947333n
```

See solution in [/src/exercises/bigint-conversion/plugin-bigint-conversion.cjs](/src/exercises/bigint-conversion/plugin-bigint-conversion.cjs).