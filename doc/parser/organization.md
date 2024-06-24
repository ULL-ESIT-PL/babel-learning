## Babel Parser File Hierarchy

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

[**To next section**: top-level.md](top-level.md) [**Up**: ../parser.md](../parser.md)