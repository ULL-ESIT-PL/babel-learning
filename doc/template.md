# Babel Template and Babel Types and Babel Generator

`@babel/types` is a package that contains a lot of utility functions for AST nodes.

`@babel/template` is a tiny but incredibly useful module. 
It allows you to write strings of code with placeholders 
that you can use instead of manually building up a massive AST.

We can see in the example [src/template/hello-babel-template.mjs](/src/template/hello-babel-template.mjs)
that the template variables `IMPORT_NAME`  and  `SOURCE` in the template object `buildRequire` are filled
with the ASTs built using `babel-types` and stored in the variables  `identifier` and `stringLiteral`.
The resulting AST  `ast` is used to generate the code using `@babel/generator`.

```js
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


```
➜  babel-learning git:(main) node src/template/hello-babel-template.mjs
type: "Identifier"
name: "myModule"
 type: "StringLiteral"
value: "my-module"
```
```js
var myModule = require("my-module");
```

See also 

- The example at [/doc/manipulation.md#replacing-a-node-with-multiple-nodes](https://github.com/ULL-ESIT-PL/babel-learning/blob/main/doc/manipulation.md#replacing-a-node-with-multiple-nodes)
- The example [/src/manipulating-ast-with-js/babel-template-example.js](/src/manipulating-ast-with-js/babel-template-example.js)