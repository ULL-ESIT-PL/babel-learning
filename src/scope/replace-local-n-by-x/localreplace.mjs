const varName = process.env["VARNAME"] || "z";
const replace = process.env["REPLACE"] || "z";

export default function({ types: t }) {
  return {
    visitor: {
      FunctionDeclaration(path) {
        if (path.scope.hasOwnBinding(varName)) {
          path.traverse({
            Identifier(path) {
              if (path.node.name ===  varName) {
                path.node.name = replace;
              }
            }
          });
          return;
        }
      }
    }
  };
}