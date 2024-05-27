# Learning Babel

My PL notes on Babel are here: https://ull-pl.vercel.app/topics/tree-transformations/babel

See this introduction by Matt Zeunert and the associated [GitHub repository](https://github.com/mattzeunert/babel-plugin-demo) 
for a simple example of how to create a Babel plugin.

* [Compiling JavaScript with Babel and writing your own Babel plugins](https://youtu.be/5gQiIWXBQ0U?si=AR0ZKEI6rZe4OMpV)

Also see the following resources:

* [Babel: Usage Guide](https://babeljs.io/docs/usage)
* [Plugins: Babel](https://babeljs.io/docs/plugins)
* [Plugins list](https://babeljs.io/docs/plugins-list)

## Babel Configuration

See the [Babel Configuration](doc/configure.md) section.

## Writing a Babel Plugin

* [Babel Handbook at jamiebuilds/babel-handbook](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md) This document covers how to create Babel plugins and is recommended by the Babel people.
  * [kentcdodds babel-plugin-handbook](https://github.com/kentcdodds/babel-plugin-handbook) forked from jamiebuilds/babel-handbook.
  * [StackOverflow: How to create a babel plugin for internal use](https://stackoverflow.com/questions/53639450/how-to-create-a-babel-plugin-for-internal-use)
* [Babel plugin Remove debugger transform. This plugin removes all `debugger;` statements](https://github.com/babel/minify/tree/master/packages/babel-plugin-transform-remove-debugger)
* [babel-plugin-transform-remove-debugger at GitHub](https://github.com/babel/minify/tree/a24dd066f16db5a7d5ab13c2af65e767347ef550/packages/babel-plugin-transform-remove-debugger)


## Help

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

## Traversal

See section [traversal.md](doc/traversal.md).

## babel-types and babel-template

See example [play/hello-babel-template.mjs](/play/hello-babel-template.mjs).

You can use two different kinds of placeholders: 
- syntactic placeholders (e.g. `%%name%%`) or 
- identifier placeholders (e.g. `NAME`). 

`@babel/template` supports both those approaches by default, but they can't be mixed. If you need to be explicit about what syntax you are using, you can use the `syntacticPlaceholders` option.

## Writing your first plugin

See section [first-plugin.md](doc/first-plugin.md).

## Transformations

1. [Visiting](doc/visiting.md)
2. [Manipulation](doc/manipulation.md)
3. [Scope](doc/scope.md)


## Parser

See section [parser.md](doc/parser.md).