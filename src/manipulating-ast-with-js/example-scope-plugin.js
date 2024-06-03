module.exports = ({ types: t }) => {
  return {
    visitor: {
      CallExpression(path) {
        const { scope, node } = path;
        if (node.callee.name === 'require'
          && node.arguments.length === 1
          && t.isStringLiteral(node.arguments[0])
          && node.arguments[0].value === 'foo-bar'
        ) {
          const localIdentifier = path.parent.id.name; // f
          scope.bindings[localIdentifier].referencePaths.forEach(p => {
            p.parentPath.replaceWith(t.NumericLiteral(99));
          }); 
        }
      }
    }
  }
};