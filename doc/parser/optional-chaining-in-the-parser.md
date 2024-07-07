# On Babel Parser Plugins

## Introduction

At the end of Nicolo Ribaudo's talk [@babel/howto](https://youtu.be/UeVq_U5obnE?t=3119) the interviewer asks him about how to add syntax to Babel. 

> ... The Babel parser does not support plugins. That parsing option I was using in the code is just a list of features which the parser
>  already supports but are disabled by default. 
> If you want to test your custom syntax, we don't yet at least provide an API to do so and **we suggest you to just fork the parser (the Babel mono repo) and then you can provide your custom parser as a Babel option**. 

When asked about the process of adding a new JS syntax proposals to Babel, Nicolo says:

> ... We don't have like a rule for this. We try to implement "parser plugins" soon unless the proposal is really unstable. For example, there is currently a pattern matching proposal which I think is stage one, may be is stage 2, I'm not sure and we have not implemented yet, just because 
> the syntax is changing really fast and so we aren't willing to commit to these frequent changes.


## packages/babel-parser/typings/babel-parser.d.ts

See [babel-parser/typings/babel-parser.d.ts](https://github.com/ULL-ESIT-PL/babel-tanhauhau/blob/e498bee10f0123bb208baa228ce6417542a2c3c4/packages/babel-parser/typings/babel-parser.d.ts#L97-L136). This is the list of plugins that can be enabled in the parser:

```ts
export interface ParserOptions {
    ... // other options
    /* Array containing the plugins that you want to enable.  */
    plugins?: ParserPlugin[];
    tokens?: boolean;
}
export type ParserPlugin =
    'asyncGenerators' |
    'bigInt' |
    'classPrivateMethods' |
    'classPrivateProperties' |
    'classProperties' |
    'decorators' |
    'decorators-legacy' |
    'doExpressions' |
    'dynamicImport' |
    'estree' |
    'exportDefaultFrom' |
    'exportNamespaceFrom' | // deprecated
    'flow' |
    'flowComments' |
    'functionBind' |
    'functionSent' |
    'importMeta' |
    'jsx' |
    'logicalAssignment' |
    'moduleAttributes' |
    'nullishCoalescingOperator' |
    'numericSeparator' |
    'objectRestSpread' |
    'optionalCatchBinding' |
    'optionalChaining' |
    'partialApplication' |
    'pipelineOperator' |
    'placeholders' |
    'privateIn' |
    'throwExpressions' |
    'topLevelAwait' |
    'typescript' |
    'v8intrinsic' |
    ParserPluginWithOptions;

export type ParserPluginWithOptions =
    ['decorators', DecoratorsPluginOptions] |
    ['pipelineOperator', PipelineOperatorPluginOptions] |
    ['flow', FlowPluginOptions];
```

So, if you add a new syntax feature to Babel like the curry syntax explained in [Tan Li Hau's talk](/tan-liu-article.md), add it here.

## packages/babel-core/src/parser/index.js

The code in this file is responsible for parsing overwrite plugins. 
You can see an example of parsing overwrite in the subsection *Running with the installed compiler using parserOverride
* of the file  
[/doc/tan-liu-article/plugin-first-approach.md](https://github.com/ULL-ESIT-PL/babel-learning/blob/main/doc/tan-liu-article/plugin-first-approach.md#running-with-the-installed-compiler-using-parseroverride)

The [@babel/core](https://github.com/ULL-ESIT-PL/babel-tanhauhau/tree/master/packages/babel-core/src) package wraps 
the actual parser. The involved code is in files [src/parse.js](https://github.com/ULL-ESIT-PL/babel-tanhauhau/blob/master/packages/babel-core/src/parse.js) and those files in the folder [/src/parser/](https://github.com/ULL-ESIT-PL/babel-tanhauhau/tree/master/packages/babel-core/src/parser), namely the file [index.js](https://github.com/ULL-ESIT-PL/babel-tanhauhau/blob/master/packages/babel-core/src/parser/index.js).
Follows the code of the generator `parser` at [packages/babel-core/src/parser/index.js](https://github.com/ULL-ESIT-PL/babel-tanhauhau/blob/master/packages/babel-core/src/parser/index.js) 

```ts
export default function* parser(pluginPasses: PluginPasses, { parserOpts, highlightCode = true, filename = "unknown" }: Object,  code: string,): Handler<ParseResult> {
  try {
    const results = []; // array of ASTs?
    for (const plugins of pluginPasses) {
      for (const plugin of plugins) {
        const { parserOverride } = plugin;
        if (parserOverride) {
          const ast = parserOverride(code, parserOpts, parse);

          if (ast !== undefined) results.push(ast); // push the AST to the results array
        }
      }
    }

    if (results.length === 0) { return parse(code, parserOpts); } 
    else if (results.length === 1) {
      yield* []; // If we want to allow async parsers
      if (typeof results[0].then === "function") { throw new Error(`You appear to be using an async parser plugin, ` +  `which your current version of Babel does not support. ` + `If you're using a published plugin, you may need to upgrade ` +   `your @babel/core version.`, ); }
      return results[0];
    }
    throw new Error("More than one plugin attempted to override parsing.");
  } catch (err) { ... throw err; }
}
```

The parser function is an asynchronous generator (indicated by the `function*` syntax) that takes three parameters: `pluginPasses`, an object containing parser options, and the `code` to be parsed. It returns a `Handler` that yields a `ParseResult`, which is an AST node.

 Inside the function, it attempts to parse the code using any provided plugin overrides. If a plugin provides a `parserOverride` function, this function is called with the `code`, parser options, and a reference to the default Babel parser. If the override returns an AST, it is added to the `results` array.

After attempting to use all plugin overrides, the function checks the results:

- If no plugins returned an AST, it falls back to the default Babel parser.
- If exactly one plugin returned an AST, that AST is returned as the result.
- If more than one plugin returned an AST, an error is thrown, as only one parser override should be effective.

## parseSubscript

In [packages/babel-parser/src/parser/expression.js](https://github.com/ULL-ESIT-PL/babel-tanhauhau/tree/master/packages/babel-parser/src/parser) we have the `parseSubscript` method inside the class `ExpressionParser`
which is in charge of parsing the subscript expressions. 

```js
  /**
   * @param state Set 'state.stop = true' to indicate that we should stop parsing subscripts.
   *   state.optionalChainMember to indicate that the member is currently in OptionalChain
   */
  parseSubscript(
    base: N.Expression, // The base expression to parse subscripts for. In a.b the base is a.
    startPos: number, startLoc: Position,
    noCalls: ?boolean,              // If true, don't parse call expressions.
    state: N.ParseSubscriptState, 
    maybeAsyncArrow: boolean,
  ): N.Expression {
```

**Bind Expression Parsing**: If the `doubleColon` token is encountered and `noCalls` is `false`, it parses a bind expression (e.g., `a::b`), marking the parsing state to `stop` further subscript parsing.

```js
    if (!noCalls && this.eat(tt.doubleColon)) { // S.t. like a::b a binding expression
      const node = this.startNodeAt(startPos, startLoc);
      node.object = base;
      node.callee = this.parseNoCallExpr();
      state.stop = true;
      return this.parseSubscripts(
        this.finishNode(node, "BindExpression"),
        startPos,
        startLoc,
        noCalls,
      );
    } 
```
**Optional Chaining**: When the `questionDot` token is found, it indicates the start of an optional chaining expression (e.g., `a?.b`). The method then checks for different scenarios like `computed` property access (`a?.[0]`), optional call expressions (`a?.()`), and direct property access with optional chaining (`a?.b`). Each of these scenarios is handled by creating a node representing the expression, setting properties on the node to reflect the parsed structure, and then finishing the node with the appropriate type.

```js
    else if (this.match(tt.questionDot)) { // S.t. like a?.b
      this.expectPlugin("optionalChaining");
      state.optionalChainMember = true;
      if (noCalls && this.lookahead().type === tt.parenL) { // S.t. like a?.(0)
        state.stop = true;
        return base;
      }
      this.next();

      const node = this.startNodeAt(startPos, startLoc);

      if (this.eat(tt.bracketL)) { // S.t. like a?.[0]
        node.object = base;
        node.property = this.parseExpression();
        node.computed = true;
        node.optional = true;
        this.expect(tt.bracketR);
        return this.finishNode(node, "OptionalMemberExpression");
      } else if (this.eat(tt.parenL)) { // S.t. like a?.(0)
        node.callee = base;
        node.arguments = this.parseCallExpressionArguments(tt.parenR, false);
        node.optional = true;
        return this.finishNode(node, "OptionalCallExpression");
      } else { // S.t. like a?.b
        node.object = base;
        node.property = this.parseIdentifier(true);
        node.computed = false;
        node.optional = true;
        return this.finishNode(node, "OptionalMemberExpression");
      }
    } 
```

Notice that the expression `a?.(0)` does make sense in JavaScript. It utilizes the optional chaining operator (`?.`) in combination with a function call. The optional chaining operator (`?.`) when used with a function call, it conditionally calls the function only if the function reference is not `null` or `undefined`.

Consider the following example:

```javascript
const obj = {
  func: (x) => x * 2,
};

// Using optional chaining with function call
const result1 = obj.func?.(2); // 4
const result2 = obj.nonExistentFunc?.(2); // undefined

console.log(result1); // Output: 4
console.log(result2); // Output: undefined
```

This can be particularly useful in situations where the function you are calling might not always be defined:


**Property Access and Computed Property Access**: The method also handles regular property access (`a.b`) and computed property access (`a[b]`) by checking for the presence of a dot or an opening bracket, respectively. It constructs the corresponding expression nodes accordingly.

```js
    else if (this.eat(tt.dot)) {
      const node = this.startNodeAt(startPos, startLoc);
      node.object = base;
      node.property = this.parseMaybePrivateName();
      node.computed = false;
      if (state.optionalChainMember) {
        node.optional = false;
        return this.finishNode(node, "OptionalMemberExpression");
      }
      return this.finishNode(node, "MemberExpression");
    } else if (this.eat(tt.bracketL)) {
      const node = this.startNodeAt(startPos, startLoc);
      node.object = base;
      node.property = this.parseExpression();
      node.computed = true;
      this.expect(tt.bracketR);
      if (state.optionalChainMember) {
        node.optional = false;
        return this.finishNode(node, "OptionalMemberExpression");
      }
      return this.finishNode(node, "MemberExpression");
    } 
```    
**Function Call Parsing**: If a parenthesis token is encountered and `noCalls` is false, it indicates a function call. The method parses the arguments of the call using `parseCallExpressionArguments`, handles potential `async` arrow functions, and finishes the call expression node. It also adjusts parser state variables related to `async` and `yield` parsing.

```js 
    else if (!noCalls && this.match(tt.parenL)) {
      const oldMaybeInArrowParameters = this.state.maybeInArrowParameters;
      const oldYieldPos = this.state.yieldPos;
      const oldAwaitPos = this.state.awaitPos;
      this.state.maybeInArrowParameters = true;
      this.state.yieldPos = 0;
      this.state.awaitPos = 0;

      this.next();

      let node = this.startNodeAt(startPos, startLoc);
      node.callee = base;

      const oldCommaAfterSpreadAt = this.state.commaAfterSpreadAt;
      this.state.commaAfterSpreadAt = -1;

      node.arguments = this.parseCallExpressionArguments(
        tt.parenR,
        maybeAsyncArrow,
        base.type === "Import",
        base.type !== "Super",
      );
      if (!state.optionalChainMember) {
        this.finishCallExpression(node);
      } else {
        this.finishOptionalCallExpression(node);
      }

      if (maybeAsyncArrow && this.shouldParseAsyncArrow()) {
        state.stop = true;

        this.checkCommaAfterRestFromSpread();

        node = this.parseAsyncArrowFromCallExpression(
          this.startNodeAt(startPos, startLoc),
          node,
        );
        this.checkYieldAwaitInDefaultParams();
        this.state.yieldPos = oldYieldPos;
        this.state.awaitPos = oldAwaitPos;
      } else {
        this.toReferencedListDeep(node.arguments);

        // We keep the old value if it isn't null, for cases like
        //   (x = async(yield)) => {}
        this.state.yieldPos = oldYieldPos || this.state.yieldPos;
        this.state.awaitPos = oldAwaitPos || this.state.awaitPos;
      }

      this.state.maybeInArrowParameters = oldMaybeInArrowParameters;
      this.state.commaAfterSpreadAt = oldCommaAfterSpreadAt;

      return node;
    }
```
**Tagged Template Expression Parsing**: If a backquote token is matched, it indicates the start of a tagged template expression, which is then parsed accordingly.
```js
    else if (this.match(tt.backQuote)) {
      return this.parseTaggedTemplateExpression(
        startPos,
        startLoc,
        base,
        state,
      );
    } else {
      state.stop = true;
      return base;
    }
  }
```

**Stopping Condition**: If none of the conditions for specific subscript types are met, the method sets the parsing state to stop, indicating that no further subscript parsing should occur for the current expression.

Throughout the parsing process, the method makes extensive use of the parser's `state` and utility methods to accurately construct the abstract syntax tree (AST) nodes representing the parsed expressions. 