/* 
Babel Template is another tiny but incredibly useful module. 
It allows you to write strings of code with placeholders 
that you can use instead of manually building up a massive AST.
*/
import template from "babel-template";
//const template = _template.default;
import _generate from "@babel/generator";
const generate = _generate.default;

import * as _t from "babel-types";
const t = _t.default;

const buildRequire = template(`
  var IMPORT_NAME = require(SOURCE);
`);

const ast = buildRequire({
  IMPORT_NAME: t.identifier("myModule"),
  SOURCE: t.stringLiteral("my-module")
});

console.log(generate(ast).code);