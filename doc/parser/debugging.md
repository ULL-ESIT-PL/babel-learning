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

If the port `9229` is already in use, you can use another `port` using the syntax:
```
node --inspect-brk[=[host:]port] bin/babel-parser.js examples/simple.js
```
or kill the process using it.
For instance, on a Mac, you can use the `lsof -i tcp:<port>` command to find the process using the port and then kill it:

```sh
➜  babel-parser git:(learning) ✗ lsof -i tcp:9229
COMMAND   PID                 USER   FD   TYPE             DEVICE SIZE/OFF NODE NAME
node    15101 casianorodriguezleon   18u  IPv4 0x3859a6a2d44b1ac6      0t0  TCP localhost:9229 (LISTEN)
➜  babel-parser git:(learning) ✗ kill -9 15101
```

Open the Chrome browser and go to the URL `chrome://inspect`. Click on the `inspect` link to open the Chrome DevTools. The debugger will stop at the `debugger` statement in the `next` function.