// transform -> babel7: initial screen
const translations = {
  "label_hello": "Hello world!",
  "label_bye": "Bye! Nice to meet you!",
};

module.exports = function (babel) {
  const { types: t } = babel;

  return {
    name: "second-transform", // not required
    visitor: {
      CallExpression(path) {
        let node = path.node;
        if (t.isIdentifier(node.callee, { name: "t" })) {
          if (t.isStringLiteral(node.arguments[0])) { // notice StringLiteral, not Literal
            const key = node.arguments[0].value;
            const value = translations[key];
            if (value) {
              console.error(node.callee.name, node.arguments[0].value);
              node.arguments[0] = t.stringLiteral(value);
            }
          }
        }
      },
    }
  }
};
