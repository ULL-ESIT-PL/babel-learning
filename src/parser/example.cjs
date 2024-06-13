const code = `const element = <a href="https://www.google.com">Hello, world!</a>;`;
let parse = require("@babel/parser").parse;
let ast = parse(code, {
  // parse in strict mode and allow module declarations
  sourceType: "module",

  plugins: [
    // enable jsx and flow syntax
    "jsx",
    "flow",
  ],
});

const skip = (key, value) => {
  if (key === "loc" || key === "start" || key === "end" || key === "directives" || key === "comments") {
    return undefined;
  }
  return value;
}
console.log(JSON.stringify(ast, skip, 2));