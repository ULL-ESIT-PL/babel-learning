# TC39 Proposal Pattern Matching. Stage 1

The plugin https://github.com/iptop/babel-plugin-proposal-pattern-matching provides a minimal grammar, high performance JavaScript pattern matching implementation of the TC39 pattern matching proposal described at repo https://github.com/tc39/proposal-pattern-matching. This proposal is currently (2024) at stage 1.

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

This defines the Fibonacci function `fib` using an arrow function and pattern matching. 

The plugin visits the `CallExpression` nodes corresponding to calls `match(n)(f1, f2, ..., fn)` 
to create the translated function replacing the AST node 
by a function that uses a sequence of `if` statements to match the patterns that will be built 
based on the actual value of `n`. 

See 
the entry point of the plugin at https://github.com/iptop/babel-plugin-proposal-pattern-matching/blob/main/src/index.js:

```js
module.exports = (babel) => {
  return {
    visitor: {
      ImportDeclaration (path, state) {
        resolveImportDeclaration(babel, path, state)
      },
      CallExpression (path, state) {
        resolveCallExpression(babel, path, state)
      }
    }
  }
}
```

The manipulation of the AST is done in the [src/visitor/call-expression.js](https://github.com/ULL-ESIT-PL/babel-plugin-proposal-pattern-matching/blob/main/src/visitor/call-expression.js) module. When the identifier used in the `CallExpression` is `match`, the plugin transforms the AST using the `transformMatch` function:


```js
const transformMatch = require('../transform/match')
const transformFnMatch = require('../transform/fnmatch')
module.exports = (babel, path, state) => {
  const $callee = path.get('callee')
  const $$callee = $callee.node
  if ($$callee.type == 'Identifier') {
    /* Extract AST tokens from NodePath */
    const astTag = $callee.getData('pattern-matching')
    if (astTag == 'match') {
      transformMatch(babel, $callee)
    }

    if (astTag == 'fnmatch') {
      transformFnMatch(babel, $callee)
    }
  }
}
```

- The ASTs for the following parameters 
   - `(v = 1) => 1` and 
   - `(v = 2) => 1` 
are used as patterns that match specific cases:

- If `n` is `1`, the default value of the first parameter is used as pattern to match and the code for the body of such function is executed.
- If `n` is `2`, the second pattern matches and the second function is called returning `1`.
- The last line `_ => fib(_ - 1) + fib(_ - 2)` is a fallback pattern that matches any other value. 
  It recursively calculates the Fibonacci number by summing the results of `fib(_ - 1)` and `fib(_ - 2)`.

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

Notice that `v`  is not used in the transformed code. The `_uid` variable is used to store the value of `n` and the patterns are matched against it.

That when executed gives:

```
➜  tc39-pattern-matching git:(main) ✗ node fib-easy.mjs 
55
```



##############




### Installation and Setup:

To use this Babel plugin, you need to install it and configure Babel to use the plugin:

1. **Install the Plugin**:
   ```sh
   npm install babel-plugin-proposal-pattern-matching
   ```

2. **Configure Babel**:
   Add the plugin to your Babel configuration (`.babelrc` or `babel.config.js`):
   ```json
   {
     "plugins": ["babel-plugin-proposal-pattern-matching"]
   }
   ```

With this setup, you can use pattern matching in your JavaScript code, as demonstrated in the example.