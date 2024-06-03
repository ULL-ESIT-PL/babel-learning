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

const translations = {
  "label_hello": "Hello world!",
  "label_bye": "Bye! Nice to meet you!",
};
const labels = Object.keys(translations);

traverse(ast, {
  CallExpression(path) {
    let node = path.node;
    let callee = node.callee.name;
    let arg = node.arguments[0];
    if (callee == "t" &&
      arg.type == "StringLiteral" &&
      labels.includes(arg.value)) {
      /* node.type = "StringLiteral"; node.value = translations[node.arguments[0].value]; delete node.arguments; delete node.callee; */
      path.replaceWith(t.stringLiteral(translations[arg.value]));
    }
  }
});

//console.log(JSON.stringify(ast, null, 2))
const result = generate(ast);
console.log(result.code);
