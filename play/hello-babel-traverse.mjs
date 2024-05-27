import * as babylon from "babylon";
import _traverse from "@babel/traverse";
const traverse = _traverse.default;
//console.log(traverse)
import _generate from "@babel/generator";
const generate = _generate.default;

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

//console.log(JSON.stringify(ast, null, 2));

const output = generate(ast, code);
console.log(output.code);

