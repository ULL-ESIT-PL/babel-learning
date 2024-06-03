const template = require("@babel/template").default;
const generate =  require("@babel/generator").default;
const t =  require("@babel/types");

let buildRequire = template(`
  var %%importName%% = require(%%source%%);
`);

let ast = buildRequire({
  importName: t.identifier("myModule"),
  source: t.stringLiteral("my-module"),
});

console.log("syntactic placeholders: ", generate(ast).code);

buildRequire = template(`
  var IMPORT_NAME = require(SOURCE);
`);

ast = buildRequire({
  IMPORT_NAME: t.identifier("myModule"),
  SOURCE: t.stringLiteral("my-module"),
});

console.log("identifier placeholders: ",generate(ast).code);
