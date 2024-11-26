See [issue #23](https://github.com/ULL-ESIT-PL/babel-tanhauhau/issues/23)


@AdrianMoraRodriguez 
Let us consider the following example:

```js
➜  array-else git:(main) ✗ cat aconcatb.js
// https://github.com/ULL-ESIT-PL/babel-tanhauhau/discussions/17
let a = [3,2,1, else x => x*x ];
let b = ["hello", "world"];
try { 
    let c = a.concat(b);
    console.log(c);
} catch (e) {
    console.log(e);
}

try { 
    let d = b.concat(a);
    console.log(d);
} catch (e) {
    console.log(e);
}
```

when compiled produces:

```console
➜  array-else git:(main) ✗ ./babel.js aconcatb.js -o aconcatb.cjs
➜  array-else git:(main) ✗ cat -n aconcatb.cjs     
```
```js              
     1  // https://github.com/ULL-ESIT-PL/babel-tanhauhau/discussions/17
     2  let a = new Proxy([3, 2, 1], {
     3    get: function (target, prop) {
     4      if (typeof target[prop] === "function") return function (...args) {
     5        return target[prop].apply(target, args);
     6      };
     7      if (prop < target.length) return target[prop];
     8      return (x => x * x)(prop);
     9    }
    10  });
    11  let b = ["hello", "world"];
    12
    13  try {
    14    let c = a.concat(b);
    15    console.log(c);
    16  } catch (e) {
    17    console.log(e);
    18  }
    19
    20  try {
    21    let d = b.concat(a);
    22    console.log(d);
    23  } catch (e) {
    24    console.log(e);
    25  }
```
and when executed throws an error in line 7:

```console
➜  array-else git:(main) ✗ node aconcatb.cjs 
[ 3, 2, 1, 'hello', 'world' ]
TypeError: Cannot convert a Symbol value to a number
    at Object.get (/Users/casianorodriguezleon/campus-virtual/2324/learning/babel-learning/src/array-else/aconcatb.cjs:7:14)
    at Array.concat (<anonymous>)
 ```

The error message points to line 7  of the  `if (prop < target.length) return target[prop]` of the **generated code**. It seems that 
`b.concat(a)` calls the `get`  with `prop` set to a `Symbol(Symbol.isConcatSpreadable)`.  See [Symbol.isConcatSpreadable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/isConcatSpreadable). This symbol governs the. behavior of `concat` 

If we modify the generated code to:

```js 
➜  array-else git:(main) ✗ cat -n aconcatb-modified.cjs
     1  // https://github.com/ULL-ESIT-PL/babel-tanhauhau/discussions/17
     2  function isNumeric(n) {
     3    return !isNaN(parseFloat(n)) && isFinite(n);
     4  }
     5
     6  let a = new Proxy([3, 2, 1], {
     7    [Symbol.isConcatSpreadable]: true,
     8    length: 3,
     9    get: function (target, prop) {
    10      if (typeof prop === "symbol" && prop === Symbol.isConcatSpreadable) {
    11        console.error("prop:", prop);
    12        return true;
    13      }
    14      if (typeof target[prop] === "function") return function (...args) {
    15        return target[prop].apply(target, args);
    16      };
    17      if (typeof prop === "string") return target[prop];
    18      console.error("prop:", prop, "typeof prop:", typeof prop);
    19      if (isNumeric(prop) && prop < target.length) return target[prop];
    20      return (x => x * x)(prop);
    21    }
    22  });
    23  let b = ["hello", "world"];
    24
    25  try {
    26    let c = a.concat(b);
    27    console.log(c);
    28  } catch (e) {
    29    console.log(e);
    30  }
    31
    32  try {
    33    let d = b.concat(a);
    34    console.log(d);
    35  } catch (e) {
    36    console.log("Error in d = b.concat(a):", e.message);
    37  }
```

This is the execution output:

```console
➜  array-else git:(main) ✗ node aconcatb-modified.cjs
[ 3, 2, 1, 'hello', 'world' ]
prop: Symbol(Symbol.isConcatSpreadable)
[ 'hello', 'world', 3, 2, 1 ]
```



## Current weaknesses

Error messages  must always  refer to the source `aconcatb.js`. We need to provide [source maps](https://tc39.es/source-map/). See also [package source-map](https://www.npmjs.com/package/source-map)
