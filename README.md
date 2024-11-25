# YATBABEL: Yet Another Tutorial on Babel

## Introduction

Babel is a JavaScript transpiler that converts not only ECMAScript 2015+ but also JS extensions like JSX, Flow, TypeScript, and other proposals into JavaScript code that can run in any browser or JavaScript environment.  

This tutorial is a collection of notes and examples when reading tutorials on 

- how to start using Babel,
- how to write plugins, 
- how to write macros, 
- how to extend the parser, tokenizer and scope analyzer 
- What is TC39 and how to make proposals to TC39

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


### Babel, the Web and Source Maps

See section [/src/babel-tutorial/README.md](/src/babel-tutorial/README.md).

## Babylon

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

## Babel Template and Babel Types and Babel Generator

See section [doc/template.md](doc/template.md).

For another example using templates see section *Babel Templates* at file [/src/manipulating-ast-with-js/README.md](babel-templates/src/manipulating-ast-with-js/README.md#babel-templates).

## Scope

See section [Scope](doc/scope.md)

## Plugin Options

See section [Plugin Options](doc/plugin-options.md)

## Babel Handbook at jamiebuilds/babel-handbook

* [Babel Handbook at jamiebuilds/babel-handbook](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md) This document covers how to create Babel plugins and is recommended by the Babel people.
  * [kentcdodds babel-plugin-handbook](https://github.com/kentcdodds/babel-plugin-handbook) forked from jamiebuilds/babel-handbook.
  
## Babel Plugin Examples


* See section [Babel Plugin Examples](/src/awesome/README.md)
* [version](/src/awesome/version)
* [Reading "Babel Macros" by Tan Liu: The case of facebook/idx](/tan-liu-babel-macros/tan-liu-babel-macros.md#the-case-of-facebookidx)

## Babel Macros

See 

- Section [Reading "Babel Macros" by Tan Liu](/doc/tan-liu-babel-macros/tan-liu-babel-macros.md)
- [Learning Babel Macros](https://github.com/ULL-ESIT-PL/learning-babel-macros/tree/main) at ULL-ESIT-PL/learning-babel-macros repo by Casiano

## Reproducing Nicolo Ribaudo's talk at HolyJS 2019

See chapter [Reproducing Nicolo Ribaudo's talk at HolyJS 2019](/doc/nicolo-howto-talk/README.md)

## The Babel Parser

See 

- See section [tokenizer.md](/doc/parser/tokenizer.md).
- Section [parser.md](doc/parser.md)
- [Commented Reading of "Creating custom JavaScript syntax with Babel"](/doc/tan-liu-article.md)
- [tc39](/doc/parser/tc39.md)

## Project "Creating custom JavaScript syntax with Babel"

See [Commented Reading of "Creating custom JavaScript syntax with Babel"](/doc/tan-liu-article.md)

## Adrian's Final Degree Project

[Adrian](https://github.com/AdrianMoraRodriguez) is working in his Final Degree Project on extending JS arrays and objects with a `else` clause 
defining the default behavior when the property does not exists in the array. 

```javascript
let a = [1, 2, 3, else x => x * x];

console.log(a[2]);  // 3
console.log(a[5]);  // 25 (porque 5 * 5 = 25)
```

See [/src/array-else/README.md](/src/array-else/README.md) to know more about Adrian's transpiler. 

## Pablo's Final Degree Project

[Pablo](https://github.com/PSantanaGlez13) is working in his Final Degree Project on extending JS with *Assignable functions* whose behavior can be changed via assignments:

`➜  left-side git:(main) ✗ cat left-side-original.mjs`
```js
function @@ foo(bar) {
  return bar * 2;
}
foo(10) = 5;
```

See [/src/left-side/README.md](/src/left-side/README.md) to know more about Pablo's transpiler. 

## Building and publishing your Babel version

See section [Building and publishing your Babel version](/doc/building-publishing.md).   

## Exercises

See section [Exercises](doc/exercises/README.md).

## References

See section [References](doc/references.md).

## Contributing

Make a fork of this repo, make your changes and make a pull request.

- If you find a type, an error, make an [issue](https://github.com/ULL-ESIT-PL/babel-learning/issues) or let us know in the [Discussions](https://github.com/ULL-ESIT-PL/babel-learning/discussions).
- If you find an interesting reference, tutorial, etc. please let us know either by 
modifying the [doc/references.md](doc/references.md) file followed by the pull request or 
just make an issue.
