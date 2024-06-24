## The Class StatementParser and the parseTopLevel function


The class `StatementParser` implements the `Statement` parsing.

The function `parseTopLevel` parses a `program`. 
It receives a `file` node and a `program` node as parameters.
The `program` parameter is a `N.Program` node that is going to represent 
the top-level structure of the program. 
It will contain the interpreter directive (if any) and the body AST of the program.
The function returns a `file` node that contains the `program` node, the `comments` 
and optionally the `tokens` of the program. Here is the [definition of the Program node](https://github.com/babel/babel/blob/master/packages/babel-parser/ast/spec.md#programs):

```ts 
Program <: Node {
  type: "Program";
  interpreter: InterpreterDirective | null; // #!/usr/bin/env node
  sourceType: "script" | "module";
  body: [ Statement | ModuleDeclaration ];  // Array of expressions or statements or import or export declarations
  directives: [ Directive ]; // "use strict" directives
}
```
This is the code of the `parseTopLevel` function:
```ts
export default class StatementParser extends ExpressionParser {

  parseTopLevel(file: N.File, program: N.Program): N.File {
    program.sourceType = this.options.sourceType;

    program.interpreter = this.parseInterpreterDirective();

    this.parseBlockBody(program, true, true, tt.eof);

    if ( // check for undefined exports if it is a module
      this.inModule &&
      !this.options.allowUndeclaredExports &&
      this.scope.undefinedExports.size > 0
    ) { // raise an error if there are undefined exports
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

The call `this.parseBlockBody(program, true, true, tt.eof);` parses the body of the program. 
- The first argument is the node to which the body will be attached.
- The first `true` argument `allowDirectives` indicates that directives are allowed in the body. 
  Directives are special instructions or statements that are processed differently by the JavaScript engine compared to regular code,
  like `"use strict"` and `use asm`. 
- The second `true` argument indicates that the body is top level. 
- The third argument `tt.eof` is the token type tha signals the end of the body.

### Checking for undefined exports if it is a module

After parsing the body, we check if we are in a module and if there are `undefined` exports.
This ensures that exports are always defined before exporting them.
This is required according to the spec here: https://www.ecma-international.org/ecma-262/9.0/index.html#sec-module-semantics-static-semantics-early-errors. See [pull request 9589](https://github.com/babel/babel/pull/9589).

The `[name]` part in the expression `for (const [name] of Array.from(this.scope.undefinedExports))` uses array destructuring to extract the first element of each iterable element in `this.scope.undefinedExports`. 

### finishNode and finishNodeAt

The `finishNode` function is responsible for finishing the construction of an AST node, assigning it final properties before it is considered complete. The function accepts a *generic* `node T`, which must be a node type (`NodeType`), along with a `type` that indicates the type of node to end, 

```ts
finishNode<T: NodeType>(node: T, type: string): T {
  return this.finishNodeAt(node, type, this.state.lastTokEnd, this.state.lastTokEndLoc);
}
```

The helper function `finishNodeAt` is responsible for the actual finishing. The function accepts a *generic* `node T`, which must be a node type (`NodeType`), along with 
- a `type` that indicates the type of node to end, 
- a `pos` position that represents the end of the node in the source code, and 
- a `loc` object which contains location information, specifically the end of the node location.

The first step within the function is a safety check for `production` that raises an error if an attempt is made to terminate a node that has already been terminated previously, which is indicated by `node.end > 0`. 

```js
  finishNodeAt<T: NodeType>(node: T, type: string, pos: number, loc: Position, ): T {
    if (process.env.NODE_ENV !== "production" && node.end > 0) {
      throw new Error(
        "Do not call finishNode*() twice on the same node." +
          " Instead use resetEndLocation() or change type directly.",
      );
    }
    node.type = type;
    node.end = pos;
    node.loc.end = loc;
    if (this.options.ranges) node.range[1] = pos;
    this.processComment(node);
    return node;
  }
  ```


### parseBlockBody

Here is the `parseBlockBody` function that is called by `parseTopLevel`:

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
