# Exercise: Implement Complex Numbers in Babel

## Tokenizer

See the treatment of BigInt in the tokenizer file index.js. Instead of n we use "i" and introduce the token "tt.imaginary"

```
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
```

Then we need to add the token to the tokenTypes in the file tokenTypes.js

In the parser we have to allow binary operations with "imaginary" numbers. 

## File babel-tanhauhau/packages/babel-parser/src/utils.js: Function isLiteralPropertyName

```js
  /**
   * Test if current token is a literal property name
   * https://tc39.es/ecma262/#prod-LiteralPropertyName
   * LiteralPropertyName:
   *   IdentifierName
   *   StringLiteral
   *   NumericLiteral
   *   BigIntLiteral
   */
  isLiteralPropertyName(): boolean {
    return (
      this.match(tt.name) ||
      !!this.state.type.keyword ||
      this.match(tt.string) ||
      this.match(tt.num) ||
      this.match(tt.bigint)
    );
  }
}
```

## File: babel-tanhauhau/packages/babel-parser/src/types.js

It appears in the type declaration `Literal` in lines 94-100:

```js
// Literals

export type Literal =
  | RegExpLiteral
  | NullLiteral
  | StringLiteral
  | BooleanLiteral
  | NumericLiteral
  | BigIntLiteral;
```

later appears in line 127-130:
  
```js
export type BigIntLiteral = NodeBase & {
  type: "BigIntLiteral",
  value: number,
};
```

and in lines 1201-1213:

```js 
export type TsKeywordTypeType =
  | "TSAnyKeyword"
  | "TSUnknownKeyword"
  | "TSNumberKeyword"
  | "TSObjectKeyword"
  | "TSBooleanKeyword"
  | "TSBigIntKeyword"
  | "TSStringKeyword"
  | "TSSymbolKeyword"
  | "TSVoidKeyword"
  | "TSUndefinedKeyword"
  | "TSNullKeyword"
  | "TSNeverKeyword";
```

## File: babel-tanhauhau/packages/babel-parser/src/parser/expression.js

```js
parseExprAtom(refExpressionErrors?: ?ExpressionErrors): N.Expression {
    // If a division operator appears in an expression position, the
    // tokenizer got confused, and we force it to read a regexp instead.
    if (this.state.type === tt.slash) this.readRegexp();

    const canBeArrow = this.state.potentialArrowAt === this.state.start;
    let node;

    switch (this.state.type) {
      case tt._super:
      case tt._import:
      case tt._this:
      case tt.name: 
      case tt._do: 
      case tt.regexp: 
      case tt.num:
        return this.parseLiteral(this.state.value, "NumericLiteral");
      case tt.bigint:
        return this.parseLiteral(this.state.value, "BigIntLiteral");
      case tt.string:
        return this.parseLiteral(this.state.value, "StringLiteral");
      case tt._null:
      case tt._true:
      case tt._false:
      case tt.parenL:
      case tt.bracketBarL:
      case tt.bracketHashL: 
      case tt.bracketL: 
      case tt.braceBarL:
      case tt.braceHashL: 
      case tt.braceL: 
      case tt._function:
      case tt.at:
      case tt._class:
      case tt._new:

      case tt.backQuote:

      case tt.doubleColon: 

      // fall through
      default:
        throw this.unexpected();
    }
  }
  ```