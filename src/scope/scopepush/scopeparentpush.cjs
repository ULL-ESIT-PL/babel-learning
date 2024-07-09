module.exports = function(babel) {
  const { types: t } = babel;

  return {
    name: "pushing-to-parent-plugin",
    visitor: {
      FunctionDeclaration(path) {
        const id = path.scope.generateUidIdentifierBasedOnNode(path.node.id);
        let node = t.toExpression(path.node);
        path.remove();
        path.scope.parent.push({ id, init: node });
      }
    }
  };
};