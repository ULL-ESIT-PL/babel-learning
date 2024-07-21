See https://github.com/hustcc/babel-plugin-version

## Installing

```
npm i 
```

## input.js
`➜  version git:(main) ✗ cat input.js`
```js  
const a = { a: __VERSION__ };

const b = a === __VERSION__;

const c = [__VERSION__];

const d =__VERSION__ = 1;

const e = "__VERSION__";
```

## Running the plugin

```
➜  version git:(main) ✗ npm test
> version@1.0.0 test
> babel input.js
```
```js
const a = {
  a: "1.0.0"
};
const b = a === "1.0.0";
const c = ["1.0.0"];
const d = __VERSION__ = 1;
const e = "1.0.0";
```

## Configuring the plugin

You can customize the default `__VERSION__` define.

```json
{
  "plugins": [
    ["version", {
      "define": "__PKG_VERSION__",
      "identifier": false,
      "stringLiteral": true 
     }]
  ]
}
```

 - **define**, `string`. Default `__VERSION__`. Define the keyword string which will be transformed.
 - **identifier**, `boolean`. Default `true`. Whether transform identifier which's name is equal `define` string.
 - **stringLiteral**, `boolean`. Default `true`. Whether transform string variable which is equal `define` string.


## Plugin code

See original source at https://github.com/hustcc/babel-plugin-version/blob/master/src/index.js

```js
'use strict';

var fs = require('fs');
// Assumes the package.json file is in the root of the project
var version = JSON.parse(fs.readFileSync('package.json', 'utf8')).version;

module.exports = function (_ref) {
  var t = _ref.types;

  return {
    visitor: {
      // __VERSION__
      ReferencedIdentifier: function(path, state) { // See https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md#toc-check-if-an-identifier-is-referenced
        var identifier = state.opts.identifier;
        var transform = identifier === undefined ? true : identifier; // 默认转换

        var define = state.opts.define || '__VERSION__'; // 默认值
        if (transform && path.node.name === define) {
          path.replaceWith(t.valueToNode(version));
        }
      },
      // "__VERSION__"
      StringLiteral: function(path, state) {
        var stringLiteral = state.opts.stringLiteral;
        var transform = stringLiteral === undefined ? true : stringLiteral;

        var define = state.opts.define || '__VERSION__';
        if (transform && path.node.value === define) {
          path.replaceWith(t.valueToNode(version));
        }
      }
    }
  };
};
```

You can check if an identifier is referenced by using the `isReferencedIdentifier` method. It can be also used in a visitor like above.

```js
Identifier(path) {
  if (path.isReferencedIdentifier()) {
    // ...
  }
}
```

## isReferencedIdentifier

According to ChatGPT `path.isReferencedIdentifier()` is `true` "means it checks if the identifier is used in a context where its value is being read, rather than just being declared or defined." See [chatgpt-isreferencedidentifier.md](chatgpt-isreferencedidentifier.md).

For instance in the example [input.js](input.js) the identifiers which are referenced are this (format is id, line. column):

```js
➜  version git:(main) ✗ npx babel input.js     
__VERSION__ 1 15
a 3 10
__VERSION__ 3 16
__VERSION__ 5 11
```
The `a` appears because of the line 3:

```js 
const b = a === "1.0.0";
```

See [/doc/visiting.md#check-if-an-identifier-is-referenced](/doc/visiting.md#check-if-an-identifier-is-referenced) for more details.

