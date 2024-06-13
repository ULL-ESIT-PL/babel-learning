const babelParser = require('@babel/parser');
const { parseForESLint } = require('babel-eslint');

// Example JavaScript code
const code = `
function add(a, b) {
  return a + b;
}
`;

// Parse with Babel to get Babel AST
const babelAst = babelParser.parse(code, {
  sourceType: 'module',
  plugins: [
    // Add Babel plugins if needed, e.g., 'jsx', 'typescript'
  ]
});

// Convert Babel AST to ESTree AST using babel-eslint
const estreeAst = parseForESLint(code, {
  sourceType: 'module',
  // Additional options for parsing
}).ast;

// Output the ESTree AST
console.log('ESTree AST:', JSON.stringify(estreeAst, null, 2));


