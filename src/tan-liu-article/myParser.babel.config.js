const path = require('path');
// ./myParser.js -> /Users/casianorodriguezleon/campus-virtual/2122/learning/compiler-learning/babel-tanhauhau/packages/babel-parser/lib/index.js
const myParser = path.join('./my-parser.js');
const { parse } = require("./myParser.js");

module.exports = {
  "plugins": [
    {
      parserOverride(code, opts) {
        return parse(code, opts);
      },
    },
    path.join(__dirname, "babel-transform-curry-function.cjs"),
  ],
}