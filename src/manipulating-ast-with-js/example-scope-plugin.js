module.exports = ({ types: t }) => {
  return {
    visitor: {
      CallExpression(path) {
        const { scope, node } = path;
        if (!(node.callee.name === 'require'       && 
              node.arguments.length === 1          && 
              t.isStringLiteral(node.arguments[0]) && 
              node.arguments[0].value === 'foo-bar')) return; 
          const localIdentifier = path.parent.id.name; // f
          for (const p of scope.bindings[localIdentifier].referencePaths) { /* Same as scope.getBinding(localIdentifier) */
            if (!(p.parentPath.isCallExpression()  && 
                  p.parent.callee === p.node)) continue; 
            p.parentPath.replaceWith(t.NumericLiteral(99));
          };   
      }
    }
  }
};