import * as babylon from "babylon";
import _traverse from "@babel/traverse";
const traverse = _traverse.default;

const code = `
var a = 1; // pathA, path.key = 0
var b = 2; // pathB, path.key = 1
var c = 3; // pathC, path.key = 2
`;

const ast = babylon.parse(code);

traverse(ast, {
  enter(path) {
    if (path.node.type === "VariableDeclaration") {
      console.error(
        path.inList, // true
        path.listKey, // 
        path.key, // 0
        path.getSibling(path.key).node.declarations[0].id.name, // 
        path.getSibling((path.key + 1)%3).node.declarations[0].id.name, //
        path.container.length, // 3
        path.getPrevSibling().node?.declarations[0].id.name, // 
        path.getNextSibling().node?.declarations[0].id.name, // 
        path.getAllPrevSiblings().length,  // 
        path.getAllNextSiblings().length   // 
      );
    }
  }
});

