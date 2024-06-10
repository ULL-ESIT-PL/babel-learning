module.exports = function (babel) {
  const { types: t, template } = babel;
  const curryTemplate = template(`const currying = require("./currying.cjs")`)();

  return {
    name: "curry-function",
    visitor: {
      Program: {
        exit(path) {
          let node = path.node;
          node.body.unshift(curryTemplate);
        }
      },
      FunctionDeclaration(path) {
        if (path.get("curry").node) { 
          const functionName = path.get("id.name").node;
          path.node.id = undefined;
          path.node.curry = false; // avoid infinite loop

          path.replaceWith(
            t.variableDeclaration("const", [
              t.variableDeclarator(
                t.identifier(functionName),
                // t.callExpression(this.addHelper("currying"), [
                t.callExpression(t.identifier("currying"), [ 
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
  };
}
