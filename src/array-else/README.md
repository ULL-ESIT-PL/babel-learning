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

`➜  array-else git:(main) ✗ cat babel.config.json`
```json
{
  "plugins": [ 
    "../../babel-tanhauhau-adrian/packages/babel-parser/defaultvector.cjs"
  ]
}
```

and now we can transpile the code:

`➜  array-else git:(main) ✗ npx adrianbabel array-else.js`
```js 
ELSE
let a = new Proxy([1, 2, 3], {
  get: function (target, prop) {
    if (prop < target.length) return target[prop];
    return (x => x * x)(prop);
  }
});
console.log(a[2]); // 3

console.log(a[5]); // 25 (porque 5 * 5 = 25)
```

and we can execute it (the `2>null` is to avoid the `console.error` debug messages):

```bash
➜  array-else git:(main) ✗ npx adrianbabel array-else.js 2>/dev/null | node -
3
25
```

## Links to sAdrian's compiler for the `else` clause on Arrays and Objects

```
martes,  5 de noviembre de 2024, 12:56:07 WEST
➜  packages git:(adrian) ✗ git lg | head -n 1
38c427bb8 - (HEAD -> adrian, origin/Adrian-tfg) Añadida la configuracion (hace 6 días Adrián Mora)
```

- [packages/babel-parser/babel.config.json](https://github.com/ULL-ESIT-PL/babel-tanhauhau/blob/Adrian-tfg/packages/babel-parser/babel.config.json)
- [packages/babel-parser/defaultvector.js](https://github.com/ULL-ESIT-PL/babel-tanhauhau/blob/Adrian-tfg/packages/babel-parser/defaultvector.js)
- [packages/babel-parser/pruebas.js](https://github.com/ULL-ESIT-PL/babel-tanhauhau/blob/Adrian-tfg/packages/babel-parser/pruebas.js)
- [packages/babel-parser/src/parser/expression.js](https://github.com/ULL-ESIT-PL/babel-tanhauhau/blob/Adrian-tfg/packages/babel-parser/src/parser/expression.js#L2079-L2091)


### Goals

- [Move defaultvector to babel-plugin-helper-defaultvector as extenernal plugin](https://github.com/ULL-ESIT-PL/babel-tanhauhau/issues/13)?
