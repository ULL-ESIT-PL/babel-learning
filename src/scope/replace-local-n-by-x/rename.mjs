const varName = process.env["VARNAME"] || "z"; // Get the variable name from the environment variable VARNAME, default to "z"
const replace = process.env["REPLACE"] || "z"; // Get the replacement name from the environment variable REPLACE, default to "z"

export default function({ types: t }) {
  return {
    visitor: {
      FunctionDeclaration(path) {
        path.scope.rename(varName, replace); // Rename the variable in the function scope 
      }
    }
  };
}