# Reading "Creating custom JavaScript syntax with Babel"

## Installing Tan Liu Babel fork

I started cloning Tan Liu babel fork of the repo instead of the main Babel repo.

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
├── packages
packages
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

```sh