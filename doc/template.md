See example [src/template/hello-babel-template.mjs](/src/template/hello-babel-template.mjs).

```js
/* 
Babel Template is another tiny but incredibly useful module. 
It allows you to write strings of code with placeholders 
that you can use instead of manually building up a massive AST.
*/
import template from "babel-template";
import _generate from "@babel/generator";
const generate = _generate.default;

import * as _t from "babel-types";
const t = _t.default;

import compast from "compact-js-ast"

const buildRequire = template(`
  var IMPORT_NAME = require(SOURCE);
`);

const identifier = t.identifier("myModule"); // See https://babeljs.io/docs/babel-types#identifier
const stringLiteral = t.stringLiteral("my-module");
console.log(compast(identifier, { parse: false, }),
  compast(stringLiteral, { parse: false, }));

const ast = buildRequire({
  IMPORT_NAME: identifier,
  SOURCE: stringLiteral
});

console.log(generate(ast).code); // var myModule = require("my-module");
```

You can use two different kinds of placeholders: 
- syntactic placeholders (e.g. `%%name%%`) or 
- identifier placeholders (e.g. `NAME`). 

`@babel/template` supports both those approaches by default, but they can't be mixed. If you need to be explicit about what syntax you are using, you can use the `syntacticPlaceholders` option.

```sh
➜  babel-learning git:(main) node src/template/hello-babel-template.mjs
type: "Identifier"
name: "myModule"
 type: "StringLiteral"
value: "my-module"

var myModule = require("my-module");
```