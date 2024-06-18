/*   
state git:(main) ✗ pwd
/Users/casianorodriguezleon/campus-virtual/2324/learning/babel-learning/src/state
➜  state git:(main) ✗ npx babel hello-state-input.js  --config-file ./babel.config.json
*/
module.exports = function (babel) {
  const { template, types: t } = babel;
  let sneak = template(`console.log("Identifier '"+VAR + "' was used " + COUNT + " times")`);

  return {
    name: "hello-state-plugin", 
    visitor: {
      Identifier(path, state) {
        if (path.node.name === state.opts.targetIdentifier) {
          state.identifierCount = state.identifierCount+1 || 1;
        }
      },
      Program: {
        exit(path, state) {
          path.node.body.push(
            sneak({ 
              VAR: t.StringLiteral(state.opts.targetIdentifier),
              COUNT: t.NumericLiteral(state.identifierCount || 0) 
            })
          );
          console.error(`Identifier "${state.opts.targetIdentifier}" was used ${state.identifierCount} times.`);
        }
      }
    }
  };
};
