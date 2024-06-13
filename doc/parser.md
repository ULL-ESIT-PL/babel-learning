# The Babel Parser

## Example

See a simple example of how to use the parser at [/src/parser/example.cjs](/src/parser/example.cjs).

## Docs

The docs for the parser are at https://babeljs.io/docs/babel-parser

## Article Creating custom JavaScript syntax with Babel

See the Svelte maintainer Tan Li Hau (陈立豪) article "Creating custom JavaScript syntax with Babel" (September 25, 2019) available at https://lihautan.com/creating-custom-javascript-syntax-with-babel
where the author creates  a curry function syntax `@@`:

```js
// '@@' makes the function `foo` curried
function @@ foo(a, b, c) {
  return a + b + c;
}
console.log(foo(1, 2)(3)); // 6
```

the parser is a recursive descent parser. 

- Modifies the lexer. [packages/babel-parser/src/tokenizer/types.js](https://github.com/tanhauhau/babel/blob/feat/curry-function/packages/babel-parser/src/tokenizer/types.js#L86). We need typescript for that.

- The author looks for
`"FunctionDeclaration"` and finds a function called `parseFunction` in 
[packages/babel-parser/src/parser/statement.js](https://github.com/tanhauhau/babel/blob/da0af5fd99a9b747370a2240df3abf2940b9649c/packages/babel-parser/src/parser/statement.js#L1030),
and here found a line that sets the `generator` attribute.

See [tan-liu-article.md](/doc/tan-liu-article.md) for the summary of my experience reproducing Tan Liu Hau's article.


## Parser Output: The Babel AST

The  Babel AST specification is at file `spec.md` in repo https://github.com/babel/babel/blob/master/packages/babel-parser/ast/spec.md

The Babel parser generates AST according to [Babel AST format][].
It is based on [ESTree spec][] with the following deviations:

- [Literal][] token is replaced with [StringLiteral][], [NumericLiteral][], [BigIntLiteral][], [BooleanLiteral][], [NullLiteral][], [RegExpLiteral][]
- [Property][] token is replaced with [ObjectProperty][] and [ObjectMethod][]
- [MethodDefinition][] is replaced with [ClassMethod][] and [ClassPrivateMethod][]
- [PropertyDefinition][] is replaced with [ClassProperty][] and [ClassPrivateProperty][]
- [PrivateIdentifier][] is replaced with [PrivateName][]
- [Program][] and [BlockStatement][] contain additional `directives` field with [Directive][] and [DirectiveLiteral][]
- [ClassMethod][], [ClassPrivateMethod][], [ObjectProperty][], and [ObjectMethod][] value property's properties in [FunctionExpression][] is coerced/brought into the main method node.
- [ChainExpression][] is the kind of node produced by espree for expressions like `obj?.aaa?.bbb`. It will be replaced with [OptionalMemberExpression][] and [OptionalCallExpression][]
- [ImportExpression][] is replaced with a [CallExpression][] whose `callee` is an [Import] node. This change will be reversed in Babel 8.
- [ExportAllDeclaration][] with `exported` field is replaced with an [ExportNamedDeclaration][] containing an [ExportNamespaceSpecifier][] node.

<!-- NOT WORKING: around commit d8bc310 Here is aChatGPT answer to the question [How can I convert a Babel.js AST to Estree format?](/doc/parser/babelAST2estree.md) -->

AST for JSX code is based on [Facebook JSX AST][].

[babel ast format]: https://github.com/babel/babel/tree/main/packages/babel-parser/ast/spec.md
[estree spec]: https://github.com/estree/estree
[literal]: https://github.com/estree/estree/blob/master/es5.md#literal
[property]: https://github.com/estree/estree/blob/master/es5.md#property
[methoddefinition]: https://github.com/estree/estree/blob/master/es2015.md#methoddefinition
[propertydefinition]: https://github.com/estree/estree/blob/master/es2022.md#propertydefinition
[chainexpression]: https://github.com/estree/estree/blob/master/es2020.md#chainexpression
[importexpression]: https://github.com/estree/estree/blob/master/es2020.md#importexpression
[exportalldeclaration]: https://github.com/estree/estree/blob/master/es2020.md#exportalldeclaration
[privateidentifier]: https://github.com/estree/estree/blob/master/es2022.md#privateidentifier
[stringliteral]: https://github.com/babel/babel/tree/main/packages/babel-parser/ast/spec.md#stringliteral
[numericliteral]: https://github.com/babel/babel/tree/main/packages/babel-parser/ast/spec.md#numericliteral
[bigintliteral]: https://github.com/babel/babel/tree/main/packages/babel-parser/ast/spec.md#bigintliteral
[booleanliteral]: https://github.com/babel/babel/tree/main/packages/babel-parser/ast/spec.md#booleanliteral
[nullliteral]: https://github.com/babel/babel/tree/main/packages/babel-parser/ast/spec.md#nullliteral
[regexpliteral]: https://github.com/babel/babel/tree/main/packages/babel-parser/ast/spec.md#regexpliteral
[objectproperty]: https://github.com/babel/babel/tree/main/packages/babel-parser/ast/spec.md#objectproperty
[objectmethod]: https://github.com/babel/babel/tree/main/packages/babel-parser/ast/spec.md#objectmethod
[classmethod]: https://github.com/babel/babel/tree/main/packages/babel-parser/ast/spec.md#classmethod
[classproperty]: https://github.com/babel/babel/tree/main/packages/babel-parser/ast/spec.md#classproperty
[classprivateproperty]: https://github.com/babel/babel/tree/main/packages/babel-parser/ast/spec.md#classprivateproperty
[classprivatemethod]: https://github.com/babel/babel/tree/main/packages/babel-parser/ast/spec.md#classprivatemethod
[privatename]: https://github.com/babel/babel/tree/main/packages/babel-parser/ast/spec.md#privatename
[program]: https://github.com/babel/babel/tree/main/packages/babel-parser/ast/spec.md#programs
[blockstatement]: https://github.com/babel/babel/tree/main/packages/babel-parser/ast/spec.md#blockstatement
[directive]: https://github.com/babel/babel/tree/main/packages/babel-parser/ast/spec.md#directive
[directiveliteral]: https://github.com/babel/babel/tree/main/packages/babel-parser/ast/spec.md#directiveliteral
[functionexpression]: https://github.com/babel/babel/tree/main/packages/babel-parser/ast/spec.md#functionexpression
[optionalmemberexpression]: https://github.com/babel/babel/blob/main/packages/babel-parser/ast/spec.md#optionalmemberexpression
[optionalcallexpression]: https://github.com/babel/babel/blob/main/packages/babel-parser/ast/spec.md#optionalcallexpression
[callexpression]: https://github.com/babel/babel/blob/main/packages/babel-parser/ast/spec.md#callexpression
[import]: https://github.com/babel/babel/blob/main/packages/babel-parser/ast/spec.md#import
[exportnameddeclaration]: https://github.com/babel/babel/blob/main/packages/babel-parser/ast/spec.md#exportnameddeclaration
[exportnamespacespecifier]: https://github.com/babel/babel/blob/main/packages/babel-parser/ast/spec.md#exportnamespacespecifier
[facebook jsx ast]: https://github.com/facebook/jsx/blob/master/AST.md

## Error codes

Error codes are useful for handling the errors thrown by `@babel/parser`.

There are two error codes, `code` and `reasonCode`.

- `code`
  - Rough classification of errors (e.g. `BABEL_PARSER_SYNTAX_ERROR`, `BABEL_PARSER_SOURCETYPE_MODULE_REQUIRED`).
- `reasonCode`
  - Detailed classification of errors (e.g. `MissingSemicolon`, `VarRedeclaration`).

See example at [/src/parser/error-example.cjs](/src/parser/error-example.cjs):

```js 
const { parse } = require("@babel/parser");

const ast = parse(`a b`, { errorRecovery: true });

console.log(ast.errors[0].code); // BABEL_PARSER_SYNTAX_ERROR
console.log(ast.errors[0].reasonCode); // MissingSemicolon
```


## tc39 

Ecma International's TC39 is a group of JavaScript developers, implementers, and academics collaborating 
with the community to maintain and evolve the definition of JavaScript.

See [tc39.md](/doc/parser/tc39.md) 

## Tokenizer

See section [/doc/parser/tokenizer.md](/doc/parser/tokenizer.md).

## References

See section [References](docs/references.md).
