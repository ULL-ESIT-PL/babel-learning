/* A transformation so that a generator declaration 
`function* xxx(...) { ...}` 
is hoisted to a constant declaration with the same name of the generator function. 
The constant must be initialized to a call to the function  with name 
`buildGenerator`with argument the bare function.  
`const xxx = buildGenerator(function(...) { ... })`.

`npx babel input-generator-declaration-local.js --plugins=./generator-transform-plugin.cjs`
*/
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
