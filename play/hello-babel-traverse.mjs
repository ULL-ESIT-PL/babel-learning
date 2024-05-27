import * as babylon from "babylon";
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

const output = generate(ast, code);
console.log(output.code);

