module.exports = function (babel) {
  return {
    name: "ast-transform2", // not required
    visitor: {
      ReturnStatement(path) {
        if (path.node.argument.type == "BinaryExpression" && path.node.argument.left.name  == "n") {
          path.replaceWithMultiple([
            babel.template(`let a = N`)({N: path.node.argument.left }),
            babel.template(`return 4*a`)()
          ])  
        }
      }
    }
  };
}
