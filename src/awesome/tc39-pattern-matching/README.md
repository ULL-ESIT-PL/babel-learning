# Proposal Pattern Matching

The plugin https://github.com/iptop/babel-plugin-proposal-pattern-matching provides a minimal grammar, high performance JavaScript pattern matching implementation of the TC39 pattern matching proposal described at repo https://github.com/tc39/proposal-pattern-matching.

## Installing

```
✗ npm install --save-dev babel-plugin-proposal-pattern-matching
```

## Execution. Simple example

Consider the example:

`➜  tc39-pattern-matching git:(main) ✗ cat fib-easy.js`
```js 
➜  tc39-pattern-matching git:(main) ✗ cat -n fib-easy.js 
     1  import match from 'babel-plugin-proposal-pattern-matching/match.js'
     2  const fib = n=>match(n)(
     3          (v=1)=>1,
     4          (v=2)=>1,
     5          _=>fib(_-1)+fib(_-2)
     6  )
     7
     8  console.log(fib(10))
     9  // -> 55
```

Is transformed to:

```
➜  tc39-pattern-matching git:(main) ✗ npx babel fib-easy.js -o fib-easy.mjs
➜  tc39-pattern-matching git:(main) ✗ cat -n fib-easy.mjs
```
```js
     1  import match from 'babel-plugin-proposal-pattern-matching/match.js';
     2  const fib = n => (v => {
     3    const _uid = n;
     4    if (_uid === 1) {
     5      return 1;
     6    }
     7    if (_uid === 2) {
     8      return 1;
     9    }
    10    return fib(_uid - 1) + fib(_uid - 2);
    11    throw new Error("No matching pattern");
    12  })();
    13  console.log(fib(10));
    14  // -> 55
```
That when executed gives:

```
➜  tc39-pattern-matching git:(main) ✗ node fib-easy.mjs 
55
```

