To convert a Babel AST to ESTree format, you can use the `babel-eslint` parser, which provides the functionality to parse Babel-compatible JavaScript code and produce an ESTree-compatible AST. This is particularly useful if you need to work with tools that expect an ESTree-compliant AST, such as ESLint.

Here's a step-by-step guide to accomplish this:

### 1. Install Dependencies

First, you need to install the necessary packages:

```sh
npm install @babel/parser @babel/traverse @babel/types @babel/generator
npm install babel-eslint
```

### 2. Parse JavaScript Code with Babel Parser

Use the `@babel/parser` to parse JavaScript code into a Babel AST.

```javascript
const babelParser = require('@babel/parser');

const code = `
function add(a, b) {
  return a + b;
}
`;

const babelAst = babelParser.parse(code, {
  sourceType: 'module',
  plugins: [
    // Add plugins if needed, e.g., 'jsx', 'typescript'
  ]
});

console.log('Babel AST:', JSON.stringify(babelAst, null, 2));
```

### 3. Convert Babel AST to ESTree Format

`babel-eslint` provides the `parseForESLint` function, which you can use to convert the Babel AST to ESTree format.

```javascript
const { parseForESLint } = require('babel-eslint');

const estreeAst = parseForESLint(code, {
  sourceType: 'module',
  // Pass additional options if needed
}).ast;

console.log('ESTree AST:', JSON.stringify(estreeAst, null, 2));
```

### 4. Full Example

Here is a complete example that combines parsing with Babel and converting to ESTree format:

```javascript
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
```

### Explanation

- **Babel Parser**: `@babel/parser` is used to parse the JavaScript code into a Babel AST.
- **babel-eslint**: The `parseForESLint` function from `babel-eslint` takes the JavaScript code and returns an ESTree-compatible AST.
- **Options**: You can pass additional options to the parsers, such as specifying plugins or source type.

### Additional Notes

- **babel-eslint** is designed to bridge the gap between Babel and ESLint, providing an ESTree-compatible AST from Babel-transformed code.
- If you're working directly with Babel and need to maintain compatibility with ESTree-based tools, this method ensures that the output conforms to the expected ESTree format.
- Make sure to install the necessary dependencies and configure them according to your project's requirements.