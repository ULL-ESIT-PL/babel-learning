// This example shows how to produce a estree compatible AST using the babel parser.
const babel = require('@babel/core');
const source = '4';

const options = {
  parserOpts: { // https://babeljs.io/docs/en/babel-parser#options
    plugins: [ 'estree', ],
    sourceType: 'script', // module, script
    tokens: true, // default false
    sourceFilename: 'estree-example-tokens.js',
  },
};

const ast = babel.parseSync(source, options);

console.log(JSON.stringify(
  ast, 
  function skip(key, value) {
    if ([ 'loc', 'start', 'end', 'directives', 'comments' ].includes(key)) {
      return undefined;
    }
    return value;
  },2),
);
//const generate = require("@babel/generator").default;
//console.log(generate(ast).code); // throws an error
const recast = require('recast');
console.error(recast.print(ast).code) // '4;'