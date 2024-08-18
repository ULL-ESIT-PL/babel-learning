# Executing standalone the Babel parser

We can also run the parser standalone. I added a `cjs` file to the `test` folder:

```js
➜  babel-parser git:(master) ✗ cat test/curry-function.cjs 
const { parse } =  require('../lib');

function getParser(code) {
  return () => parse(code, { sourceType: 'module' });
}
let input = `function @@ foo() {}`;
let ast = getParser(input)();

console.log(JSON.stringify(ast, null, "  "));
```

When we run it, we  get the same error:

```sh
➜  babel-parser git:(master) ✗ node test/curry-function.cjs 
TokenType {
  label: '@',
  keyword: undefined,
  beforeExpr: false,
  startsExpr: false,
  rightAssociative: false,
  isLoop: false,
  isAssign: false,
  prefix: false,
  postfix: false,
  binop: null,
  updateContext: null
}
TokenType {
  label: '@',
  keyword: undefined,
  beforeExpr: false,
  startsExpr: false,
  rightAssociative: false,
  isLoop: false,
  isAssign: false,
  prefix: false,
  postfix: false,
  binop: null,
  updateContext: null
}
/Users/casianorodriguezleon/campus-virtual/2122/learning/compiler-learning/babel-tanhauhau/packages/babel-parser/lib/parser/error.js:50
SyntaxError: Unexpected token (1:9)
    at Parser._raise (/Users/casianorodriguezleon/campus-virtual/2122/learning/compiler-learning/babel-tanhauhau/    at Parser.parseIdentifierName (/Users/casianorodriguezleon/campus-virtual/2122/learning/compiler-learning/babel-tanhauhau/packages/babel-parser/lib/parser/expression.js:1517:18) {
  loc: Position { line: 1, column: 9 },
  pos: 9
}
Node.js v21.2.0
```

We can also run with the `--inspect-brk` flag to debug the parser:

```sh
➜  babel-parser git:(master) ✗ node --inspect-brk test/curry-function.cjs
```