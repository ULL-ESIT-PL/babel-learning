# Debugging the Babel parser

Change to the folder containing the Babel parser:

```sh
➜  babel-parser git:(learning) ✗ pwd
/Users/casianorodriguezleon/campus-virtual/2122/learning/compiler-learning/babel-tanhauhau/packages/babel-parser
```

In the branch `learning` we have a [src/packages/babel-parser/examples](https://github.com/ULL-ESIT-PL/babel-tanhauhau/tree/learning/packages/babel-parser/examples) folder with several simple examples:

`➜  babel-parser git:(learning) ✗ cat examples/simple2.js`
```js 

42+3
```

The script `bin/babel-parser.js` outputs the AST:

```
➜  babel-parser git:(learning) ✗ bin/babel-parser.js examples/simple2.js
```
See the output at file [/doc/parser/debugging/42plus3AST.md](/doc/parser/debugging/42plus3AST.md) 

### Setting a Breakpoint

Write the `debugger` statement in whatever function in the `lib/index.js` file 
you want to debug (You can use the `src/*.js` files but then remember to rebuild). For instance, in the `next` function:

```js
 next() {
    debugger;

    if (!this.isLookahead) {
      this.checkKeywordEscapes();

      if (this.options.tokens) {
        this.pushToken(new Token(this.state));
      }
    }

    this.state.lastTokEnd = this.state.end;
    this.state.lastTokStart = this.state.start;
    this.state.lastTokEndLoc = this.state.endLoc;
    this.state.lastTokStartLoc = this.state.startLoc;
    this.nextToken();
  }
```

We can now run the small parser script at `bin/babel-parser.js` with the following command:

```sh
➜  babel-parser git:(learning) ✗ node --inspect-brk bin/babel-parser.js examples/simple2.js
Debugger listening on ws://127.0.0.1:9229/0ae03cdd-538d-4f67-b3e9-b2f88b0b3c0f
For help, see: https://nodejs.org/en/docs/inspector
```

### Specifying the Port

If the port `9229` is already in use, you can use another one using the syntax:
`node --inspect-brk[=[host:]port] `:

```sh
➜  babel-parser git:(learning) ✗ node --inspect-brk=127.0.0.1:3030  bin/babel-parser.js examples/simple2.js
Debugger listening on ws://127.0.0.1:3030/f9e064fa-83e8-4ad0-aa14-4bb20aa6e883
For help, see: https://nodejs.org/en/docs/inspector
```

Then go to `chrome://inspect` and click on the `open dedicated tools` link

![/images/chrome-debugger-open-dedicated-tools-for-node.png](/images/chrome-debugger-open-dedicated-tools-for-node.png)

Click on the `Add connection` link and add the URL 

![/images/chrome-debugger-adding-a-connection.png](/images/chrome-debugger-adding-a-connection.png)

### Killing the Process

Alternatively, if the port `9229` is already in use, you can kill the process using it.
For instance, on a Mac, you can use the `lsof -i tcp:<port>` command to find the process using the port and then kill it:

```sh
➜  babel-parser git:(learning) ✗ lsof -i tcp:9229
COMMAND   PID                 USER   FD   TYPE             DEVICE SIZE/OFF NODE NAME
node    15101 casianorodriguezleon   18u  IPv4 0x3859a6a2d44b1ac6      0t0  TCP localhost:9229 (LISTEN)
➜  babel-parser git:(learning) ✗ kill -9 15101
```

Open the Chrome browser and go to the URL `chrome://inspect`. Click on the `inspect` link to open the Chrome DevTools. The debugger will stop at the `debugger` statement in the `next` function.

## ES6 grammars

### Grammars Supported by Babel

The folder `src/plugins` in the Babel repository contains the plugins that implement the grammars supported by Babel. 

```
➜  babel-parser git:(learning) ✗ tree  src/plugins
src/plugins
├── estree.js
├── flow.js
├── jsx
│   ├── index.js
│   └── xhtml.js
├── placeholders.js
├── typescript
│   ├── index.js
│   └── scope.js
└── v8intrinsic.js
```

The following are some of the grammars supported by Babel:

1. **ECMAScript (JavaScript) Grammar**: This is the primary grammar supported by Babel. It includes all standard JavaScript syntax as defined by the ECMAScript specification. File `src/plugins

2. **TypeScript Grammar**: Babel also supports parsing TypeScript, a superset of JavaScript that adds static typing. Babel can strip TypeScript type annotations but does not perform type-checking. Folder `src/plugins/typescript` contains the TypeScript "parser plugin".

3. **JSX Grammar**: JSX is a syntax extension used in React for writing HTML-like code within JavaScript. Babel can parse and transform JSX syntax.
Folder `src/plugins/jsx` contains the JSX "parser plugin".

4. **Flow Grammar**: Flow is a static type checker for JavaScript. Babel can parse Flow type annotations, although, like TypeScript, it does not perform type-checking.  File `src/plugins/flow.js` contains the Flow "parser plugin".

5. **Proposals and Experimental Syntax**: Babel supports various ECMAScript proposals and experimental syntax, often before they become part of the official ECMAScript standard. These are implemented as plugins in Babel.
For instance The Facebook Hermes JS engine provides a babel parser plugin
[babel-plugin-syntax-hermes-parser](https://github.com/facebook/hermes/blob/main/tools/hermes-parser/js/babel-plugin-syntax-hermes-parser/README.md).
 This plugin switches Babel to use `hermes-parser` instead of the `@babel/parser`. Since Hermes parser uses C++ compiled to WASM it is significantly faster and provides full syntax support for Flow.

### Finding Grammars in Backus-Naur Form (BNF) or Similar

While Babel itself does not directly provide its supported grammars in Backus-Naur Form (BNF), you can refer to several resources to find such formal grammars:

1. **ECMAScript Specification**: The official ECMAScript specification defines the JavaScript grammar in a formal language similar to BNF, called the Extended Backus-Naur Form (EBNF).
   - [ECMAScript Specification](https://tc39.es/ecma262/)

2. **TypeScript Grammar**: TypeScript's grammar is based on JavaScript's grammar with additional rules for types. Here is a pdf with a TypeScript Language Specification:
   - [TypeScript Specification](https://javascript.xgqfrms.xyz/pdfs/TypeScript%20Language%20Specification.pdf)

3. **JSX Grammar**: The JSX syntax is less formally defined in BNF or EBNF but can be understood through this [JSX spec here.](https://facebook.github.io/jsx/)

4. **Flow Grammar**: Flow's grammar extends JavaScript with type annotations. The formal grammar for Flow can be derived from the Flow documentation and its implementation.
   - [Flow Documentation](https://flow.org/en/docs/)

### Extracting Formal Grammars
If you need the grammar in a formal notation like BNF or EBNF, you might need to manually extract it from the above resources or use tools that can generate grammars from parsers, such as ANTLR, for the TypeScript or ECMAScript grammars.

In summary, Babel supports several JavaScript-related grammars, including ECMAScript, TypeScript, JSX, and Flow. While Babel itself does not provide these grammars in BNF, they can be found or derived from the specifications and documentation of these languages.

### Other resources

- https://tc39.es/ecma262/
- gist: https://gist.github.com/rbuckton/0d8c1f1c607f52f5ae37

## Call Stack

When you run the parser, you can see the call stack in the Chrome DevTools when it stops on the `next` breakpoint. Read the call stack from bottom to top. 

1. next 
2. parseLiteral
3. parseExprAtom
4. parseExprSubscripts
5. parseMaybeUnary
6. parseExprOps
7. parseMaybeConditional
8. parseMaybeAssign

    ```js 
    parseMaybeAssign(noIn, refExpressionErrors, afterLeftParse, refNeedsArrowPos) {
      const startPos = this.state.start;
      const startLoc = this.state.startLoc;

      if (this.isContextual("yield")) {
        if (this.prodParam.hasYield) {
          let left = this.parseYield(noIn);

          if (afterLeftParse) {
            left = afterLeftParse.call(this, left, startPos, startLoc);
          }

          return left;
        } else {
          this.state.exprAllowed = false;
        }
      }

      let ownExpressionErrors;

      if (refExpressionErrors) {
        ownExpressionErrors = false;
      } else {
        refExpressionErrors = new ExpressionErrors();
        ownExpressionErrors = true;
      }

      if (this.match(types.parenL) || this.match(types.name)) {
        this.state.potentialArrowAt = this.state.start;
      }

      let left = this.parseMaybeConditional(noIn, refExpressionErrors, refNeedsArrowPos); // <= Here

      if (afterLeftParse) {
        left = afterLeftParse.call(this, left, startPos, startLoc);
      }

      if (this.state.type.isAssign) {
        const node = this.startNodeAt(startPos, startLoc);
        const operator = this.state.value;
        node.operator = operator;

        if (operator === "??=") {
          this.expectPlugin("logicalAssignment");
        }

        if (operator === "||=" || operator === "&&=") {
          this.expectPlugin("logicalAssignment");
        }

        if (this.match(types.eq)) {
          node.left = this.toAssignable(left);
          refExpressionErrors.doubleProto = -1;
        } else {
          node.left = left;
        }

        if (refExpressionErrors.shorthandAssign >= node.left.start) {
          refExpressionErrors.shorthandAssign = -1;
        }

        this.checkLVal(left, undefined, undefined, "assignment expression");
        this.next();
        node.right = this.parseMaybeAssign(noIn);
        return this.finishNode(node, "AssignmentExpression");
      } else if (ownExpressionErrors) {
        this.checkExpressionErrors(refExpressionErrors, true);
      }

      return left;
    }
    ```
9.  parseExpression

    ```js 
    parseExpression(noIn, refExpressionErrors) {
      const startPos = this.state.start;
      const startLoc = this.state.startLoc;
      const expr = this.parseMaybeAssign(noIn, refExpressionErrors); // <= Here

      if (this.match(types.comma)) {
        const node = this.startNodeAt(startPos, startLoc);
        node.expressions = [expr];

        while (this.eat(types.comma)) {
          node.expressions.push(this.parseMaybeAssign(noIn, refExpressionErrors));
        }

        this.toReferencedList(node.expressions);
        return this.finishNode(node, "SequenceExpression");
      }

      return expr;
    }
    ```

10. parseStatementContent

    ```js 
      parseStatementContent(context, topLevel) {
        let starttype = this.state.type; // The type of the current token
        const node = this.startNode();
        let kind;

        if (this.isLet(context)) {
          starttype = types._var;
          kind = "let";
        }

        switch (starttype) { // None of the cases match
          case types._break:
          case types._continue:
            return this.parseBreakContinueStatement(node, starttype.keyword);

          case types._debugger:
            return this.parseDebuggerStatement(node);

          case types._do:
            return this.parseDoStatement(node);

          case types._for:
            return this.parseForStatement(node);

          case types._function:
            if (this.lookaheadCharCode() === 46) break;

            if (context) {
              if (this.state.strict) {
                this.raise(this.state.start, ErrorMessages.StrictFunction);
              } else if (context !== "if" && context !== "label") {
                this.raise(this.state.start, ErrorMessages.SloppyFunction);
              }
            }

            return this.parseFunctionStatement(node, false, !context);

          case types._class:
            if (context) this.unexpected();
            return this.parseClass(node, true);

          case types._if:
            return this.parseIfStatement(node);

          case types._return:
            return this.parseReturnStatement(node);

          case types._switch:
            return this.parseSwitchStatement(node);

          case types._throw:
            return this.parseThrowStatement(node);

          case types._try:
            return this.parseTryStatement(node);

          case types._const:
          case types._var:
            kind = kind || this.state.value;

            if (context && kind !== "var") {
              this.raise(this.state.start, ErrorMessages.UnexpectedLexicalDeclaration);
            }

            return this.parseVarStatement(node, kind);

          case types._while:
            return this.parseWhileStatement(node);

          case types._with:
            return this.parseWithStatement(node);

          case types.braceL:
            return this.parseBlock();

          case types.semi:
            return this.parseEmptyStatement(node);

          case types._export:
          case types._import:
            {
              const nextTokenCharCode = this.lookaheadCharCode();

              if (nextTokenCharCode === 40 || nextTokenCharCode === 46) {
                break;
              }

              if (!this.options.allowImportExportEverywhere && !topLevel) {
                this.raise(this.state.start, ErrorMessages.UnexpectedImportExport);
              }

              this.next();
              let result;

              if (starttype === types._import) {
                result = this.parseImport(node);

                if (result.type === "ImportDeclaration" && (!result.importKind || result.importKind === "value")) {
                  this.sawUnambiguousESM = true;
                }
              } else {
                result = this.parseExport(node);

                if (result.type === "ExportNamedDeclaration" && (!result.exportKind || result.exportKind === "value") || result.type === "ExportAllDeclaration" && (!result.exportKind || result.exportKind === "value") || result.type === "ExportDefaultDeclaration") {
                  this.sawUnambiguousESM = true;
                }
              }

              this.assertModuleNodeAllowed(node);
              return result;
            }

          default:
            {
              if (this.isAsyncFunction()) {
                if (context) {
                  this.raise(this.state.start, ErrorMessages.AsyncFunctionInSingleStatementContext);
                }

                this.next();
                return this.parseFunctionStatement(node, true, !context);
              }
            }
        }

        const maybeName = this.state.value;  // 42
        const expr = this.parseExpression(); // <= Here

        if (starttype === types.name && expr.type === "Identifier" && this.eat(types.colon)) {
          return this.parseLabeledStatement(node, maybeName, expr, context);
        } else {
          return this.parseExpressionStatement(node, expr);
        }
      }
    ```
11. parseStatement

    Decorators in JavaScript are a proposal (still in Stage 3 as of 2024) that provides a syntax for wrapping or modifying classes, methods, and properties. See the example at 
    [/src/awesome/tc39-decorators](/src/awesome/tc39-decorators/)

    ```js
    parseStatement(context, topLevel) {
      if (this.match(types.at)) { // if the current token is an `@` symbol
        this.parseDecorators(true);
      }

      return this.parseStatementContent(context, topLevel); // <= Here
    }
    ```
12. parseBlockOrModuleBlockBody

    The `parseBlockOrModuleBlockBody` function is responsible for parsing the body of a block or module block in a JavaScript program. 


    An octal literal in JavaScript is a way to represent an integer in base-8 (octal) numeral system. It uses digits from 0 to 7. In JavaScript, octal literals are denoted differently depending on whether they are in ES5 or ES6+. Before ECMAScript 2015 (ES6) we have **Legacy Octal Literals**: These begin with a leading zero (`0`). For example, `075` is interpreted as the octal number 75, which is 61 in decimal. However, using this form in strict mode will throw a syntax error because it is not allowed. From ECMAScript 2015 (ES6) onwards we have **ES6 Octal Literals**: These start with `0o` or `0O` (zero followed by a lowercase or uppercase letter "o"). For instance, `0o75` is interpreted as the octal number 75, which is 61 in decimal.

    ```js
    var n = 075; // Before ECMAScript 2015 this would equal 61 in decimal
    ```
    but in strict mode:
    ```js
    "use strict";
    var n = 075; // SyntaxError: Octal literals are not allowed in strict mode.
    ```
    Instead we have to use Modern Octal:
    ```js
    var n = 0o75; // This equals 61 in decimal
    ```

    The function begins by initializing an array `octalPositions` to track positions of octal literals and saving the current strict mode state in `oldStrict`. It also initializes two boolean flags: `hasStrictModeDirective` to track if a `"use strict"` directive is encountered, and `parsedNonDirective` to track if any non-directive statements have been parsed.

    The function then enters a loop that continues until the `end` token is matched. Within the loop, it first checks if there are any octal literals before a `"use strict"` directive and stores their positions. It then parses a statement 
    with `parseStatement` and if it is a "true statement" the corresponding AST it is pushed in the `body`. 
    
    If the statement is a valid directive and directives are allowed, it converts the statement to a directive using `stmtToDirective` and adds it to the `directives` array. If the directive is "use strict", it sets the strict mode to true.

    After the loop, if `strict` mode is enabled and there are octal literals, it raises an error for each octal literal found before the `"use strict"` directive.

    Finally, if an `afterBlockParse` callback is provided, it is called with the `hasStrictModeDirective` flag. The function then restores the `strict` mode to its original state if it was not previously enabled and advances to the `next` token.

    ```js 
    parseBlockOrModuleBlockBody(body, directives, topLevel, end, afterBlockParse) {
      const octalPositions = [];
      const oldStrict = this.state.strict;
      let hasStrictModeDirective = false;
      let parsedNonDirective = false;

      while (!this.match(end)) {
        if (!parsedNonDirective && this.state.octalPositions.length) {
          octalPositions.push(...this.state.octalPositions);
        }

        const stmt = this.parseStatement(null, topLevel); // <= Here

        if (directives && !parsedNonDirective && this.isValidDirective(stmt)) {
          const directive = this.stmtToDirective(stmt); // It is a directive
          directives.push(directive);

          if (!hasStrictModeDirective && directive.value.value === "use strict") {
            hasStrictModeDirective = true;
            this.setStrict(true);
          }

          continue;
        }

        parsedNonDirective = true;
        body.push(stmt);
      }

      if (this.state.strict && octalPositions.length) {
        for (let _i3 = 0; _i3 < octalPositions.length; _i3++) {
          const pos = octalPositions[_i3];
          this.raise(pos, ErrorMessages.StrictOctalLiteral);
        }
      }

      if (afterBlockParse) {
        afterBlockParse.call(this, hasStrictModeDirective);
      }

      if (!oldStrict) {
        this.setStrict(false);
      }

      this.next();
    }
    ```
13. parseBlockBody

    The `parseBlockBody` method takes several parameters: `node` which will store the AST for the block statement, `allowDirectives` (a boolean), `topLevel` (indicating whether the block is at the top level of the program), 
    `end` (the token type that signifies the end of the block), and an optional `afterBlockParse` callback. The `body` array will hold the ASTs for the statements within the block, while the `directives` array will hold any directive prologues (like `"use strict"`). The method  calls `this.parseBlockOrModuleBlockBody`, which is responsible for the actual parsing of the block's contents.
    
    ```js
    parseBlockBody(node, allowDirectives, topLevel, end, afterBlockParse) {
      const body = node.body = [];
      const directives = node.directives = [];
      this.parseBlockOrModuleBlockBody(body, allowDirectives ? directives : undefined, topLevel, end, afterBlockParse);
    }
    ```
14. parseTopLevel
    
    The `parseTopLevel` function is the entry point for parsing the top-level of a file. It initializes the `program` node
    with the `sourceType` and `interpreter` properties, and then calls `parseBlockBody` to parse the body of the program.
    
    ```js
    class StatementParser extends ExpressionParser {
      parseTopLevel(file, program) {
        program.sourceType = this.options.sourceType;
        program.interpreter = this.parseInterpreterDirective();
        this.parseBlockBody(program, true, true, types.eof);

        if (this.inModule && !this.options.allowUndeclaredExports && this.scope.undefinedExports.size > 0) {
          for (let _i = 0, _Array$from = Array.from(this.scope.undefinedExports); _i < _Array$from.length; _i++) {
            const [name] = _Array$from[_i];
            const pos = this.scope.undefinedExports.get(name);
            this.raise(pos, ErrorMessages.ModuleExportUndefined, name);
          }
        }

        file.program = this.finishNode(program, "Program");
        file.comments = this.state.comments;
        if (this.options.tokens) file.tokens = this.tokens;
        return this.finishNode(file, "File");
      }
      ...
    }
    ```

    After parsing the program, the function checks for any `undefinedExports` in the module scope and raises an error if any are found. It then finishes the `program` and `file` nodes and returns the `file` node.
15. parse
    
    Once what kind of source and what kind of parser to use is determined, the appropriate `parse` function is called. 
    A check for the presence of a  `topLevelAwait` is done here to decide whether we are running in async mode or not. 
    After initialization of the scope and creation of the upper AST nodes, we get the initial token and the `parseTopLevel` function is then called with the `file` and `program` nodes. The function returns the root node of the AST: `file`.
    The parsing starts!

    ```js
    parse() {
      let paramFlags = PARAM;

      if (this.hasPlugin("topLevelAwait") && this.inModule) {
        paramFlags |= PARAM_AWAIT;
      }

      this.scope.enter(SCOPE_PROGRAM);
      this.prodParam.enter(paramFlags);
      const file = this.startNode();
      const program = this.startNode();
      this.nextToken();
      file.errors = null;
      this.parseTopLevel(file, program); // <= Here
      file.errors = this.state.errors;
      return file;
    }
    ```
16. parse 
    
    See line `getParser(options, input).parse();` below at function `parse`. Babel.js supports two source types: `script` and `module`. The `sourceType` option can be set to `script` or `module`. If the `sourceType` is `unambiguous`, Babel will try to parse the input as a module. If it fails, it will try to parse it as a script.

    ```js
    function parse(input, options) {
      var _options;

      if (((_options = options) == null ? void 0 : _options.sourceType) === "unambiguous") {
        options = Object.assign({}, options);

        try {
          options.sourceType = "module";
          const parser = getParser(options, input);
          const ast = parser.parse();

          if (parser.sawUnambiguousESM) {
            return ast;
          }

          if (parser.ambiguousScriptDifferentAst) {
            try {
              options.sourceType = "script";
              return getParser(options, input).parse();
            } catch (_unused) {}
          } else {
            ast.program.sourceType = "script";
          }

          return ast;
        } catch (moduleError) {
          try {
            options.sourceType = "script";
            return getParser(options, input).parse(); 
          } catch (_unused2) {}

          throw moduleError;
        }
      } else {
        return getParser(options, input).parse(); // <= Here
      }
    }
    ```

## Variables

### this.parser 

![/images/debugging/parser.png](/images/debugging/parser.png)

### this.state

![/images/debugging/state.png](/images/debugging/state.png)

Notice how `type`  contains the `TokenType` of the current token.