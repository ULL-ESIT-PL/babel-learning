module.exports = function(babel) {
  const { types: t } = babel;

  return {
    name: "add-variable-plugin",
    visitor: {
      FunctionDeclaration(path) {
        path.scope.push({
          id: t.identifier("newVar"),
          init: t.numericLiteral(42),
          kind: "const"
        });
      }
    }
  };
};