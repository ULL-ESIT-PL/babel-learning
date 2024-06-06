module.exports = function (babel) {
  const { types: t } = babel;

  return {
    name: "ast-transform", // not required
    visitor: {
      BinaryExpression(path) {
        const { node } = path;
        if (node.operator == "*" && node.left.name == node.right.name) {
          path.replaceWith(t.binaryExpression("**", path.node.left, t.numericLiteral(2)));
          path.stop;
        }
      }
    }
  };
}