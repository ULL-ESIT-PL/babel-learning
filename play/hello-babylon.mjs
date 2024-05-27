import * as babylon from "babylon";

const code = `function square(n) {
  return n * n;
}`;

let ast = babylon.parse(code);
console.log(JSON.stringify(ast, null, 2));

// Node {
//   type: "File",
//   start: 0,
//   end: 38,
//   loc: SourceLocation {...},
//   program: Node {...},
//   comments: [],
//   tokens: [...]
// }