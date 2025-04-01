import { parse } from '@babel/parser';
import _traverse from '@babel/traverse';
const traverse = _traverse.default;
import _generate from "@babel/generator";
const generate = _generate.default;
import * as t from '@babel/types';

// Sample code to transform
const code = `
function square(n) {
  return n * n;
}

const double = function(n) {
  return n + n;
}

const add = (a, b) => a + b;
`;

// Parse the code into an AST
const ast = parse(code, {
  sourceType: 'module',
});

// Use traverse to visit and modify nodes
traverse(ast, {
  // Visit function declarations
  FunctionDeclaration(path) {
    console.log(`Found function declaration: ${path.node.id.name}`);
    
    // Add a comment above the function. See https://github.com/babel/babel/blob/0f95b748a9a5f90c3b23d4d72299684991049243/packages/babel-types/src/comments/addComments.ts and https://github.com/babel/babel/blob/0f95b748a9a5f90c3b23d4d72299684991049243/packages/babel-traverse/src/path/comments.ts#L57-L64
    path.addComment('leading', ` Function: ${path.node.id.name} `, true);
  },
  
  // Visit function expressions
  FunctionExpression(path) {
    const parentNode = path.parent;
    if (t.isVariableDeclarator(parentNode)) {
      console.log(`Found function expression assigned to: ${parentNode.id.name}`);
    }
  },
  
  // Visit arrow functions
  ArrowFunctionExpression(path) {
    const parentNode = path.parent;
    if (t.isVariableDeclarator(parentNode)) {
      console.log(`Found arrow function assigned to: ${parentNode.id.name}`);
      
      // Transform arrow function to regular function
      const arrowFunc = path.node;
      const regularFunc = t.functionExpression(
        null,
        arrowFunc.params,
        t.blockStatement([
          t.returnStatement(arrowFunc.body)
        ])
      );
      
      path.replaceWith(regularFunc);
    }
  }
});

// Generate code from the modified AST
const output = generate(ast, {}, code);

console.log('\nTransformed code:');
console.log(output.code);