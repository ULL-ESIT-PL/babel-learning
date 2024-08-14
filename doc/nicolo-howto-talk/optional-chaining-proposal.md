# Optional Chaining Proposal

Watch the talk [Optional Chaining: From Specification to Implementation](https://youtu.be/bFlzeI8VGnU?si=YffCfFfPwo5uSDoC) by Ross Kirsling (TC39 member) in [JS Japan Conference](https://www.youtube.com/@jsconfjp). December 2022

See the [TC39 Agendas](https://github.com/tc39/agendas) repo. This repo has a folder per year and markdowns 01.md ... for each meeting. 

See the meeting https://github.com/tc39/agendas/blob/main/2017/01.md and see the slides by Gabriel Isenberg (Champion at the time) for the *Null Propagation Operator* at [Google Slides](https://docs.google.com/presentation/d/11O_wIBBbZgE1bMVRJI8kGnmC6dWCBOwutbN9SWOK0fU/view#slide=id.p)


The repository for the Optional Chaining Proposal is at https://github.com/tc39/proposal-optional-chaining
and we  archived in 2022. It is worth to see 
the closed issues. For instance closed issues containing the words [dot after](https://github.com/tc39/proposal-optional-chaining/issues?q=is%3Aissue+is%3Aclosed++dot+after) 

## The idea  was initially proposed as a TS issue but does not fit there so it is moved to JS 

> (5:33) Hard to say where everything began um this feature existed in C sharp beforehand for instance
>  but what's really interesting to remember is that at the very beginning of typescript issue number 16
> in July 2014 um someone requested this feature in typescript.  Typescript as a rule doesn't want to put itself in direct syntactic conflict with the base JavaScript language so instead of going their own way and implementing this as part of typescript they worked with tc39 to realize this as part of JavaScript proper but this of course took a long time and you can see that because this wasn't fixed until issue number 33 to 94.

## Parsing Conflict and Choice

> (6:41) a long time um we had some real uh heated discussions on on GitHub about both
> syntax and semantics um as you're probably aware.
> When we do an optional bracket access we have to write **question dot** square brackets.
> There's still that dot in there. 

> If you were using C sharp you could just write question square brackets and
> people were were kind of like is there no better way do we need that dot? 

He is referring to the question *Why not to use `a?[2]` instead of the verbose `a?.[2]`* 
that was the finally chosen syntax?

> The reason that we need that is to  distinguish it from a ternary, where we might have the ternary question mark followed by the square brackets of an array and that to to determine definitively that we we have an optional bracket access and not  a ternary would require unbounded
> lookahead 

He is referring to the ambiguity of the following expression:

```js 
a ? [2] : [3]
```
 
> ... that's not necessarily a problem for an ahead of time parser but
> it is a problem for JavaScript (parser) and so this this syntactic solution was kind of
> the least bad thing that we could do but as you can see from
> the 282 comments here it was a bit heated um also uh semantics wise in a language

## Issue 34: Syntax: Use `?&` 

See [issue 34](https://github.com/tc39/proposal-optional-chaining/issues/34) Syntax: Use `?&` (or anything else that correct the inconsistency between `a?.b` and `a?.[b]`)

> (7:50) The 282 comments here it was a bit heated. 

## Issue 69: `(null)?.b` should evaluate to `null`, not `undefined` 

See https://github.com/tc39/proposal-optional-chaining/issues/69

> Also semantics wise in a language which only has `null` which doesn't have `undefined` there's a different way of considering this operation which is that you're propagating `null` through the chain but that's not really how we want to consider this.
> What we want to consider is you're trying to reach the end of the chain, you're trying to determine the value of the last property in the chain and 
> if you can't reach that point then you get `undefined` back you early out with the value `undefined`. 
> The only way that you should get `null` is if you actually reach the end of the chain and you find a concrete `null` value. 
> But people had different conceptions of the feature originally and this was also kind of a heated topic to resolve and and these were some painful discussions. 

> These conversations were very draining and and the fact of the matter is that sometimes you have a situation where nobody wants to have a particular conversation it's about an edge case it's about just a difficult topic that you wish you could ignore. 
> But these topics we have to face them and we have to come to a consensus because we have to have a complete feature that has considered all of those edge cases so that we can deliver it to the world so that we can say this deserves to be part of JavaScript.



## Lexical Analysis 

### /packages/babel-parser/src/index.js 

#### `readToken_question` in the class `Tokenizer`

```js
  readToken_question(): void {
    // '?'
    const next = this.input.charCodeAt(this.state.pos + 1);
    const next2 = this.input.charCodeAt(this.state.pos + 2);
    if (next === charCodes.questionMark && !this.state.inType) {
      if (next2 === charCodes.equalsTo) {
        // '??='
        this.finishOp(tt.assign, 3);
      } else {
        // '??'
        this.finishOp(tt.nullishCoalescing, 2);
      }
    } else if (
      next === charCodes.dot &&
      !(next2 >= charCodes.digit0 && next2 <= charCodes.digit9)
    ) {
      // '.' not followed by a number
      this.state.pos += 2;
      this.finishToken(tt.questionDot);
    } else {
      ++this.state.pos;
      this.finishToken(tt.question);
    }
  }
```

#### `updateContext` in the class `Tokenizer`

```js 
  updateContext(prevType: TokenType): void {
    const type = this.state.type;
    let update;

    if (type.keyword && (prevType === tt.dot || prevType === tt.questionDot)) {
      this.state.exprAllowed = false;
    } else if ((update = type.updateContext)) {
      update.call(this, prevType);
    } else {
      this.state.exprAllowed = type.beforeExpr;
    }
  }
```

### /packages/babel-parser/src/tokenizer/context.js

#### `updateContext` 

```js
import { types as tt } from "./types";
...
tt._function.updateContext = tt._class.updateContext = function (prevType) {
  if (prevType === tt.dot || prevType === tt.questionDot) {
    // when function/class follows dot/questionDot, it is part of
    // (optional)MemberExpression, then we don't need to push new token context
  } else if (
    prevType.beforeExpr &&
    prevType !== tt.semi &&
    prevType !== tt._else &&
    !(
      prevType === tt._return &&
      lineBreak.test(this.input.slice(this.state.lastTokEnd, this.state.start))
    ) &&
    !(
      (prevType === tt.colon || prevType === tt.braceL) &&
      this.curContext() === types.b_stat
    )
  ) {
    this.state.context.push(types.functionExpression);
  } else {
    this.state.context.push(types.functionStatement);
  }

  this.state.exprAllowed = false;
};
```

### src/tokenizer/types.js

The assignment of fine-grained, information-carrying type objects
allows the tokenizer to store the information it has about a
token in a way that is very cheap for the parser to look up.

There is an ambiguity in the JavaScript grammar regarding the interpretation of the `yield` keyword in various contexts. Specifically, this ambiguity arises when the `yield` keyword is used in contexts where it could be interpreted either as a standalone `yield` expression or as part of a larger expression.

In JavaScript, the `yield` keyword is used within generator functions to pause execution and return a value. However, depending on what follows `yield`, the parser must determine whether `yield` is:

1. A complete expression by itself, or
2. The start of a more complex expression (e.g., `yield a + b`).

Consider the following examples:

1. **Simple `yield`:**
   ```javascript
   yield;
   ```
   Here, `yield` is a standalone expression, and the execution pauses, returning `undefined`.

2. **`yield` as part of a larger expression:**
   ```javascript
   yield a + b;
   ```
   In this case, `yield` returns the result of the expression `a + b`.

3. **Potential ambiguity:**
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

```js
export const types: { [name: string]: TokenType } = {
  num: new TokenType("num", { startsExpr }),
  bigint: new TokenType("bigint", { startsExpr }),
  regexp: new TokenType("regexp", { startsExpr }),
  string: new TokenType("string", { startsExpr }),
  name: new TokenType("name", { startsExpr }),
  eof: new TokenType("eof"),

  // Punctuation token types.
  bracketL: new TokenType("[", { beforeExpr, startsExpr }),
  ...
  dot: new TokenType("."),
  question: new TokenType("?", { beforeExpr }),
  questionDot: new TokenType("?."),
  ...
  exponent: new TokenType("**", {
    beforeExpr,
    binop: 11,
    rightAssociative: true,
  }),
  ... // more token types
}
```

The `beforeExpr` property is used to disambiguate between regular
expressions and divisions. It is set on all token types as `"["` and `"?"` that can
be followed by an expression like `[ 2/3 ...` and `[ / ...`. 
A slash `/` after them would be a regular expression).

At some point in the declaration of `types` arrive a section with
the **keywords**. All token type keywords start with an underscore, to make them
easy to recognize.

```js
 _break: createKeyword("break"),
 _case: createKeyword("case", { beforeExpr }),
 ...
```

Here is the keywords section of the `types` object:

```js
export const types: { [name: string]: TokenType } = {
  ...
  // Keywords
  // Don't forget to update packages/babel-helper-validator-identifier/src/keyword.js
  // when new keywords are added
  _break: createKeyword("break"),
  _case: createKeyword("case", { beforeExpr }),
  _catch: createKeyword("catch"),
  _continue: createKeyword("continue"),
  _debugger: createKeyword("debugger"),
  _default: createKeyword("default", { beforeExpr }),
  _do: createKeyword("do", { isLoop, beforeExpr }),
  _else: createKeyword("else", { beforeExpr }),
  _finally: createKeyword("finally"),
  _for: createKeyword("for", { isLoop }),
  _function: createKeyword("function", { startsExpr }),
  _if: createKeyword("if"),
  _return: createKeyword("return", { beforeExpr }),
  _switch: createKeyword("switch"),
  _throw: createKeyword("throw", { beforeExpr, prefix, startsExpr }),
  _try: createKeyword("try"),
  _var: createKeyword("var"),
  _const: createKeyword("const"),
  _while: createKeyword("while", { isLoop }),
  _with: createKeyword("with"),
  _new: createKeyword("new", { beforeExpr, startsExpr }),
  _this: createKeyword("this", { startsExpr }),
  _super: createKeyword("super", { startsExpr }),
  _class: createKeyword("class", { startsExpr }),
  _extends: createKeyword("extends", { beforeExpr }),
  _export: createKeyword("export"),
  _import: createKeyword("import", { startsExpr }),
  _null: createKeyword("null", { startsExpr }),
  _true: createKeyword("true", { startsExpr }),
  _false: createKeyword("false", { startsExpr }),
  _in: createKeyword("in", { beforeExpr, binop: 7 }),
  _instanceof: createKeyword("instanceof", { beforeExpr, binop: 7 }),
  _typeof: createKeyword("typeof", { beforeExpr, prefix, startsExpr }),
  _void: createKeyword("void", { beforeExpr, prefix, startsExpr }),
  _delete: createKeyword("delete", { beforeExpr, prefix, startsExpr }),
}
```

`isLoop` marks a keyword as starting a loop like in `_for: createKeyword("for", { isLoop })`, 
which is important
to know when parsing a **label**, in order to allow or disallow
continue jumps to that label.
