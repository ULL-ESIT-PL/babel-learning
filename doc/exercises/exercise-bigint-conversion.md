
# Promote Integer to BigInt when necessary

The semantics of the `BigInt` type are similar to the `Number` type.
When operating a `BigInt` with a number the result is an exception. 
To convert a `Number` to a `BigInt` use the `BigInt()` constructor.

Write a Babel plugin to promote the number to a `BigInt` when the constant is an integer one.

```
➜  babel-learning git:(main) ✗ cat src/exercises/bigint-conversion/input-1-bigint-conversion.js 
a = 2n+3;
b = 4 +5n;
c = 6n + 7n;
➜  babel-learning git:(main) npx babel src/exercises/bigint-conversion/input-1-bigint-conversion.js --plugins=./src/exercises/bigint-conversion/plugin-bigint-conversion.cjs
"use strict";

a = 2n + 3n;
b = 4n + 5n;
c = 6n + 7n;
```
See solution in [/src/exercises/bigint-conversion/](/src/exercises/bigint-conversion/).