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

## context.js

The source text of an ECMAScript is first converted into a sequence of input elements, which are 
* tokens, 
* line terminators, 
* comments, or 
* white space. 

The source text is scanned from left to right, repeatedly taking the longest possible sequence of code points as the next input element.

In ECMAScript, there are several situations where **the identification of lexical input elements is sensitive to the syntactic grammar context** that is consuming the input elements. 

This requires *multiple goal symbols* for the lexical grammar. The use of multiple lexical goals ensures that there are no lexical ambiguities that would affect **automatic semicolon insertion**. 

We will see later that in the 
`types.js` file where tokens are defined, that Babel.js tokens have properties like `beforeExpr`, `startsExpr` and `isLoop` that are used to provide context:

- [yield and `startExpr`](yield-and-startexpr.md)
- [The slash and the beforeExpr property](slash-beforeexpr.md)
- [Labels and the `isLoop` property](labels-isloop.md)
 

The [context.js](https://github.com/ULL-ESIT-PL/babel-tanhauhau/blob/master/packages/babel-parser/src/tokenizer/context.js) is code to 
provide context to deal with these conflicts.

In the comments at the beginning of the file the authors mention to read https://github.com/sweet-js/sweet-core/wiki/design [^1]. 

```js
// The algorithm used to determine whether a regexp can appear at a
// given point in the program is loosely based on sweet.js' approach.
// See https://github.com/mozilla/sweet.js/wiki/design

import { types as tt } from "./types";
import { lineBreak } from "../util/whitespace";

export class TokContext {
  constructor(
    token: string,
    isExpr?: boolean,
    preserveSpace?: boolean,
    override?: ?Function, // Takes a Tokenizer as a this-parameter, and returns void.
  ) {
    this.token = token;
    this.isExpr = !!isExpr; // convert to boolean
    this.preserveSpace = !!preserveSpace;
    this.override = override; 
  }

  token: string;
  isExpr: boolean;
  preserveSpace: boolean;
  override: ?Function;
}

export const types: {
  [key: string]: TokContext,
} = {
  braceStatement: new TokContext("{", false), // The `{` token starts a code block
  braceExpression: new TokContext("{", true), // The `{` token starts an object literal
  templateQuasi: new TokContext("${", false), // The `${` token starts a template string expression
  parenStatement: new TokContext("(", false), 
  parenExpression: new TokContext("(", true),
  template: new TokContext("`", true, true, p => p.readTmplToken()),
  functionExpression: new TokContext("function", true),
  functionStatement: new TokContext("function", false),
};
```

Each token type (`tt.parenR`, `tt.name`, etc.) has an associated `updateContext` method that updates the parser’s state `this.state` 
based on the context in which the token appears. For instance, when encountering a `{` token, the parser needs to decide whether it starts a block (e.g., in a function body) or an object literal. The `updateContext` method for `{` uses the previous token to make this decision and pushes the appropriate context onto the stack.


```js
tt.parenR.updateContext = tt.braceR.updateContext = function () {
  if (this.state.context.length === 1) { // If the length is one, it means that the parser is at the outermost level of a nested structure
    this.state.exprAllowed = true;       //  An expression is allowed at the current parsing position.
    return;
  }

  let out = this.state.context.pop();
  if (out === types.braceStatement && this.curContext().token === "function") {
    out = this.state.context.pop();
  }

  this.state.exprAllowed = !out.isExpr;
};

tt.name.updateContext = function (prevType) {
 ...
};

tt.braceL.updateContext = function (prevType) {
  this.state.context.push(
    this.braceIsBlock(prevType) ? types.braceStatement : types.braceExpression,
  );
  this.state.exprAllowed = true;
};

tt.dollarBraceL.updateContext = function () {
  ...
};

// It pushes either parenStatement or parenExpression onto the context stack depending on the preceding token (prevType)
tt.parenL.updateContext = function (prevType) {
  const statementParens =
    prevType === tt._if ||
    prevType === tt._for ||
    prevType === tt._with ||
    prevType === tt._while;
  this.state.context.push(
    statementParens ? types.parenStatement : types.parenExpression,
  );
  this.state.exprAllowed = true;
};

tt.incDec.updateContext = function () {
  // tokExprAllowed stays unchanged
};

tt._function.updateContext = tt._class.updateContext = function (prevType) {
  ...
};

tt.backQuote.updateContext = function () {
  ...
};

tt.star.updateContext = function () {
  this.state.exprAllowed = false;
};
```

These classes `TokContext` and `types` are used in several places:

- The [src/tokenizer/index.js](https://github.com/ULL-ESIT-PL/babel-tanhauhau/blob/master/packages/babel-parser/src/tokenizer/index.js) file to provide context to the tokenizer. See [/doc/parser/context/index-context.md](/doc/parser/context/index-context.md)
- The [src/plugins/jsx/index.js](https://github.com/ULL-ESIT-PL/babel-tanhauhau/blob/master/packages/babel-parser/src/plugins/jsx/index.js) file to provide context to the tokenizer of the parser extension for JSX. See [/doc/parser/context/plugin-jsx-context.md](/doc/parser/context/plugin-jsx-context.md). Notice that the babel parser has a plugin folder with several plugins: `jsx`, `flow`, `typescript`, `estree`, ... 


[^1]: [sweet.js](https://www.sweetjs.org/) is a macro system for JavaScript based on Babel. It is a compiler that takes a macro definition file and a source file and produces a JavaScript file. See our repo https://github.com/ULL-ESIT-PL/learning-macros-sweetjs for more information.

See also my PL notes at section [Lexical Ambiguity Example](https://ull-pl.vercel.app/topics/syntax-analysis/teoria#lexical-ambiguity-example)

... Although ECMAScript started as a language with a simple design, over the years that design has become more and more complex.

## state.js

The file [state.js](https://github.com/ULL-ESIT-PL/babel-tanhauhau/blob/master/packages/babel-parser/src/tokenizer/state.js) contains a `State` class, which has the current parsing position — the number of characters we are into the code — and an array of tokens and a lot of other things too.

```js 

import type { Options } from "../options";
import * as N from "../types";
import { Position } from "../util/location";

import { types as ct, type TokContext } from "./context";
import { types as tt, type TokenType } from "./types";
export default class State {
  strict: boolean;
  curLine: number;

  // And, if locations are used, the {line, column} object
  // corresponding to those offsets
  startLoc: Position;
  endLoc: Position;
  init(options: Options): void {
    this.strict =
      options.strictMode === false ? false : options.sourceType === "module";

    this.curLine = options.startLine;
    this.startLoc = this.endLoc = this.curPosition();
  }

  errors: SyntaxError[] = [];

  // Used to signify the start of a potential arrow function
  potentialArrowAt: number = -1;

  ...

  // Tokens length in token store
  tokensLength: number = 0;

  curPosition(): Position {
    return new Position(this.curLine, this.pos - this.lineStart);
  }
  ...
  clone(skipArrays?: boolean): State {
    const state = new State();
    const keys = Object.keys(this);
    for (let i = 0, length = keys.length; i < length; i++) {
      const key = keys[i];
      // $FlowIgnore
      let val = this[key];

      if (!skipArrays && Array.isArray(val)) {
        val = val.slice();
      }

      // $FlowIgnore
      state[key] = val;
    }

    return state;
  }
}
```

See [Adding Custom Syntax to Babel](https://medium.com/@jacobp100/adding-custom-syntax-to-babel-e1a1315c6a90) by Jacob Parker, 2016

## types.js 

Let us review our notes about this file:

> Let's first look at where a token type is defined: [packages/babel-parser/src/tokenizer/types.js](https://github.com/ULL-ESIT-PL/babel-tanhauhau/blob/master/packages/babel-parser/src/tokenizer/types.js#L86-L203).

### The constant types: an object with the token types

> Here you see a list of tokens, so let's add our new token definition in as well[^brackets]:
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
>   // Punctuation token types.
>   bracketL: new TokenType("[", { beforeExpr, startsExpr }),
>    ...
>   dot: new TokenType("."),
>   question: new TokenType("?", { beforeExpr }),
>   questionDot: new TokenType("?."),
>   ...
>   exponent: new TokenType("**", {
>     beforeExpr,
>     binop: 11,
>     rightAssociative: true,
>   }),
>  ... // more token types
> };
> ```

In ECMAScript, there are several situations where **the identification of lexical input elements is sensitive to the syntactic grammar context** that is consuming the input elements. 

This requires *multiple goal symbols* for the lexical grammar. The use of multiple lexical goals ensures that there are no lexical ambiguities that would affect **automatic semicolon insertion**. 

The assignment of fine-grained, information-carrying type objects
allows the tokenizer to store the information it has about a
token in a way that is very cheap for the parser to look up.

At some point inside the declaration of `types` arrive a zone with
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

### The properties startExpr, beforeExpr, and isLoop

- [yield and `startExpr`](yield-and-startexpr.md)
- [The slash and the beforeExpr property](slash-beforeexpr.md)
- [Labels and the `isLoop` property](labels-isloop.md)

[^brackets]: The curly braces `{}` in the TypeScript declaration export `const types: { [name: string]: TokenType }` are used to define an object type. Within these braces, `[name: string]: TokenType` specifies a **signing index**. This means that the types object **can have any number of properties** whose keys are `string` and whose values ​​are of type `TokenType`. In other words, it is an object that can have multiple properties with dynamic names of type `string`, and each of these properties must be of type `TokenType`.


### Keywords and Binary Operations

The `keywords` object is a map of keyword strings to token types[^types]:

```js 
export const keywords = new Map<string, TokenType>();
```
[^types]: The Map<string, TokenType>() syntax in TypeScript indicates the creation of a new `Map` instance with specific types for the keys and values. Here, `<string, TokenType>` specifies that the `Map` keys must be of type `string` and the values ​​must be of type `TokenType`. The parentheses `()` after `Map<string, TokenType>` are required **to invoke the `Map` constructor and create a new instance of it**. Without the parentheses, you would be referring to the `Map` type itself, rather than creating an instance of it.

There are a few helper functions to create keyword tokens and binary operators:

```js
function createKeyword(name: string, options: TokenOptions = {}): TokenType {
  options.keyword = name;
  const token = new TokenType(name, options);
  keywords.set(name, token);
  return token;
}

function createBinop(name: string, binop: number) {
  return new TokenType(name, { beforeExpr, binop });
}
```

The keywords are built in the same file [types.js](https://github.com/ULL-ESIT-PL/babel-tanhauhau/blob/master/packages/babel-parser/src/tokenizer/types.js#L165C2-L202) later:

```js
 // Keywords
  // Don't forget to update packages/babel-helper-validator-identifier/src/keyword.js
  // when new keywords are added
  _break: createKeyword("break"),
  _case: createKeyword("case", { beforeExpr }),
  ...
```


### The TokenType class

We see that we call the token constructor 

```js
constructor(label: string, conf: TokenOptions = {})
```

with `new TokenType('@@')` with the `label` set to `@@` but no `conf`iguration option. 

The `startsExpr` property used for tokens `num`, `bigint`, `regexp`, `string`, `name`, `#`, etc.
is used to determine whether an expression
may be the `argument` subexpression of a `yield` expression or
`yield` statement. It is set on all token types that may be at the
start of a subexpression.


By calling the [constructor](https://github.com/ULL-ESIT-PL/babel-tanhauhau/blob/master/packages/babel-parser/src/tokenizer/types.js#L45-L71) we are setting the `label` property of the token `atat` to `@@`

```ts
export class TokenType {
  label: string;
  keyword: ?string;
  beforeExpr: boolean;
  startsExpr: boolean;
  rightAssociative: boolean;
  isLoop: boolean;
  isAssign: boolean;
  prefix: boolean;
  postfix: boolean;
  binop: ?number;
  updateContext: ?(prevType: TokenType) => void;

  constructor(label: string, conf: TokenOptions = {}) {
    this.label = label;
    this.keyword = conf.keyword;
    this.beforeExpr = !!conf.beforeExpr;
    this.startsExpr = !!conf.startsExpr;
    this.rightAssociative = !!conf.rightAssociative;
    this.isLoop = !!conf.isLoop;
    this.isAssign = !!conf.isAssign;
    this.prefix = !!conf.prefix;
    this.postfix = !!conf.postfix;
    this.binop = conf.binop != null ? conf.binop : null;
    this.updateContext = null;
  }
}
...
```



## index.js

> Next, let's find out where the token gets created during tokenization. A quick search for `tt.at` within `babel-parser/src/tokenizer` lead us to [packages/babel-parser/src/tokenizer/index.js](https://github.com/ULL-ESIT-PL/babel-tanhauhau/blob/master/packages/babel-parser/src/tokenizer/index.js#L891-L894)

### The `getTokenFromCode` method 

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

The Babel parser uses [charcodes constants](https://github.com/xtuc/charcodes?tab=readme-ov-file) to represent characters. See  also my notes on [Unicode, UTF-16 and JavaScript
](https://ull-pl.vercel.app/topics/expresiones-regulares-y-analisis-lexico/unicode-utf-16-and-js#the-unicode-standard)

```js
➜  babel-parser git:(learning) ✗ node
> const cc = require("charcodes")
undefined
> "i".charCodeAt(0) == cc.lowercaseI
true
```

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

### The `finishOp` method

The function `finishOp`  receives the token type and the size of the token, sets the token value and advances the position by calling [finishToken](https://github.com/ULL-ESIT-PL/babel-tanhauhau/blob/master/packages/babel-parser/src/tokenizer/index.js#L382-L390)

```js
finishOp(type: TokenType, size: number): void {
    const str = this.input.slice(this.state.pos, this.state.pos + size);
    this.state.pos += size;
    this.finishToken(type, str);
  }
```


```js 
  finishToken(type: TokenType, val: any): void {
    this.state.end = this.state.pos;
    this.state.endLoc = this.state.curPosition();
    const prevType = this.state.type;
    this.state.type = type;
    this.state.value = val;

    if (!this.isLookahead) this.updateContext(prevType);
  }
```

### Numbers: readNumber

```js
export default class Tokenizer extends ParserErrors {
  ...
  // Read an integer, octal integer, or floating-point number.
  readNumber(startsWithDot: boolean): void {
      const start = this.state.pos;
      let isFloat = false;
      let isBigInt = false;
      let isNonOctalDecimalInt = false;

      if (!startsWithDot && this.readInt(10) === null) {
        this.raise(start, Errors.InvalidNumber);
      }
      let octal =
        this.state.pos - start >= 2 &&
        this.input.charCodeAt(start) === charCodes.digit0;
      if (octal) {
        if (this.state.strict) {
          this.raise(start, Errors.StrictOctalLiteral);
        }
        if (/[89]/.test(this.input.slice(start, this.state.pos))) {
          octal = false;
          isNonOctalDecimalInt = true;
        }
      }

      let next = this.input.charCodeAt(this.state.pos);
      if (next === charCodes.dot && !octal) {
        ++this.state.pos;
        this.readInt(10);
        isFloat = true;
        next = this.input.charCodeAt(this.state.pos);
      }

      if (
        (next === charCodes.uppercaseE || next === charCodes.lowercaseE) &&
        !octal
      ) {
        next = this.input.charCodeAt(++this.state.pos);
        if (next === charCodes.plusSign || next === charCodes.dash) {
          ++this.state.pos;
        }
        if (this.readInt(10) === null) this.raise(start, "Invalid number");
        isFloat = true;
        next = this.input.charCodeAt(this.state.pos);
      }

      // disallow numeric separators in non octal decimals and legacy octal likes
      if (this.hasPlugin("numericSeparator") && (octal || isNonOctalDecimalInt)) {
        const underscorePos = this.input
          .slice(start, this.state.pos)
          .indexOf("_");
        if (underscorePos > 0) {
          this.raise(underscorePos + start, Errors.ZeroDigitNumericSeparator);
        }
      }

      if (next === charCodes.underscore) {
        this.expectPlugin("numericSeparator", this.state.pos);
      }

      if (next === charCodes.lowercaseN) {
        // disallow floats, legacy octal syntax and non octal decimals
        // new style octal ("0o") is handled in this.readRadixNumber
        if (isFloat || octal || isNonOctalDecimalInt) {
          this.raise(start, "Invalid BigIntLiteral");
        }
        ++this.state.pos;
        isBigInt = true;
      }

      if (isIdentifierStart(this.input.codePointAt(this.state.pos))) {
        throw this.raise(this.state.pos, Errors.NumberIdentifier);
      }

      // remove "_" for numeric literal separator, and "n" for BigInts
      const str = this.input.slice(start, this.state.pos).replace(/[_n]/g, "");

      if (isBigInt) {
        this.finishToken(tt.bigint, str); // create a BigInt token 
        return;
      }

      const val = octal ? parseInt(str, 8) : parseFloat(str);
      this.finishToken(tt.num, val); // create a number token
    }
  ...
}
```

The `isIdentifierStart` function is defined in the `@/babel/babel-helper-validator-identifier` package and checks whether a given character code starts an identifier.

```js
// Test whether a given character code starts an identifier.

export function isIdentifierStart(code: number): boolean {
  if (code < charCodes.uppercaseA) return code === charCodes.dollarSign;
  if (code <= charCodes.uppercaseZ) return true;
  if (code < charCodes.lowercaseA) return code === charCodes.underscore;
  if (code <= charCodes.lowercaseZ) return true;
  if (code <= 0xffff) {
    return (
      code >= 0xaa && nonASCIIidentifierStart.test(String.fromCharCode(code))
    );
  }
  return isInAstralSet(code, astralIdentifierStartCodes);
}
``` 

`readNumber` is called from:

### readToken_dot

```js
export default class Tokenizer extends ParserErrors {
  ...

  readToken_dot(): void {
    const next = this.input.charCodeAt(this.state.pos + 1);
    if (next >= charCodes.digit0 && next <= charCodes.digit9) {
      this.readNumber(true);
      return;
    }

    if (
      next === charCodes.dot &&
      this.input.charCodeAt(this.state.pos + 2) === charCodes.dot
    ) {
      this.state.pos += 3;
      this.finishToken(tt.ellipsis);
    } else {
      ++this.state.pos;
      this.finishToken(tt.dot);
    }
  }
  ...
}
```

and from:

### getTokenFromCode: numbers

```js
export default class Tokenizer extends ParserErrors {
  ...
  getTokenFromCode(code: number): void {
    switch (code) {
        // The interpretation of a dot depends on whether it is followed
        // by a digit or another two dots.
        ...
        // Anything else beginning with a digit is an integer, octal
        // number, or float. (fall through)
        ...
        case charCodes.digit1:
        case charCodes.digit2:
        case charCodes.digit3:
        case charCodes.digit4:
        case charCodes.digit5:
        case charCodes.digit6:
        case charCodes.digit7:
        case charCodes.digit8:
        case charCodes.digit9:
          this.readNumber(false);
          return;

        // Quotes produce strings.
        case charCodes.quotationMark:
        ...
    }
    ...
  }
}
```

## See also /doc/parser/context/index-context.md

See also the explanation of the file `src/tokenizer/index.js` at  [/doc/parser/context/index-context.md](/doc/parser/context/index-context.md)