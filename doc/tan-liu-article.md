# Reading "Creating custom JavaScript syntax with Babel"

Tan Li Hau (陈立豪) has written one of the best introductions to Babel I ever seen. He is also a prolific youtuber.
I strongly recommend you to follow his work and attend his lessons. These are my notes for his article "Creating custom JavaScript syntax with Babel" (September 25, 2019) available at https://lihautan.com/creating-custom-javascript-syntax-with-babel


## The Goal

> Let me show you what we will achieve at the end of this article.
> We are going to create a curry function syntax `@@.` The syntax is like the generator function, except you place `@@` instead of `*` in between the function keyword and the function name, eg `function @@ name(arg1, arg2)`.

> ```js
> // '@@' makes the function `foo` curried
> function @@ foo(a, b, c) {
>   return a + b + c;
> }
> console.log(foo(1, 2)(3)); // 6
> ```

> In this example, you can have partial application with the function `foo`. Calling `foo` with the number of parameters less than the arguments required will return a new function of the remaining arguments:

> ```js
> foo(1, 2, 3); // 6
> 
> const bar = foo(1, 2); // (n) => 1 + 2 + n
> bar(3); // 6
> ```

## Installing Tan Li Hau Babel fork

### Machine Configuration

```sh
➜  babel-learning git:(main) sw_vers        
ProductName:            macOS
ProductVersion:         14.5
BuildVersion:           23F79
➜  babel-learning git:(main) uname          
Darwin
➜  babel-learning git:(main) node --version
v21.2.0
➜  babel-learning git:(main) nvm --version
0.35.3
➜  babel-learning git:(main) npm --version
10.2.3
```

### Branch `learning`

You can find the version modified in the branch `learning` of the repository [ULL-ESIT-PL/babel-tanhauhau](https://github.com/ULL-ESIT-PL/babel-tanhauhau/tree/learning)

```sh
➜  babel-tanhauhau git:(learning) ✗ git diff --name-only master 
.vscode/settings.json
packages/babel-parser/src/parser/expression.js
packages/babel-parser/src/parser/statement.js
packages/babel-parser/src/tokenizer/index.js
packages/babel-parser/src/tokenizer/types.js
packages/babel-parser/test/curry-function.cjs
packages/babel-parser/test/curry-function.js
```

### Forking

I started forking [Tan Li Hau babel fork](https://github.com/tanhauhau/babel) of the repo instead of the main Babel repo and then I clone my fork
at https://github.com/ULL-ESIT-PL/babel-tanhauhau:

### Cloning the repo

```sh
gh repo clone ULL-ESIT-PL/babel-tanhauhau
```

### yarn and gulp

Then I realized that I have to install yarn and gulp to build the project.

```sh
➜  babel-tanhauhau git:(master) pwd -P
/Users/casianorodriguezleon/campus-virtual/2122/learning/compiler-learning/babel-tanhauhau
babel-tanhauhau git:(master) npm i -g yarn 
babel-tanhauhau git:(master) npm i -g gulp
```

### make bootstrap

then I proceed to make the bootstrap:

```sh
➜  babel-tanhauhau git:(master) make bootstrap
```
I was using node v21.2.0 and nvm 0.35.3.
There were errors with node-gyp. 
I found that node-gyp is a cross-platform command-line tool written in Node.js for compiling native addon modules for Node.js. 
It contains a vendored copy of the `gyp-next` project that was previously used by the 
Chromium team and extended to support the development of Node.js native addons. Native modules refers to the modules that are written outside of JavaScript, modules that are written in C++ (C++ addons) for example and embedded into JavaScript using things like N-API (Node-API).

These were the errors:

```sh
gyp info find Python using Python version 3.11.4 found at \"/Users/casianorodriguezleon/.pyenv/versions/3.11.4/bin/python\"
(node:29944) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
gyp ERR! UNCAUGHT EXCEPTION 
gyp ERR! stack TypeError: Cannot assign to read only property 'cflags' of object '#<Object>'
gyp ERR! stack     at createConfigFile (/Users/casianorodriguezleon/campus-virtual/2122/learning/compiler-learning/babel-tanhauhau/node_modules/node-gyp/lib/configure.js:118:21)
gyp ERR! stack     at /Users/casianorodriguezleon/campus-virtual/2122/learning/compiler-learning/babel-tanhauhau/node_modules/node-gyp/lib/configure.js:85:9
gyp ERR! stack     at /Users/casianorodriguezleon/campus-virtual/2122/learning/compiler-learning/babel-tanhauhau/node_modules/mkdirp/index.js:30:20
gyp ERR! stack     at FSReqCallback.oncomplete (node:fs:189:23)
gyp ERR! System Darwin 23.5.0
gyp ERR! command \"/Users/casianorodriguezleon/.nvm/versions/node/v21.2.0/bin/node\" \"/Users/casianorodriguezleon/campus-virtual/2122/learning/compiler-learning/babel-tanhauhau/node_modules/node-gyp/bin/node-gyp.js\" \"configure\" \"--fallback-to-build\" \"--module=/Users/casianorodriguezleon/campus-virtual/2122/learning/compiler-learning/babel-tanhauhau/node_modules/fsevents/lib/binding/Release/node-v120-darwin-x64/fse.node\" \"--module_name=fse\" \"--module_path=/Users/casianorodriguezleon/campus-virtual/2122/learning/compiler-learning/babel-tanhauhau/node_modules/fsevents/lib/binding/Release/node-v120-darwin-x64\" \"--napi_version=9\" \"--node_abi_napi=napi\" \"--napi_build_version=0\" \"--node_napi_label=node-v120\"
gyp ERR! cwd /Users/casianorodriguezleon/campus-virtual/2122/learning/compiler-learning/babel-tanhauhau/node_modules/fsevents
gyp ERR! node -v v21.2.0
gyp ERR! node-gyp -v v5.0.5
gyp ERR! This is a bug in `node-gyp`.
gyp ERR! Try to update node-gyp and file an Issue if it does not help:
gyp ERR!     <https://github.com/nodejs/node-gyp/issues>
node-pre-gyp ERR! build error 
node-pre-gyp ERR! stack Error: Failed to execute '/Users/casianorodriguezleon/.nvm/versions/node/v21.2.0/bin/node /Users/casianorodriguezleon/campus-virtual/2122/learning/compiler-learning/babel-tanhauhau/node_modules/node-gyp/bin/node-gyp.js configure --fallback-to-build --module=/Users/casianorodriguezleon/campus-virtual/2122/learning/compiler-learning/babel-tanhauhau/node_modules/fsevents/lib/binding/Release/node-v120-darwin-x64/fse.node --module_name=fse --module_path=/Users/casianorodriguezleon/campus-virtual/2122/learning/compiler-learning/babel-tanhauhau/node_modules/fsevents/lib/binding/Release/node-v120-darwin-x64 --napi_version=9 --node_abi_napi=napi --napi_build_version=0 --node_napi_label=node-v120' (7)
node-pre-gyp ERR! stack     at ChildProcess.<anonymous> (/Users/casianorodriguezleon/campus-virtual/2122/learning/compiler-learning/babel-tanhauhau/node_modules/fsevents/node_modules/node-pre-gyp/lib/util/compile.js:83:29)
node-pre-gyp ERR! stack     at ChildProcess.emit (node:events:519:28)
node-pre-gyp ERR! stack     at maybeClose (node:internal/child_process:1105:16)
node-pre-gyp ERR! stack     at ChildProcess._handle.onexit (node:internal/child_process:305:5)
node-pre-gyp ERR! System Darwin 23.5.0
node-pre-gyp ERR! command \"/Users/casianorodriguezleon/.nvm/versions/node/v21.2.0/bin/node\" \"/Users/casianorodriguezleon/campus-virtual/2122/learning/compiler-learning/babel-tanhauhau/node_modules/fsevents/node_modules/node-pre-gyp/bin/node-pre-gyp\" \"install\" \"--fallback-to-build\"
node-pre-gyp ERR! cwd /Users/casianorodriguezleon/campus-virtual/2122/learning/compiler-learning/babel-tanhauhau/node_modules/fsevents
node-pre-gyp ERR! node -v v21.2.0
node-pre-gyp ERR! node-pre-gyp -v v0.12.0
node-pre-gyp ERR! not ok 
Failed to execute '/Users/casianorodriguezleon/.nvm/versions/node/v21.2.0/bin/node /Users/casianorodriguezleon/campus-virtual/2122/learning/compiler-learning/babel-tanhauhau/node_modules/node-gyp/bin/node-gyp.js configure --fallback-to-build --module=/Users/casianorodriguezleon/campus-virtual/2122/learning/compiler-learning/babel-tanhauhau/node_modules/fsevents/lib/binding/Release/node-v120-darwin-x64/fse.node --module_name=fse --module_path=/Users/casianorodriguezleon/campus-virtual/2122/learning/compiler-learning/babel-tanhauhau/node_modules/fsevents/lib/binding/Release/node-v120-darwin-x64 --napi_version=9 --node_abi_napi=napi --napi_build_version=0 --node_napi_label=node-v120' (7)"
✨  Done in 29.07s.
```

thus I tried again, this time with node v20.

```sh
➜  babel-tanhauhau git:(master) nvm use v20
Now using node v20.5.0 (npm v9.8.0)
➜  babel-tanhauhau git:(master) make bootstrap
```

It took a while to build the project, but there were no errors:

```sh
...
[12:33:49] Skipped minification of 'babel-tanhauhau/packages/babel-standalone/babel.js' because not publishing
[12:33:49] Finished 'build-babel-standalone' after 29 s
```

### make build

Thus I proceed to the `make build`:

```sh
babel-tanhauhau git:(master) make build
...
[12:37:46] Skipped minification of 'babel-tanhauhau/packages/babel-standalone/babel.js' because not publishing
[12:37:46] Finished 'build-babel-standalone' after 18 s
```

### make test

I then runned the tests. 

```sh
  babel-tanhauhau git:(master) ✗ make test
BABEL_ENV=test yarn --silent eslint scripts packages codemods eslint '*.js' --format=codeframe
```

Most of them passed but there were some errors. For instance:

```sh
 FAIL  packages/babel-plugin-transform-dotall-regex/test/index.js
  ● babel-plugin-transform-dotall-regex/dotall regex › with unicode property escape
```

I will try to find out what is the reason later.

## The Babel monorepo

[Babel uses a monorepo structure](https://github.com/babel/babel/blob/main/doc/design/monorepo.md), all the packages, eg: 
`@babel/core`, 
`@babel/parser`, 
`@babel/plugin-transform-react-jsx`, 
etc 
are in the `packages/` folder:

```
➜  babel-tanhauhau git:(master) tree -aL 1
.
├── Gulpfile.js
├── Makefile
├── README.md
├── babel.config.js
├── codemods
├── doc
├── jest.config.js
├── lerna.json
├── lib
├── node_modules
├── package.json
└── packages
       └──
          ├── babel-cli
          ├── babel-generator
          ├── babel-helper-...
          ├── babel-node
          ├── babel-parser
          ├── babel-plugin-...
          ├── babel-plugin-proposal-async-generator-functions
          ├── babel-plugin-syntax-...
          ├── babel-plugin-syntax-jsx
          ├── babel-plugin-syntax-typescript
          ├── babel-plugin-transform-...
          ├── babel-polyfill
          ├── babel-preset-env
          ├── babel-preset-flow
          ├── babel-preset-react
          ├── babel-preset-typescript
          ├── babel-register
          ├── babel-runtime...
          ├── babel-standalone
          ├── babel-template
          ├── babel-traverse
          └── babel-types
          ├── scripts
          └── test
```

## Our custom babel parser

### Tree structure

The folder we are going to work on is `packages/babel-parser/`:

```
➜  babel-tanhauhau git:(master) cd packages/babel-parser 
➜  babel-parser git:(master) tree -I node_modules -aL 2
.
├── AUTHORS
├── CHANGELOG.md
├── LICENSE
├── README.md
├── ast
│   ├── flow.md
│   ├── jsx.md
│   └── spec.md
├── bin
│   └── babel-parser.js
├── lib
│   └── index.js
├── package.json
├── src
│   ├── index.js
│   ├── options.js
│   ├── parser
│   │   ├── base.js
│   │   ├── comments.js
│   │   ├── error-message.js
│   │   ├── error.js
│   │   ├── expression.js
│   │   ├── index.js
│   │   ├── lval.js
│   │   ├── node.js
│   │   ├── statement.js
│   │   └── util.js
│   ├── plugin-utils.js
│   ├── plugins
│   │   ├── estree.js
│   │   ├── flow.js
│   │   ├── jsx
│   │   ├── placeholders.js
│   │   ├── typescript
│   │   └── v8intrinsic.js
│   ├── tokenizer
│   │   ├── context.js
│   │   ├── index.js
│   │   ├── state.js
│   │   └── types.js
│   ├── types.js
│   └── util
│       ├── class-scope.js
│       ├── identifier.js
│       ├── location.js
│       ├── production-parameter.js
│       ├── scope.js
│       ├── scopeflags.js
│       └── whitespace.js
├── test
│   ├── estree-throws.js
│   ├── expressions
│   ├── expressions.js
│   ├── fixtures
│   ├── helpers
│   ├── index.js
│   ├── plugin-options.js
│   └── unit
└── typings
    └── babel-parser.d.ts

14 directories, 19 files
```

> We've talked about tokenization and parsing, now it's clear where to find the code for each process. 
> `plugins/` folder contains plugins that extend the base parser and add custom syntaxes, 
> such as `jsx` and `flow`.

... and `typescript`.

### A test for the goal 

> Let's do a Test-driven development (TDD). 
> I find it easier to define the test case then slowly work our way to "fix" it. 
> It is especially true in an unfamiliar codebase, 
> TDD allows you to "easily" point out code places you need to change.

I copy the test file `packages/babel-parser/test/curry-function.js` from the article:

```js
 ➜  babel-parser git:(master) ✗ cat test/curry-function.js 
import { parse } from '../lib';

function getParser(code) {
  return () => parse(code, { sourceType: 'module' });
}

describe('curry function syntax', function() {
  it('should parse', function() {
    expect(getParser(`function @@ foo() {}`)()).toMatchSnapshot();
  });
});
```

The testing seems to be in Jest: `toMatchSnapshot` is a [Jest function](https://jestjs.io/docs/snapshot-testing).
See for instance 

1. The script [ULL-ESIT-PL/babel-tanhauhau//scripts/test.sh](https://github.com/ULL-ESIT-PL/babel-tanhauhau/blob/master/scripts/test.sh)
2. [ULL-ESIT-PL/babel-tanhauhau//packages/babel-parser/test/unit/tokenizer/types.js](https://github.com/ULL-ESIT-PL/babel-tanhauhau/blob/master/packages/babel-parser/test/unit/tokenizer/types.js)

To run the tests for a package we can use the `make test-only` command specifying 
- The package with the `TEST_ONLY` environment variable and 
- To run only those tests whose description matches the `TEST_GREP` environment variable

```sh
➜  babel-tanhauhau git:(master) ✗ TEST_ONLY=babel-parser TEST_GREP="token types" make test-only
BABEL_ENV=test ./scripts/test.sh
 PASS  packages/babel-parser/test/unit/tokenizer/types.js

Test Suites: 7 skipped, 1 passed, 1 of 8 total
Tests:       5253 skipped, 3 passed, 5256 total
Snapshots:   0 total
Time:        7.01s
Ran all test suites matching /(packages|codemods|eslint)\/.*babel-parser.*\/test/i with tests matching "token types".
/Applications/Xcode.app/Contents/Developer/usr/bin/make test-clean
rm -rf  packages/*/test/tmp
rm -rf  packages/*/test-fixtures.json
rm -rf  codemods/*/test/tmp
rm -rf  codemods/*/test-fixtures.json
rm -rf  eslint/*/test/tmp
rm -rf  eslint/*/test-fixtures.json
```

### parse, parseExpression 

The `index.js` file in the `lib` folder exports an object with 

- `parse`, 
- `parseExpression` and 
- `tokTypes` properties


```js
➜  babel-tanhauhau git:(master) ✗ cd packages/babel-parser 
➜  babel-parser git:(master) ✗ node
> B = require("./lib")
{
  parse: [Function: parse],
  parseExpression: [Function: parseExpression],
  tokTypes: [Getter]
}
```

We can get the AST for the code `1` with `B.parseExpression("1")`. The AST spec is at [packages/babel-parser/ast/spec.md](https://github.com/babel/babel/blob/main/packages/babel-parser/ast/spec.md):

```js
> B.parseExpression("1")
Node {
  type: 'NumericLiteral',
  start: 0,
  end: 1,
  loc: SourceLocation {
    start: Position { line: 1, column: 0 },
    end: Position { line: 1, column: 1 }
  },
  extra: { rawValue: 1, raw: '1' },
  value: 1,
  comments: [],
  errors: []
}
```

### tokTypes

The `tokTypes` property is a getter that returns an object with the token types:

```
> B.tokTypes.num
TokenType {
  label: 'num',
  keyword: undefined,
  beforeExpr: false,
  startsExpr: true,
  rightAssociative: false,
  isLoop: false,
  isAssign: false,
  prefix: false,
  postfix: false,
  binop: null,
  updateContext: null
}
> B.tokTypes.exponent
TokenType {
  label: '**',
  keyword: undefined,
  beforeExpr: true,
  startsExpr: false,
  rightAssociative: true,
  isLoop: false,
  isAssign: false,
  prefix: false,
  postfix: false,
  binop: 11,
  updateContext: null
}
> B.tokTypes.star
TokenType {
  label: '*',
  keyword: undefined,
  beforeExpr: true,
  startsExpr: false,
  rightAssociative: false,
  isLoop: false,
  isAssign: false,
  prefix: false,
  postfix: false,
  binop: 10,
  updateContext: [Function (anonymous)]
}
> B.tokTypes.plusMin
TokenType {
  label: '+/-',
  keyword: undefined,
  beforeExpr: true,
  startsExpr: true,
  rightAssociative: false,
  isLoop: false,
  isAssign: false,
  prefix: true,
  postfix: false,
  binop: 9,
  updateContext: null
}
> B.tokTypes.incDec
TokenType {
  label: '++/--',
  keyword: undefined,
  beforeExpr: false,
  startsExpr: true,
  rightAssociative: false,
  isLoop: false,
  isAssign: false,
  prefix: true,
  postfix: true,
  binop: null,
  updateContext: [Function (anonymous)]
}
```

### TEST_ONLY=babel-parser TEST_GREP="curry function" make test-only


We run `make test-only` from the root of the project:

```sh
➜  babel-parser git:(master) ✗ TEST_ONLY=babel-parser TEST_GREP="curry function" make test-only
make: *** No rule to make target `test-only'.  Stop.
➜  babel-parser git:(master) ✗ cd ..
➜  packages git:(master) ✗ cd ..
➜  babel-tanhauhau git:(master) ✗ TEST_ONLY=babel-parser TEST_GREP="curry function" make test-only
BABEL_ENV=test ./scripts/test.sh
 FAIL  packages/babel-parser/test/curry-function.js
  ● curry function syntax › should parse

    SyntaxError: Unexpected token (1:9)

      752 | 
      753 |   _raise(errorContext, message) {
    > 754 |     const err = new SyntaxError(message);
          |                 ^
      755 |     Object.assign(err, errorContext);
      756 | 
      757 |     if (this.options.errorRecovery) {

      at Parser._raise (packages/babel-parser/lib/index.js:754:17)
      at Parser.raiseWithData (packages/babel-parser/lib/index.js:747:17)
      at Parser.raise (packages/babel-parser/lib/index.js:741:17)
      at Parser.unexpected (packages/babel-parser/lib/index.js:8844:16)
      at Parser.parseIdentifierName (packages/babel-parser/lib/index.js:10863:18)
      at Parser.parseIdentifier (packages/babel-parser/lib/index.js:10840:23)
      at Parser.parseFunctionId (packages/babel-parser/lib/index.js:11927:55)
      at Parser.parseFunction (packages/babel-parser/lib/index.js:11893:22)
      at Parser.parseFunctionStatement (packages/babel-parser/lib/index.js:11542:17)
      at Parser.parseStatementContent (packages/babel-parser/lib/index.js:11234:21)


Test Suites: 1 failed, 7 skipped, 1 of 8 total
Tests:       1 failed, 5255 skipped, 5256 total
Snapshots:   0 total
Time:        6.598s, estimated 11s
Ran all test suites matching /(packages|codemods|eslint)\/.*babel-parser.*\/test/i with tests matching "curry function".
make: *** [test-only] Error 1
```
The environment variables `TEST_ONLY=babel-parser TEST_GREP="curry function"`
set the test to run only the `babel-parser` tests and to grep for the string `curry function` in the test description.

### BABEL_ENV=test npx jest -u packages/babel-parser/test/curry-function.js

The same thing happens when I run the test using `jest`:

```sh
➜  babel-tanhauhau git:(master) ✗ BABEL_ENV=test npx jest -u packages/babel-parser/test/curry-function.js

 FAIL  packages/babel-parser/test/curry-function.js
  curry function syntax
    ✕ should parse (6ms)

  ● curry function syntax › should parse

    SyntaxError: Unexpected token (1:9)

      752 | 
      753 |   _raise(errorContext, message) {
    > 754 |     const err = new SyntaxError(message);
          |                 ^
      755 |     Object.assign(err, errorContext);
      756 | 
      757 |     if (this.options.errorRecovery) {

      at Parser._raise (packages/babel-parser/lib/index.js:754:17)
      at Parser.raiseWithData (packages/babel-parser/lib/index.js:747:17)
      at Parser.raise (packages/babel-parser/lib/index.js:741:17)
      at Parser.unexpected (packages/babel-parser/lib/index.js:8844:16)
      at Parser.parseIdentifierName (packages/babel-parser/lib/index.js:10863:18)
      at Parser.parseIdentifier (packages/babel-parser/lib/index.js:10840:23)
      at Parser.parseFunctionId (packages/babel-parser/lib/index.js:11927:55)
      at Parser.parseFunction (packages/babel-parser/lib/index.js:11893:22)
      at Parser.parseFunctionStatement (packages/babel-parser/lib/index.js:11542:17)
      at Parser.parseStatementContent (packages/babel-parser/lib/index.js:11234:21)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        1.273s
Ran all test suites matching /packages\/babel-parser\/test\/curry-function.js/i.
```

The environment variable `BABEL_ENV=test` is used to set the environment to test.

> Our parser found 2 seemingly innocent `@` tokens at a place where they shouldn't be present.

### make watch

> How do I know that? Let's start the watch mode, `make watch`, wear our detective cap 🕵️‍ and start digging!

> You can access the built files for individual packages from `packages/<package-name>/lib`.


In the `Makefile` we find this task `watch`:

```Makefile
watch: build-no-bundle
	BABEL_ENV=development $(YARN) gulp watch
```
and in the `Gulpfile.js` we find the `watch` task:

```js
gulp.task(
  "watch",
  gulp.series("build-no-bundle", function watch() {
    gulp.watch(defaultSourcesGlob, gulp.task("build-no-bundle"));
  })
);
```

The target `make watch` allow us to have Babel build itself and incrementally build files on change. This way
we can see the changes we are going to do in the tokenizer and parser withour having to re-build the whole project.

When I do `make watch` I see the following output:

```sh
➜  babel-tanhauhau git:(master) ✗ make watch
rm -rf  packages/*/test/tmp
rm -rf  packages/*/test-fixtures.json
rm -rf  codemods/*/test/tmp
rm -rf  codemods/*/test-fixtures.json
rm -rf  eslint/*/test/tmp
rm -rf  eslint/*/test-fixtures.json
rm -f .npmrc
rm -rf packages/babel-polyfill/browser*
rm -rf packages/babel-polyfill/dist
rm -rf coverage
rm -rf packages/*/npm-debug*
rm -rf  packages/*/lib
rm -rf  codemods/*/lib
rm -rf  eslint/*/lib
BABEL_ENV=development yarn --silent gulp build-no-bundle
[16:25:24] Using gulpfile ~/campus-virtual/2122/learning/compiler-learning/babel-tanhauhau/gulpfile.js
[16:25:24] Starting 'build-no-bundle'...
[16:25:25] Compiling 'codemods/babel-plugin-codemod-object-assign-to-object-spread/src/index.js'...
[16:25:25] Compiling 'codemods/babel-plugin-codemod-optional-catch-binding/src/index.js'...
@babel/preset-env: `DEBUG` option

Using targets:
{
  "node": "21.2"
}

Using modules transform: false

Using plugins:
  syntax-numeric-separator { "node":"21.2" }
  proposal-class-properties { "node":"21.2" }
  proposal-private-methods { "node":"21.2" }
  syntax-nullish-coalescing-operator { "node":"21.2" }
  syntax-optional-chaining { "node":"21.2" }
  syntax-json-strings { "node":"21.2" }
  syntax-optional-catch-binding { "node":"21.2" }
  syntax-async-generators { "node":"21.2" }
  syntax-object-rest-spread { "node":"21.2" }
  syntax-dynamic-import { "node":"21.2" }

Using polyfills: No polyfills were added, since the `useBuiltIns` option was not set.
[16:25:25] Compiling 'eslint/babel-eslint-parser/src/analyze-scope.js'...
... # hundreds of lines of "Compiling" messages
[16:25:32] Compiling 'packages/babel-types/src/validators/react/isCompatTag.js'...
[16:25:32] Compiling 'packages/babel-types/src/validators/react/isReactComponent.js'...
[16:25:32] Finished 'build-no-bundle' after 7.76 s
# Ensure that build artifacts for types are created during local
# development too.
/Applications/Xcode.app/Contents/Developer/usr/bin/make generate-type-helpers
yarn --silent node packages/babel-types/scripts/generateTypeHelpers.js
Generating @babel/types dynamic functions
  ✔ Generated builders
  ✔ Generated validators
  ✔ Generated asserts
  ✔ Generated constants
/Applications/Xcode.app/Contents/Developer/usr/bin/make build-typings
yarn --silent node packages/babel-types/scripts/generators/flow.js > packages/babel-types/lib/index.js.flow
yarn --silent node packages/babel-types/scripts/generators/typescript.js > packages/babel-types/lib/index.d.ts
BABEL_ENV=development yarn --silent gulp watch
[16:25:35] Using gulpfile ~/campus-virtual/2122/learning/compiler-learning/babel-tanhauhau/gulpfile.js
[16:25:35] Starting 'watch'...
[16:25:35] Starting 'build-no-bundle'...
[16:25:35] Compiling 'packages/babel-types/src/asserts/generated/index.js'...
@babel/preset-env: `DEBUG` option

Using targets:
{
  "node": "21.2"
}

Using modules transform: false

Using plugins:
  syntax-numeric-separator { "node":"21.2" }
  proposal-class-properties { "node":"21.2" }
  proposal-private-methods { "node":"21.2" }
  syntax-nullish-coalescing-operator { "node":"21.2" }
  syntax-optional-chaining { "node":"21.2" }
  syntax-json-strings { "node":"21.2" }
  syntax-optional-catch-binding { "node":"21.2" }
  syntax-async-generators { "node":"21.2" }
  syntax-object-rest-spread { "node":"21.2" }
  syntax-dynamic-import { "node":"21.2" }

Using polyfills: No polyfills were added, since the `useBuiltIns` option was not set.
[16:25:36] Compiling 'packages/babel-types/src/builders/generated/index.js'...
[16:25:36] Compiling 'packages/babel-types/src/constants/generated/index.js'...
[16:25:36] Compiling 'packages/babel-types/src/validators/generated/index.js'...
[16:25:36] Finished 'build-no-bundle' after 1.19 s
[16:25:36] Starting 'watch'...
```
And it hangs here waiting for any of the Babel source files to change and rebuilding the compiler 
when need it.

### Running the tests on watching mode

Now we run the test again:

```
➜  babel-tanhauhau git:(master) ✗ TEST_ONLY=babel-parser TEST_GREP="curry function" make test-only
BABEL_ENV=test ./scripts/test.sh
 FAIL  packages/babel-parser/test/curry-function.js
  ● curry function syntax › should parse

    SyntaxError: Unexpected token (1:9)

      41 | 
      42 |   _raise(errorContext, message) {
    > 43 |     const err = new SyntaxError(message);
         |                 ^
      44 |     Object.assign(err, errorContext);
      45 | 
      46 |     if (this.options.errorRecovery) {

      at Parser._raise (packages/babel-parser/lib/parser/error.js:43:17)
      at Parser.raiseWithData (packages/babel-parser/lib/parser/error.js:36:17)
      at Parser.raise (packages/babel-parser/lib/parser/error.js:30:17)
      at Parser.unexpected (packages/babel-parser/lib/parser/util.js:109:16)
      at Parser.parseIdentifierName (packages/babel-parser/lib/parser/expression.js:1515:18) <--- here
      at Parser.parseIdentifier (packages/babel-parser/lib/parser/expression.js:1492:23)
      at Parser.parseFunctionId (packages/babel-parser/lib/parser/statement.js:847:63)
      at Parser.parseFunction (packages/babel-parser/lib/parser/statement.js:813:22)
      at Parser.parseFunctionStatement (packages/babel-parser/lib/parser/statement.js:462:17)
      at Parser.parseStatementContent (packages/babel-parser/lib/parser/statement.js:154:21)


Test Suites: 1 failed, 7 skipped, 1 of 8 total
Tests:       1 failed, 5255 skipped, 5256 total
Snapshots:   0 total
Time:        8.269s, estimated 11s
Ran all test suites matching /(packages|codemods|eslint)\/.*babel-parser.*\/test/i with tests matching "curry function".
make: *** [test-only] Error 1
```

> Tracing the stack trace, led us to `packages/babel-parser/src/parser/expression.js` where it throws `this.unexpected()`.

Correct! See the message `... at Parser.parseIdentifierName (packages/babel-parser/lib/parser/expression.js:1515:18)` in the stack trace above.

> Let us add some `console.log`:

### Adding console.log to see the parser 

Tan Li proposes to go to file `packages/babel-parser/src/parser/expression.js` and add some `console.log` to see what is happening.

```js
parseIdentifierName(pos: number, liberal?: boolean): string {
  if (this.match(tt.name)) {
    // ...
  } else {
    console.log(this.state.type); // current token
    console.log(this.lookahead().type); // next token
    throw this.unexpected();
  }
}
```

> How do I know `this.state.type` and `this.lookahead().type` will give me the current and the next token?

> Well, I'll explained them [later](https://lihautan.com/creating-custom-javascript-syntax-with-babel#thiseat-thismatch-thisnext).
>
> Let's recap what we've done so far before we move on:

> 1. We've written a test case for babel-parser
> 2. We ran `make test-only` to run the test case
> 3. We've started the **watch mode** via `make watch`
> 4. We've learned about **parser state**, and console out the current token type, `this.state.type`

Here is the full code of the previous version of the function:
  
```ts
  parseIdentifierName(pos: number, liberal?: boolean): string {
    let name: string;

    if (this.match(tt.name)) {
      name = this.state.value;
    } else if (this.state.type.keyword) {
      name = this.state.type.keyword;

      // `class` and `function` keywords push function-type token context into this.context.
      // But there is no chance to pop the context if the keyword is consumed
      // as an identifier such as a property name.
      const context = this.state.context;
      if (
        (name === "class" || name === "function") &&
        context[context.length - 1].token === "function"
      ) {
        context.pop();
      }
    } else {
      throw this.unexpected();
    }

    if (liberal) {
      // If the current token is not used as a keyword, set its type to "tt.name".
      // This will prevent this.next() from throwing about unexpected escapes.
      this.state.type = tt.name;
    } else {
      this.checkReservedWord(
        name,
        this.state.start,
        !!this.state.type.keyword,
        false,
      );
    }

    this.next();

    return name;
  }
```

Next to the function I've got several warnings in VSCode stating that 
["type annotations can only be used in typescript"](https://stackoverflow.com/questions/48859169/error-types-can-only-be-used-in-a-ts-file-visual-studio-code-using-ts-che). The solution adopted is described
in section [doc/vscode-typescript-config.md](/doc/vscode-typescript-config.md).


So I included the code above in the function `parseIdentifierName` in the file `packages/babel-parser/src/parser/expression.js`
and watched the `make watch` terminal sending the warnings about compiling the files that I have changed:

```
Using polyfills: No polyfills were added, since the `useBuiltIns` option was not set.
[16:25:36] Compiling 'packages/babel-types/src/builders/generated/index.js'...
[16:25:36] Compiling 'packages/babel-types/src/constants/generated/index.js'...
[16:25:36] Compiling 'packages/babel-types/src/validators/generated/index.js'...
[16:25:36] Finished 'build-no-bundle' after 1.19 s
[16:25:36] Starting 'watch'...
[19:40:45] Starting 'build-no-bundle'...
[19:40:45] Compiling 'packages/babel-parser/src/parser/expression.js'...
[19:40:46] Finished 'build-no-bundle' after 683 ms
[19:40:46] Starting 'build-no-bundle'...
[19:40:46] Finished 'build-no-bundle' after 187 ms
[19:41:08] Starting 'build-no-bundle'...
[19:41:08] Compiling 'packages/babel-parser/src/parser/expression.js'...
[19:41:08] Finished 'build-no-bundle' after 474 ms
```
Now, when I run the tests again, I get the following output:

```sh
➜  babel-tanhauhau git:(master) ✗ TEST_ONLY=babel-parser TEST_GREP="curry function" make test-only
BABEL_ENV=test ./scripts/test.sh
 FAIL  packages/babel-parser/test/curry-function.js
  ● Console

    console.error packages/babel-parser/lib/parser/expression.js:1515
      TokenType {
        label: '@',
        keyword: undefined,
        beforeExpr: false,
        startsExpr: false,
        rightAssociative: false,
        isLoop: false,
        isAssign: false,
        prefix: false,
        postfix: false,
        binop: null,
        updateContext: null
      }
    console.error packages/babel-parser/lib/parser/expression.js:1516
      TokenType {
        label: '@',
        keyword: undefined,
        beforeExpr: false,
        startsExpr: false,
        rightAssociative: false,
        isLoop: false,
        isAssign: false,
        prefix: false,
        postfix: false,
        binop: null,
        updateContext: null
      }

  ● curry function syntax › should parse

    SyntaxError: Unexpected token (1:9)
...
```

> As you can see, both tokens are `@` token:

```js
TokenType {
  label: '@',
  // ...
}
```

We can also [make a standalone execution of the Babel parser](/doc/standalone-parser-execution.md)

### A new token: `@@`

> Here's what we are going to do next:

> If there's 2 consecutive `@`, it should not be separate tokens, it should be a `@@` token, the new token we just defined for our curry function

> Let's first look at where a token type is defined: [packages/babel-parser/src/tokenizer/types.js](https://github.com/ULL-ESIT-PL/babel-tanhauhau/blob/master/packages/babel-parser/src/tokenizer/types.js#L86-L203).

> Here you see a list of tokens, so let's add our new token definition in as well:
>
> ```js
> export const types: { [name: string]: TokenType } = {
>   num: new TokenType("num", { startsExpr }),
>   bigint: new TokenType("bigint", { startsExpr }),
>   regexp: new TokenType("regexp", { startsExpr }),
>   string: new TokenType("string", { startsExpr }),
>   name: new TokenType("name", { startsExpr }),
>   eof: new TokenType("eof"),
>   ...
>   at: new TokenType("@"),
>   atat: new TokenType('@@'),
>   hash: new TokenType("#", { startsExpr }),
>   ...
> };
> ```

By calling the [constructor](https://github.com/ULL-ESIT-PL/babel-tanhauhau/blob/master/packages/babel-parser/src/tokenizer/types.js#L45-L71) we are setting the `label` property of the token `atat` to `@@`

> Next, let's find out where the token gets created during tokenization. A quick search for `tt.at` within `babel-parser/src/tokenizer` lead us to [packages/babel-parser/src/tokenizer/index.js](https://github.com/ULL-ESIT-PL/babel-tanhauhau/blob/master/packages/babel-parser/src/tokenizer/index.js#L891-L894)

Here is the general structure of the code of the `getTokenFromCode` function inside 
the `babel-parser/src/tokenizer/index.js` file:

```js
...
import * as charCodes from "charcodes";
import { types as tt, keywords as keywordTypes, type TokenType } from "./types";
...

export default class Tokenizer extends ParserErrors {
...
 getTokenFromCode(code: number): void {
    switch (code) {
      // The interpretation of a dot depends on whether it is followed
      // by a digit or another two dots.

      case charCodes.dot:
        this.readToken_dot();
        return;
      ...
      case charCodes.atSign:
        ++this.state.pos;
        this.finishToken(tt.at);
        return;

      case charCodes.numberSign:
        this.readToken_numberSign();
        return;
      ...
      default:
        if (isIdentifierStart(code)) {
          this.readWord();
          return;
        }
    }

    throw this.raise(
      this.state.pos,
      Errors.InvalidOrUnexpectedToken,
      String.fromCodePoint(code),
    );
  }
```

The Babel parser uses [charcodes constants](https://github.com/xtuc/charcodes?tab=readme-ov-file) to represent characters.

> Well, token types are import as `tt` throughout the babel-parser.
>


> Let's create the token `tt.atat` instead of `tt.at` if there's another `@` after the current `@`:
>

> ```js
> case charCodes.atSign:
>       // if the next character is a `@`
>       if (this.input.charCodeAt(this.state.pos + 1) === charCodes.atSign) {
>         // create `tt.atat` instead
>         this.finishOp(tt.atat, 2);
>       } else {
>         this.finishOp(tt.at, 1);
>       }
>       return;
> ``` 

The function `finishOp`  receives the token type and the size of the token, sets the token value and advances the position by calling [finishToken](https://github.com/ULL-ESIT-PL/babel-tanhauhau/blob/master/packages/babel-parser/src/tokenizer/index.js#L382-L390)

```js
finishOp(type: TokenType, size: number): void {
    const str = this.input.slice(this.state.pos, this.state.pos + size);
    this.state.pos += size;
    this.finishToken(type, str);
  }
```
> If you run the test again, you will see that the current token and the next token has changed:

```sh 
➜  babel-tanhauhau git:(learning) ✗ TEST_ONLY=babel-parser TEST_GREP="curry function" make test-only
BABEL_ENV=test ./scripts/test.sh
 FAIL  packages/babel-parser/test/curry-function.js
  ● Console

    console.error packages/babel-parser/lib/parser/expression.js:1517
      TokenType {
        label: '@@',
        keyword: undefined,
        beforeExpr: false,
        startsExpr: false,
        rightAssociative: false,
        isLoop: false,
        isAssign: false,
        prefix: false,
        postfix: false,
        binop: null,
        updateContext: null
      }
    console.error packages/babel-parser/lib/parser/expression.js:1518
      TokenType {
        label: 'name',
        keyword: undefined,
        beforeExpr: false,
        startsExpr: true,
        rightAssociative: false,
        isLoop: false,
        isAssign: false,
        prefix: false,
        postfix: false,
        binop: null,
        updateContext: [Function (anonymous)]
      }

  ● curry function syntax › should parse

    SyntaxError: Unexpected token (1:9)
  ```

  Notice that 
  
  1. I have created the branch `learning` to keep track of the changes I am doing in the code.
  2. The parser fails but now the token has label `@@` 

## The new parser

### A plan

> Before we move on, let's inspect how generator functions are represented in AST:

`➜  babel-learning git:(main) compast -jp 'function* foo() {}' | jq '.body[0]'`
```json
{
  "type": "FunctionDeclaration",
  "id": {
    "type": "Identifier",
    "name": "foo"
  },
  "expression": false,
  "generator": true,
  "async": false,
  "params": [],
  "body": {
    "type": "BlockStatement",
    "body": []
  }
}
```

> As you can see, a generator function is represented by the `generator: true` 
> attribute of a of the `FunctionExpression` or of the `FunctionDeclaration` if it is the case.

> Similarly, we can add a `curry: true` attribute or the `FunctionDeclaration` too 
> if it is a `curry` function:

`➜  babel-learning git:(main) compast -jp 'function @@ foo() {}' | jq '.body[0]'`
```json
{
  "type": "FunctionDeclaration",
  "id": {
    "type": "Identifier",
    "name": "foo"
  },
  "expression": false,
  "generator": false,
  "curry": true,
  "async": false,
  "params": [],
  "body": {
    "type": "BlockStatement",
    "body": []
  }
}
```


> **We have a plan now**, let's implement it!.

### Making the parser pass the test

> A quick search on "`FunctionDeclaration`" leads us to a function called `parseFunction` in 
> [packages/babel-parser/src/parser/statement.js](https://github.com/ULL-ESIT-PL/babel-tanhauhau/blob/master/packages/babel-parser/src/parser/statement.js#L1039-L1100), and here we find a line that sets the `generator` attribute, let's add one more line:

```js
packages/babel-parser/src/parser/statement.js
export default class StatementParser extends ExpressionParser {
  // ...
  parseFunction<T: N.NormalFunction>(
    node: T,
    statement?: number = FUNC_NO_FLAGS,
    isAsync?: boolean = false
  ): T {
    // ...
    node.generator = this.eat(tt.star);
    node.curry = this.eat(tt.atat);
  }
}
```

> If you run the test again, you will be amazed that it passed!

```sh
➜  babel-tanhauhau git:(learning) ✗ npx jest -u packages/babel-parser/test/curry-function.js
 PASS  packages/babel-parser/test/curry-function.js
  curry function syntax
    ✓ should parse (6ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   1 passed, 1 total
Time:        0.562s, estimated 1s
Ran all test suites matching /packages\/babel-parser\/test\/curry-function.js/i.
```

> That's it? How did we miraculously fix it?

> I am going to briefly explain how parsing works, and in the process hopefully, you understood what that one-liner change did.

### How parsing works

> With the list of tokens from the tokenizer, the parser consumes the token one by one and constructs the AST. 
> The parser uses the language grammar specification to decide how to use the tokens, which token to expect next.

> The grammar specification looks something like this:

> ```
> ...
> ExponentiationExpression -> UnaryExpression
>                             UpdateExpression ** ExponentiationExpression
> MultiplicativeExpression -> ExponentiationExpression
>                             MultiplicativeExpression ("*" or "/" or "%") ExponentiationExpression
> AdditiveExpression       -> MultiplicativeExpression
>                             AdditiveExpression + MultiplicativeExpression
>                             AdditiveExpression - MultiplicativeExpression
> ...
> ```

> It explains the precedence of each expressions/statements. For example, an `AdditiveExpression` is made up of either:

> - a `MultiplicativeExpression`, or
> - an `AdditiveExpression` followed by `+` operator token followed by `MultiplicativeExpression`, or
> - an `AdditiveExpression` followed by `-` operator token followed by `MultiplicativeExpression`.

> With these rules, we translate them into parser code:

> ```js
> class Parser {
>   // ...
>   parseAdditiveExpression() {
>     const left = this.parseMultiplicativeExpression();
>     // if the current token is `+` or `-`
>     if (this.match(tt.plus) || this.match(tt.minus)) {
>       const operator = this.state.type;
>       // move on to the next token
>       this.nextToken();
>       const right = this.parseMultiplicativeExpression();
> 
>       // create the node
>       this.finishNode(
>         {
>           operator,
>           left,
>           right,
>         },
>         'BinaryExpression'
>       );
>     } else {
>       // return as MultiplicativeExpression
>       return left;
>     }
>   }
> }
> ```

> This is a made-up code that oversimplifies what babel have, but I hope you get the gist of it.

> As you can see here, the parser is recursively in nature, and it goes from the lowest precedence to the highest precedence expressions/statements. Eg: `parseAdditiveExpression` calls `parseMultiplicativeExpression`, which in turn calls `parseExponentiationExpression`, which in turn calls ... . This recursive process is called [Recursive Descent Parsing](https://craftinginterpreters.com/parsing-expressions.html#recursive-descent-parsing).

### this.eat, this.match, this.next

> If you have noticed, in my examples above, I used some utility function, such as `this.eat`, `this.match`, `this.next`, etc. These are babel parser's internal functions, yet they are quite ubiquitous amongst parsers as well:

- `this.match` returns a boolean indicating whether the current token matches the condition
- `this.next` moves the token list forward to point to the next token
- `this.eat` return what `this.match` returns and if `this.match` returns true, will do `this.next`
  - `this.eat` is commonly used for optional operators, like `*` in generator function, `;` at the end of statements, and `?` in typescript types.
- `this.lookahead` get the next token without moving forward to make a decision on the current node

If you take a look again the parser code we just changed, it's easier to read it in now.

`packages/babel-parser/src/parser/statement.js`
```js
export default class StatementParser extends ExpressionParser {
  parseStatementContent(/* ...*/) {
    // ...
    // NOTE: we call match to check the current token
    if (this.match(tt._function)) {
      this.next();
      // NOTE: function statement has a higher precendence than a generic statement
      this.parseFunction();
    }
  }
  // ...
  parseFunction(/* ... */) {
    // NOTE: we call eat to check whether the optional token exists
    node.generator = this.eat(tt.star);
    node.curry = this.eat(tt.atat);
    node.id = this.parseFunctionId();
  }
}
```

## Your parser in the web 

> **Side Note**: You might be curious how am I able to visualize the custom syntax in the Babel AST Explorer, where I showed you the new "`curry`" attribute in the AST.

> That's because I've added a new feature in the [Babel AST Explorer](https://lihautan.com/babel-ast-explorer/) (not the AST Explorer, but the one of Tan Li Hau) where you can upload your custom parser!

```
➜  babel-tanhauhau git:(learning) ✗ ls packages/babel-parser/lib 
index.js        options.js      parser          plugin-utils.js plugins         tokenizer       types.js        util
```

> If you go to `packages/babel-parser/lib`, you would find the compiled version of your parser and the source map. 
> Open the drawer of the Babel AST Explorer, you will see a button to` upload a custom parser`. Drag the `packages/babel-parser/lib/index.js` 
> in and you will be visualizing the AST generated via your custom parser!


## Our babel plugin

> With our custom babel parser done, let's move on to write our babel plugin.

> But maybe before that, you may have some doubts on how are we going to use our custom babel parser, especially with whatever build stack we are using right now?

> Well, fret not. **A babel plugin can provide a custom parser, which is [documented on the babel website](https://babeljs.io/docs/en/babel-parser#will-the-babel-parser-support-a-plugin-system)**
>
> `babel-plugin-transformation-curry-function.js`
```js
import customParser from './custom-parser';

export default function ourBabelPlugin() {
  return {
    parserOverride(code, opts) {
      return customParser.parse(code, opts);
    },
  };
}
```
> Since we forked out the babel parser, all existing babel parser options or built-in plugins will still work perfectly.

> With this doubt out of the way, let see how we can make our curry function curryable? (not entirely sure there's such word)

