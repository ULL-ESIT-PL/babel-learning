module.exports = function (babel) {
  const generate = require("@babel/generator").default;

  return {
    name: "get-surrounding-function-or-program",
    
    visitor: {
      Identifier(path) {
        if (path.isReferencedIdentifier()) {
            console.log('referenced ',path.node.name, ' at line ',path.node.loc.start.line,' col ',path.node.loc.start.column );
        }
        else {
            console.log('declared ',path.node.name, ' at line ',path.node.loc.start.line,' col ',path.node.loc.start.column );
        }
      }
    }
  }
}
