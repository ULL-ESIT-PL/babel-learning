const traverse = require("@babel/traverse").default;
const template = require("@babel/template").default;
const parser = require('@babel/parser');
const t = require('@babel/types');
const generate = require('@babel/generator').default;
const fs = require('fs');
const path = require('path');
const code = fs.readFileSync(path.resolve(__dirname, 'example-input.js'), 'utf8');

const ast = parser.parse(code, {
  sourceType: 'module',
  //tokens: true, 
});
//console.log(ast.tokens[0]); // CommentLine

let buildCons = template(`console.log("hello world");`);

traverse(ast, {
  "ImportDeclaration|FunctionDeclaration|VariableDeclaration"(path) {
    let node = path.node;
    path.replaceWithMultiple([node, buildCons()]); 
  }
});

//console.log(JSON.stringify(ast, null, 2));
const result = generate(ast);
console.log(result.code);
