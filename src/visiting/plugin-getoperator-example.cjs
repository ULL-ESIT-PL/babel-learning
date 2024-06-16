module.exports = function (babel) {
  const generate = require("@babel/generator").default;

  return {
    name: "get-surrounding-operator",
    
    visitor: {
      NumericLiteral(path) {
        const surrounding = path.findParent(p => p.isBinaryExpression());
        if (surrounding) {
            console.log(path.node.value," surrounded by ",surrounding.node?.operator," in ", generate(surrounding.node).code, " at line ",path.node.loc.start.line," col ",path.node.loc.start.column );
        }
        else {
            console.log('no surrounding for', path.node.value);
        }
      }
    }
  }
}