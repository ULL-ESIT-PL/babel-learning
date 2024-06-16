module.exports = function (babel) {
  const generate = require("@babel/generator").default;

  return {
    name: "get-surrounding-function-or-program",
    
    visitor: {
      BinaryExpression(path) {
        const surrounding = path.getStatementParent();
        if (surrounding) {
            console.log('statement ',surrounding.node.type,' surrounds ', generate(path.node).code );
        }
        else {
            console.log('no surrounding statement for', path.node.operator);
        }
      }
    }
  }
}
