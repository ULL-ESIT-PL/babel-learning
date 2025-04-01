#!/usr/bin/env node
import * as babylon from "@babel/parser";
import _traverse from "@babel/traverse";
const traverse = _traverse.default;
//console.log(traverse)
import _generate from "@babel/generator";
const generate = _generate.default;

import compast from "compact-js-ast"

const code = `function square(n) {
  return n * n;
}`;

const ast = babylon.parse(code);

traverse(ast, {
  enter(path) {
    if (
      path.node.type === "Identifier" &&
      path.node.name === "n"
    ) {
      path.node.name = "x";
    }
  }
});

console.log(compast(ast, {
  parse: false,
  hide: ["directives", "generator", "async"]
}));

const output = generate(
  ast, { // See options https://babel.dev/docs/babel-generator#options
    retainLines: false, // Attempt to use the same line numbers in the output code as in the source code (helps preserve stack traces)
    compact: true, // Set to true to avoid adding whitespace for formatting
    concise: true, // Set to true to avoid adding whitespace for formatting
    quotes: "double",
  },
  code
);
console.log(output.code);

