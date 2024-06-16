module.exports = function (babel) {
  const { types: t } = babel; // types: t is equivalent to types: babel.types

  return {
    name: "bigint-conversion",
    
    visitor: {
      BinaryExpression(path) {
        let node = path.node;
        if (t.isBigIntLiteral(node.left) && (t.isNumericLiteral(node.right) && Number.isInteger(node.right.value))) {
          path.get("right").replaceWith(t.bigIntLiteral(String(BigInt(node.right.value))));
        }
        else if (t.isBigIntLiteral(node.right) && (t.isNumericLiteral(node.left) && Number.isInteger(node.left.value))) {
          node.left.type = 'BigIntLiteral';
          node.left.value = BigInt(node.left.value);
        }
      }
    }
  }
}