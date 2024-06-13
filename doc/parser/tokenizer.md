# Tokenizer

## Files

```
➜  babel-parser git:(learning) ✗ tree src/tokenizer 
src/tokenizer
├── context.js
├── index.js
├── state.js
└── types.js
```

## types.js 

Let us review our notes about this file:

> Let's first look at where a token type is defined: [packages/babel-parser/src/tokenizer/types.js](https://github.com/ULL-ESIT-PL/babel-tanhauhau/blob/master/packages/babel-parser/src/tokenizer/types.js#L86-L203).

> Here you see a list of tokens, so let's add our new token definition in as well:
>
> ```js
> export const types: { [name: string]: TokenType } = {
>   num: new TokenType("num", { startsExpr }),
>   bigint: new TokenType("bigint", { startsExpr }),
>   regexp: new TokenType("regexp", { startsExpr }),
>   string: new TokenType("string", { startsExpr }),
>   name: new TokenType("name", { startsExpr }),
>   eof: new TokenType("eof"),
>   ...
>   at: new TokenType("@"),
>   atat: new TokenType('@@'),
>   hash: new TokenType("#", { startsExpr }),
>   ...
> };
> ```

By calling the [constructor](https://github.com/ULL-ESIT-PL/babel-tanhauhau/blob/master/packages/babel-parser/src/tokenizer/types.js#L45-L71) we are setting the `label` property of the token `atat` to `@@`

## index.js

> Next, let's find out where the token gets created during tokenization. A quick search for `tt.at` within `babel-parser/src/tokenizer` lead us to [packages/babel-parser/src/tokenizer/index.js](https://github.com/ULL-ESIT-PL/babel-tanhauhau/blob/master/packages/babel-parser/src/tokenizer/index.js#L891-L894)

Here is the general structure of the code of the `getTokenFromCode` function inside 
the `babel-parser/src/tokenizer/index.js` file:

```js
...
import * as charCodes from "charcodes";
import { types as tt, keywords as keywordTypes, type TokenType } from "./types";
...

export default class Tokenizer extends ParserErrors {
...
 getTokenFromCode(code: number): void {
    switch (code) {
      // The interpretation of a dot depends on whether it is followed
      // by a digit or another two dots.

      case charCodes.dot:
        this.readToken_dot();
        return;
      ...
      case charCodes.atSign:
        ++this.state.pos;
        this.finishToken(tt.at);
        return;

      case charCodes.numberSign:
        this.readToken_numberSign();
        return;
      ...
      default:
        if (isIdentifierStart(code)) {
          this.readWord();
          return;
        }
    }

    throw this.raise(
      this.state.pos,
      Errors.InvalidOrUnexpectedToken,
      String.fromCodePoint(code),
    );
  }
```

The Babel parser uses [charcodes constants](https://github.com/xtuc/charcodes?tab=readme-ov-file) to represent characters.

> Well, token types are import as `tt` throughout the babel-parser.
>


> Let's create the token `tt.atat` instead of `tt.at` if there's another `@` after the current `@`:
>

> ```js
> case charCodes.atSign:
>       // if the next character is a `@`
>       if (this.input.charCodeAt(this.state.pos + 1) === charCodes.atSign) {
>         // create `tt.atat` instead
>         this.finishOp(tt.atat, 2);
>       } else {
>         this.finishOp(tt.at, 1);
>       }
>       return;
> ``` 

See  the actual code at [src/tokenizer/index.js](https://github.com/ULL-ESIT-PL/babel-tanhauhau/blob/learning/packages/babel-parser/src/tokenizer/index.js#L891-L899)

The function `finishOp`  receives the token type and the size of the token, sets the token value and advances the position by calling [finishToken](https://github.com/ULL-ESIT-PL/babel-tanhauhau/blob/master/packages/babel-parser/src/tokenizer/index.js#L382-L390)

```js
finishOp(type: TokenType, size: number): void {
    const str = this.input.slice(this.state.pos, this.state.pos + size);
    this.state.pos += size;
    this.finishToken(type, str);
  }
```