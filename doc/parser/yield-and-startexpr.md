# `yield` and `startsExpr`

There is an ambiguity in the JavaScript grammar regarding the interpretation of the `yield` keyword in various contexts. Specifically, this ambiguity arises when the `yield` keyword is used in contexts where it could be interpreted either as a standalone `yield` expression or as part of a larger expression.

In JavaScript, the `yield` keyword is used within generator functions to pause execution and return a value. However, depending on what follows `yield`, the parser must determine whether `yield` is:

1. A complete expression by itself, or
2. The start of a more complex expression (e.g., `yield a + b`).

Consider the following example:

   ```javascript
   function* generator() {
       const result = yield 1 + 2;
   }
   ```

The expression after `yield` could be interpreted as either:

- `(yield 1) + 2`: yielding the value `1`, and then adding `2` to whatever value is subsequently passed into the generator.
- `yield (1 + 2)`: yielding the result of the addition `3`.

The `startsExpr` property in Babel’s tokenizer helps resolve this ambiguity by indicating whether a given token can initiate a **subexpression**. This is crucial when the parser encounters a `yield` keyword followed by another token, and it needs to decide whether to treat `yield` as part of a larger expression or as a standalone keyword.

- **When `startsExpr` is `true`:** It signals that the following token may begin an expression. The parser can then determine whether the `yield` should be combined with the following tokens or treated separately.
  
- **When `startsExpr` is `false`:** It suggests that the next token cannot start an expression, potentially clarifying that `yield` is being used in isolation.


The `startsExpr` property is used to determine whether an expression
may be the “argument” subexpression of a `yield` expression or
`yield` statement. It is set on all token types that may be at the
start of a subexpression.
