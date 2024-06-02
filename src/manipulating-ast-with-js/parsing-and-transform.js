const transform = require('./example-transform');
const babel = require('@babel/core');
const fs = require('fs');
const path = require('path');
const code = fs.readFileSync(path.resolve(__dirname, 'example-input.js'), 'utf8');
const result = babel.transform(code, {
  plugins: [transform]
});
console.log(result.code);