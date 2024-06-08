module.exports = function (babel) {
  const { types: t } = babel;

  return {
    name: "generator-transform", 
    
    visitor: {
      FunctionDeclaration(path) {
        if (path.get("generator").node) { 
          const functionName = path.get("id.name").node;
          path.node.id = undefined;
          path.node.generator = false; // avoid infinite loop

          path.replaceWith(
            t.variableDeclaration("const", [
              t.variableDeclarator(
                t.identifier(functionName),
                t.callExpression(t.identifier("buildGenerator"), [ 
                  t.toExpression(path.node),
                ]),
              ), 
            ]),
          );

          // hoist it
          const node = path.node;
          const currentScope = path.scope.path.node;
          path.remove();
          if (currentScope.body.body) {
            currentScope.body.body.unshift(node);
          } else {
            currentScope.body.unshift(node);
          }
        }
      },
    },
  }
}
