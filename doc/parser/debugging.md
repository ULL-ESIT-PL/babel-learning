# Debugging the Babel parser

Change to the folder containing the Babel parser:

```sh
➜  babel-parser git:(learning) ✗ pwd
/Users/casianorodriguezleon/campus-virtual/2122/learning/compiler-learning/babel-tanhauhau/packages/babel-parser
```

In the branch `learning` we have a [src/packages/babel-parser/examples](https://github.com/ULL-ESIT-PL/babel-tanhauhau/tree/learning/packages/babel-parser/examples) folder with several simple examples:

`➜  babel-parser git:(learning) ✗ cat examples/simple.js`
```js 
42
```

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
➜  babel-parser git:(learning) ✗ node --inspect-brk bin/babel-parser.js examples/simple.js
Debugger listening on ws://127.0.0.1:9229/0ae03cdd-538d-4f67-b3e9-b2f88b0b3c0f
For help, see: https://nodejs.org/en/docs/inspector
```

### Specifying the Port

If the port `9229` is already in use, you can use another one using the syntax:
`node --inspect-brk[=[host:]port] `:

```sh
➜  babel-parser git:(learning) ✗ node --inspect-brk=127.0.0.1:3030  bin/babel-parser.js examples/simple.js
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

1. next 
2. parseLiteral
3. parseExprAtom
4. parseExprSubscripts
5. parseMaybeUnary
6. parseExprOps
7. parseMaybeConditional
8. parseMaybeAssign
9. parseExpression
10. parseStatementContent
11. parseStatement
12. parseBlockOrModuleBlockBody
13. parseBlockBody
14. parseTopLevel
15. parse
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
    From line `getParser(options, input).parse();`) at function:
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
            return getParser(options, input).parse(); // <= Here
          } catch (_unused2) {}

          throw moduleError;
        }
      } else {
        return getParser(options, input).parse();
      }
    }
    ```
