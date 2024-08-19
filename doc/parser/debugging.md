# Debugging the Babel parser

Change to the folder containing the Babel parser:

```sh
➜  babel-parser git:(learning) ✗ pwd
/Users/casianorodriguezleon/campus-virtual/2122/learning/compiler-learning/babel-tanhauhau/packages/babel-parser
```

In the branch `learning` we have a `simple.js` file with the following content:

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

alternatively, kill the process using it.
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

1. **ECMAScript (JavaScript) Grammar**: This is the primary grammar supported by Babel. It includes all standard JavaScript syntax as defined by the ECMAScript specification.

2. **TypeScript Grammar**: Babel also supports parsing TypeScript, a superset of JavaScript that adds static typing. Babel can strip TypeScript type annotations but does not perform type-checking.

3. **JSX Grammar**: JSX is a syntax extension used in React for writing HTML-like code within JavaScript. Babel can parse and transform JSX syntax.

4. **Flow Grammar**: Flow is a static type checker for JavaScript. Babel can parse Flow type annotations, although, like TypeScript, it does not perform type-checking.

5. **Proposals and Experimental Syntax**: Babel supports various ECMAScript proposals and experimental syntax, often before they become part of the official ECMAScript standard. These are implemented as plugins in Babel.

### Finding Grammars in Backus-Naur Form (BNF) or Similar

While Babel itself does not directly provide its supported grammars in Backus-Naur Form (BNF), you can refer to several resources to find such formal grammars:

1. **ECMAScript Specification**: The official ECMAScript specification defines the JavaScript grammar in a formal language similar to BNF, called the Extended Backus-Naur Form (EBNF).
   - [ECMAScript Specification](https://tc39.es/ecma262/)

2. **TypeScript Grammar**: TypeScript's grammar is based on JavaScript's grammar with additional rules for types. The TypeScript compiler's source code is the best resource for understanding its grammar.
   - [TypeScript Specification](https://github.com/microsoft/TypeScript)

3. **JSX Grammar**: The JSX syntax is less formally defined in BNF or EBNF but can be understood through the React documentation and the Babel JSX plugin source code.
   - [JSX in Depth](https://reactjs.org/docs/jsx-in-depth.html)

4. **Flow Grammar**: Flow's grammar extends JavaScript with type annotations. The formal grammar for Flow can be derived from the Flow documentation and its implementation.
   - [Flow Documentation](https://flow.org/en/docs/)

### Extracting Formal Grammars
If you need the grammar in a formal notation like BNF or EBNF, you might need to manually extract it from the above resources or use tools that can generate grammars from parsers, such as ANTLR, for the TypeScript or ECMAScript grammars.

In summary, Babel supports several JavaScript-related grammars, including ECMAScript, TypeScript, JSX, and Flow. While Babel itself does not provide these grammars in BNF, they can be found or derived from the specifications and documentation of these languages.


- https://tc39.es/ecma262/
- gist: https://gist.github.com/rbuckton/0d8c1f1c607f52f5ae37
