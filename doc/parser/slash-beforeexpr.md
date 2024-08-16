# The slash and the beforeExpr property

There is another ambiguity in JavaScript’s grammar concerning the interpretation of a `/` character. 

For example, **there are no syntactic grammar contexts where both a leading division or division-assignment, and a leading [RegularExpressionLiteral](https://tc39.es/ecma262/#prod-RegularExpressionLiteral) are permitted**. 

This is not affected by semicolon insertion (see [12.10.1 Rules of Automatic Semicolon Insertion](https://tc39.es/ecma262/#sec-rules-of-automatic-semicolon-insertion)) in examples such as lines 4 and 5 in the following code:


```js{4,5}
let {a, b, hi, g, c, d} = require('./hidden-amb')
a = b
/hi/g.exec(c).map(d)
console.log(a);
```   

where the first non-whitespace, non-comment code point after a 
[LineTerminator](https://tc39.es/ecma262/#prod-LineTerminator) is the 
`/` (*U+002F unicode name SOLIDUS*) and **the syntactic context allows division or division-assignment**, no semicolon is inserted at the `LineTerminator`!. 

That is, the above example is interpreted in the same way as:

```js
a = b / hi / g.exec(c).map(d);
```

When we run the code above, we get:

```
➜  prefix-lang git:(master) ✗ node examples/lexical-ambiguity.js
1
```

The contents of file `examples/hidden-amb.js` explain why the output is `1`: 

```js
let tutu = { map(_) { return 2}}
let a = 5, b = 8, hi = 4, c = "hello", d =
    g = { exec(_) { return tutu; }}
module.exports = {a, b, hi, c, d, g}
```

See the code in the repo [crguezl/js-lexical-ambiguity](https://github.com/crguezl/js-lexical-ambiguity/blob/master/lexical-ambiguity.js)

The ambiguity arises because the `/` character in JavaScript can either represent:

1. The start of a **regular expression literal**, like `/abc/`.
2. The **division operator**, as in `a / b`.

In JavaScript, whether the `/` should be interpreted as the beginning of a regular expression or as a division operator **depends on the context in which it appears**. The `beforeExpr` property is used by the tokenizer to help disambiguate these two possibilities.

In this example

```javascript
let regex = /abc/;
```

The `/` starts a regular expression.

- **Example of Division:**
  ```javascript
  let result = a / b;
  ```
  In this case, the `/` is used as a division operator.

The `beforeExpr` property is set on tokens that appear in contexts where an expression is expected to follow. If the tokenizer knows that it is in a context where an expression is expected (indicated by `beforeExpr` being `true`), then it will treat the `/` as the start of a regular expression.

Conversely, if the context suggests that an expression is not expected (`beforeExpr` is `false`), the tokenizer will interpret the `/` as a division operator instead.

Consider the following code:
```javascript
let a = b / c;
let regex = /abc/;
```
- In the first line, `b / c` is a division operation because `beforeExpr` is `false` after `b`.
- In the second line, `/abc/` is a regular expression because `beforeExpr` is `true` at the start of the line, indicating that an expression (here, a regular expression) can start.

The `beforeExpr` property is used to disambiguate between regular
expressions and divisions. It is set on all token types as `"["` and `"?"` that can
be followed by an expression like `[ 2/3 ...` and `[ / ...`. 
A slash `/` after them would be a regular expression).
