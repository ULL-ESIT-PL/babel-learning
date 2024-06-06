const path = require("path");
const babel = require("@babel/core");

const code = `let square = n => { return n * n; }`;
const result = babel.transformSync(
  code, 
  {
    plugins: [path.join(__dirname, "replacewithmultiple-plugin.cjs")]
  }
);
console.log(result.code); 