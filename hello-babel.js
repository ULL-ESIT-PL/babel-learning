const babel = require("@babel/core");

const code = `
let f = (x) => console.log(x);
f("Hello, Babel!");
`;
const result = babel.transformSync(
  code, 
  {
    presets: ["@babel/preset-env"],
    plugins: ["@babel/plugin-transform-arrow-functions"]
  }
);
console.log(result.code); 
/* Output:
"use strict";

var f = function f(x) {
  return console.log(x);
};
f("Hello, Babel!");
*/s