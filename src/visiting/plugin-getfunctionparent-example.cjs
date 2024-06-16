module.exports = function (babel) {
  const generate = require("@babel/generator").default;

  return {
    name: "get-surrounding-function-or-program",
    
    visitor: {
      BinaryExpression(path) {
        const surrounding = path.getFunctionParent();
        if (surrounding) {
            console.log('function ',surrounding.node?.id?.name,' surrounds ', generate(path.node).code );
        }
        else {
            console.log('no surrounding function for', path.node.operator);
        }
      }
    }
  }
}
