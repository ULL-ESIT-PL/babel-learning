# Reading "Creating custom JavaScript syntax with Babel"

## Installing Tan Liu Babel fork

I started forking Tan Liu babel fork of the repo instead of the main Babel repo and then I clone my fork:

```sh
gh repo clone ULL-ESIT-PL/babel-tanhauhau
```

Then I realized that I have to install yarn and gulp to build the project.

```sh
➜  babel-tanhauhau git:(master) pwd -P
/Users/casianorodriguezleon/campus-virtual/2122/learning/compiler-learning/babel-tanhauhau
babel-tanhauhau git:(master) npm i -g yarn 
babel-tanhauhau git:(master) npm i -g gulp
```

then I proceed to make the bootstrap:

```sh
➜  babel-tanhauhau git:(master) make bootstrap
```
I was using node v21.2.0.
There were errors with node-gyp. node-gyp is a cross-platform command-line tool written in Node.js for compiling native addon modules for Node.js. It contains a vendored copy of the gyp-next project that was previously used by the Chromium team and extended to support the development of Node.js native addons:

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
Thus I proceed to the `make build`:

```sh
babel-tanhauhau git:(master) make build
...
[12:37:46] Skipped minification of 'babel-tanhauhau/packages/babel-standalone/babel.js' because not publishing
[12:37:46] Finished 'build-babel-standalone' after 18 s
```
I then runned the tests. Most of them passed but there were some errors. For instance:

```sh
 FAIL  packages/babel-plugin-transform-dotall-regex/test/index.js
  ● babel-plugin-transform-dotall-regex/dotall regex › with unicode property escape
```

I will try to fix them later.

Babel uses a monorepo structure, all the packages, eg: 
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

The folder we are going to work on is `packages/babel-parser/`:

```
➜  babel-tanhauhau git:(master) cd packages/babel-parser 
typings
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

It's clear where to find the code for each process. 
`plugins/` folder contains plugins that extend the base parser and add custom syntaxes, 
such as `jsx` and `flow`.

> Let's do a Test-driven development (TDD). 
> I find it easier to define the test case then slowly work our way to "fix" it. 
> It is especially true in an unfamiliar codebase, 
> TDD allows you to "easily" point out code places you need to change.

I copy the test file `test/curry-function.js` from the article:

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

### TEST_ONLY=babel-parser TEST_GREP="curry function" make test-only

and run `make test-only` from the root of the project:

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
I guess that the environment variables `TEST_ONLY=babel-parser TEST_GREP="curry function"`
set the test to run only the `babel-parser` tests and to grep for the string `curry function`.

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
And it hangs here.

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

Correct! See the message `at Parser.parseIdentifierName (packages/babel-parser/lib/parser/expression.js:1515:18)` in the stack trace above.

> Let us add some `console.log`:

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

Here is the full code of this version of the function:
  
```js
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
["type annotations can only be used in typescript"](https://stackoverflow.com/questions/48859169/error-types-can-only-be-used-in-a-ts-file-visual-studio-code-using-ts-che). The solution adopted was to disable the configuration
variable `"javascript.validate.enable"` in the settings.

So I included the code above in the function `parseIdentifierName` in the file `packages/babel-parser/src/parser/expression.js`
and watched the `make watch`terminal sending the warnings about compiling the files that I have changed:

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