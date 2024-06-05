# Learning Babel


## VSCode Configuration

See section [doc/vscode-typescript-config.md](/doc/vscode-typescript-config.md) on how to configure VSCode to work with Babel files in TypeScript.

## git configuration: Husky and git Hooks

See section [doc/git-hooks-configuration.md](doc/git-hooks-configuration.md) on how to survive with pre-commit hooks

## Babel Configuration

See the [Babel Configuration](doc/configure.md) section.

## Babel Help

```
➜  babel-learning git:(main) ✗ npx babel --help
Usage: babel [options] <files ...>

Options:
  -f, --filename [filename]                   The filename to use when reading from stdin. This will be used in source-maps, errors etc.
  --presets [list]                            A comma-separated list of preset names.
  --plugins [list]                            A comma-separated list of plugin names.
  --config-file [path]                        Path to a .babelrc file to use.
  --env-name [name]                           The name of the 'env' to use when loading configs and plugins. Defaults to the value of BABEL_ENV, or else
                                              NODE_ENV, or else 'development'.
  --root-mode [mode]                          The project-root resolution mode. One of 'root' (the default), 'upward', or 'upward-optional'.
  --source-type [script|module]               
  --no-babelrc                                Whether or not to look up .babelrc and .babelignore files.
  --ignore [list]                             List of glob paths to **not** compile.
  --only [list]                               List of glob paths to **only** compile.
  --no-highlight-code                         Enable or disable ANSI syntax highlighting of code frames. (on by default)
  --no-comments                               Write comments to generated output. (true by default)
  --retain-lines                              Retain line numbers. This will result in really ugly code.
  --compact [true|false|auto]                 Do not include superfluous whitespace characters and line terminators.
  --minified                                  Save as many bytes when printing. (false by default)
  --auxiliary-comment-before [string]         Print a comment before any injected non-user code.
  --auxiliary-comment-after [string]          Print a comment after any injected non-user code.
  -s, --source-maps [true|false|inline|both]  
  --source-map-target [string]                Set `file` on returned source map.
  --source-file-name [string]                 Set `sources[0]` on returned source map.
  --source-root [filename]                    The root from which all sources are relative.
  --module-root [filename]                    Optional prefix for the AMD module formatter that will be prepended to the filename on module definitions.
  -M, --module-ids                            Insert an explicit id for modules.
  --module-id [string]                        Specify a custom name for module ids.
  -x, --extensions [extensions]               List of extensions to compile when a directory has been the input. [.js,.jsx,.es6,.es,.mjs,.cjs]
  --keep-file-extension                       Preserve the file extensions of the input files.
  -w, --watch                                 Recompile files on changes.
  --skip-initial-build                        Do not compile files before watching.
  -o, --out-file [out]                        Compile all input files into a single file.
  -d, --out-dir [out]                         Compile an input directory of modules into an output directory.
  --relative                                  Compile into an output directory relative to input directory or file. Requires --out-dir [out]
  -D, --copy-files                            When compiling a directory copy over non-compilable files.
  --include-dotfiles                          Include dotfiles when compiling and copying non-compilable files.
  --no-copy-ignored                           Exclude ignored files when copying non-compilable files.
  --verbose                                   Log everything. This option conflicts with --quiet
  --quiet                                     Don't log anything. This option conflicts with --verbose
  --delete-dir-on-start                       Delete the out directory before compilation.
  --out-file-extension [string]               Use a specific extension for the output files
  -V, --version                               output the version number
  -h, --help                                  display help for command
```

## Compile JavaScript with Babel

### npx babel src/input.js --out-dir lib --presets=@babel/env

```
➜  babel-learning git:(main) cat src/input.js 
const fn = () => 1;
➜  babel-learning git:(main) ✗ npx babel src/input.js --out-dir lib --presets=@babel/env
Successfully compiled 1 file with Babel (465ms).
➜  babel-learning git:(main) ✗ cat lib/input.js
"use strict";

var fn = function fn() {
  return 1;
};
```

### babel.transformSync

You can also call `babel.transformSync` from your own program with the `code` as
the first argument and an option object specifying 
the `presets` and `plugins`: 

`➜  babel-learning git:(main) ✗ cat src/hello-babel.js` 
```js
const babel = require("@babel/core");

const code = `
let f = (x) => console.log(x);
f("Hello, Babel!");
`;
const result = babel.transformSync(
  code, 
  {
    presets: ["@babel/preset-env"], // for compiling ES2015+ syntax
    plugins: ["@babel/plugin-transform-arrow-functions"]
  }
);
console.log(result.code); 
```

When executed we get:

`➜  babel-learning git:(main) ✗ node src/hello-babel.js` 
```js
"use strict";

var f = function f(x) {
  return console.log(x);
};
f("Hello, Babel!");
```

### Babylon

Babylon was the parser that Babel used to parse JavaScript code.
Not any more. Now Babel uses `@babel/parser` which is a fork of Babylon.
See [src/hello-babylon.mjs](src/hello-babylon.mjs) for an example of using Babylon.



## Traversal

See section [traversal.md](doc/traversal.md). It includes an example
using the modules babel-traverse and babel-generator and compact-js-ast

## Writing my first Babel Plugin

See section [first-plugin.md](doc/first-plugin.md).

## Visiting the AST in a Babel Plugin

See section [Visiting](doc/visiting.md)

## Manipulating the AST in a Babel Plugin

See section [Manipulation](doc/manipulation.md)

## Manipulating AST with JavaScript by Tan Liu Hau

* See section [src/manipulating-ast-with-js/README.md](src/manipulating-ast-with-js/README.md) describing my experience reproducing [Tan Li Hau (陈立豪)](https://github.com/tanhauhau) youtube video [Manipulating AST with JavaScript](https://youtu.be/5z28bsbJJ3w?si=7UMZyXpNG5AdfWCE)
* See also by the same author [Step-by-step guide for writing a custom babel transformation](https://lihautan.com/step-by-step-guide-for-writing-a-babel-transformation). Tan Li Hau. September 12, 2019

## Babel Template and Babel Types and Babel Generator

See section [doc/template.md](doc/template.md).

For another example using templates see section *Babel Templates* at file [/src/manipulating-ast-with-js/README.md](babel-templates/src/manipulating-ast-with-js/README.md#babel-templates).

## Scope

See section [Scope](doc/scope.md)

## Babel Handbook at jamiebuilds/babel-handbook

* [Babel Handbook at jamiebuilds/babel-handbook](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md) This document covers how to create Babel plugins and is recommended by the Babel people.
  * [kentcdodds babel-plugin-handbook](https://github.com/kentcdodds/babel-plugin-handbook) forked from jamiebuilds/babel-handbook.
  
### Babel Plugin Examples

* [Babel plugin Remove debugger transform. This plugin removes all `debugger;` statements](https://github.com/babel/minify/tree/master/packages/babel-plugin-transform-remove-debugger)
  * [babel-plugin-transform-remove-debugger at GitHub](https://github.com/babel/minify/tree/a24dd066f16db5a7d5ab13c2af65e767347ef550/packages/babel-plugin-transform-remove-debugger)

## The Babel Parser

See section [parser.md](doc/parser.md).

## References

See section [References](doc/references.md).
