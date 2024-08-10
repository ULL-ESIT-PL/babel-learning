# TC39 Proposal Pattern Matching. Stage 1

This TC39 [proposal](https://github.com/tc39/proposal-pattern-matching) introduces three new concepts to Javascript:

1. the "matcher pattern",
    a new DSL closely based in part on the existing [Destructuring Binding Patterns](https://tc39.github.io/ecma262/#sec-destructuring-binding-patterns)  which allows recursively testing the structure and contents of a value in multiple ways at once, and extracting some of that structure into local bindings at the same time
2. the `match(){}` expression,
    a general replacement for the `switch` statement
    that uses matcher patterns
    to resolve to one of several values,

    ```js
    match(<subject-expression>) {
        when <pattern>: <value-expression>;
        when <pattern>: <value-expression>;
        ...
        default: <value-expression>;
    }
    ```
3. the `is` boolean operator,
    which allows for one-off testing of a value against a matcher pattern,
    potentially also introducing bindings from that test into the local environment.

For instance:

```js
match(val) {
    when < 10: console.log("small");
    when >= 10 and < 20: console.log("mid");
    default: "large";
}
```

Here is another example of the DSL. Notice how 
a `let`, `const`, or `var` keyword followed by a valid variable name
(identical to binding statements anywhere else) is valid in a pattern.
Binding patterns always match,
and additionally introduce a binding,
binding the subject to the given name
with the given binding semantics.

```js
match (res) {
  when { status: 200 or 201, let pages, let data } and if (pages > 1):
    handlePagedData(pages, data);
  when { status: 200 or 201, let pages, let data } and if (pages === 1):
    handleSinglePage(data);
  default: handleError(res);
}
```

Below is another example usen `is` and checking the type of the values in the array:

```js 
var json = {
  'user': ['Lily', 13]
};
if( json is {user: [String and let name, Number and let age]} ) {
  print(`User ${name} is ${age} years old.`);
}
```

The plugin https://github.com/iptop/babel-plugin-proposal-pattern-matching provides a zero grammar modification, high performance JavaScript pattern matching implementation of the TC39 pattern matching proposal described at repo https://github.com/tc39/proposal-pattern-matching. This proposal is currently (2024) at stage 1.

The expression *Zero Grammar* used here means that the plugin does not introduce new syntax to the JavaScript language. The `match` keyword is substituted by a function call to a function with name `match`. Also, the `when <pattern>: <value-expression>;` disappears and is replaced by function parameters of `match`:

```js 
const fib = n=>match(n)(     // match(n) {
        (v=1)=>1,            //   when == 1: 1:
        (v=2)=>1,            //   when == 2: 1;
        _=>fib(_-1)+fib(_-2) //   default: fib(n-1)+fib(n-2);
)                            // }

console.log(fib(10))
```

This strongly simplifies the implementation of the plugin avoiding to modify the
lexer and parser of the Babel compiler. An analysis and transformation of the AST is enough to implement the plugin.

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

Matcher patterns are a new DSL, closely inspired by destructuring patterns,
for recursively testing the structure and contents of a value
while simultaneously extracting some parts of that value
as local bindings for use by other code.

Matcher patterns can be divided into three general varieties:

* Value patterns, which test that the subject matches some criteria, like "is the string `"foo"`" or "matches the variable `bar`".
* Structure patterns, which test the subject matches some structural criteria like "has the property `foo`" or "is at least length 3", and also let you recursively apply additional matchers to parts of that structure.
* Combinator patterns, which let you match several patterns in parallel on the same subject, with simple boolean `and`/`or` logic.


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






