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