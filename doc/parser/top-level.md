## Top Level 

 The class `StatementParser` implements the `Statement` parsing.

The function `parseTopLevel` parses a program. Initializes the parser, reads any number of
statements, and wraps them in a `Program` node.  Optionally takes a
`program` argument.  If present, the statements will be appended
to its `body` instead of creating a new node.

```ts
export default class StatementParser extends ExpressionParser {

  parseTopLevel(file: N.File, program: N.Program): N.File {
    program.sourceType = this.options.sourceType;

    program.interpreter = this.parseInterpreterDirective();

    this.parseBlockBody(program, true, true, tt.eof);

    if (
      this.inModule &&
      !this.options.allowUndeclaredExports &&
      this.scope.undefinedExports.size > 0
    ) {
      for (const [name] of Array.from(this.scope.undefinedExports)) {
        const pos = this.scope.undefinedExports.get(name);
        // $FlowIssue
        this.raise(pos, Errors.ModuleExportUndefined, name);
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
The assignment `program.interpreter = this.parseInterpreterDirective();` parses the 
[InterpreterDirective](https://tc39.es/ecma262/#sec-ecmascript-language-directives-and-prologues) `/#!.*/` if any.

### parseBlockBody

The call `this.parseBlockBody(program, true, true, tt.eof);` parses the body of the program. 
- The first argument is the node to which the body will be attached.
- The first `true` argument `allowDirectives` indicates that directives are allowed in the body. 
- The second `true` argument indicates that the body is top level. 
- The third argument `tt.eof` is the token type tha signals the end of the body.

```js
parseBlockBody(
    node: N.BlockStatementLike,
    allowDirectives: ?boolean, topLevel: boolean, end: TokenType,
    afterBlockParse?: (hasStrictModeDirective: boolean) => void,
  ): void {
    const body = (node.body = []);
    const directives = (node.directives = []);
    this.parseBlockOrModuleBlockBody(
      body,
      allowDirectives ? directives : undefined,
      topLevel,
      end,
      afterBlockParse,
    );
}
```

### parseIfStatement

The structure of all the `parse`Something functions is similar. They start by calling `this.next()` to move to the next token, then they
continue following the grammar rules using the token if needed. Finally, they call `this.finishNode` to create the AST node.
Here it the case of the `parseIfStatement` function that follows the [IfStatement](https://tc39.es/ecma262/#sec-if-statement-static-semantics-early-errors) grammar rule:

```js
  parseIfStatement(node: N.IfStatement): N.IfStatement {
    this.next(); // eat `if`
    node.test = this.parseHeaderExpression();    // parse the test expression
    node.consequent = this.parseStatement("if"); // parse the consequent statement
    node.alternate = this.eat(tt._else) ? this.parseStatement("if") : null; // eat `else` and parse the alternate statement if any
    return this.finishNode(node, "IfStatement");
  }
```

### Methods consuming tokens

We can see the difference between `this.eat(tt._else)` and `this.next()`. The former consumes the token if it is an `else` token, while the latter just moves to the next token without consuming it. There is also `this.expect(tt._else)` that raises an error if the next token is not an `else` token and consumes it if it is:

```js
  expect(type: TokenType, pos?: ?number): void {
    this.eat(type) || this.unexpected(pos, type);
  }
  ```
Another method is `this.match` that returns `true` if the next token is of the given type without consuming it:

```js
  match(type: TokenType): boolean {
    return this.state.type === type;
  }
```
