# TC39 Proposal Pattern Matching. Stage 1

This proposal introduces three new concepts to Javascript:

* the "matcher pattern",
    a new DSL closely related to destructuring patterns,
    which allows recursively testing the structure and contents of a value
    in multiple ways at once,
    and extracting some of that structure into local bindings at the same time
* the `match(){}` expression,
    a general replacement for the `switch` statement
    that uses matcher patterns
    to resolve to one of several values,
* the `is` boolean operator,
    which allows for one-off testing of a value against a matcher pattern,
    potentially also introducing bindings from that test into the local environment.


The plugin https://github.com/iptop/babel-plugin-proposal-pattern-matching provides a minimal grammar, high performance JavaScript pattern matching implementation of the TC39 pattern matching proposal described at repo https://github.com/tc39/proposal-pattern-matching. This proposal is currently (2024) at stage 1.

## Installation and Setup of babel-plugin-proposal-pattern-matching

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


## How it works

Consider the example [fib-easy.js](fib-easy.js):


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
replacing the AST node 
by a function that uses a sequence of `if` statements to match the patterns that will be built 
based on the actual value of `n`. 

See the entry point of the plugin at
[src/index.js](https://github.com/ULL-ESIT-PL/babel-plugin-proposal-pattern-matching/blob/main/src/index.js#L9-L11):

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

The manipulation of the AST is done in the [src/visitor/call-expression.js](https://github.com/ULL-ESIT-PL/babel-plugin-proposal-pattern-matching/blob/main/src/visitor/call-expression.js#L9-L11) module. When the identifier used in the `callee` of the `CallExpression` node is `match`, the plugin transforms the AST using the [transformMatch](https://github.com/ULL-ESIT-PL/babel-plugin-proposal-pattern-matching/blob/main/src/transform/match.js) function:


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
The `transformMatch` function builds the replacement AST node using this Babel template

```js 
(v=> {
    const UID = EXP
    BLOCKS
    throw new Error("No matching pattern");
  })()
```
that template can be clearly seen in the shape of the generated code [fib-easy.mjs](fib-easy.mjs):

```js
const fib = n => (v => {
  const _uid = n;                      // const UID = EXP
  if (_uid === 1) {                    // BLOCKS
    return 1;
  }
  if (_uid === 2) {
    return 1;
  }
  return fib(_uid - 1) + fib(_uid - 2); // END BLOCKS
  throw new Error("No matching pattern");
})();
```

this is the actual code of the `transformMatch` function:
```js
module.exports = function transformMatch (babel, referencePath) {
  const $root = referencePath.parentPath.parentPath
  const $$uid = $root.scope.generateUidIdentifier('uid')
  const $matching = getMatching($root)
  const $$matching = $matching.node
  const $patterns = getPatterns($root)
  const $$blocks = transformPatterns(babel, $patterns, $$uid).filter(item => item)

  const $$IIFE = babel.template(`
    (v=> {
      const UID = EXP
      BLOCKS
      throw new Error("No matching pattern");
    })()
    `)({
    UID: $$uid,
    EXP: $$matching,
    BLOCKS: $$blocks
  })
  $root.replaceWith($$IIFE)
}
```
So what remains to understand is how the [transformPatterns](https://github.com/ULL-ESIT-PL/babel-plugin-proposal-pattern-matching/blob/main/src/transform/match.js#L71-L86) function works. 

Four cases are considered:  assign patterns, identifier patterns, array patterns and object patterns:

```js
function transformPatterns (babel, $patterns, $$uid) {
  return $patterns.map($pattern => {
    const $param = $pattern.get('params.0')
    const $$param = $param.node
    switch ($$param.type) {
      case 'AssignmentPattern':
        return createIFBlock(babel, $pattern, $param, $$uid)
      case 'Identifier':
        return createReturnBlock(babel, $pattern, $param, $$uid)
      case 'ArrayPattern':
        return createDeconstruction(babel, $pattern, $param, $$uid, 'ArrayPattern')
      case 'ObjectPattern':
        return createDeconstruction(babel, $pattern, $param, $$uid, 'ObjectPattern')
    }
  })
}
```
Our example uses the `Identifier` case. The `createReturnBlock` function is used to build the AST node for the pattern matching:

```js
function createReturnBlock (babel, $pattern, $param, $$uid) {
  const paramName = $param.get('name').node
  const $body = $pattern.get('body')
  const $$body = $body.node
  $body.scope.rename(paramName, $$uid.name)
  const $$block = babel.template(`
    return RET
    `)({
    RET: resolveBody(babel, $$body)
  })
  return $$block
}
```

This way the initial code is transformed to:

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






