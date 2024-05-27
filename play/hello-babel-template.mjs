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

const identifier = t.identifier("myModule");
const stringLiteral = t.stringLiteral("my-module");
console.log(compast(identifier, { parse: false, }),
  compast(stringLiteral, { parse: false, }));

const ast = buildRequire({
  IMPORT_NAME: identifier,
  SOURCE: stringLiteral
});

console.log(generate(ast).code); // var myModule = require("my-module");