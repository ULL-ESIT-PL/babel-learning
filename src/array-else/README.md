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