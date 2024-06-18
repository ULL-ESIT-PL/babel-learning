/*   
state git:(main) ✗ pwd
/Users/casianorodriguezleon/campus-virtual/2324/learning/babel-learning/src/state
➜  state git:(main) ✗ npx babel hello-state-input.js  --config-file ./babel.config.json
*/
module.exports = function (babel) {
  const { template, types: t } = babel;
  let sneak = template(`console.log(COUNT)`);

  return {
    name: "hello-state-plugin",
    visitor: {
      Identifier(path, state) {
        if (path.node.name === state.opts.targetIdentifier) {
          state.identifierCount = (parseInt(state.identifierCount)+1) || 1;
        }
      },
      Program: {
        exit(path, state) {
          path.node.body.push(sneak({ COUNT: t.NumericLiteral(state.identifierCount || 0) }));
          console.error(`Identifier "${state.opts.targetIdentifier}" was used ${state.identifierCount} times.`);
        }
      }
    }
  };
};
