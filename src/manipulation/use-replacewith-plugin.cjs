const path = require("path");
const babel = require("@babel/core");

const code = `let square = n => n * n;`;
const result = babel.transformSync(
  code, 
  {
    presets: ["@babel/preset-env"], // for compiling ES2015+ syntax
    plugins: [path.join(__dirname, "replacewith-plugin.cjs"), "@babel/plugin-transform-arrow-functions"]
  }
);
console.log(result.code); 