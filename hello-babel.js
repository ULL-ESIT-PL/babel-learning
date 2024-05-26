const babel = require("@babel/core");

const code = `
let f = (x) => console.log(x);
f("Hello, Babel!");
`;
const result = babel.transformSync(code, /* optionsObject */);
console.log(result.code);