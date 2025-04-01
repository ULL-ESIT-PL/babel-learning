const varName = process.env["VARNAME"] || "z"; // Get the variable name from the environment variable VARNAME, default to "z"
const replace = process.env["REPLACE"] || "z"; // Get the replacement name from the environment variable REPLACE, default to "z"

export default function({ types: t }) {
  return {
    visitor: {
      FunctionDeclaration(path) {
        if (path.scope.hasOwnBinding(varName)) { // Check if the function has a binding for the variable name
          path.traverse({ // Traverse the function body
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