export default function({ types: t }) {
  return {
    visitor: {
      FunctionDeclaration(path) {
        if (path.scope.hasOwnBinding("n")) {
          path.traverse({
            Identifier(path) {
              if (path.node.name === "n") {
                path.node.name = "x";
              }
            }
          });
          return;
        }
      }
    }
  };
}