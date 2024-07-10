import * as babylon from "@babel/parser";

const code = `n => n * n;`;

let ast = babylon.parse(code, {
  sourceType: "module",
  plugins: ["@babel/plugin-transform-arrow-functions"]
});
console.log(JSON.stringify(ast, null, 2));
/*  
node src/hello-babylon.mjs > salida.json
compast -n salida.json 
type: "File"
program:
  type: "Program"
  body:
    - type: "ExpressionStatement"
      expression:
        type: "ArrowFunctionExpression"
        id: null
        params:
          - type: "Identifier"
            name: "n"
        body:
          type: "BinaryExpression"
          left:
            type: "Identifier"
            name: "n"
          operator: "*"
          right:
            type: "Identifier"
            name: "n"
*/