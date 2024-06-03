const transform = require('./example-transform');
const babel = require('@babel/core');
const fs = require('fs');
const path = require('path');
const result = babel.transformFileSync(path.resolve(__dirname, 'example-input.js'), {
  plugins: [transform]
});
console.log(result.code);