## File Hierarchy

Currently 

```shell
➜  babel-parser git:(learning) ✗ jq '.version' package.json 
"7.10.2"
```
it has 6 directories, 33 files in the `src`folder:
```
➜  babel-parser git:(learning) ✗ tree src -I node_modules     
src
├── index.js
├── options.js
├── parser
│   ├── base.js
│   ├── comments.js
│   ├── error-message.js
│   ├── error.js
│   ├── expression.js
│   ├── index.js
│   ├── lval.js
│   ├── node.js
│   ├── statement.js
│   └── util.js
├── plugin-utils.js
├── plugins
│   ├── estree.js
│   ├── flow.js
│   ├── jsx
│   │   ├── index.js
│   │   └── xhtml.js
│   ├── placeholders.js
│   ├── typescript
│   │   ├── index.js
│   │   └── scope.js
│   └── v8intrinsic.js
├── tokenizer
│   ├── context.js
│   ├── index.js
│   ├── state.js
│   └── types.js
├── types.js
└── util
    ├── class-scope.js
    ├── identifier.js
    ├── location.js
    ├── production-parameter.js
    ├── scope.js
    ├── scopeflags.js
    └── whitespace.js
```

## Parsing functions

The parsing functions are in the `parser` folder. It is a recursive descent parser. Let us start with the `statememt.js` file. 
The parsing functions usually start with the prefix `parse` followed by the name of the syntactic variable it parses:

```javascript
➜  parser git:(learning) ✗ egrep -i '^\s*parse\w+\(' statement.js | cat -n
     1    parseTopLevel(file: N.File, program: N.Program): N.File {
     2    parseInterpreterDirective(): N.InterpreterDirective | null {
     3    parseStatement(context: ?string, topLevel?: boolean): N.Statement {
     4    parseStatementContent(context: ?string, topLevel: ?boolean): N.Statement {
     5    parseDecorators(allowExport?: boolean): void {
     6    parseDecorator(): N.Decorator {
     7    parseMaybeDecoratorArguments(expr: N.Expression): N.Expression {
     8    parseBreakContinueStatement(
     9    parseDebuggerStatement(node: N.DebuggerStatement): N.DebuggerStatement {
    10    parseHeaderExpression(): N.Expression {
    11    parseDoStatement(node: N.DoWhileStatement): N.DoWhileStatement {
    12    parseForStatement(node: N.Node): N.ForLike {
    13    parseFunctionStatement(
    14    parseIfStatement(node: N.IfStatement): N.IfStatement {
    15    parseReturnStatement(node: N.ReturnStatement): N.ReturnStatement {
    16    parseSwitchStatement(node: N.SwitchStatement): N.SwitchStatement {
    17    parseThrowStatement(node: N.ThrowStatement): N.ThrowStatement {
    18    parseTryStatement(node: N.TryStatement): N.TryStatement {
    19    parseVarStatement(
    20    parseWhileStatement(node: N.WhileStatement): N.WhileStatement {
    21    parseWithStatement(node: N.WithStatement): N.WithStatement {
    22    parseEmptyStatement(node: N.EmptyStatement): N.EmptyStatement {
    23    parseLabeledStatement(
    24    parseExpressionStatement(
    25    parseBlock(
    26    parseBlockBody(
    27    parseBlockOrModuleBlockBody(
    28    parseFor(
    29    parseForIn(
    30    parseVar(
    31    parseVarId(decl: N.VariableDeclarator, kind: "var" | "let" | "const"): void {
    32    parseFunctionId(requireId?: boolean): ?N.Identifier {
    33    parseFunctionParams(node: N.Function, allowModifiers?: boolean): void {
    34    parseClassBody(
    35    parseClassMemberFromModifier(
    36    parseClassMember(
    37    parseClassMemberWithIsStatic(
    38    parseClassPropertyName(member: N.ClassMember): N.Expression | N.Identifier {
    39    parsePostMemberNameModifiers(
    40    parseAccessModifier(): ?N.Accessibility {
    41    parseClassPrivateProperty(
    42    parseClassProperty(node: N.ClassProperty): N.ClassProperty {
    43    parseClassId(
    44    parseClassSuper(node: N.Class): void {
    45    parseExport(node: N.Node): N.AnyExport {
    46    parseExportDefaultExpression(): N.Expression | N.Declaration {
    47    parseExportDeclaration(node: N.ExportNamedDeclaration): ?N.Declaration {
    48    parseExportFrom(node: N.ExportNamedDeclaration, expect?: boolean): void {
    49    parseExportSpecifiers(): Array<N.ExportSpecifier> {
    50    parseImport(node: N.Node): N.AnyImport {
    51    parseImportSource(): N.StringLiteral {
    52    parseImportSpecifierLocal(
    53    parseNamedImportSpecifiers(node: N.ImportDeclaration) {
    54    parseImportSpecifier(node: N.ImportDeclaration): void {
```

## Top Level 

 The class `StatementParser` implements the `Statement` parsing.

The function `parseTopLevel` parses a program. Initializes the parser, reads any number of
statements, and wraps them in a Program node.  Optionally takes a
`program` argument.  If present, the statements will be appended
to its body instead of creating a new node.

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

We can see the difference between `this.eat(tt._else)` and `this.next()`. The former consumes the token if it is an `else` token, while the latter just moves to the next token without consuming it. There is also `this.expect(tt._else)` that raises an error if the next token is not an `else` token and consumes it if it is.