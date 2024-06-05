import { parse } from "@babel/parser";

import _traverse from "@babel/traverse";
const traverse = _traverse.default || _traverse;

/* Return the path of the first Identifier node in the AST of the code */
function getIdentifierPath(code) {
  const ast = parse(code);
  let nodePath;
  traverse(ast, {
    Identifier: function (path) {
      nodePath = path;
      path.stop();
    },
  });

  return nodePath;
}

function testReferencePaths() { //0123456789012345678901234567890123456
  const path = getIdentifierPath("function square(n) { return n * n}"); 
  console.log(path.node.loc.start); // { line: 1, column: 9, index: 9 }
  console.log(Object.keys(path.context.scope))
  const referencePaths = path.context.scope.bindings.n.referencePaths;
  console.log(referencePaths.length); // 2
  console.log(referencePaths[0].node.loc.start) /* { line: 1, column: 28, index: 28, } */
  console.log(referencePaths[1].node.loc.start) /* { line: 1, column: 32, index: 32, } */
}

testReferencePaths();
